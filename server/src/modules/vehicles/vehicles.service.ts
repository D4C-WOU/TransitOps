import type { Prisma, VehicleStatus } from "@prisma/client";
import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

type VehicleInput = {
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacity: number;
  odometer?: number;
  acquisitionCost: number;
  status?: VehicleStatus;
  region?: string | null;
};

export async function listVehicles(query: Record<string, unknown>) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const where: Prisma.VehicleWhereInput = {
    ...(query.status ? { status: query.status as VehicleStatus } : {}),
    ...(query.type ? { type: { contains: String(query.type) } } : {}),
    ...(query.region ? { region: { contains: String(query.region) } } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.vehicle.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.vehicle.count({ where }),
  ]);

  return { items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
}

export async function getVehicle(id: number) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new ApiError(404, "Vehicle not found.");
  return vehicle;
}

export function createVehicle(data: VehicleInput) {
  return prisma.vehicle.create({ data });
}

export async function updateVehicle(id: number, data: Partial<VehicleInput>) {
  await getVehicle(id);
  return prisma.vehicle.update({ where: { id }, data });
}

export async function deleteVehicle(id: number) {
  const vehicle = await getVehicle(id);
  const tripCount = await prisma.trip.count({ where: { vehicleId: id } });
  if (tripCount > 0) {
    return prisma.vehicle.update({ where: { id }, data: { status: "retired" } });
  }
  await prisma.vehicle.delete({ where: { id } });
  return vehicle;
}