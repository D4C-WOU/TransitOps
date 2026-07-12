import type { Prisma } from "@prisma/client";
import prisma from "../../config/db";

export async function getKpis(query: Record<string, unknown>) {
  const vehicleWhere: Prisma.VehicleWhereInput = {
    ...(query.region ? { region: { contains: String(query.region) } } : {}),
    ...(query.type ? { type: { contains: String(query.type) } } : {}),
  };

  const [totalVehicles, available, onTrip, inShop, totalDrivers, draftTrips, dispatchedTrips, completedTrips, cancelledTrips, fuelCost, expenseCost, maintenanceCost] = await prisma.$transaction([
    prisma.vehicle.count({ where: vehicleWhere }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: "available" } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: "on_trip" } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: "in_shop" } }),
    prisma.driver.count(),
    prisma.trip.count({ where: { status: "draft" } }),
    prisma.trip.count({ where: { status: "dispatched" } }),
    prisma.trip.count({ where: { status: "completed" } }),
    prisma.trip.count({ where: { status: "cancelled" } }),
    prisma.fuelLog.aggregate({ _sum: { cost: true, liters: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.maintenanceLog.aggregate({ _sum: { cost: true } }),
  ]);

  const utilization = totalVehicles ? Math.round((onTrip / totalVehicles) * 100) : 0;
  const fuel = Number(fuelCost._sum.cost ?? 0);
  const maintenance = Number(maintenanceCost._sum.cost ?? 0);
  const expenses = Number(expenseCost._sum.amount ?? 0);

  return {
    fleet: { totalVehicles, available, onTrip, inShop, utilization },
    drivers: { totalDrivers },
    trips: [
      { status: "draft", count: draftTrips },
      { status: "dispatched", count: dispatchedTrips },
      { status: "completed", count: completedTrips },
      { status: "cancelled", count: cancelledTrips },
    ],
    costs: {
      fuel,
      maintenance,
      expenses,
      total: fuel + maintenance + expenses,
      liters: Number(fuelCost._sum.liters ?? 0),
    },
  };
}