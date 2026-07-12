import type { DriverStatus, Prisma } from "@prisma/client";
import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

type DriverInput = {
  userId?: number | null;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string | Date;
  contactNumber: string;
  safetyScore?: number;
  status?: DriverStatus;
};

function normalize(data: Partial<DriverInput>): Prisma.DriverUncheckedCreateInput | Prisma.DriverUncheckedUpdateInput {
  return {
    ...data,
    licenseExpiryDate: data.licenseExpiryDate ? new Date(data.licenseExpiryDate) : undefined,
  };
}

export async function listDrivers(query: Record<string, unknown>) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const where: Prisma.DriverWhereInput = {
    ...(query.status ? { status: query.status as DriverStatus } : {}),
    ...(query.licenseCategory ? { licenseCategory: { contains: String(query.licenseCategory) } } : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.driver.findMany({ where, orderBy: { updatedAt: "desc" }, skip: (page - 1) * limit, take: limit, include: { user: { select: { email: true, role: true } } } }),
    prisma.driver.count({ where }),
  ]);
  return { items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
}

export async function getDriver(id: number) {
  const driver = await prisma.driver.findUnique({ where: { id }, include: { user: { select: { email: true, role: true } } } });
  if (!driver) throw new ApiError(404, "Driver not found.");
  return driver;
}

export function createDriver(data: DriverInput) {
  return prisma.driver.create({ data: normalize(data) as Prisma.DriverUncheckedCreateInput });
}

export async function updateDriver(id: number, data: Partial<DriverInput>) {
  await getDriver(id);
  return prisma.driver.update({ where: { id }, data: normalize(data) as Prisma.DriverUncheckedUpdateInput });
}

export async function deleteDriver(id: number) {
  const driver = await getDriver(id);
  const tripCount = await prisma.trip.count({ where: { driverId: id } });
  if (tripCount > 0) {
    return prisma.driver.update({ where: { id }, data: { status: "off_duty" } });
  }
  await prisma.driver.delete({ where: { id } });
  return driver;
}