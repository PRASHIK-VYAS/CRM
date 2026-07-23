# EduBridge Enterprise — Low-Level Design (LLD) v2.0

> **Owner**: TrailBlazers  
> **Stack**: PostgreSQL (via Supabase) | Express.js 5.x | Node.js 20 | Prisma ORM  
> **Audience**: Backend Development Team  
> **Version**: 2.1 — EduBridge Enterprise

---

## Table of Contents

1. [Database Schema](#1-database-schema)
2. [API Endpoint Contract](#2-api-endpoint-contract)
3. [Security & RBAC](#3-security--rbac)
4. [Module Inventory](#4-module-inventory)

---

## 1. Database Schema

The schema is managed via **Prisma ORM** against **PostgreSQL 15+** (hosted on Supabase). All models use either `Int` (autoincrement) or `String` (UUID v4) primary keys. Timestamps use `Timestamptz(6)`. Soft-delete is implemented via a nullable `deletedAt` column.

### 1.1 Entity Definitions

#### `User`

Stores system actors (Admin, TPO, EBSC, RBSC, Coordinator, HOD). The `role` enum drives access control.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `Int` | `PK, autoincrement` | Surrogate key |
| `name` | `VARCHAR(255)` | `NOT NULL` | Display name |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Login identifier |
| `password` | `VARCHAR(255)` | `NOT NULL` | bcrypt hash |
| `role` | `UserRole` enum | `NOT NULL, DEFAULT 'coordinator'` | `admin \| tpo \| ebsc \| rbsc \| coordinator \| hod` |
| `resetToken` | `VARCHAR(255)` | | Password reset token |
| `resetTokenExpiry` | `TIMESTAMPTZ(6)` | | Reset token expiry |
| `otp` | `VARCHAR(255)` | | One-time password for reset |
| `otpExpiry` | `TIMESTAMPTZ(6)` | | OTP expiry |
| `createdAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `updatedAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |

**Relations:** `deals` → `DealPipeline[]`, `activityLogs` → `ActivityLog[]`

**Map:** `Users`

---

#### `Company360`

Central repository for corporate entities tracked by the TPO cell. Includes CRM pipeline status, partnership levels, relationship stages, health scoring, and aggregated placement counters.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK` | |
| `companyCode` | `VARCHAR(20)` | `UNIQUE, NOT NULL` | Internal code |
| `companyName` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Legal name |
| `industry` | `CompanyIndustry` enum | `NOT NULL` | `IT \| Finance \| Healthcare \| Manufacturing \| Education \| Consulting \| Telecommunication \| E_Commerce \| Automobile \| Construction \| Other` |
| `website` | `VARCHAR(255)` | | |
| `email` | `VARCHAR(255)` | | |
| `phone` | `VARCHAR(20)` | | |
| `linkedin` | `VARCHAR(255)` | | LinkedIn URL |
| `headOffice` | `VARCHAR(255)` | | HQ address |
| `city` | `VARCHAR(255)` | | |
| `country` | `VARCHAR(255)` | `DEFAULT 'India'` | |
| `postalCode` | `VARCHAR(15)` | | |
| `companySize` | `CompanySize` enum | | `1-50 \| 51-200 \| 201-500 \| 501-1000 \| 1000+` |
| `foundedYear` | `Int` | | |
| `description` | `TEXT` | | |
| `status` | `CompanyStatus` enum | `DEFAULT 'PROSPECT'` | `ACTIVE \| INACTIVE \| PROSPECT \| BLACKLISTED` |
| `partnershipLevel` | `PartnershipLevel` enum | `DEFAULT 'NONE'` | `NONE \| BASIC \| PREMIUM \| STRATEGIC` |
| `relationshipStage` | `RelationshipStage` enum | `DEFAULT 'Cold_Lead'` | 10-stage pipeline from Cold Lead to Strategic Partner |
| `healthScore` | `Int` | `DEFAULT 0` | Computed or manual score (0-100) |
| `nextFollowUpDate` | `TIMESTAMPTZ(6)` | | Scheduled follow-up |
| `totalPlacements` | `Int` | `DEFAULT 0` | Aggregate counter |
| `totalOffers` | `Int` | `DEFAULT 0` | Aggregate counter |
| `totalVisits` | `Int` | `DEFAULT 0` | Aggregate counter |
| `totalMoUs` | `Int` | `DEFAULT 0` | Aggregate counter |
| `dealStatus` | `DealStatus` enum | `DEFAULT 'ACTIVE'` | `ACTIVE \| ON_HOLD \| LOST \| WON` |
| `phoneNumber` | `VARCHAR(20)` | | Dedicated business phone (distinct from `phone`) |
| `hireKey` | `VARCHAR(50)` | | Hiring authority key: `"Head"` or `"Co-head"` |
| `createdBy` | `UUID` | | Actor who created |
| `updatedBy` | `UUID` | | Actor who last updated |
| `isActive` | `Boolean` | `DEFAULT true` | Active flag |
| `createdAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `updatedAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `deletedAt` | `TIMESTAMPTZ(6)` | | Soft-delete timestamp |

**Relations:** `alumni[]`, `deals[]`, `mous[]`, `outreaches[]`, `employments[]`, `placementDrives[]`, `activityLogs[]`

**Indexes:** `city`, `healthScore`, `industry`, `nextFollowUpDate`, `partnershipLevel`, `relationshipStage`, `status`

**Map:** `company360`

---

#### `Alumni`

Directory of graduated students mapped to their current employment. Supports influence scoring, skills tracking, and outreach targeting.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK` | |
| `alumniCode` | `VARCHAR(20)` | `UNIQUE, NOT NULL` | Internal alumni code |
| `fullName` | `VARCHAR(255)` | `NOT NULL` | |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | |
| `phone` | `VARCHAR(20)` | | |
| `department` | `VARCHAR(100)` | `NOT NULL` | Graduating department |
| `batchYear` | `Int` | `NOT NULL` | Graduating year |
| `currentDesignation` | `VARCHAR(150)` | `NOT NULL` | Current job title |
| `seniorityLevel` | `AlumniSeniorityLevel` enum | `DEFAULT 'Entry_Level'` | `Entry_Level \| Mid_Level \| Senior_Level \| Lead \| Manager \| Director \| Founder \| HR \| Other` |
| `companyId` | `UUID` | `FK → Company360.id` | Current employer |
| `linkedin` | `VARCHAR(255)` | | LinkedIn profile URL |
| `location` | `VARCHAR(255)` | | Current city |
| `skills` | `JSON` | `DEFAULT '[]'` | Array of skill strings |
| `willingnessToHelp` | `AlumniWillingnessToHelp` enum | `DEFAULT 'Maybe'` | `Yes \| No \| Maybe` |
| `helpTypes` | `JSON` | `DEFAULT '[]'` | Types of help alumni can offer |
| `influenceScore` | `Int` | `DEFAULT 0` | 0-100 influence metric |
| `relationshipScore` | `Int` | `DEFAULT 0` | 0-100 relationship metric |
| `lastContactedAt` | `TIMESTAMPTZ(6)` | | Last outreach timestamp |
| `status` | `AlumniStatus` enum | `DEFAULT 'Active'` | `Active \| Inactive \| Not_Reachable` |
| `notes` | `TEXT` | | Internal notes |
| `createdAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `updatedAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |

**Relations:** `company → Company360`, `employments → Employment[]`

**Indexes:** `companyId`

**Map:** `alumni`

---

#### `DealPipeline`

Tracks opportunities with companies through a multi-stage sales pipeline from cold lead to strategic partnership. Each deal is owned by a User and linked to a Company360 record.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK` | |
| `dealCode` | `VARCHAR(20)` | `UNIQUE, NOT NULL` | Internal deal code |
| `companyId` | `UUID` | `FK → Company360.id, NOT NULL` | Target company |
| `title` | `VARCHAR(255)` | `NOT NULL` | Deal title |
| `ownerId` | `Int` | `FK → User.id, NOT NULL` | TPO/coordinator owning the deal |
| `stage` | `DealStage` enum | `DEFAULT 'Cold_Lead'` | 13-stage pipeline |
| `priority` | `DealPriority` enum | `DEFAULT 'Medium'` | `Low \| Medium \| High \| Critical` |
| `probability` | `Int` | `DEFAULT 10` | Win probability % |
| `expectedStudents` | `Int` | `DEFAULT 0` | Expected hire count |
| `expectedCTC` | `DECIMAL(10,2)` | | Expected salary package |
| `expectedHiringDate` | `DATE` | | Target hiring date |
| `source` | `DealSource` enum | `DEFAULT 'Other'` | Lead source |
| `leadOwner` | `VARCHAR(255)` | | External lead owner name |
| `decisionMaker` | `VARCHAR(255)` | | Company decision maker |
| `decisionMakerEmail` | `VARCHAR(255)` | | |
| `decisionMakerPhone` | `VARCHAR(255)` | | |
| `lastActivityDate` | `TIMESTAMPTZ(6)` | | Last activity timestamp |
| `nextFollowUpDate` | `TIMESTAMPTZ(6)` | | Scheduled next action |
| `nextAction` | `VARCHAR(255)` | | Description of next action |
| `meetingDate` | `TIMESTAMPTZ(6)` | | Scheduled meeting |
| `proposalSentDate` | `TIMESTAMPTZ(6)` | | Proposal sent date |
| `mouExpectedDate` | `TIMESTAMPTZ(6)` | | Expected MoU signing |
| `closeDate` | `TIMESTAMPTZ(6)` | | Deal close date |
| `lostReason` | `TEXT` | | Reason if lost |
| `competitorCollege` | `VARCHAR(255)` | | Competing institution |
| `riskLevel` | `DealRiskLevel` enum | `DEFAULT 'Low'` | `Low \| Medium \| High` |
| `remarks` | `TEXT` | | Internal remarks |
| `isArchived` | `Boolean` | `DEFAULT false` | Archived flag |
| `createdBy` | `UUID` | | |
| `updatedBy` | `UUID` | | |
| `createdAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `updatedAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `deletedAt` | `TIMESTAMPTZ(6)` | | Soft-delete |

**Relations:** `company → Company360`, `owner → User`

**Indexes:** `companyId`, `expectedHiringDate`, `nextFollowUpDate`, `ownerId`, `priority`, `probability`, `stage`

**Map:** `deal_pipeline`

---

#### `MoU`

Digital Memorandum of Understanding records tracking agreements between the institution and corporate partners. Supports deliverable classification (Part A: Seminars, Part B: Higher Studies) and departmental association.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK` | |
| `companyId` | `UUID` | `FK → Company360.id, NOT NULL` | Partner company |
| `departmentId` | `UUID` | `FK → Department.id` | Owning academic department |
| `mouNumber` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | Reference number |
| `title` | `VARCHAR(255)` | `NOT NULL` | MoU title |
| `purpose` | `TEXT` | | Description of purpose |
| `startDate` | `DATE` | `NOT NULL` | Effective start |
| `endDate` | `DATE` | `NOT NULL` | Expiry date |
| `signedDate` | `DATE` | `NOT NULL` | Date signed |
| `status` | `MoUStatus` enum | `DEFAULT 'DRAFT'` | `DRAFT \| PENDING \| ACTIVE \| EXPIRED \| TERMINATED \| RENEWED` |
| `collaborationType` | `CollaborationType` enum | `NOT NULL` | `PLACEMENTS \| INTERNSHIPS \| TRAINING \| RESEARCH \| CONSULTANCY \| INDUSTRY_VISIT \| WORKSHOP \| MULTIPLE \| OTHER` |
| `deliverableType` | `DeliverableType` enum | `DEFAULT 'PART_A_SEMINARS'` | `PART_A_SEMINARS \| PART_B_HIGHER_STUDIES \| BOTH` |
| `signedByCompany` | `VARCHAR(255)` | | Company signatory name |
| `signedByInstitute` | `VARCHAR(255)` | | Institute signatory name |
| `renewalReminderDays` | `Int` | `DEFAULT 30` | Days before expiry to trigger reminder |
| `documentUrl` | `VARCHAR(255)` | | Link to signed PDF |
| `remarks` | `TEXT` | | |
| `createdBy` | `UUID` | | |
| `updatedBy` | `UUID` | | |
| `isActive` | `Boolean` | `DEFAULT true` | |
| `createdAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `updatedAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `deletedAt` | `TIMESTAMPTZ(6)` | | Soft-delete |

**Relations:** `company → Company360`, `department → Department`

**Indexes:** `collaborationType`, `companyId`, `departmentId`, `endDate`, `status`

**Map:** `mous`

---

#### `Outreach`

Logs every touchpoint with a company — emails, calls, meetings, visits, and other interactions. Functions as an interaction history log (not a queued email system in V1).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK` | |
| `companyId` | `UUID` | `FK → Company360.id, NOT NULL` | Target company |
| `outreachType` | `OutreachType` enum | `NOT NULL` | `EMAIL \| PHONE_CALL \| MEETING \| LINKEDIN \| VISIT \| EVENT \| PLACEMENT_DRIVE \| INTERNSHIP \| MOU_DISCUSSION \| FOLLOW_UP \| OTHER` |
| `subject` | `VARCHAR(255)` | `NOT NULL` | Subject line |
| `description` | `TEXT` | | Body / notes |
| `interactionDate` | `TIMESTAMPTZ(6)` | `NOT NULL` | When the interaction occurred |
| `outcome` | `OutreachOutcome` enum | `DEFAULT 'NEUTRAL'` | `POSITIVE \| NEUTRAL \| NEGATIVE \| NO_RESPONSE \| FOLLOW_UP_REQUIRED` |
| `status` | `OutreachStatus` enum | `DEFAULT 'PLANNED'` | `PLANNED \| COMPLETED \| CANCELLED \| MISSED` |
| `nextFollowUpDate` | `TIMESTAMPTZ(6)` | | Scheduled next outreach |
| `notes` | `TEXT` | | Free-form notes |
| `createdBy` | `UUID` | `NOT NULL` | |
| `updatedBy` | `UUID` | | |
| `isActive` | `Boolean` | `DEFAULT true` | |
| `createdAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `updatedAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `deletedAt` | `TIMESTAMPTZ(6)` | | Soft-delete |

**Relations:** `company → Company360`

**Indexes:** `companyId`, `interactionDate`, `nextFollowUpDate`, `outcome`, `status`

**Map:** `outreaches`

---

#### `Employment`

Tracks alumni employment history — current and past positions at companies.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK` | |
| `alumniId` | `UUID` | `FK → Alumni.id, NOT NULL` | Alumni record |
| `companyId` | `UUID` | `FK → Company360.id, NOT NULL` | Employer |
| `designation` | `VARCHAR(255)` | `NOT NULL` | Job title |
| `department` | `VARCHAR(100)` | | Department |
| `startDate` | `DATE` | `NOT NULL` | Start date |
| `endDate` | `DATE` | | End date (null if current) |
| `isCurrent` | `Boolean` | `DEFAULT true` | Currently employed here |
| `employmentType` | `EmploymentType` enum | `DEFAULT 'FULL_TIME'` | `FULL_TIME \| PART_TIME \| CONTRACT \| INTERNSHIP` |
| `workMode` | `WorkMode` enum | `DEFAULT 'ON_SITE'` | `ON_SITE \| REMOTE \| HYBRID` |
| `location` | `VARCHAR(255)` | | Work location |
| `description` | `TEXT` | | Role description |
| `remarks` | `TEXT` | | |
| `createdAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `updatedAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |

**Relations:** `alumni → Alumni`, `company → Company360`

**Indexes:** `alumniId`, `companyId`, `(alumniId, isCurrent)`, `(companyId, isCurrent)`

**Map:** `employment`

---

#### `Department`

Academic departments within the institution. Enables department-level association of MoUs and alumni records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK` | |
| `name` | `VARCHAR(100)` | `UNIQUE, NOT NULL` | Display name (e.g. "Computer Engineering") |
| `code` | `VARCHAR(10)` | `UNIQUE, NOT NULL` | Short code (e.g. "COMP") |
| `isActive` | `Boolean` | `DEFAULT true` | |
| `createdAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `updatedAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |

**Relations:** `alumni[]`, `mous[]`

**Map:** `departments`

---

#### `PlacementDrive`

Tracks individual placement drives per company — the job event, student participation, selection counts, and package offered.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK` | |
| `companyId` | `UUID` | `FK → Company360.id, NOT NULL` | Hiring company |
| `driveDate` | `DATE` | `NOT NULL` | Date of the drive |
| `jobTitle` | `VARCHAR(255)` | `NOT NULL` | Job role / title |
| `studentsAppeared` | `Int` | `DEFAULT 0` | Number of students who appeared |
| `studentsSelected` | `Int` | `DEFAULT 0` | Number of students selected |
| `package` | `DECIMAL(10,2)` | | Highest/LPA package offered |
| `notes` | `TEXT` | | Internal notes |
| `createdAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |
| `updatedAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |

**Relations:** `company → Company360`

**Indexes:** `companyId`

**Map:** `placement_drives`

---

#### `ActivityLog`

Shared activity log for calls, emails, and meetings — visible to all admins to provide a unified company history. Every outreach interaction also writes a corresponding ActivityLog entry.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK` | |
| `companyId` | `UUID` | `FK → Company360.id, NOT NULL` | Target company |
| `type` | `VARCHAR(20)` | `NOT NULL` | `CALL \| EMAIL \| MEETING \| NOTE` |
| `subject` | `VARCHAR(255)` | `NOT NULL` | Log subject line |
| `description` | `TEXT` | | Detailed description |
| `performedBy` | `Int` | `FK → User.id, NOT NULL` | User who performed the action |
| `createdAt` | `TIMESTAMPTZ(6)` | `NOT NULL` | |

**Relations:** `company → Company360`, `user → User`

**Indexes:** `companyId`, `performedBy`

**Map:** `activity_logs`

---

### 1.2 Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ DealPipeline : owns
    User ||--o{ ActivityLog : logs
    Company360 ||--o{ Alumni : employs
    Company360 ||--o{ DealPipeline : targets
    Company360 ||--o{ MoU : signs
    Company360 ||--o{ Outreach : logs
    Company360 ||--o{ Employment : hosts
    Company360 ||--o{ PlacementDrive : conducts
    Company360 ||--o{ ActivityLog : tracks
    Alumni ||--o{ Employment : has
    Department ||--o{ Alumni : belongs_to
    Department ||--o{ MoU : governs
```

---

## 2. API Endpoint Contract

### 2.1 Standardised Response Envelope

All API responses follow a consistent JSON envelope:

```json
{
    "success": true,
    "data": { ... },
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 142,
        "totalPages": 8
    },
    "message": null
}
```

On error:

```json
{
    "success": false,
    "data": null,
    "message": "Human-readable error description"
}
```

HTTP status codes: `200` (success), `201` (created), `400` (validation), `401` (unauthenticated), `403` (forbidden), `404` (not found), `409` (conflict), `500` (internal).

---

### 2.2 Mounted Modules (all routes wired in server.js)

#### Module: Auth

Base path: `/auth`

| Method | Endpoint | Auth | Request Body | Success Response | Notes |
|--------|----------|------|-------------|------------------|-------|
| `GET` | `/` | No | — | `{ message }` | Server health |
| `GET` | `/health` | No | — | `{ status }` | Health check |
| `POST` | `/login` | No | `{ email, password }` | `{ token, user }` | Returns JWT |
| `POST` | `/forgot-password` | No | `{ email }` | `{ message }` | Sends OTP via email |
| `POST` | `/create_user` | Yes (admin) | `{ name, email, password, role }` | `{ message, user }` | Admin-only |
| `POST` | `/verify-otp` | No | `{ email, otp }` | `{ token }` | Returns short-lived reset token |
| `POST` | `/reset-password` | No (Bearer reset token) | `{ newPassword }` | `{ message }` | Requires reset JWT in header |

#### Module: Analytics

Base path: `/analytics`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/dashboard` | No | Returns aggregate counts for companies (total/active/prospect/inactive), MoUs, outreaches, health score average, industry breakdown, status breakdown |
| `GET` | `/institutional-dashboard` | No | Returns Total Students, Highest Package, Average Package, and Company-wise package distribution |

**`GET /analytics/institutional-dashboard` Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 5000,
    "highestPackage": 2500000,
    "averagePackage": 650000,
    "companyWiseDistribution": [
      { "company": "Google", "students": 12, "avgPackage": 2400000 }
    ]
  }
}
```

#### Module: Company360

Base path: `/api/company360`

| Method | Endpoint | Auth | Request / Query | Description |
|--------|----------|------|----------------|-------------|
| `POST` | `/` | No | `{ companyName, industry, ... }` | Create new company |
| `GET` | `/` | No | `?page, limit, search, industry, status, partnershipLevel, city, isActive, includeDeleted, sortBy, sortOrder` | List companies (paginated, filterable) |
| `GET` | `/:id` | No | `?includeDeleted` | Get company by ID |
| `GET` | `/:id/details` | No | — | Get company with relations (MoUs, outreaches, deals, alumni) |
| `GET` | `/:id/statistics` | No | — | Get aggregated stats (activeMoUs, outreaches, deals, alumniCount) |
| `PUT` | `/:id` | No | `{ companyName, industry, ... }` | Update company fields |
| `DELETE` | `/:id` | No | — | Soft delete (sets deletedAt) |
| `DELETE` | `/:id/restore` | No | — | Restore soft-deleted company |
| `DELETE` | `/:id/permanently-delete` | No | — | Hard delete |

#### Module: Alumni

Base path: `/api/alumni`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create alumni |
| `GET` | `/` | List alumni (paginated, filterable by department, batchYear, seniorityLevel, companyId, skill, etc.) |
| `GET` | `/statistics` | Get aggregate statistics |
| `GET` | `/code/:alumniCode` | Get by alumni code |
| `GET` | `/email/:email` | Get by email |
| `GET` | `/company/:companyId` | Get by company |
| `GET` | `/:id` | Get by ID |
| `PUT` | `/:id` | Update alumni |
| `PATCH` | `/:id/company` | Assign to company |
| `DELETE` | `/:id/company` | Remove company assignment |
| `PATCH` | `/:id/scores` | Update influence/relationship scores |
| `POST` | `/:id/contact` | Record contact |
| `POST` | `/:id/skills` | Add skills |
| `DELETE` | `/:id/skills` | Remove skill |
| `PATCH` | `/:id/help-preferences` | Update willingness to help |
| `PATCH` | `/:id/status` | Change status |
| `PATCH` | `/:id/activate` | Activate |
| `PATCH` | `/:id/deactivate` | Deactivate |
| `DELETE` | `/:id/permanently-delete` | Permanently delete |

#### Module: Deal Pipeline

Base path: `/api/deals`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create deal |
| `GET` | `/` | List deals (paginated, filterable by stage, priority, source, riskLevel, probability range, follow-up window, etc.) |
| `GET` | `/statistics` | Get pipeline statistics (total, byStage, byPriority, byRiskLevel) |
| `GET` | `/upcoming-follow-ups` | List deals with follow-up in next N days |
| `GET` | `/company/:companyId` | Get deals by company |
| `GET` | `/owner/:ownerId` | Get deals by owner |
| `GET` | `/:id` | Get deal by ID |
| `PUT` | `/:id` | Update deal |
| `PATCH` | `/:id/stage` | Change deal stage (triggers probability updates, date stamps) |
| `PATCH` | `/:id/reassign` | Reassign deal owner |
| `PATCH` | `/:id/archive` | Archive deal |
| `PATCH` | `/:id/restore` | Restore archived/deleted deal |
| `DELETE` | `/:id` | Permanently delete deal |

#### Module: MoU

Base path: `/api/mou`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create MoU (supports `departmentId`, `deliverableType`) |
| `GET` | `/` | List MoUs (paginated, filterable by status, collaborationType, companyId, date ranges) |
| `GET` | `/statistics` | Get aggregate MoU statistics |
| `GET` | `/company/:companyId` | Get MoUs by company |
| `GET` | `/:id` | Get MoU by ID |
| `PUT` | `/:id/status` | Change MoU status |
| `PATCH` | `/:id/activate` | Activate MoU |
| `PATCH` | `/:id/deactivate` | Deactivate MoU |
| `DELETE` | `/:id` | Soft delete MoU |
| `DELETE` | `/:id/permanently-delete` | Permanently delete MoU |

#### Module: Outreach

Base path: `/api/outreach`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create outreach record |
| `GET` | `/` | List outreaches (paginated, filterable by type, status, outcome, company, date ranges) |
| `GET` | `/statistics` | Get outreach statistics (completion rate, byType, byOutcome, byStatus) |
| `GET` | `/upcoming-follow-ups` | List upcoming follow-ups within N days |
| `GET` | `/company/:companyId` | Get outreaches by company |
| `GET` | `/:id` | Get outreach by ID |
| `PUT` | `/:id` | Update outreach |
| `PATCH` | `/:id/complete` | Mark outreach as completed |
| `PATCH` | `/:id/cancel` | Cancel outreach |
| `PATCH` | `/:id/missed` | Mark outreach as missed |
| `POST` | `/:id/follow-up` | Schedule follow-up outreach |
| `DELETE` | `/:id` | Soft delete |
| `DELETE` | `/:id/permanently-delete` | Permanently delete |

#### Module: Employment

Base path: `/api/employment`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create employment record |
| `GET` | `/` | List employments (paginated, filterable by alumniId, companyId, isCurrent) |
| `GET` | `/:id` | Get employment by ID |
| `PUT` | `/:id` | Update employment |
| `DELETE` | `/:id` | Delete employment |

#### Module: TPO Sync

Base path: `/api/tpo`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/sync-student-counts` | Ingest manual placement drive data |

**`POST /api/tpo/sync-student-counts` Request:**
```json
{
  "companyId": "uuid",
  "driveDate": "2026-08-15",
  "jobTitle": "Software Engineer",
  "studentsAppeared": 45,
  "studentsSelected": 12,
  "package": 1200000
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": "uuid", "companyId": "uuid", ... }
}
```

#### Module: AI (NVIDIA NIM)

Base path: `/api/ai`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/generate-email` | Generate personalized outreach email via NVIDIA NIM |

**`POST /api/ai/generate-email` Request:**
```json
{
  "companyName": "Google",
  "recipientName": "John Doe",
  "context": "We are looking to collaborate for campus placements",
  "tone": "professional"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subject": "Collaboration Opportunity with EduBridge",
    "body": "Dear John,..."
  }
}
```

---

## 3. Security & RBAC

### 3.1 JWT Authentication

The system uses a **single JWT token** strategy (no access/refresh token split).

```
Token creation (login):
  payload = { id: user.id, email: user.email, role: user.role }
  token = JWT.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE || '24h' })

Token verification (middleware):
  header = req.headers.authorization  // "Bearer <token>"
  if !header → 401
  req.user = JWT.verify(token, JWT_SECRET)
  next()
```

- **`JWT_SECRET`**: Environment variable, configured per deployment
- **`JWT_EXPIRE`**: Environment variable, defaults to `24h`
- **Password hashing**: bcrypt with cost factor 10
- **Password reset flow**: Email OTP → verify-otp returns short-lived reset JWT → reset-password accepts new password

### 3.2 Auth Middleware

Five middleware functions are provided in `middleware/auth.js`:

| Middleware | Behavior |
|-----------|----------|
| `authenticate` | Extracts Bearer token, verifies JWT, attaches `req.user` with `{ id, email, role }`. Returns 401 on failure. |
| `isAdmin` | Checks `req.user.role === "admin"`. Returns 403 if not admin. Must follow `authenticate`. |
| `isTPO` | Checks `req.user.role` is at least `tpo` level (admin, tpo, ebsc, rbsc). Returns 403 otherwise. |
| `isRBSC` | Checks `req.user.role` is `rbsc` or higher (admin, tpo, ebsc, rbsc). Returns 403 otherwise. |
| `isEBSC` | Checks `req.user.role` is `ebsc` or higher (admin, tpo, ebsc). Returns 403 otherwise. |

### 3.3 Role Hierarchy

```
admin  >  tpo  >  ebsc  >  rbsc  >  hod  >  coordinator
```

Higher roles inherit all permissions of lower roles.

### 3.4 Permission Matrix

| Operation | Admin | TPO | EBSC | RBSC | HOD | Coordinator |
|-----------|-------|-----|------|------|-----|-------------|
| Create users | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Login | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage companies | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage alumni | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage MoUs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage deals | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage outreach | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View analytics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Institutional Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TPO Sync (ingest drives) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| AI Email Generation | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| View activity logs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create activity logs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

> **Note:** The permission matrix above reflects the capabilities of the built service/controller layer. The only RBAC rule currently **enforced** at the middleware level is `isAdmin` on the `create_user` endpoint. All other endpoints currently have no role gate — they are open to any authenticated user. Role-gating per operation should be added as endpoints are hardened.

---

## 4. Module Inventory

### 4.1 Source File Map

| Layer | File (relative to `backend/src/`) | Lines | Purpose |
|-------|-----------------------------------|-------|---------|
| **Entry** | `server.js` | 39 | Express bootstrap, mounts all route modules, DB connection |
| **Config** | `config/prisma.js` | 26 | Prisma client initialization with PostgreSQL adapter |
| **Config** | `config/jwt.js` | 12 | JWT sign/verify helpers |
| **Config** | `config/db.js` | 4 | Re-exports prisma client |
| **Middleware** | `middleware/auth.js` | 22 | `authenticate`, `isAdmin`, `isTPO`, `isRBSC`, `isEBSC` middleware |
| **Routes** | `routes/auth.js` | 183 | Login, forgot-password, create_user, verify-otp, reset-password |
| **Routes** | `routes/analytics.js` | 7 | Dashboard + institutional dashboard analytics routes |
| **Routes** | `routes/company360.js` | 27 | Company360 CRUD routes |
| **Routes** | `routes/alumni.js` | 48 | Alumni CRUD routes |
| **Routes** | `routes/dealPipeline.js` | 34 | Deal pipeline CRUD + stage management routes |
| **Routes** | `routes/mouvoult.js` | 31 | MoU CRUD + status management routes |
| **Routes** | `routes/outreach.js` | 30 | Outreach CRUD + follow-up routes |
| **Routes** | `routes/employment.js` | 18 | Employment CRUD routes |
| **Routes** | `routes/tpo.js` | — | TPO Sync endpoints |
| **Routes** | `routes/ai.js` | — | AI email generation endpoints |
| **Controller** | `controller/company360.js` | 185 | Company360 request handlers |
| **Controller** | `controller/alumni.js` | 365 | Alumni request handlers |
| **Controller** | `controller/mouvoult.js` | 236 | MoU request handlers |
| **Controller** | `controller/analytics.js` | 14 | Analytics + institutional dashboard request handlers |
| **Controller** | `controller/dealPipeline.js` | 268 | Deal pipeline request handlers |
| **Controller** | `controller/outreach.js` | 288 | Outreach request handlers |
| **Controller** | `controller/employment.js` | 115 | Employment request handlers |
| **Controller** | `controller/tpo.js` | — | TPO sync request handlers |
| **Controller** | `controller/ai.js` | — | AI email generation request handlers |
| **Service** | `service/company360Services.js` | 358 | Company360 business logic |
| **Service** | `service/alumni.js` | 1186 | Alumni business logic |
| **Service** | `service/DealPipeline.js` | 914 | Deal pipeline business logic |
| **Service** | `service/mouvoult.js` | 891 | MoU business logic |
| **Service** | `service/OutreachServices.js` | 986 | Outreach business logic |
| **Service** | `service/employment.js` | 313 | Employment business logic |
| **Service** | `service/Analytics.js` | 67 | Dashboard + institutional dashboard aggregation logic |
| **Service** | `service/ActivityLog.js` | — | Shared activity log service (writes to `activity_logs` table for calls/emails/meetings) |
| **Service** | `service/TpoSync.js` | — | TPO sync business logic for placement drive ingestion |
| **Service** | `service/AiService.js` | — | NVIDIA NIM API integration for email generation |
| **Utils** | `utils/email.js` | 24 | Nodemailer transporter for OTP emails |

### 4.2 Service-to-Model Mapping

| Service Module | Primary Model | Secondary Models |
|----------------|---------------|-----------------|
| `company360Services.js` | Company360 | — |
| `alumni.js` | Alumni | Company360, Employment, Department |
| `DealPipeline.js` | DealPipeline | Company360, User |
| `mouvoult.js` | MoU | Company360, Department |
| `OutreachServices.js` | Outreach | Company360 |
| `employment.js` | Employment | Alumni, Company360 |
| `Analytics.js` | Company360, MoU, Outreach | PlacementDrive |
| `ActivityLog.js` | ActivityLog | Company360, User |
| `TpoSync.js` | PlacementDrive | Company360 |
| `AiService.js` | — (external API) | — |

### 4.3 Notable Implementation Details

- **Soft delete**: Company360, MoU, Outreach, DealPipeline use `deletedAt` nullable timestamp for soft deletes. Alumni lacks a `deletedAt` field — uses `status` enum instead.
- **Audit fields**: Most models include `createdBy` and `updatedBy` (UUID strings) for basic audit trails.
- **Enum normalization**: Service layers include mapping functions (`normalizeEnum`, `statusMap`) to handle both human-readable labels and enum values during input/output.
- **Shared activity log**: The `ActivityLog` service writes an entry for every call/email/meeting interaction, visible to all admin-level roles. This provides a unified company history across the TPO team.
- **Notification routing**: Faculty-facing alerts (MoU expiry, follow-up reminders) are routed to users with `hod` and `tpo` roles rather than individual faculty members.
- **NVIDIA NIM integration**: The AI email generation service calls the NVIDIA NIM API with contextual prompts to generate personalized outreach emails. Requires `NVIDIA_API_KEY` environment variable.
- **Part A / Part B deliverables**: MoUs can be classified as `PART_A_SEMINARS` (corporate seminars) or `PART_B_HIGHER_STUDIES` (higher education collaboration) via the `deliverableType` enum.

---

## Appendix A — Index Summary

| Table | Index Name | Type | Columns |
|-------|-----------|------|---------|
| `alumni` | `alumni_company_id` | B-tree | `companyId` |
| `company360` | `company360_city` | B-tree | `city` |
| `company360` | `company360_health_score` | B-tree | `healthScore` |
| `company360` | `company360_industry` | B-tree | `industry` |
| `company360` | `company360_next_follow_up_date` | B-tree | `nextFollowUpDate` |
| `company360` | `company360_partnership_level` | B-tree | `partnershipLevel` |
| `company360` | `company360_relationship_stage` | B-tree | `relationshipStage` |
| `company360` | `company360_status` | B-tree | `status` |
| `deal_pipeline` | `deal_pipeline_company_id` | B-tree | `companyId` |
| `deal_pipeline` | `deal_pipeline_expected_hiring_date` | B-tree | `expectedHiringDate` |
| `deal_pipeline` | `deal_pipeline_next_follow_up_date` | B-tree | `nextFollowUpDate` |
| `deal_pipeline` | `deal_pipeline_owner_id` | B-tree | `ownerId` |
| `deal_pipeline` | `deal_pipeline_priority` | B-tree | `priority` |
| `deal_pipeline` | `deal_pipeline_probability` | B-tree | `probability` |
| `deal_pipeline` | `deal_pipeline_stage` | B-tree | `stage` |
| `mous` | `mous_collaboration_type` | B-tree | `collaborationType` |
| `mous` | `mous_company_id` | B-tree | `companyId` |
| `mous` | `mous_end_date` | B-tree | `endDate` |
| `mous` | `mous_status` | B-tree | `status` |
| `outreaches` | `outreaches_company_id` | B-tree | `companyId` |
| `outreaches` | `outreaches_interaction_date` | B-tree | `interactionDate` |
| `outreaches` | `outreaches_next_follow_up_date` | B-tree | `nextFollowUpDate` |
| `outreaches` | `outreaches_outcome` | B-tree | `outcome` |
| `outreaches` | `outreaches_status` | B-tree | `status` |
| `employment` | `employment_alumni_id` | B-tree | `alumniId` |
| `employment` | `employment_company_id` | B-tree | `companyId` |
| `employment` | `employment_alumni_id_is_current` | B-tree | `(alumniId, isCurrent)` |
| `employment` | `employment_company_id_is_current` | B-tree | `(companyId, isCurrent)` |
| `mous` | `mous_department_id` | B-tree | `departmentId` |
| `placement_drives` | `placement_drives_company_id` | B-tree | `companyId` |
| `activity_logs` | `activity_logs_company_id` | B-tree | `companyId` |
| `activity_logs` | `activity_logs_performed_by` | B-tree | `performedBy` |
