/**
 * Seed script — populates demo data for local dev / hackathon demo.
 * Run: npm run seed  (from /server)
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

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
      prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@transitops.com",
          passwordHash,
          role: "admin",
        },
      }),
      prisma.user.create({
        data: {
          name: "Farah Khan",
          email: "fleet.manager@transitops.com",
          passwordHash,
          role: "fleet_manager",
        },
      }),
      prisma.user.create({
        data: {
          name: "Sam Rivera",
          email: "safety.officer@transitops.com",
          passwordHash,
          role: "safety_officer",
        },
      }),
      prisma.user.create({
        data: {
          name: "Priya Nair",
          email: "finance@transitops.com",
          passwordHash,
          role: "financial_analyst",
        },
      }),
      prisma.user.create({
        data: {
          name: "Alex Morgan",
          email: "alex.driver@transitops.com",
          passwordHash,
          role: "driver",
        },
      }),
    ]);

  const [van05, truck12, bikeX] = await Promise.all([
    prisma.vehicle.create({
      data: {
        registrationNumber: "VAN-05",
        nameModel: "Tata Ace Van",
        type: "Van",
        maxLoadCapacity: 500,
        odometer: 12000,
        acquisitionCost: 850000,
        status: "available",
        region: "North",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "TRK-12",
        nameModel: "Ashok Leyland Truck",
        type: "Truck",
        maxLoadCapacity: 5000,
        odometer: 45000,
        acquisitionCost: 2500000,
        status: "available",
        region: "West",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "BIKE-21",
        nameModel: "Bajaj Delivery Bike",
        type: "Bike",
        maxLoadCapacity: 50,
        odometer: 8000,
        acquisitionCost: 90000,
        status: "in_shop",
        region: "North",
      },
    }),
  ]);

  const [driverAlex, driverPriya, driverSuspended] = await Promise.all([
    prisma.driver.create({
      data: {
        userId: driverUser.id,
        name: "Alex Morgan",
        licenseNumber: "DL-1001",
        licenseCategory: "LMV",
        licenseExpiryDate: new Date("2027-06-30"),
        contactNumber: "9876543210",
        safetyScore: 95,
        status: "available",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Priya Sharma",
        licenseNumber: "DL-1002",
        licenseCategory: "HMV",
        licenseExpiryDate: new Date("2026-12-31"),
        contactNumber: "9876543211",
        safetyScore: 88,
        status: "available",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Rohit Verma",
        licenseNumber: "DL-1003",
        licenseCategory: "LMV",
        licenseExpiryDate: new Date("2025-01-01"),
        contactNumber: "9876543212",
        safetyScore: 60,
        status: "suspended",
      },
    }),
  ]);

  await prisma.maintenanceLog.create({
    data: {
      vehicleId: bikeX.id,
      type: "Oil Change",
      description: "Routine servicing",
      cost: 1500,
      status: "active",
    },
  });

  const trip1 = await prisma.trip.create({
    data: {
      source: "Mumbai",
      destination: "Pune",
      vehicleId: truck12.id,
      driverId: driverPriya.id,
      cargoWeight: 3000,
      plannedDistance: 150,
      actualDistance: 155,
      status: "completed",
      dispatchedAt: new Date(Date.now() - 86400000),
      completedAt: new Date(),
      createdById: fleetManager.id,
    },
  });

  await prisma.fuelLog.create({
    data: {
      vehicleId: truck12.id,
      tripId: trip1.id,
      liters: 40,
      cost: 4200,
      logDate: new Date(),
    },
  });

  await prisma.expense.create({
    data: {
      vehicleId: truck12.id,
      tripId: trip1.id,
      category: "toll",
      amount: 350,
      expenseDate: new Date(),
    },
  });

  await prisma.trip.create({
    data: {
      source: "Delhi",
      destination: "Jaipur",
      vehicleId: van05.id,
      driverId: driverAlex.id,
      cargoWeight: 450,
      plannedDistance: 280,
      status: "dispatched",
      dispatchedAt: new Date(),
      createdById: fleetManager.id,
    },
  });
  await prisma.vehicle.update({
    where: { id: van05.id },
    data: { status: "on_trip" },
  });
  await prisma.driver.update({
    where: { id: driverAlex.id },
    data: { status: "on_trip" },
  });

  console.log("Seed complete.");
  console.log("Demo login (all roles): password = Password@123");
  console.log(
    "  admin@transitops.com | fleet.manager@transitops.com | safety.officer@transitops.com | finance@transitops.com | alex.driver@transitops.com",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
