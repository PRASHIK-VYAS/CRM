# SOFTWARE REQUIREMENTS SPECIFICATION

**Project:** EduBridge Enterprise
**Document:** SRS — Functional & Non-Functional Requirements
**Version:** 2.0 — Enterprise Suite
**Prepared For:** Development, DBA, and QA Teams
**Status:** Internal — Confidential
**Date:** 23 July 2026

> **CONFIDENTIAL – FOR INTERNAL USE ONLY**

---

## Document Revision History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 26 Jun 2026 | Initial MVP specification | Project Lead |
| 2.0 | 23 Jul 2026 | Enterprise rewrite — 7-role hierarchy, Kanban, Gemini AI, web scraping, MoU Intelligence, Analytics, No-Code designer | Project Lead |

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for EduBridge Enterprise, a full-stack Institutional CRM for Training and Placement Offices (TPOs). It serves as the contractual baseline between stakeholders and the development team for the Enterprise Suite delivery.

### 1.2 Document Conventions

| Term | Description |
|------|-------------|
| SHALL | Mandatory requirement |
| SHOULD | Recommended requirement |
| MAY | Optional feature |
| FR-XXX | Functional Requirement identifier |
| NFR-XXX | Non-Functional Requirement identifier |
| MoU | Memorandum of Understanding |
| RBAC | Role-Based Access Control |

### 1.3 Intended Audience

| Stakeholder | Purpose |
|-------------|---------|
| Database Administrator (DBA) | Design normalized MySQL schema aligned with the hierarchy and module data model |
| Backend Developers | Implement REST APIs, Gemini AI integration, web scraping engine, Kanban logic |
| Frontend Developers | Build responsive React dashboards, Kanban board, No-Code designer |
| Project Manager | Baseline for sprint planning and scope control |
| QA / Test Engineers | Derive test cases from FRs and NFRs |
| System Administrators | Setup MySQL, Node.js, and Docker hosting |

### 1.4 Project Scope

EduBridge Enterprise provides centralized management of institutional corporate relations, placement transactions, AI-driven outreach, and advanced analytics.

**In Scope:**
- Seven-role hierarchy: Admin, Head, TPO, Co-Head, EBSC, RBSC, Coordinator
- Company Tiers (Tier 1/2/3) and 360° Directory with phone numbers and hire keys
- Kanban Deal Pipeline with Current Status, stage gates, probability tracking
- Gemini AI integration for personalized email generation
- Web scraping engine for automated lead discovery
- Department-wise MoU Vault with filtered expiry alerts and Part A/B classification
- Alumni Role Mapping with influence scoring
- Placement analytics: Selection Ratios, Placement Calendar, Peak Package Reporting
- No-Code Card Template Designer with drag-and-drop components
- Institutional Dashboard, TPO Sync API, Shared Activity Logs, Drive Tracking

**Out of Scope:**
- Native mobile apps (iOS/Android)
- AI-based predictive matching (reserved for V2)
- Integrated payment gateways
- Direct student-facing company management portal

### 1.5 References

- IEEE Std 830-1998 — Recommended Practice for Software Requirements Specifications
- Internal VPPCOE TPO workflow analysis
- Gemini API documentation for text generation
- Competitive analysis of HubSpot CRM and Superset

---

## 2. Overall Description

### 2.1 Product Perspective

EduBridge Enterprise is a standalone, web-based B2B SaaS application running on the MERN-S stack (MySQL, Express, React, Node). It replaces fragmented manual processes with a unified relational system featuring AI automation and visual Kanban pipeline management.

The system interfaces with:
- **Gemini API:** For personalized email content generation
- **Web Scraping Engine:** Puppeteer/Cheerio-based automated lead discovery
- **Email Gateways:** SMTP/SendGrid for bulk outreach and notifications
- **File Storage:** Local/S3 for MoU PDFs and card template assets

### 2.2 User Classes and Characteristics

| Role | Proficiency | Description |
|------|-------------|-------------|
| **Admin** | High | System-level user management, global configuration, audit access |
| **Head** | Moderate-High | Top TPO lead — cross-department visibility, all modules, Peak Package reporting |
| **TPO Officer** | Moderate | Primary power user — full CRM, AI email, web scraping, drive ingestion |
| **Co-Head** | Moderate | Deputy to Head — manages vertical, Kanban pipeline, team oversight |
| **EBSC** | Moderate | Education & Beyond Sub-Committee — academic MoUs and higher studies |
| **RBSC** | Moderate | Recruitment & Branding Sub-Committee — company tiers and outreach |
| **Coordinator** | Low-Moderate | Department-level operator — scoped to own department's data |

### 2.3 Operating Environment

| Component | Specification |
|-----------|---------------|
| **Client** | Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) |
| **Server OS** | Linux (Ubuntu 22.04 / Debian 11) via Node.js 20+ runtime |
| **Database** | MySQL 8.0+ |
| **Hosting** | Dockerized on Cloud VPS (min 4GB RAM / 2 vCPUs) |
| **Responsiveness** | Desktop primary, tablet secondary, mobile view-only |

### 2.4 Design and Implementation Constraints

- **Timeline:** Hard deadline of 100 days (24 Jul – 31 Oct 2026)
- **Tech Stack:** Mandated MERN-S (MySQL, Express 5.x, React 18+, Node 20+)
- **ORM/Query:** Knex.js query builder or raw SQL (no Prisma)
- **AI Model:** Gemini API (not NVIDIA NIM)
- **No-Code Designer:** Custom React-based drag-and-drop (no third-party page builder)

### 2.5 Assumptions and Dependencies

- Excel data from existing tracking sheets can be cleaned and imported.
- Gemini API key will be provisioned with sufficient quota for daily email generation.
- SMTP provider will be configured for bulk email delivery.
- TPO staff will be available for bi-weekly UAT sessions.
- Web scraping will target publicly accessible job portals and company websites.

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-001 | The system SHALL support JWT-based authentication with token expiry of 24 hours | All |
| FR-002 | The system SHALL support password hashing via bcrypt (cost factor 10) | All |
| FR-003 | The system SHALL support password reset via email OTP flow | All |
| FR-004 | The system SHALL enforce role-based access at API middleware level for all endpoints | All |
| FR-005 | The system SHALL support 7 distinct roles: Admin, Head, TPO, Co-Head, EBSC, RBSC, Coordinator | System |
| FR-006 | The system SHALL enforce role hierarchy: Admin > Head > TPO > Co-Head > EBSC > RBSC > Coordinator | System |

### 3.2 User Management

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-010 | The system SHALL allow only Admin users to create, update, and delete user accounts | Admin |
| FR-011 | The system SHALL assign each user a department scope (NULL for cross-department roles) | Admin |
| FR-012 | The system SHALL allow users to update their own profile (name, email, password) | All |
| FR-013 | The system SHALL log all user creation and role changes in the audit trail | System |

### 3.3 Company Tiers & 360° Directory

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-020 | The system SHALL allow creating company records with fields: companyName, industry, website, email, phone, phoneNumber, linkedin, headOffice, city, country, postalCode, companySize, foundedYear, description | Head/TPO/Co-Head/EBSC/RBSC/Coordinator |
| FR-021 | The system SHALL support 3 company tiers: Tier 1 (Premium), Tier 2 (Standard), Tier 3 (Emerging) | Head/TPO/Co-Head/RBSC |
| FR-022 | The system SHALL include a dedicated phoneNumber field distinct from the general phone field | All creators |
| FR-023 | The system SHALL include a hireKey field (Head/Co-Head) indicating the relationship owner | Head/TPO/Co-Head |
| FR-024 | The system SHALL support searching companies by name, industry, city, tier, and status | All |
| FR-025 | The system SHALL support paginated listing with CSV export | All |
| FR-026 | The system SHALL support soft-delete (deletedAt) and restore for company records | Head/TPO/Co-Head |
| FR-027 | The system SHALL automatically update aggregate counters (totalPlacements, totalOffers, totalVisits, totalMoUs) when related records are created | System |

### 3.4 Kanban Deal Pipeline

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-030 | The system SHALL provide a Kanban board view of deals organized by stage | Head/TPO/Co-Head/EBSC/RBSC |
| FR-031 | The system SHALL support deal stages: Cold Lead, Initial Contact, Follow-Up, Meeting Scheduled, Proposal Sent, Negotiation, MoU Discussion, MoU Signed, Placement Drive, Active Partner, Strategic Partner | All deal managers |
| FR-032 | The system SHALL allow creating deals with: title, companyId, ownerId, stage, priority, probability, expectedStudents, expectedCTC, expectedHiringDate, source, leadOwner, decisionMaker, decisionMakerEmail, decisionMakerPhone | Head/TPO/Co-Head/RBSC |
| FR-033 | The system SHALL support drag-and-drop stage changes on the Kanban board | Head/TPO/Co-Head/RBSC |
| FR-034 | The system SHALL track deal stage history (previous stage, new stage, timestamp, user) | System |
| FR-035 | The system SHALL include a Current Status field on each deal card (On Track / At Risk / Stalled / Won / Lost) | Head/TPO/Co-Head |
| FR-036 | The system SHALL support deal priority levels: Low, Medium, High, Critical | Head/TPO/Co-Head/RBSC |
| FR-037 | The system SHALL support assigning risk levels: Low, Medium, High | Head/TPO/Co-Head |
| FR-038 | The system SHALL support filtering deals by: stage, priority, owner, source, risk level, probability range, date range | Head/TPO/Co-Head |
| FR-039 | The system SHALL calculate probability automatically based on stage with configurable defaults | System |

### 3.5 Gemini AI Email Automation

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-040 | The system SHALL integrate with Google Gemini API for personalized email generation | Head/TPO/Co-Head/EBSC/RBSC |
| FR-041 | The system SHALL accept inputs: companyName, recipientName, context/purpose, tone preference (professional/warm/formal) | Head/TPO/Co-Head/EBSC/RBSC |
| FR-042 | The system SHALL return generated email with subject line and body | System |
| FR-043 | The system SHALL allow the user to edit the generated email before sending | Head/TPO/Co-Head/EBSC/RBSC |
| FR-044 | The system SHALL log all AI-generated emails in both the outreach record and activity log | System |
| FR-045 | The system SHALL handle Gemini API errors with a fallback to manual template composition | System |
| FR-046 | The system SHALL NOT allow Coordinator role to access AI email generation | System |

### 3.6 Web Scraping Lead Generation

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-050 | The system SHALL include a configurable web scraping engine using Puppeteer/Cheerio | System |
| FR-051 | The system SHALL extract: company name, industry, website, contact email/phone, location from target sources | System |
| FR-052 | The system SHALL create scraped companies as leads with status "Prospect" and source "Web Scrape" | System |
| FR-053 | The system SHALL support scheduled scraping (daily/weekly) via cron or job queue | System |
| FR-054 | The system SHALL flag potential duplicate companies by name similarity against existing directory entries | System |
| FR-055 | The system SHALL provide a review queue where Head/TPO can approve, edit, or reject scraped leads | Head/TPO |
| FR-056 | The system SHALL allow Co-Heads and Coordinators to view scraped leads (read-only) in the review queue | Co-Head/Coordinator |

### 3.7 Department-wise MoU Intelligence

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-060 | The system SHALL store MoU records with: companyId, departmentId, mouNumber, title, purpose, startDate, endDate, signedDate, status, collaborationType, deliverableType, signedByCompany, signedByInstitute, documentUrl | Head/TPO/Co-Head/EBSC/Coordinator |
| FR-061 | The system SHALL classify MoUs by deliverable type: Part A (Seminars/Workshops), Part B (Higher Studies), or Both | All creators |
| FR-062 | The system SHALL associate each MoU with an academic department via departmentId FK | All creators |
| FR-063 | The system SHALL support filtering MoUs by department | Head/TPO/Co-Head |
| FR-064 | The system SHALL trigger expiry alerts at a configurable number of days before endDate (default: 30) | System |
| FR-065 | The system SHALL route MoU expiry alerts based on department scope: TPO/Head receive all department alerts; Coordinator receives only own department alerts | System |
| FR-066 | The system SHALL display a department-wise MoU dashboard showing: total active, expiring this quarter, expired this year per department | Head/TPO/Co-Head |
| FR-067 | The system SHALL allow Coordinators to view and manage ONLY MoUs tagged to their department | System |

### 3.8 Alumni Role Mapping

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-070 | The system SHALL store alumni records with: fullName, email, phone, department, batchYear, currentDesignation, seniorityLevel, companyId, linkedin, location, skills, willingnessToHelp, helpTypes, influenceScore, relationshipScore | Head/TPO/Co-Head/Coordinator |
| FR-071 | The system SHALL support alumni seniority levels: Entry, Mid, Senior, Lead, Manager, Director, Founder, HR, Other | All creators |
| FR-072 | The system SHALL support searching alumni by: company, role, seniority, department, batch year | Head/TPO/Co-Head |
| FR-073 | The system SHALL support filtering by willingnessToHelp (Yes/No/Maybe) | Head/TPO/Co-Head |
| FR-074 | The system SHALL allow manual update of influenceScore (0-100) and relationshipScore (0-100) | Head/TPO/Co-Head |
| FR-075 | The system SHALL display alumni count per company on the company profile page | All |

### 3.9 Placement Analytics

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-080 | The system SHALL calculate and display student-to-selection ratio (X:Y) and percentage per placement drive | Head/TPO/Co-Head |
| FR-081 | The system SHALL display placement drives in a calendar view (month/week/day) | Head/TPO/Co-Head |
| FR-082 | The system SHALL support calendar filtering by: company, department, date range, status (Scheduled/Completed/Cancelled) | Head/TPO/Co-Head |
| FR-083 | The system SHALL track and display Peak Package per year with: company, student name, package amount, department | Head/TPO/Co-Head |
| FR-084 | The system SHALL display year-over-year Peak Package comparison chart | Head/TPO/Co-Head |
| FR-085 | The system SHALL calculate and display average and median package per year | Head/TPO/Co-Head |
| FR-086 | The system SHALL support export of analytics reports (PDF/CSV) | Head/TPO/Co-Head |

### 3.10 No-Code Card Template Designer

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-090 | The system SHALL provide a visual drag-and-drop card template editor | Head/TPO/Co-Head/EBSC/RBSC |
| FR-091 | The system SHALL include components: text block, image, button, divider, badge, icon, spacer | All designers |
| FR-092 | The system SHALL support: resize, reorder, delete, and duplicate of components | All designers |
| FR-093 | The system SHALL provide a live preview of the card being designed | All designers |
| FR-094 | The system SHALL allow saving templates with name and category | All designers |
| FR-095 | The system SHALL allow Head/Admin to publish templates as organization-approved | Admin/Head |
| FR-096 | The system SHALL track template usage analytics (template ID, user, count, date) | System |
| FR-097 | The system SHALL allow Coordinators to use published templates only (not create new ones) | Coordinator |

### 3.11 Institutional Dashboard

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-100 | The system SHALL display total students count | Head/TPO/Co-Head/EBSC/RBSC |
| FR-101 | The system SHALL display highest package (current year and all-time) | Head/TPO/Co-Head/EBSC/RBSC |
| FR-102 | The system SHALL display average and median package | Head/TPO/Co-Head/EBSC/RBSC |
| FR-103 | The system SHALL display company-wise package distribution (table and chart) | Head/TPO/Co-Head/EBSC/RBSC |
| FR-104 | The system SHALL display deal pipeline summary (deals by stage) | Head/TPO/Co-Head |
| FR-105 | The system SHALL display active MoU count and upcoming expirations | Head/TPO/Co-Head |
| FR-106 | The system SHALL display upcoming placement drives | Head/TPO/Co-Head |
| FR-107 | The system SHALL support date range filtering (current year, last year, custom) | Head/TPO/Co-Head |
| FR-108 | The system SHALL auto-refresh dashboard data every 5 minutes | System |

### 3.12 TPO Sync API

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-110 | The system SHALL provide a REST endpoint `POST /api/tpo/sync-student-counts` | Head/TPO/Co-Head |
| FR-111 | The system SHALL accept: companyId, driveDate, jobTitle, studentsAppeared, studentsSelected, package | Head/TPO/Co-Head |
| FR-112 | The system SHALL validate that studentsSelected <= studentsAppeared | System |
| FR-113 | The system SHALL support batch input as JSON array | System |
| FR-114 | The system SHALL create/update PlacementDrive record and update Company360 aggregate counters | System |
| FR-115 | The system SHALL return detailed validation errors for failed records | System |

### 3.13 Shared Activity Logs

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-120 | The system SHALL log all calls, emails, meetings, and notes as activity log entries | System |
| FR-121 | Each activity log entry SHALL include: companyId, type (CALL/EMAIL/MEETING/NOTE), subject, description, performedBy, createdAt | System |
| FR-122 | The system SHALL make activity logs visible to all roles except Coordinator (who can only create, not view others') | System |
| FR-123 | The system SHALL support filtering activity logs by: company, user, type, date range | Admin/Head/TPO/Co-Head |

### 3.14 Placement Drive Tracking

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-130 | The system SHALL store placement drive records with: companyId, driveDate, jobTitle, studentsAppeared, studentsSelected, package, notes | Head/TPO/Co-Head |
| FR-131 | The system SHALL display drive records on the company profile page | All |
| FR-132 | The system SHALL support multiple drives per company | All creators |
| FR-133 | The system SHALL calculate and display selection ratio per drive | System |

### 3.15 Department Management

| FR-ID | Requirement | Role |
|-------|-------------|------|
| FR-140 | The system SHALL store academic departments with: name, code | Admin |
| FR-141 | The system SHALL associate users (Coordinators) with a department | Admin |
| FR-142 | The system SHALL scope Coordinator data access to their department for: companies, MoUs, alumni, deals, drives | System |

---

## 4. Non-Functional Requirements

| NFR-ID | Category | Requirement |
|--------|----------|-------------|
| NFR-001 | Performance | Dashboard and profile pages SHALL load in < 2 seconds |
| NFR-002 | Performance | Kanban board SHALL render < 2 seconds for up to 200 deals |
| NFR-003 | Performance | Search queries in 360° Directory SHALL return results in < 1 second for up to 10,000 records |
| NFR-004 | Performance | AI email generation SHALL complete in < 5 seconds |
| NFR-005 | Performance | Web scraping batch SHALL complete within 30 minutes for 500 target pages |
| NFR-006 | Performance | Dashboard aggregates SHALL compute in < 3 seconds for 5 years of data |
| NFR-007 | Security | All APIs SHALL be protected via JWT; passwords SHALL be hashed with bcrypt |
| NFR-008 | Security | API rate limiting SHALL be applied: 100 requests/minute per user for standard endpoints, 10 requests/minute for AI generation |
| NFR-009 | Security | Web scraping SHALL respect robots.txt and apply rate limiting (max 5 requests/second per domain) |
| NFR-010 | Security | Gemini API key SHALL be stored server-side only, never exposed to client |
| NFR-011 | Availability | System SHALL maintain 99.5% uptime during placement season (Aug–Nov) |
| NFR-012 | Availability | Planned maintenance windows SHALL be notified 48 hours in advance |
| NFR-013 | Scalability | MySQL database SHALL handle up to 10,000 companies, 50,000 alumni, and 100,000 activity log entries |
| NFR-014 | Scalability | Kanban pipeline SHALL support up to 500 active deals without performance degradation |
| NFR-015 | Usability | UI SHALL be fully responsive (Desktop/Tablet) using Tailwind CSS |
| NFR-016 | Usability | Kanban board SHALL support both drag-and-drop and keyboard-based stage changes |
| NFR-017 | Usability | No-Code designer SHALL support undo/redo (min 20 levels) |
| NFR-018 | Maintainability | Code SHALL follow modular MVC structure: routes → controllers → services → models |
| NFR-019 | Maintainability | All API responses SHALL follow a consistent JSON envelope: `{ success, data, pagination, message }` |
| NFR-020 | Maintainability | Web scraping sources SHALL be configurable via environment variables or database table |
| NFR-021 | Compatibility | System SHALL support latest versions of Chrome, Firefox, Safari, and Edge |
| NFR-022 | Compliance | All data handling SHALL comply with institutional data privacy standards |
| NFR-023 | Compliance | AI-generated emails SHALL include a disclaimer: "Generated by EduBridge AI" |
| NFR-024 | Reliability | Activity log writes SHALL be synchronous — no data loss on successful API response |
| NFR-025 | Reliability | MoU expiry scan SHALL run daily at 00:00 server time via cron |

---

## 5. External Interface Requirements

### 5.1 User Interface

| Requirement | Specification |
|-------------|---------------|
| Layout | Role-based dashboards with sidebar navigation |
| Kanban View | Drag-and-drop board with stage columns, card details panel |
| Calendar View | Month/week/day toggle for placement drives |
| No-Code Designer | Canvas-based editor with component palette, property panel, live preview |
| Feedback | Toast notifications for all CRUD operations |
| Data Handling | Server-side pagination with configurable page size |

### 5.2 Software Interfaces

| Interface | Technology | Purpose |
|-----------|------------|---------|
| Gemini API | HTTPS REST | AI-powered email content generation |
| Web Scraping | Puppeteer / Cheerio | Automated lead discovery from public portals |
| Email Service | SMTP / SendGrid | Bulk and transactional email delivery |
| File Storage | Local / S3 | MoU PDF documents and card template assets |
| Import Tool | CSV/Excel parser | Bulk upload of legacy corporate data |

### 5.3 Communication Interfaces

| Interface | Specification |
|-----------|---------------|
| API Protocol | HTTPS REST with JSON request/response bodies |
| Authentication | JWT Bearer token in Authorization header |
| Pagination | Query parameters: `page`, `limit`; Response includes `pagination` object |
| Error Format | `{ success: false, data: null, message: "error description" }` |
| Success Format | `{ success: true, data: {...}, pagination: {...}, message: null }` |

---

## 6. Glossary

| Term | Definition |
|------|------------|
| Head | Top-level TPO lead with cross-department visibility |
| Co-Head | Deputy to Head, manages a vertical of Coordinators |
| Coordinator | Department-level CRM operator |
| Tier | Company classification (Tier 1 Premium / Tier 2 Standard / Tier 3 Emerging) |
| Kanban | Visual deal pipeline with stage columns |
| Gemini | Google's generative AI model for text generation |
| Web Scrape | Automated extraction of data from public web sources |
| MoU | Memorandum of Understanding |
| Peak Package | Highest salary package offered in a given academic year |
| No-Code | Visual interface requiring no programming knowledge |
| RBSC | Recruitment & Branding Sub-Committee |
| EBSC | Education & Beyond Sub-Committee |
| MERN-S | MySQL, Express, React, Node stack |
| Selection Ratio | Ratio of students selected to students appeared |
| Placement Drive | A hiring event by a company at the institution |

---

## 7. Appendix — Open Issues

| Issue ID | Category | Description | Owner | Status |
|----------|----------|-------------|-------|--------|
| ISS-001 | Data | Verification of existing Excel data quality for import | TPO | Open |
| ISS-002 | Email | Selection of SMTP provider (Internal vs SendGrid) | Tech Lead | Open |
| ISS-003 | Scraping | Target source URLs for web scraping lead generation | TPO | Open |
| ISS-004 | AI | Gemini API quota and rate limit configuration | Tech Lead | Open |
| ISS-005 | Designer | Set of approved card template categories and branding guidelines | UX Lead | Open |
