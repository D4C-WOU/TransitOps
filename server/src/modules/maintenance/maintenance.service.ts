import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

export function listMaintenance(vehicleId?: number) {
  return prisma.maintenanceLog.findMany({
    where: vehicleId ? { vehicleId } : {},
    orderBy: { startedAt: "desc" },
    include: { vehicle: true },
  });
}

export async function createMaintenance(data: { vehicleId: number; type: string; description?: string; cost?: number }) {
  return prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({ where: { id: data.vehicleId } });
    if (!vehicle) throw new ApiError(404, "Vehicle not found.");
    if (vehicle.status === "on_trip") throw new ApiError(409, "Vehicle on trip cannot enter maintenance.");
    if (vehicle.status === "retired") throw new ApiError(409, "Retired vehicles cannot enter maintenance.");

    const log = await tx.maintenanceLog.create({ data: { ...data, status: "active" } });
    await tx.vehicle.update({ where: { id: data.vehicleId }, data: { status: "in_shop" } });
    return log;
  });
}

export async function closeMaintenance(id: number, cost?: number) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.maintenanceLog.findUnique({ where: { id }, include: { vehicle: true } });
    if (!log) throw new ApiError(404, "Maintenance log not found.");
    if (log.status !== "active") throw new ApiError(409, "Maintenance log is already closed.");

    const closed = await tx.maintenanceLog.update({
      where: { id },
      data: { status: "closed", closedAt: new Date(), ...(cost !== undefined ? { cost } : {}) },
    });
    if (log.vehicle.status !== "retired") {
      await tx.vehicle.update({ where: { id: log.vehicleId }, data: { status: "available" } });
    }
    return closed;
  });
}