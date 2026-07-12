/**
 * Seed script — populates rich demo data so the dashboard, reports,
 * and charts all look like a real operating fleet.
 * Run: npm run seed  (from /server)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86400000);
async function main() {
  console.log("Seeding TransitOps database...");

  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password@123", 10);

  const [admin, fleetManager, safetyOfficer, financialAnalyst, driverUser] =
    await Promise.all([
      prisma.user.create({ data: { name: "Admin User", email: "admin@transitops.com", passwordHash, role: "admin" } }),
      prisma.user.create({ data: { name: "Farah Khan", email: "fleet.manager@transitops.com", passwordHash, role: "fleet_manager" } }),
      prisma.user.create({ data: { name: "Sam Rivera", email: "safety.officer@transitops.com", passwordHash, role: "safety_officer" } }),
      prisma.user.create({ data: { name: "Priya Nair", email: "finance@transitops.com", passwordHash, role: "financial_analyst" } }),
      prisma.user.create({ data: { name: "Alex Morgan", email: "alex.driver@transitops.com", passwordHash, role: "driver" } }),
    ]);

  // ── Vehicles — spread across type / region / status ────────────────────────
  const vehicleData = [
    { registrationNumber: "VAN-05", nameModel: "Tata Ace Van", type: "Van", maxLoadCapacity: 500, odometer: 18400, acquisitionCost: 850000, status: "available", region: "North" },
    { registrationNumber: "VAN-11", nameModel: "Mahindra Bolero Pik-up", type: "Van", maxLoadCapacity: 700, odometer: 9200, acquisitionCost: 920000, status: "available", region: "South" },
    { registrationNumber: "TRK-12", nameModel: "Ashok Leyland Truck", type: "Truck", maxLoadCapacity: 5000, odometer: 61200, acquisitionCost: 2500000, status: "available", region: "West" },
    { registrationNumber: "TRK-19", nameModel: "Tata LPT 1613", type: "Truck", maxLoadCapacity: 6500, odometer: 44300, acquisitionCost: 3100000, status: "on_trip", region: "West" },
    { registrationNumber: "TRK-23", nameModel: "Eicher Pro 2049", type: "Truck", maxLoadCapacity: 4200, odometer: 27800, acquisitionCost: 2200000, status: "available", region: "East" },
    { registrationNumber: "BIKE-21", nameModel: "Bajaj Delivery Bike", type: "Bike", maxLoadCapacity: 50, odometer: 12100, acquisitionCost: 90000, status: "in_shop", region: "North" },
    { registrationNumber: "BIKE-27", nameModel: "TVS iQube Cargo", type: "Bike", maxLoadCapacity: 60, odometer: 5400, acquisitionCost: 110000, status: "available", region: "South" },
    { registrationNumber: "VAN-33", nameModel: "Force Traveller", type: "Van", maxLoadCapacity: 1200, odometer: 33900, acquisitionCost: 1450000, status: "retired", region: "East" },
  ];
  const vehicles = {} as Record<string, Awaited<ReturnType<typeof prisma.vehicle.create>>>;
  for (const v of vehicleData) {
    vehicles[v.registrationNumber] = await prisma.vehicle.create({ data: v as never });
  }

  // ── Drivers ──────────────────────────────────────────────────────────────
  const driverData = [
    { userId: driverUser.id, name: "Alex Morgan", licenseNumber: "DL-1001", licenseCategory: "LMV", licenseExpiryDate: new Date("2027-06-30"), contactNumber: "9876543210", safetyScore: 95, status: "available" },
    { name: "Priya Sharma", licenseNumber: "DL-1002", licenseCategory: "HMV", licenseExpiryDate: new Date("2026-12-31"), contactNumber: "9876543211", safetyScore: 88, status: "available" },
    { name: "Rohit Verma", licenseNumber: "DL-1003", licenseCategory: "LMV", licenseExpiryDate: new Date("2025-01-01"), contactNumber: "9876543212", safetyScore: 60, status: "suspended" },
    { name: "Meera Iyer", licenseNumber: "DL-1004", licenseCategory: "HGMV", licenseExpiryDate: new Date("2027-03-15"), contactNumber: "9876543213", safetyScore: 91, status: "on_trip" },
    { name: "Karan Bedi", licenseNumber: "DL-1005", licenseCategory: "LMV", licenseExpiryDate: new Date("2026-09-20"), contactNumber: "9876543214", safetyScore: 78, status: "off_duty" },
    { name: "Ananya Rao", licenseNumber: "DL-1006", licenseCategory: "HMV", licenseExpiryDate: new Date("2027-11-05"), contactNumber: "9876543215", safetyScore: 97, status: "available" },
    { name: "Devraj Singh", licenseNumber: "DL-1007", licenseCategory: "MGV", licenseExpiryDate: new Date("2026-04-18"), contactNumber: "9876543216", safetyScore: 82, status: "available" },
  ];
  const drivers = {} as Record<string, Awaited<ReturnType<typeof prisma.driver.create>>>;
  for (const d of driverData) {
    drivers[d.licenseNumber] = await prisma.driver.create({ data: d as never });
  }

  // ── Maintenance — one active (keeps BIKE-21 in_shop), one closed history ──
  await prisma.maintenanceLog.create({
    data: { vehicleId: vehicles["BIKE-21"].id, type: "Oil Change", description: "Routine servicing", cost: 1500, status: "active", startedAt: daysAgo(2) },
  });
  await prisma.maintenanceLog.create({
    data: { vehicleId: vehicles["TRK-12"].id, type: "Brake Service", description: "Pad replacement", cost: 6200, status: "closed", startedAt: daysAgo(30), closedAt: daysAgo(27) },
  });
  await prisma.maintenanceLog.create({
    data: { vehicleId: vehicles["VAN-05"].id, type: "Tyre Replacement", description: "Front pair", cost: 8400, status: "closed", startedAt: daysAgo(60), closedAt: daysAgo(58) },
  });

  // ── Trips — completed history across vehicles/drivers for reports ─────────
  const completedTrips = [
    { source: "Mumbai", destination: "Pune", vehicle: "TRK-12", driver: "DL-1002", cargoWeight: 3000, plannedDistance: 150, actualDistance: 155, daysBack: 6, liters: 40, fuelCost: 4200, toll: 350 },
    { source: "Delhi", destination: "Agra", vehicle: "VAN-05", driver: "DL-1001", cargoWeight: 420, plannedDistance: 230, actualDistance: 235, daysBack: 10, liters: 22, fuelCost: 2350, toll: 180 },
    { source: "Chennai", destination: "Bengaluru", vehicle: "TRK-23", driver: "DL-1006", cargoWeight: 3800, plannedDistance: 350, actualDistance: 358, daysBack: 4, liters: 68, fuelCost: 7100, toll: 420 },
    { source: "Ahmedabad", destination: "Surat", vehicle: "TRK-19", driver: "DL-1004", cargoWeight: 6000, plannedDistance: 270, actualDistance: 275, daysBack: 15, liters: 55, fuelCost: 5900, toll: 300 },
    { source: "Kolkata", destination: "Durgapur", vehicle: "VAN-33", driver: "DL-1007", cargoWeight: 900, plannedDistance: 170, actualDistance: 172, daysBack: 40, liters: 18, fuelCost: 1900, toll: 90 },
    { source: "Hyderabad", destination: "Vijayawada", vehicle: "TRK-23", driver: "DL-1006", cargoWeight: 3500, plannedDistance: 275, actualDistance: 280, daysBack: 2, liters: 52, fuelCost: 5600, toll: 260 },
    { source: "Bengaluru", destination: "Mysuru", vehicle: "VAN-11", driver: "DL-1005", cargoWeight: 610, plannedDistance: 145, actualDistance: 148, daysBack: 8, liters: 16, fuelCost: 1700, toll: 60 },
    { source: "Pune", destination: "Nashik", vehicle: "BIKE-27", driver: "DL-1002", cargoWeight: 45, plannedDistance: 210, actualDistance: 212, daysBack: 20, liters: 5, fuelCost: 520, toll: 0 },
  ];

  for (const t of completedTrips) {
    const trip = await prisma.trip.create({
      data: {
        source: t.source,
        destination: t.destination,
        vehicleId: vehicles[t.vehicle].id,
        driverId: drivers[t.driver].id,
        cargoWeight: t.cargoWeight,
        plannedDistance: t.plannedDistance,
        actualDistance: t.actualDistance,
        status: "completed",
        dispatchedAt: daysAgo(t.daysBack + 1),
        completedAt: daysAgo(t.daysBack),
        createdById: fleetManager.id,
      },
    });
    await prisma.fuelLog.create({
      data: { vehicleId: vehicles[t.vehicle].id, tripId: trip.id, liters: t.liters, cost: t.fuelCost, logDate: daysAgo(t.daysBack) },
    });
    if (t.toll > 0) {
      await prisma.expense.create({
        data: { vehicleId: vehicles[t.vehicle].id, tripId: trip.id, category: "toll", amount: t.toll, expenseDate: daysAgo(t.daysBack) },
      });
    }
  }

  // A couple of stray, non-trip-linked expenses (insurance, cleaning) for cost variety
  await prisma.expense.create({ data: { vehicleId: vehicles["TRK-12"].id, category: "insurance", amount: 12000, expenseDate: daysAgo(90) } });
  await prisma.expense.create({ data: { vehicleId: vehicles["VAN-05"].id, category: "cleaning", amount: 400, expenseDate: daysAgo(5) } });

  // ── Cancelled trip, for status variety ──────────────────────────────────
  await prisma.trip.create({
    data: {
      source: "Jaipur",
      destination: "Udaipur",
      vehicleId: vehicles["VAN-11"].id,
      driverId: drivers["DL-1005"].id,
      cargoWeight: 300,
      plannedDistance: 395,
      status: "cancelled",
      createdById: fleetManager.id,
    },
  });

  // ── Live trip: dispatched, keeps TRK-19 / Meera on_trip ─────────────────
  await prisma.trip.create({
    data: {
      source: "Surat",
      destination: "Vadodara",
      vehicleId: vehicles["TRK-19"].id,
      driverId: drivers["DL-1004"].id,
      cargoWeight: 5800,
      plannedDistance: 150,
      status: "dispatched",
      dispatchedAt: daysAgo(0),
      createdById: fleetManager.id,
    },
  });

  // ── Draft trip: pending dispatch, sits in the "Pending" KPI ─────────────
  await prisma.trip.create({
    data: {
      source: "Delhi",
      destination: "Jaipur",
      vehicleId: vehicles["VAN-05"].id,
      driverId: drivers["DL-1001"].id,
      cargoWeight: 450,
      plannedDistance: 280,
      status: "draft",
      createdById: fleetManager.id,
    },
  });

  console.log("Seed complete: 8 vehicles, 7 drivers, 12 trips, fuel logs, expenses, maintenance history.");
  console.log("Demo login (all roles): password = Password@123");
  console.log("  admin@transitops.com | fleet.manager@transitops.com | safety.officer@transitops.com | finance@transitops.com | alex.driver@transitops.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });