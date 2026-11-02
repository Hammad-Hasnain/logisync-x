# LogiSync-X | System Architecture & Data Models

This document provides a comprehensive technical breakdown of the **LogiSync-X** monorepo architecture, offline telemetry synchronization flow, and Mongoose database schemas.

---

## 1. High-Level System Architecture

LogiSync-X uses a monorepo topology powered by Turborepo, enforcing strict separation of concerns between edge client applications (Mobile and Web Admin) and the NestJS monolithic backend engine.

```mermaid
flowchart TD
    subgraph Clients["Edge Clients & Interfaces"]
        MobileApp["Expo Mobile App (Driver)<br/>• Local Storage Queue<br/>• Background Location Task"]
        WebAdmin["Next.js 15 Web Admin<br/>• Leaflet Fleet Map<br/>• TanStack Query Client"]
    end

    subgraph API_Gateway["NestJS Backend Engine"]
        REST["REST API Controllers<br/>(Identity, Admins, Drivers, Orders)"]
        WS["WebSocket Gateway<br/>(Socket.io - Live Tracking)"]
        BatchEndpoint["Telemetry Batch Controller<br/>(HTTP POST Sync)"]
        CronService["Schedule Cron Engine<br/>(@nestjs/schedule)"]
    end

    subgraph Memory_Data["Data & Caching Layer"]
        Redis[("Redis In-Memory Buffer<br/>• Temporary Telemetry Queue")]
        MongoDB[("MongoDB Primary Store<br/>• Core Domain Documents<br/>• Persistent Tracking Logs")]
    end

    %% Online Flow
    MobileApp -- "Live Telemetry (Online)" --> WS
    WS -- "Buffer Coordinates" --> Redis

    %% Offline Flow
    MobileApp -- "Batch Flush (Reconnected)" --> BatchEndpoint
    BatchEndpoint -- "Push to Queue" --> Redis

    %% Persistence Flow
    CronService -- "Flush Interval" --> Redis
    Redis -- "Migrate Data" --> MongoDB

    %% Admin Reads
    WebAdmin -- "REST / Live Fleet Views" --> REST
    REST -- "Fetch State & Logs" --> MongoDB
```

---

## 1.1 High-Level System Use Cases

The following usecase-beta diagram outlines the system boundaries and capabilities split across the Web Admin Panel and the Driver Mobile App, enforcing strict authentication criteria and tracking lifecycle logic.

```mermaid
usecase-beta
direction LR

%% Actors Definition
actor Admin("👨‍💼 Admin User")
actor Driver("🚗 Driver Mobile User")

%% Admin Web Panel Boundary
systemBoundary "Admin Web Panel"
    UC_AL("Log In")
    UC_DB("View Dashboard")
    UC_OM("Orders Management")
    UC_DM("Drivers Management")
    UC_VLL("Track Live Location (Order Detail)")
end

%% Driver Mobile App Boundary
systemBoundary "Driver Mobile App"
    UC_DL("Log In")
    UC_HP("Home Page (View Orders)")
    UC_OD("Order Detail Page")
    UC_US("Update Order Status (In-Transit etc.)")
    UC_SL("Stream Live GPS Location")
end

%% Admin Interconnections
Admin --> UC_AL
Admin --> UC_DB
Admin --> UC_OM
Admin --> UC_DM
Admin --> UC_VLL

%% Driver Interconnections
Driver --> UC_DL
Driver --> Driver --> UC_HP
Driver --> UC_OD
Driver --> UC_US
Driver --> UC_SL

%% Core Dependencies & Extensions
UC_DB ..> :include UC_AL
UC_OM ..> :include UC_AL
UC_DM ..> :include UC_AL

UC_HP ..> :include UC_DL
UC_OD ..> :include UC_DL

UC_SL ..> :extend UC_US
UC_SL ..> :include UC_VLL
```

---

## 2. Offline-to-Online Telemetry Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    participant D as Driver Mobile App
    participant L as Local Async Queue
    participant S as NestJS Socket Gateway
    participant R as Redis Telemetry Buffer
    participant C as Cron Scheduler
    participant M as MongoDB Storage

    Note over D,S: State A: Device Online (Normal Operation)
    D->>S: Emit live coordinate stream
    S->>R: Push GPS point to Redis Buffer

    Note over D,L: State B: Network Drops (Offline / Background)
    D-xS: Connection Lost
    D->>L: Append coordinates to local hardware queue

    Note over D,S: State C: Network Re-established
    D->>S: Reconnect HTTP / WS
    D->>L: Fetch queued coordinates
    D->>S: POST /api/v1/tracking/batch-sync (Bulk Payload)
    L->>L: Clear local queue on 200 OK
    S->>R: Push bulk coordinates to Redis Buffer

    Note over C,M: State D: Async Batch Persistence
    C->>R: Fetch buffered coordinates
    C->>M: Bulk write into TrackingLogs Collection
    C->>R: Purge processed buffer keys
```

---

## 3. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    IDENTITY {
        ObjectId _id PK
        string email UK
        string phone
        string passwordHash "select: false"
        string status "PENDING | ACTIVE | DEACTIVE"
        string role "DRIVER | ADMIN"
    }

    ADMIN {
        ObjectId _id PK
        ObjectId identityId FK
        string name
    }

    DRIVER {
        ObjectId _id PK
        ObjectId identityId FK
        string name
        string vehicleNumber
        string dutyStatus "OFFLINE | AVAILABLE | ON_TRIP"
    }

    ORDER {
        ObjectId _id PK
        string customerName
        ObjectId assignedDriverId FK
        string deliveryAddress
        string pickupLocation
        string status "PENDING | ASSIGNED | PICKED_UP | IN_TRANSIT | DELIVERED | CANCELLED"
        string trackingId UK
    }

    TRACKING_LOG {
        ObjectId _id PK
        ObjectId orderId FK
        ObjectId driverId FK
        json[] coordinates "lat, lng, timestamp"
        boolean isActiveStream
    }

    IDENTITY ||--O| ADMIN : "references"
    IDENTITY ||--O| DRIVER : "references"
    DRIVER ||--o{ ORDER : "assigned_to"
    ORDER ||--o{ TRACKING_LOG : "has_logs"
    DRIVER ||--o{ TRACKING_LOG : "generates"
```

---

## 4. Database Domain Models & Schemas

### Enums

```typescript
export enum Role {
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export enum IdentityStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE',
}

export enum DutyStatus {
  OFFLINE = 'OFFLINE',
  AVAILABLE = 'AVAILABLE',
  ON_TRIP = 'ON_TRIP',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
```

### Core Schema Definitions

#### 1. Identity Schema
* **Description:** Central authentication record holding credentials, contact details, role configuration, and account lifecycle status.
* **Fields:**
  * `email`: String (Required, Unique, Lowercase, Trimmed)
  * `phone`: String (Required, Trimmed)
  * `passwordHash`: String (Required, `select: false` for security)
  * `role`: String (Enum: `Role`, Default: `DRIVER`)
  * `status`: String (Enum: `IdentityStatus`, Default: `PENDING`)

#### 2. Admin & Driver Schemas
* **Description:** Extended profile entities mapped directly to an explicit `Identity` parent document via standard relational references.
* **Fields (Admin):**
  * `identityId`: ObjectId (Required, Ref: `Identity`, Unique)
  * `name`: String (Required, Trimmed)
* **Fields (Driver):**
  * `identityId`: ObjectId (Required, Ref: `Identity`, Unique)
  * `name`: String (Required, Trimmed)
  * `vehicleNumber`: String (Required, Uppercase, Trimmed)
  * `dutyStatus`: String (Enum: `DutyStatus`, Default: `OFFLINE`)

#### 3. Order Schema
* **Description:** Active logistics dispatch logs tracks routing coordinates, individual state transitions, customer descriptors, and active delivery assignments.
* **Fields:**
  * `trackingId`: String (Required, Unique, Automated-Generation)
  * `customerName`: String (Required, Trimmed)
  * `pickupLocation`: String (Required)
  * `deliveryAddress`: String (Required)
  * `assignedDriverId`: ObjectId (Optional, Ref: `Driver`, Default: `null`)
  * `status`: String (Enum: `OrderStatus`, Default: `PENDING`)

#### 4. TrackingLog Schema (TimeSeries Structure)
* **Description:** High-frequency spatial database optimized for storing coordinate arrays emitted via active edge tracking streams.
* **Fields:**
  * `orderId`: ObjectId (Required, Ref: `Order`, Index: true)
  * `driverId`: ObjectId (Required, Ref: `Driver`, Index: true)
  * `isActiveStream`: Boolean (Default: `true`)
  * `coordinates`: Array of Subdocuments:
    * `lat`: Number (Required)
    * `lng`: Number (Required)
    * `timestamp`: Date (Required, Default: `Date.now`)
