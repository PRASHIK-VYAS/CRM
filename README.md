# EduBridge Enterprise

> **Institutional CRM for Training & Placement Offices**

EduBridge Enterprise digitizes the full recruiter lifecycle — from initial outreach and MoU signing to placement transactions and alumni networking — serving TPO Admins, Officers, Students, and Recruiters.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Feature Modules](#2-feature-modules)
3. [MoU Deliverables: Part A & Part B](#3-mou-deliverables-part-a--part-b)
4. [AI-Powered Email Automation (NVIDIA NIM)](#4-ai-powered-email-automation-nvidia-nim)
5. [Tech Stack](#5-tech-stack)
6. [Getting Started](#6-getting-started)
7. [Project Structure](#7-project-structure)
8. [Documentation Index](#8-documentation-index)

---

## 1. Overview

EduBridge Enterprise replaces fragmented manual processes (Excel, WhatsApp, physical files) with a unified relational system that:

- **Preserves institutional memory** — company relationships survive staff turnover
- **Automates outreach** — follow-up reminders, MoU expiry alerts, AI-generated emails
- **Tracks placements** — from drive scheduling through offer acceptance
- **Builds alumni influence maps** — leverage graduated students for referrals

---

## 2. Feature Modules

| Module | Description |
|--------|-------------|
| **Company 360°** | Centralized corporate profiles with CRM pipeline, deal tracking, health scoring |
| **Deal Pipeline** | Multi-stage sales pipeline from cold lead to strategic partnership |
| **MoU Vault** | Digital agreement storage with expiry alerts and deliverable classification |
| **Outreach Engine** | Interaction logging (calls, emails, meetings) with follow-up scheduling |
| **Placement Drives** | Track student appearances, selections, and package distribution per company |
| **Alumni Network** | Alumni directory with influence scoring and company mapping |
| **Employment History** | Alumni career timeline across companies |
| **Institutional Dashboard** | Aggregate view: total students, highest package, company-wise distribution |
| **AI Email Generator** | NVIDIA NIM-powered personalized outreach email generation |
| **Shared Activity Log** | Unified call/email history visible to all admins |

---

## 3. MoU Deliverables: Part A & Part B

EduBridge MoUs support a **deliverable type** classification that maps to the institution's academic collaboration framework.

### Part A — Seminars (PART_A_SEMINARS)

Corporate seminars and industry engagement activities:
- Guest lectures and industry talks
- Technical workshops and training sessions
- Industry visits and exposure programs
- Webinars and panel discussions

### Part B — Higher Studies (PART_B_HIGHER_STUDIES)

Academic and research collaboration for higher education pathways:
- Research partnerships and joint publications
- Curriculum development and consultancy
- Higher studies guidance and scholarships
- Faculty development programs

### BOTH (BOTH)

MoUs that encompass both seminar and higher studies deliverables.

### Setting the Deliverable Type

When creating or updating an MoU via the API:

```json
POST /api/mou
{
  "mouNumber": "MOU-2026-001",
  "title": "Academic Partnership with XYZ Corp",
  "companyId": "uuid",
  "departmentId": "uuid",
  "deliverableType": "PART_A_SEMINARS",
  "startDate": "2026-08-01",
  "endDate": "2028-07-31",
  "signedDate": "2026-07-23",
  "collaborationType": "PLACEMENTS",
  "purpose": "Annual campus recruitment and seminar partnership"
}
```

Valid `deliverableType` values:
- `PART_A_SEMINARS` — Seminars & workshops
- `PART_B_HIGHER_STUDIES` — Higher studies & research
- `BOTH` — Both categories

---

## 4. AI-Powered Email Automation (NVIDIA NIM)

EduBridge Enterprise integrates with **NVIDIA NIM** to generate personalized outreach emails for corporate communication.

### How It Works

1. The TPO provides context about the company and recipient
2. The NVIDIA NIM API generates a professional email draft
3. The output includes a subject line and email body
4. The TPO can review, edit, and send through their email client

### API Endpoint

```http
POST /api/ai/generate-email
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "companyName": "Google",
  "recipientName": "Jane Smith",
  "recipientTitle": "HR Director",
  "context": "We are organizing the 2026 campus placement drive and would like to invite Google to participate.",
  "tone": "professional",
  "previousInteraction": "We met at the 2025 campus fair"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subject": "Invitation to Participate in EduBridge 2026 Campus Placements",
    "body": "Dear Jane,\n\nI hope this message finds you well..."
  }
}
```

### Configuration

Add the following environment variable to enable the AI service:

```
NVIDIA_API_KEY=<your-nvidia-nim-api-key>
```

The service is available to **Admin**, **TPO**, **EBSC**, and **RBSC** roles.

### Usage Tips

- **Context field**: Include specific details about the partnership to get relevant drafts
- **Previous interaction**: Reference past meetings or conversations for continuity
- **Tone options**: `professional` (default), `friendly`, `formal`, `persuasive`

---

## 5. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS + Three.js |
| **Backend** | Node.js + Express.js 5.x |
| **Database** | PostgreSQL 15+ (hosted on Supabase) |
| **ORM** | Prisma ORM 7.x |
| **Auth** | JWT (bcrypt + JSON Web Tokens) |
| **AI** | NVIDIA NIM API |
| **Email** | Nodemailer (SMTP) |

---

## 6. Getting Started

```bash
# Backend
cd backend
cp .env.example .env    # Configure DATABASE_URL, JWT_SECRET, SMTP, NVIDIA_API_KEY
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run dev

# Frontend
cd Frontend
npm install
npm run dev
```

---

## 7. Project Structure

```
CRM/
├── backend/
│   ├── prisma/           # Schema + migrations
│   ├── src/
│   │   ├── config/       # Prisma client, JWT helpers
│   │   ├── controller/   # Request handlers
│   │   ├── middleware/    # Auth middleware (authenticate, isAdmin, isTPO, etc.)
│   │   ├── routes/       # Express route definitions
│   │   ├── service/      # Business logic
│   │   ├── utils/        # Email transporter
│   │   └── server.js     # Express entry point
│   └── docs/             # Legacy docs, OpenAPI spec
├── Frontend/             # Next.js application
├── diagrams/             # Architecture diagrams
├── LLD.md                # Low-level design document
├── ROLES.md              # Role-based access matrix
├── SRS.md                # Software requirements specification
├── PVD.md                # Product vision document
├── README.md             # This file
└── package.json          # Root workspace config
```

---

## 8. Documentation Index

| Document | Description |
|----------|-------------|
| `SRS.md` | Software Requirements Specification |
| `EduBridge_Enterprise_SRS.md` | Enterprise feature SRS |
| `PVD.md` | Product Vision Document |
| `LLD.md` | Low-Level Design (schema, APIs, RBAC, module inventory) |
| `ROLES.md` | Role matrix and permission mappings |
| `backend/docs/openapi.yml` | OpenAPI 3.0 specification |
| `ER.drawio.svg` | Entity-Relationship Diagram |
