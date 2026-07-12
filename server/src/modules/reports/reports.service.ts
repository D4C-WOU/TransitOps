import prisma from "../../config/db";

function csv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
}

export async function fuelEfficiency(vehicleId?: number) {
  const vehicles = await prisma.vehicle.findMany({
    where: vehicleId ? { id: vehicleId } : {},
    include: { fuelLogs: true, trips: { where: { status: "completed" } } },
  });
  return vehicles.map((vehicle) => {
    const liters = vehicle.fuelLogs.reduce((sum, log) => sum + Number(log.liters), 0);
    const distance = vehicle.trips.reduce((sum, trip) => sum + Number(trip.actualDistance ?? trip.plannedDistance), 0);
    return {
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      distance,
      liters,
      kmPerLiter: liters > 0 ? Number((distance / liters).toFixed(2)) : 0,
    };
  });
}

export async function utilization() {
  const vehicles = await prisma.vehicle.findMany({ include: { trips: true } });
  return vehicles.map((vehicle) => {
    const completed = vehicle.trips.filter((trip) => trip.status === "completed").length;
    return {
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      status: vehicle.status,
      totalTrips: vehicle.trips.length,
      completedTrips: completed,
      utilizationScore: vehicle.trips.length ? Number(((completed / vehicle.trips.length) * 100).toFixed(2)) : 0,
    };
  });
}

export async function operationalCost(vehicleId?: number) {
  const vehicles = await prisma.vehicle.findMany({
    where: vehicleId ? { id: vehicleId } : {},
    include: { fuelLogs: true, expenses: true, maintenanceLogs: true },
  });
  return vehicles.map((vehicle) => {
    const fuel = vehicle.fuelLogs.reduce((sum, log) => sum + Number(log.cost), 0);
    const expenses = vehicle.expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const maintenance = vehicle.maintenanceLogs.reduce((sum, log) => sum + Number(log.cost ?? 0), 0);
    const totalCost = fuel + expenses + maintenance;
    return {
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      fuel,
      expenses,
      maintenance,
      totalCost,
      acquisitionCost: Number(vehicle.acquisitionCost),
      roiPercent: vehicle.acquisitionCost ? Number((((Number(vehicle.acquisitionCost) - totalCost) / Number(vehicle.acquisitionCost)) * 100).toFixed(2)) : 0,
    };
  });
}

export function toCsv(rows: Record<string, unknown>[]) {
  return csv(rows);
}