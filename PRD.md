# PRODUCT REQUIREMENTS DOCUMENT

**Project:** EduBridge Enterprise
**Document:** PRD — Functional Feature Catalog
**Version:** 2.0 — Enterprise Suite
**Status:** Internal — Confidential
**Date:** 23 July 2026

> **CONFIDENTIAL – FOR INTERNAL USE ONLY**

---

## Document Revision History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 26 Jun 2026 | Initial draft — MVP feature set | Project Lead |
| 2.0 | 23 Jul 2026 | Enterprise rewrite — Head/Co-Head hierarchy, AI automation, Kanban, MoU Intelligence, No-Code designer, Peak Package | Project Lead |

---

## 1. Introduction

### 1.1 Purpose

This Product Requirements Document (PRD) defines every feature of EduBridge Enterprise at a functional level. Each feature includes a description, user stories, acceptance criteria, and role-based visibility. This document serves as the single source of truth for what the product does, who can use each feature, and how it behaves.

### 1.2 Scope

The document spans 16 core features across five delivery phases. It covers the full Enterprise Suite including the Head → Co-Head → Coordinator hierarchy, Company Tiers & 360° Directory, Kanban Deal Pipeline, Gemini AI Email Automation, Web Scraping Lead Generation, Department-wise MoU Intelligence, Alumni Role Mapping, Placement Analytics, Peak Package Reporting, and the No-Code Card Template Designer.

### 1.3 Conventions

| Term | Meaning |
|------|---------|
| MUST | Mandatory feature — required for release |
| SHOULD | High-priority feature — strongly desired |
| COULD | Optional feature — implement if time permits |
| Head | Top-level TPO lead (formerly "Admin" in MVP) |
| Co-Head | Deputy to Head, manages Coordinators |
| Coordinator | Department-level operator |
| TPO | Training & Placement Officer (power user) |
| EBSC | Education & Beyond Sub-Committee |
| RBSC | Recruitment & Branding Sub-Committee |

---

## 2. Feature Definitions

---

### F-01: Head → Co-Head → Coordinator Hierarchy

**Description:** Three-tier management structure that defines the institutional placement chain of command. The Head oversees all operations. Co-Heads manage specific verticals (e.g., IT, Core, Analytics) and supervise Coordinators. Coordinators handle department-level data entry and outreach. EBSC and RBSC sub-committees operate alongside as specialized roles.

**User Stories:**
- As a **Head**, I want to create Co-Heads and Coordinators so that I can delegate responsibilities.
- As a **Co-Head**, I want to view all deals and activities within my vertical so that I can track team progress.
- As a **Coordinator**, I want to manage companies and alumni within my department so that I own my data scope.
- As an **RBSC** member, I want to manage company tiers and corporate outreach so that branding initiatives are tracked.
- As an **EBSC** member, I want to create higher-studies MoUs so that academic partnerships are managed separately.

**Acceptance Criteria:**
- System MUST support 7 distinct roles: Head, Co-Head, Coordinator, TPO, EBSC, RBSC, Admin.
- Role hierarchy: Admin > Head > TPO > Co-Head > EBSC > RBSC > Coordinator.
- Higher roles inherit all permissions of lower roles.
- Coordinator scope is limited to their assigned department.
- Head MUST have cross-department visibility.
- User creation MUST be restricted to Admin role only.

---

### F-02: Company Tiers

**Description:** Classification of corporate partners into Tier 1 (Premium), Tier 2 (Standard), and Tier 3 (Emerging) based on hiring history, package ranges, brand reputation, and engagement frequency. Tiers drive prioritization in outreach and deal pipeline.

**User Stories:**
- As a **Head**, I want to classify companies into tiers so that my team prioritizes high-value partners.
- As a **Co-Head**, I want to filter companies by tier so that I can assign outreach focus.
- As a **Coordinator**, I want to see the tier of every company so that I know which to prioritize.

**Acceptance Criteria:**
- System MUST support 3 company tiers: Tier 1 (Premium), Tier 2 (Standard), Tier 3 (Emerging).
- Tier classification MUST be editable by Head, Co-Head, TPO, and RBSC roles.
- Tier MUST be visible on company profile, deal cards, and directory listings.
- System SHOULD auto-suggest tier based on historical placement data (total hires, package avg).
- Filtering and sorting by tier MUST be available in the company directory.

---

### F-03: 360° Company Directory

**Description:** Centralized repository of every corporate entity in the institutional network. Each company profile includes full contact details (including dedicated phone number field), industry, website, LinkedIn, head office address, company size, founded year, description, partnership level, relationship stage, health score, next follow-up date, and aggregate counters (total placements, offers, visits, MoUs). Also tracks `hireKey` (Head or Co-Head responsible) and `phoneNumber` (dedicated business line distinct from general phone).

**User Stories:**
- As a **TPO**, I want a single searchable directory of all companies so that I never lose corporate data.
- As a **Coordinator**, I want to add phone numbers and hire keys so that contact details are complete.
- As a **Head**, I want to see aggregate counters (total placements, MoUs) per company so that I can measure partnership value.

**Acceptance Criteria:**
- System MUST support CRUD for company records.
- Company profile MUST include: companyName, industry, website, email, phone, phoneNumber (dedicated), linkedin, headOffice, city, country, postalCode, companySize, foundedYear, description, status, partnershipLevel, relationshipStage, healthScore, nextFollowUpDate, hireKey, totalPlacements, totalOffers, totalVisits, totalMoUs.
- Directory MUST support search by name, industry, city, tier, status.
- Directory MUST support pagination and CSV export.
- Phone number field MUST be distinct from general phone field.
- `hireKey` field MUST indicate which hierarchy level (Head / Co-Head) owns the relationship.

---

### F-04: Kanban Deal Pipeline

**Description:** Multi-stage deal tracking system that visualizes each company's journey from discovery to strategic partnership. Each deal includes a title, owner, stage, priority, probability, expected students, expected CTC, expected hiring date, source, lead owner, decision maker details, next action, meeting/proposal dates, MoU expected date, close date, lost reason, competitor college, risk level, and remarks. The "Current Status" field provides a real-time snapshot of deal health.

**User Stories:**
- As a **Co-Head**, I want to see all deals in a Kanban view so that I can drag-and-drop stages.
- As a **Head**, I want to filter deals by priority, stage, and owner so that I can identify bottlenecks.
- As a **Coordinator**, I want to update deal stage and next action so that pipeline data is current.

**Acceptance Criteria:**
- System MUST provide a Kanban board view with columns for each deal stage.
- Deal stages MUST include: Cold Lead → Initial Contact → Follow-Up → Meeting Scheduled → Proposal Sent → Negotiation → MoU Discussion → MoU Signed → Placement Drive → Active Partner → Strategic Partner.
- Each deal card MUST display: title, company, stage, priority, probability, expected CTC, next action, expected hiring date, deal owner, Current Status.
- Drag-and-drop MUST update deal stage immediately.
- Deal pipeline MUST support filtering by: stage, priority, owner, source, risk level, probability range, date range.
- System MUST track deal audit log (stage changes, timestamp, user).
- System MUST send follow-up reminders based on nextAction and nextFollowUpDate.
- Probability MUST auto-update based on stage (configurable defaults).

---

### F-05: Gemini AI Email Automation

**Description:** Integration with Google Gemini API to auto-generate personalized outreach emails. Given company context, recipient name, purpose, and preferred tone, the AI produces a complete email with subject line and body. Eliminates manual drafting for mass outreach campaigns.

**User Stories:**
- As a **TPO**, I want to input company name and context and get a ready-to-send email so that I save drafting time.
- As a **Co-Head**, I want to select tone (professional, warm, formal) so that emails match relationship stage.
- As a **Head**, I want to review AI-generated emails before sending so that quality is maintained.

**Acceptance Criteria:**
- System MUST integrate with Gemini API for email generation.
- Input MUST include: companyName, recipientName, context/purpose, tone preference.
- Output MUST include: subject line, email body (plain text or HTML).
- System MUST allow the user to edit the generated email before sending.
- System MUST log all generated emails in the outreach/activity log.
- System MUST handle API errors gracefully (fallback to manual template).
- Each role (Head, Co-Head, TPO, EBSC, RBSC) MUST have access; Coordinators MUST NOT have AI email access.

---

### F-06: Web Scraping Lead Generation

**Description:** Automated web scraping engine that discovers new companies from job portals, corporate websites, and placement news sources. Extracts company name, industry, contact info, and hiring patterns, then auto-creates lead records in the 360° directory with status "Prospect."

**User Stories:**
- As a **TPO**, I want the system to automatically find new companies so that I don't miss potential partners.
- As a **Co-Head**, I want to review scraped leads before they enter the directory so that data quality is maintained.
- As a **Head**, I want a report of newly discovered companies each week so that I can track pipeline growth.

**Acceptance Criteria:**
- System MUST include a configurable scraping engine (Puppeteer/Cheerio).
- Scraper MUST extract: company name, industry, website, contact email/phone (if available), location.
- Scraped companies MUST be created as leads with status "Prospect" and source "Web Scrape."
- System MUST support scheduling (daily/weekly) for automated scraping runs.
- System MUST flag potential duplicates against existing directory entries.
- Head and TPO roles MUST have access to review/approve scraped leads.
- Co-Head and Coordinator roles MUST have view-only access to scraped leads.

---

### F-07: Department-wise MoU Intelligence

**Description:** Digital MoU vault where each MoU is tagged to a specific academic department (e.g., Computer Engineering, Mechanical, Electronics). TPOs can filter MoUs by department, view department-wise MoU counts, and receive expiry alerts filtered by department. Supports Part A (Seminars/Workshops) and Part B (Higher Studies) classification.

**User Stories:**
- As a **TPO**, I want to see which departments have MoUs with which companies so that I can coordinate renewals.
- As a **Co-Head**, I want to filter expired and expiring MoUs by department so that I can alert the right Coordinator.
- As a **Coordinator**, I want to see only my department's MoUs so that I focus on my scope.

**Acceptance Criteria:**
- MoU record MUST include departmentId (FK to Department).
- System MUST support filtering MoUs by department.
- Expiry alerts MUST be filterable by department — TPO sees all, Coordinator sees only their department.
- System MUST classify MoUs as: Part A (Seminars/Workshops), Part B (Higher Studies), or Both.
- System MUST trigger alerts 30 days (configurable) before MoU expiry.
- Alert routing: TPO and Head receive all department alerts; Coordinator receives only their department alerts.
- Department-wise MoU dashboard MUST show: total active, expiring this quarter, expired this year.

---

### F-08: Alumni Role Mapping

**Description:** Alumni records linked to their current company with detailed role information: designation, seniority level (Entry/Mid/Senior/Lead/Manager/Director/Founder/HR), department, batch year, skills, willingness to help, help types, influence score, and relationship score. Enables targeted outreach for referrals, mentorship, and guest lectures.

**User Stories:**
- As a **TPO**, I want to search alumni by company and role so that I can ask for referrals at target companies.
- As a **Coordinator**, I want to map alumni from my department so that I can track their career progression.
- As a **Head**, I want to see alumni influence scores per company so that I can leverage senior alumni for partnerships.

**Acceptance Criteria:**
- Alumni record MUST include: fullName, email, phone, department, batchYear, currentDesignation, seniorityLevel, companyId (FK), linkedin, location, skills, willingnessToHelp, helpTypes, influenceScore, relationshipScore.
- System MUST support searching alumni by: company, role, seniority level, department, batch year.
- System MUST allow filtering by willingnessToHelp (Yes/No/Maybe).
- Influence score (0-100) MUST be manually updatable by TPO/Head.
- System MUST show alumni count per company on the company profile.

---

### F-09: Student-to-Selection Ratios

**Description:** Per-placement-drive analytics showing how many students appeared vs. how many were selected, calculated as a ratio and percentage. Aggregated across companies and departments to identify conversion trends.

**User Stories:**
- As a **Head**, I want to see selection ratios per company so that I can identify high-conversion partners.
- As a **Co-Head**, I want to compare ratios across departments so that I can target weak areas.
- As a **TPO**, I want per-drive ratio data so that I can report to management.

**Acceptance Criteria:**
- Each PlacementDrive record MUST store: studentsAppeared, studentsSelected, package.
- System MUST calculate and display: ratio (X:Y), percentage (selected/appeared * 100).
- System MUST support aggregation: by company (all drives), by department, by year.
- System MUST display trends over time (line chart showing ratio changes per company per year).

---

### F-10: Placement Calendar

**Description:** Calendar view of all past, current, and upcoming placement drives. Each drive is shown as an event with company name, job title, date, and status. Supports filtering by company, department, date range, and status.

**User Stories:**
- As a **Co-Head**, I want to see all drives on a calendar so that I can avoid scheduling conflicts.
- As a **Coordinator**, I want to add a drive date so that my team knows when companies are visiting.
- As a **Head**, I want to view historical drive patterns so that I can plan next season.

**Acceptance Criteria:**
- System MUST display drives in calendar view (month/week/day).
- Each drive event MUST show: company name, job title, date, status (Scheduled / Completed / Cancelled).
- System MUST support filtering by: company, department, date range, status.
- Clicking a drive event MUST show full details (students appeared/selected, package, notes).
- Calendar MUST be exportable (PDF/CSV).

---

### F-11: Peak Package Reporting

**Description:** Institutional tracking of the highest placement package offered each year. Displays the company, student name, package amount, year, and department. Historical trend view allows comparison across years. Also tracks average package and median package per year.

**User Stories:**
- As a **Head**, I want to see the current year's Peak Package so that I can report to the Director.
- As a **TPO**, I want to compare Peak Packages across the last 5 years so that I can show growth.
- As a **Co-Head**, I want to see department-wise peak packages so that I can identify top performers.

**Acceptance Criteria:**
- System MUST record: Peak Package amount, company, student name, year, department, date offered.
- System MUST display: current year Peak, all-time Peak, year-over-year comparison chart.
- System MUST support department-wise peak filtering.
- System MUST calculate and display: average package, median package, and package distribution per year.
- Reports MUST be exportable (PDF/CSV).

---

### F-12: No-Code Card Template Designer

**Description:** Drag-and-drop visual designer that allows TPO staff (without HTML/CSS knowledge) to create card templates for outreach emails, offer letters, notification cards, and MoU summary cards. Users pick from pre-built components (text, image, button, divider, badge) and arrange them on a canvas.

**User Stories:**
- As a **TPO**, I want to design an outreach card without writing code so that I can quickly create branded communications.
- As a **Coordinator**, I want to use pre-made templates so that I don't need design skills.
- As a **Head**, I want to lock approved templates so that branding is consistent.

**Acceptance Criteria:**
- System MUST provide a drag-and-drop card template editor.
- Editor MUST include components: text block, image, button, divider, badge, icon, spacer.
- Editor MUST support: resize, reorder, delete, duplicate components.
- Editor MUST support live preview of the card.
- Users MUST be able to save templates with a name and category.
- Users MUST be able to use saved templates when composing emails or generating cards.
- Head/Admin MUST be able to "publish" templates as organization-approved.
- System MUST track template usage analytics (which template used how many times).

---

### F-13: Institutional Dashboard

**Description:** Executive dashboard showing key institutional placement KPIs: total students, highest package (current year and all-time), average package, company-wise package distribution, selection ratios, active MoUs, deal pipeline summary, and upcoming drives.

**User Stories:**
- As a **Head**, I want a single-page dashboard with all key metrics so that I can present to management.
- As a **Co-Head**, I want to drill down into any metric so that I can analyze details.

**Acceptance Criteria:**
- Dashboard MUST display: totalStudents, highestPackage (current year + all-time), averagePackage, medianPackage.
- Dashboard MUST show company-wise package distribution (table/chart).
- Dashboard MUST show active MoU count, deal pipeline summary (by stage), upcoming drives.
- Dashboard MUST support date range filtering (current year, last year, custom).
- All roles except Coordinator MUST have access to the dashboard.
- Dashboard SHOULD auto-refresh every 5 minutes.

---

### F-14: TPO Sync API

**Description:** REST endpoint that allows ingestion of placement drive data from external sources (e.g., CSV upload, manual entry, or API integration). Accepts company, drive date, job title, students appeared, students selected, and package.

**User Stories:**
- As a **TPO**, I want to upload drive data in bulk so that I save manual entry time.
- As a **Head**, I want the system to validate uploaded data so that bad data is caught.

**Acceptance Criteria:**
- API endpoint MUST accept: companyId (or companyCode), driveDate, jobTitle, studentsAppeared, studentsSelected, package.
- System MUST support single and batch (JSON array) input.
- System MUST validate that studentsSelected <= studentsAppeared.
- System MUST create/update PlacementDrive record and update Company360 aggregate counters.
- System MUST return detailed validation errors for failed records.
- Access restricted to Head, TPO, Co-Head roles.

---

### F-15: Shared Activity Logs

**Description:** Unified chronological log of all calls, emails, meetings, and notes across the TPO team. Every interaction with a company is logged and visible to all admin roles, providing complete corporate relationship history.

**User Stories:**
- As a **TPO**, I want to see every interaction a company has had with anyone on the team so that I don't repeat asks.
- As a **Coordinator**, I want to log a call so that my Co-Head can see my activity.
- As a **Head**, I want to filter activity by user, type, and date so that I can audit team performance.

**Acceptance Criteria:**
- Activity log entry MUST include: companyId, type (CALL/EMAIL/MEETING/NOTE), subject, description, performedBy, createdAt.
- Log MUST be visible to all roles above Coordinator.
- Log MUST support filtering by: company, user, type, date range.
- System MUST auto-log AI-generated emails and outreach completions.

---

### F-16: Placement Drive Tracking

**Description:** Per-company placement drive records capturing job title, drive date, number of students appeared, number selected, and package offered. Drives are linked to companies and can be associated with departments.

**User Stories:**
- As a **Coordinator**, I want to record a drive so that placement data is captured.
- As a **Co-Head**, I want to view all drives for a company so that I see the full hiring history.

**Acceptance Criteria:**
- Drive record MUST include: companyId, driveDate, jobTitle, studentsAppeared, studentsSelected, package, notes.
- Drive records MUST be viewable on the company profile page.
- Multiple drives per company MUST be supported.
- System MUST calculate and display selection ratio per drive.
- TPO, Co-Head, Head, and Admin MUST be able to create/edit drives.
- Coordinator MUST have read-only access to drives outside their department.

---

## 3. Feature-to-Role Access Matrix

| Feature | Admin | Head | TPO | Co-Head | EBSC | RBSC | Coordinator |
|---------|-------|------|-----|---------|------|------|-------------|
| F-01: Hierarchy Management | Create | — | — | — | — | — | — |
| F-02: Company Tiers | Edit | Edit | Edit | Edit | View | Edit | View |
| F-03: 360° Directory | Full | Full | Full | Full | Full | Full | Dept-scoped |
| F-04: Kanban Pipeline | Full | Full | Full | Full | View | Full | Dept-scoped |
| F-05: Gemini AI Email | — | Review | Generate | Generate | Generate | Generate | — |
| F-06: Web Scraping | Full | Review | Full | View | View | View | View |
| F-07: MoU Intelligence | Full | Full | Full | Full | Full | Full | Dept-scoped |
| F-08: Alumni Role Mapping | Full | Full | Full | Full | Full | Full | Dept-scoped |
| F-09: Selection Ratios | View | View | View | View | View | View | Dept-scoped |
| F-10: Placement Calendar | Full | Full | Full | Full | View | View | View |
| F-11: Peak Package | View | View | View | View | View | View | View |
| F-12: No-Code Designer | Publish | Publish | Full | Full | Full | Full | Use templates |
| F-13: Dashboard | Full | Full | Full | Full | Full | Full | View |
| F-14: TPO Sync | — | Full | Full | Full | — | — | — |
| F-15: Activity Logs | Full | Full | Full | Full | Full | Full | Create only |
| F-16: Drive Tracking | Full | Full | Full | Full | View | View | Dept-scoped |

---

## 4. Non-Functional Requirements (Feature-Level)

| Feature | Performance | Security | Usability |
|---------|-------------|----------|-----------|
| Kanban Pipeline | Board loads < 2s for 200+ deals | Stage change audit trail | Drag-and-drop, keyboard shortcuts |
| Gemini AI Email | Email generated < 5s | API key managed server-side | Inline editing post-generation |
| Web Scraping | Daily batch completes < 30 min | Rate limiting, source whitelist | Review queue with approve/reject |
| No-Code Designer | Canvas renders < 1s | Template publish workflow | Undo/redo, responsive preview |
| Dashboard | Aggregates computed < 3s for 5yr data | Row-level security by role | Drill-down, export, auto-refresh |
| 360° Directory | Search results < 1s for 10k records | Soft-delete protection | CSV import/export, bulk edit |
| MoU Intelligence | Expiry scan runs daily at midnight | Department-scoped visibility | Filtered alert dashboard |

---

## 5. Glossary

| Term | Definition |
|------|------------|
| Head | Top-level TPO lead with cross-department visibility |
| Co-Head | Deputy to Head, manages a vertical/team of Coordinators |
| Coordinator | Department-level CRM operator |
| Tier | Company classification (Tier 1 Premium / Tier 2 Standard / Tier 3 Emerging) |
| Kanban | Visual deal pipeline with stage columns |
| Gemini AI | Google's generative AI model for email drafting |
| Web Scrape | Automated extraction of company data from public web sources |
| MoU | Memorandum of Understanding |
| Peak Package | Highest salary package offered in a given year |
| No-Code | Visual drag-and-drop interface requiring no programming knowledge |
| RBSC | Recruitment & Branding Sub-Committee |
| EBSC | Education & Beyond Sub-Committee |
| Selection Ratio | Ratio of students selected to students appeared for a placement drive |
