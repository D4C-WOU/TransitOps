import prisma from "../../config/db";

export function listExpenses(vehicleId?: number) {
  return prisma.expense.findMany({ where: vehicleId ? { vehicleId } : {}, orderBy: { expenseDate: "desc" }, include: { vehicle: true, trip: true } });
}
export function createExpense(data: { vehicleId: number; tripId?: number | null; category: string; amount: number; expenseDate: string }) {
  return prisma.expense.create({ data: { ...data, expenseDate: new Date(data.expenseDate) } });
}
export function deleteExpense(id: number) {
  return prisma.expense.delete({ where: { id } });
}