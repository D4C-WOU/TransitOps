// client/src/lib/validators.ts
import { z } from "zod";

// ── Auth ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().trim().email("Entered email is invalid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
    email: z.string().trim().email("Entered email is invalid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type SignupFormValues = z.infer<typeof signupSchema>;

// ── Vehicles ──────────────────────────────────────────────────────────────────
export const vehicleSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required"),
  nameModel: z.string().trim().min(1, "Vehicle model is required"),
  type: z.string().trim().min(1, "Vehicle type is required"),
  maxLoadCapacity: z.coerce
    .number()
    .gt(0, "Max load capacity must be greater than 0"),
  odometer: z.coerce
    .number()
    .min(0, "Odometer cannot be negative")
    .default(0),
  acquisitionCost: z.coerce
    .number()
    .min(0, "Acquisition cost cannot be negative"),
  status: z
    .enum(["available", "on_trip", "in_shop", "retired"])
    .default("available"),
  region: z.string().trim().optional(),
});
export type VehicleFormInput = z.input<typeof vehicleSchema>;
export type VehicleFormValues = z.output<typeof vehicleSchema>;

// ── Drivers ───────────────────────────────────────────────────────────────────
export const driverSchema = z.object({
  name: z.string().trim().min(1, "Driver name is required"),
  licenseNumber: z.string().trim().min(1, "License number is required"),
  licenseCategory: z.string().trim().min(1, "License category is required"),
  licenseExpiryDate: z.string().min(1, "License expiry date is required"),
  contactNumber: z.string().trim().min(8, "Contact number is invalid"),
  safetyScore: z.coerce.number().min(0).max(100).default(100),
  status: z
    .enum(["available", "on_trip", "off_duty", "suspended"])
    .default("available"),
});
export type DriverFormInput = z.input<typeof driverSchema>;
export type DriverFormValues = z.output<typeof driverSchema>;

// ── Trips ─────────────────────────────────────────────────────────────────────
export const tripSchema = z.object({
  source: z.string().trim().min(1, "Source is required").max(120),
  destination: z.string().trim().min(1, "Destination is required").max(120),
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  driverId: z.coerce.number().int().positive("Driver is required"),
  cargoWeight: z.coerce
    .number()
    .gt(0, "Cargo weight must be greater than 0"),
  plannedDistance: z.coerce
    .number()
    .gt(0, "Planned distance must be greater than 0"),
});
export type TripFormInput = z.input<typeof tripSchema>;
export type TripFormValues = z.output<typeof tripSchema>;
