import prisma from "../../config/db";

export function listFuelLogs(vehicleId?: number) {
  return prisma.fuelLog.findMany({ where: vehicleId ? { vehicleId } : {}, orderBy: { logDate: "desc" }, include: { vehicle: true, trip: true } });
}
export function createFuelLog(data: { vehicleId: number; tripId?: number | null; liters: number; cost: number; logDate: string }) {
  return prisma.fuelLog.create({ data: { ...data, logDate: new Date(data.logDate) } });
}
export function deleteFuelLog(id: number) {
  return prisma.fuelLog.delete({ where: { id } });
}