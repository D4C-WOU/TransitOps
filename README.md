# 🚛 TransitOps — Smart Transport Operations Platform

TransitOps is a full-stack fleet management platform for tracking vehicles, drivers, trips, maintenance, fuel, and expenses — with role-based access control, enforced business rules, transactional status workflows, and operational reporting.

Built as part of the **Odoo Hiring Hackathon (Virtual Round)**.

---

## ✨ Features

- **Fleet & Driver Management** — full CRUD for vehicles and drivers with license expiry tracking and safety scores
- **Trip Lifecycle** — Draft → Dispatch → Complete/Cancel, with atomic DB-transaction-backed status transitions
- **Maintenance Workflow** — opening a maintenance log automatically puts a vehicle in shop; closing it restores availability
- **Fuel & Expense Tracking** — per-vehicle fuel logs and categorized expenses
- **Dashboard KPIs** — live fleet utilization, trip status breakdown, and cost breakdown charts
- **Reports** — fuel efficiency (km/L), fleet utilization %, operational cost & ROI, with CSV export
- **Role-Based Access Control (RBAC)** — Admin, Fleet Manager, Driver, Safety Officer, Financial Analyst
- **Enforced Business Rules** (server-side, not just UI):
  - Unique vehicle registration numbers
  - Retired/in-shop vehicles excluded from dispatch
  - Expired-license or suspended drivers can't be assigned to trips
  - A vehicle/driver already `on_trip` can't be double-booked
  - Cargo weight can't exceed vehicle max load capacity
  - All multi-row status updates run inside DB transactions

---

## 🏗️ Tech Stack

**Frontend**
- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- Tailwind CSS 4
- React Hook Form + Zod validation
- Zustand (auth state)
- Recharts (dashboard charts)
- Axios, Lucide Icons

**Backend**
- Node.js + Express (TypeScript)
- MySQL via Prisma ORM
- JWT-based authentication (httpOnly cookies)
- Zod / express-validator for request validation
- bcrypt for password hashing
- Rate limiting, Helmet, CORS

---

## 📁 Project Structure

````

transitops/
├── client/                 # Next.js 16 App Router frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/         # login, signup
│   │   │   └── (dashboard)/    # dashboard, vehicles, drivers, trips, maintenance, fuel-expenses, reports
│   │   ├── components/         # ui / layout / charts / forms
│   │   ├── lib/                 # api client, auth helpers, validators
│   │   ├── store/                # zustand auth store
│   │   └── types/                 # shared TS interfaces
│   └── middleware.ts        # route guard (auth cookie check)
│
├── server/                 # Express + Prisma REST API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── modules/            # auth, users, vehicles, drivers, trips,
│       │                       # maintenance, fuelLogs, expenses, dashboard, reports
│       │                       # (each: routes / controller / service / validation)
│       ├── middlewares/        # auth, role guard, validation, error handler, rate limiter
│       ├── config/              # db client, env validation
│       └── utils/                # apiResponse, asyncHandler, logger
│
└── package.json            # root orchestration (concurrently)

````

Each backend module is self-contained (`routes → controller → service → validation`), and the frontend mirrors the same domain boundaries for intuitive navigation between the two codebases.

---

## 🔐 Roles (RBAC)

| Role | Access |
|---|---|
| **Admin** | User & role management |
| **Fleet Manager** | Full fleet, maintenance, vehicle lifecycle |
| **Driver** | Create/view own trips, assigned vehicle |
| **Safety Officer** | Driver compliance, license validity, safety scores |
| **Financial Analyst** | Expenses, fuel, cost & ROI reports (read-mostly) |

> New signups are provisioned as `driver` by default — elevated roles are assigned by an admin.

---

## 🗄️ Database Schema (MySQL, via Prisma)

Core entities: `users`, `vehicles`, `drivers`, `trips`, `maintenance_logs`, `fuel_logs`, `expenses`

- Unique constraints on `vehicles.registration_number`, `drivers.license_number`, `users.email`
- FK constraints with `ON UPDATE CASCADE`, `ON DELETE RESTRICT` (never orphan trips/logs)
- Status transitions for trips and maintenance run inside DB transactions to prevent race conditions

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- MySQL server running locally (or accessible via connection string)

### 1. Clone & install

````bash
git clone https://github.com/<your-username>/transitops.git
cd transitops
npm run install:all
````

### 2. Configure environment variables

**`server/.env`**

````env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/transitops"
JWT_SECRET="change_this_in_prod"
PORT=5000
````

**`client/.env.local`**

````env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
````

### 3. Set up the database

````bash
mysql -u root -p -e "CREATE DATABASE transitops;"

cd server
npx prisma migrate dev
npm run seed
cd ..
````

### 4. Run the app

````bash
npm run dev
````

This starts both the Express API (`:5000`) and the Next.js client (`:3000`) concurrently.

---

## 📜 Available Scripts

**Root**

| Script              | Description                               |
| ------------------- | ------------------------------------------ |
| `npm run dev`        | Run client + server together              |
| `npm run install:all`| Install dependencies for both apps        |

**Server** (`/server`)

| Script                   | Description               |
| ------------------------ | -------------------------- |
| `npm run dev`              | Start API in dev mode (ts-node-dev) |
| `npm run build` / `start`  | Build & run production      |
| `npm run prisma:migrate`   | Run Prisma migrations       |
| `npm run prisma:studio`    | Open Prisma Studio          |
| `npm run seed`              | Seed the database            |

**Client** (`/client`)

| Script          | Description            |
| ---------------- | ----------------------- |
| `npm run dev`      | Start Next.js dev server |
| `npm run build`    | Production build          |
| `npm run start`    | Serve production build    |
| `npm run lint`     | Run ESLint                 |

---

## 🌐 API Overview

````
/api/auth          → login, signup, me, logout
/api/users         → user management (admin)
/api/vehicles      → CRUD, filters (type/status/region)
/api/drivers       → CRUD, filters (status)
/api/trips         → create, dispatch, complete, cancel, list
/api/maintenance   → create, close, list per vehicle
/api/fuel-logs     → create, list
/api/expenses      → create, list
/api/dashboard     → KPI aggregation
/api/reports       → fuel efficiency, utilization, operational cost & ROI (+ CSV export)
````

All endpoints validate input server-side and return structured errors, e.g.:

````json
{ "success": false, "errors": [{ "field": "email", "message": "Entered email is invalid" }] }
````

---

## 🧭 Roadmap / Possible Extensions

* [ ] Email notifications for license expiry
* [ ] Multi-tenant / organization support
* [ ] Route optimization integration
* [ ] Mobile-friendly driver app view

---

## 📄 License

MIT — feel free to fork and adapt.

````
