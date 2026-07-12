export type Role = "admin" | "fleet_manager" | "driver" | "safety_officer" | "financial_analyst";
export type VehicleStatus = "available" | "on_trip" | "in_shop" | "retired";
export type DriverStatus = "available" | "on_trip" | "off_duty" | "suspended";
export type TripStatus = "draft" | "dispatched" | "completed" | "cancelled";

export type User = { id: number; name: string; email: string; role: Role };

export type Vehicle = {
  id: number;
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacity: number | string;
  odometer: number | string;
  acquisitionCost: number | string;
  status: VehicleStatus;
  region?: string | null;
};

export type Driver = {
  id: number;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number | string;
  status: DriverStatus;
};

export type Trip = {
  id: number;
  source: string;
  destination: string;
  cargoWeight: number | string;
  plannedDistance: number | string;
  actualDistance?: number | string | null;
  status: TripStatus;
  vehicle: Vehicle;
  driver: Driver;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: { total: number; page: number; limit: number; pages: number };
};

export type ApiErrorResponse = {
  success: false;
  message?: string;
  errors?: { field: string; message: string }[];
};