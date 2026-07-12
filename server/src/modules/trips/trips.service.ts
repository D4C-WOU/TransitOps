import type { Prisma, TripStatus } from "@prisma/client";
import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

type TripInput = {
  source: string;
  destination: string;
  vehicleId: number;
  driverId: number;
  cargoWeight: number;
  plannedDistance: number;
  createdById?: number;
};

async function assertAssignable(
  vehicleId: number,
  driverId: number,
  cargoWeight: number,
) {
  const [vehicle, driver] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: vehicleId } }),
    prisma.driver.findUnique({ where: { id: driverId } }),
  ]);
  if (!vehicle) throw new ApiError(404, "Vehicle not found.");
  if (!driver) throw new ApiError(404, "Driver not found.");
  if (Number(cargoWeight) > Number(vehicle.maxLoadCapacity)) {
    throw new ApiError(
      400,
      "Cargo weight exceeds vehicle capacity",
      [{ field: "cargoWeight", message: "Cargo weight exceeds vehicle capacity" }],
    );
  }
  if (vehicle.status !== "available")
    throw new ApiError(409, "Vehicle is not available.");
  if (driver.status !== "available")
    throw new ApiError(409, "Driver is not available.");
  if (driver.licenseExpiryDate < new Date())
    throw new ApiError(409, "Driver license has expired.");
}

export async function listTrips(query: Record<string, unknown>) {
  const where: Prisma.TripWhereInput = {
    ...(query.status ? { status: query.status as TripStatus } : {}),
    ...(query.vehicleId ? { vehicleId: Number(query.vehicleId) } : {}),
    ...(query.driverId ? { driverId: Number(query.driverId) } : {}),
  };
  return prisma.trip.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      vehicle: true,
      driver: true,
      createdBy: { select: { id: true, name: true } },
    },
  });
}

export async function createTrip(data: TripInput) {
  await assertAssignable(data.vehicleId, data.driverId, data.cargoWeight);
  return prisma.trip.create({
    data: { ...data, status: "draft" },
    include: { vehicle: true, driver: true },
  });
}

export async function dispatchTrip(id: number) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true },
    });
    if (!trip) throw new ApiError(404, "Trip not found.");
    if (trip.status !== "draft")
      throw new ApiError(409, "Only draft trips can be dispatched.");
    if (trip.vehicle.status !== "available")
      throw new ApiError(409, "Vehicle is not available for dispatch.");
    if (trip.driver.status !== "available")
      throw new ApiError(409, "Driver is not available for dispatch.");
    if (trip.driver.licenseExpiryDate < new Date())
      throw new ApiError(409, "Driver license has expired.");
    // Re-check cargo capacity in case vehicle was updated after draft creation
    if (Number(trip.cargoWeight) > Number(trip.vehicle.maxLoadCapacity)) {
      throw new ApiError(
        409,
        `Cargo weight (${Number(trip.cargoWeight)} kg) exceeds vehicle capacity (${Number(trip.vehicle.maxLoadCapacity)} kg).`,
      );
    }

    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: "on_trip" },
    });
    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: "on_trip" },
    });
    return tx.trip.update({
      where: { id },
      data: { status: "dispatched", dispatchedAt: new Date() },
      include: { vehicle: true, driver: true },
    });
  });
}

export async function completeTrip(id: number, actualDistance?: number) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id } });
    if (!trip) throw new ApiError(404, "Trip not found.");
    if (trip.status !== "dispatched")
      throw new ApiError(409, "Only dispatched trips can be completed.");

    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: {
        status: "available",
        odometer: {
          increment: actualDistance ?? Number(trip.plannedDistance),
        },
      },
    });
    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: "available" },
    });
    return tx.trip.update({
      where: { id },
      data: {
        status: "completed",
        completedAt: new Date(),
        actualDistance: actualDistance ?? trip.plannedDistance,
      },
      include: { vehicle: true, driver: true },
    });
  });
}

export async function cancelTrip(id: number) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id } });
    if (!trip) throw new ApiError(404, "Trip not found.");
    if (!["draft", "dispatched"].includes(trip.status))
      throw new ApiError(
        409,
        "Trip cannot be cancelled from its current status.",
      );

    if (trip.status === "dispatched") {
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: "available" },
      });
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: "available" },
      });
    }

    return tx.trip.update({
      where: { id },
      data: { status: "cancelled" },
      include: { vehicle: true, driver: true },
    });
  });
}