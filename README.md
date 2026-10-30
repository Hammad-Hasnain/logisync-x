# LogiSync-X | Enterprise Logistics & Telemetry Monorepo

> An offline-resilient, real-time fleet tracking and logistics management system engineered for high-latency and low-connectivity environments.

---

## Technical Overview

LogiSync-X is a B2B enterprise logistics platform built to solve critical telemetry data-loss issues in regions with unstable cellular connectivity. In standard tracking applications, network drops cause lost coordinates, frozen UI states, or database write bottlenecks. 

LogiSync-X addresses this through an **Offline-First Telemetry Engine**:
* **Online Mode:** Live coordinate streaming via WebSockets (Socket.io).
* **Offline / Background Mode:** Local coordinate queuing on mobile hardware, batch-syncing via resilient HTTP POST endpoints once reconnected.
* **Write-Buffer Architecture:** Inbound telemetry coordinates are cached in **Redis** to eliminate database write congestion during peak driver activity.
* **Automated Persistence:** A scheduled NestJS cron process flushes aggregated Redis telemetry into persistent **MongoDB** tracking logs at designated intervals.

---

## Monorepo Architecture

Managed via **Turborepo**, the project enforces clear bounded contexts across backend services, admin portals, and mobile edge client apps.

```text
logisync-x/
├── apps/
│   ├── backend/          # NestJS REST API, WebSocket Gateway, Redis Buffer, Cron Service
│   ├── web-admin/        # Next.js 15 Admin Dashboard, Leaflet Maps, TanStack Query
│   └── logisync-mobile/  # Expo / React Native Driver Application (EAS Build Enabled)
├── turbo.json            # Monorepo pipeline configuration
└── package.json          # Root workspace scripts
```

### 1. Backend Service (`apps/backend`)
* **Framework:** NestJS (TypeScript) with Modular Domain Architecture.
* **Authentication & RBAC:** Passport JWT authentication with Role Guards (`Admin`, `Driver`).
* **Database & Caching:** Mongoose / MongoDB for primary entities; Redis (`ioredis`) for high-throughput coordinate buffering.
* **Real-time & Background Processing:** `@nestjs/websockets` (Socket.io) for live tracking; `@nestjs/schedule` for automated Redis-to-MongoDB batch migration.

### 2. Admin Dashboard (`apps/web-admin`)
* **Framework:** Next.js (App Router, Tailwind CSS).
* **State & Data Fetching:** TanStack React Query, Axios, Jotai for lightweight client state.
* **Live Fleet Visualization:** Leaflet / React-Leaflet map integration for live driver movement and order state monitoring.

### 3. Driver Mobile Application (`apps/logisync-mobile`)
* **Framework:** Expo (React Native), Expo Router.
* **Location & Background Processing:** `expo-location`, `expo-task-manager` for background coordinate retrieval.
* **Security & Persistence:** `expo-secure-store` for JWT persistence; `@react-native-async-storage/async-storage` for offline coordinate queueing.

---

## Domain Models & Workflow

```text
[ Admin ] ---> Creates Driver & Assigns Order ---> [ Order: Assigned ]
|
(Driver Login)
|
[ Order: Picked Up / In-Transit ]
|
+-------------------+-------------------+

|                                       |
(Online)                                  (Offline)

|                                       |
Live Socket.io Stream                      Queued Local Storage

|                                       |
+-------------------+-------------------+
|
[ Redis Telemetry Buffer ]
|
(Cron Job - 30 mins)
|
[ MongoDB Tracking Logs ]
```

### Core Operational Flow
1. **Fleet Onboarding:** Admins create drivers and assign initial system credentials.
2. **Order Dispatch:** Admins assign orders to active drivers.
3. **Execution & Telemetry:** Drivers initiate pickup and transit states. If connectivity drops or the app moves to the background, location data continues to accumulate in local storage and buffers to Redis via periodic background posts (every 30 seconds).
4. **Data Clearance:** Upon order completion or cancellation, tracking ceases and telemetry buffer queues are committed to long-term storage.

---

## Local Development Setup

### Prerequisites
* Node.js (v18 or higher)
* npm / npx
* MongoDB (Local instance or MongoDB Atlas)
* Redis Server (Running locally or via Docker)

### 1. Environment Configuration
Please set up your environment variables for both the backend and web-admin apps by copying and referencing the respective `.env.example` files located inside each app folder (`apps/backend/.env.example` and `apps/web-admin/src/.env.example`).

### 2. Infrastructure Setup (Redis)
Run Redis locally using Docker:
```bash
docker run -d --name logisync-redis -p 6379:6379 redis:alpine
```

### 3. Installation & Running
Install dependencies at the monorepo root:
```bash
npm install
```

Start the Development Servers (Backend & Web Admin via Turborepo):
```bash
npm run dev
```

Start the Mobile Application (Expo):
```bash
cd apps/logisync-mobile
npm start
```

---

## Project Verification & Status

* **Monorepo Workspaces:** Backend and Web Admin run concurrently via Turborepo pipelines.
* **Mobile Client:** Pre-configured with EAS build profiles (`eas.json`) for Android and iOS development/production binaries.
* **Deployment State:** Currently configured for local evaluation and demonstration environments.

---

## Author

**Hammad Hasnain**  
*Founder & Full-Stack Engineer, HSquare Development*  

Karachi, Pakistan  

[LinkedIn Profile](https://www.linkedin.com/in/hammadhasnain/) | [GitHub Portfolio](https://github.com/Hammad-Hasnain/)
