# PRODUCT VISION DOCUMENT

**Team:** TrailBlazers
**Product:** EduBridge Enterprise
**Date:** 23 July 2026
**Version:** 2.0 — Enterprise Suite
**Status:** Internal — Confidential

---

## 1. Vision Statement

For Training and Placement Offices (TPOs) who struggle with fragmented corporate data, decaying industry relationships, and siloed department-level MoU tracking, EduBridge Enterprise is a full-stack Institutional CRM that transforms manual placement coordination into a strategic corporate partnership hub with AI-driven automation. Unlike generic CRMs or transactional portals, we provide a 360° relationship intelligence layer — enriched by Kanban deal pipelines, Gemini AI email automation, automated web-scraped lead generation, department-wise MoU intelligence, and a No-Code card designer — that preserves institutional memory, maximizes student employability, and scales from a single Head to multiple Co-Heads and Coordinators under a unified hierarchy.

---

## 2. Problem Statement

**Core Problem:** The "Institutional Relationship Gap" — campus placement teams rely on fragmented Excel sheets, WhatsApp chains, and individual memory, causing irreversible loss of corporate relationships during staff turnover and missed opportunities from cold leads.

### Who Feels This Pain

| Role | Pain Point |
|------|-----------|
| **Head (TPO Lead)** | No unified visibility into deal pipelines, MoU expiry across departments, or team-wide outreach activity |
| **Co-Head** | Cannot track Co-Head/Coordinator performance; no Kanban stage-gating for company deals |
| **Coordinator** | Duplicated data entry across departments; no structured follow-up reminders |
| **TPO Officer** | Manual email drafting for hundreds of recruiters; no automated lead sourcing |

### Evidence / Proof Points

- **Data Silos:** Companies tracked in separate Excel files per department — no single source of truth.
- **Relationship Decay:** 70% of corporate leads go cold within 90 days due to no structured follow-up.
- **MoU Blindness:** No department-wise MoU view; TPOs cannot filter expiring agreements by academic unit.
- **Inefficient Outreach:** Personalized email drafting for 200+ recruiters is manually intensive.
- **Memory Loss:** Historical interaction data is lost entirely when a Coordinator or Head leaves.
- **Placement Opaqueness:** Student-to-selection ratios and Peak Package data are buried in post-season reports, not available in real-time.

---

## 3. Target Users

### Primary Users

| User | Description |
|------|-------------|
| **Head** | TPO Lead — oversees all placement operations, owns institutional-level KPIs (Peak Package, selection ratios, MoU compliance) |
| **Co-Head** | Deputy to Head — manages Coordinators, drives deal pipeline, owns company tier strategy |
| **Coordinator** | Department-level operator — creates companies, logs outreach, tracks MoUs, manages alumni within their department |
| **TPO Officer** | Power user — full CRM access, AI email generation, web scraping for leads, placement drive ingestion |

### Secondary Users

| User | Description |
|------|-------------|
| **RBSC (Recruitment & Branding SC)** | Corporate outreach and branding initiatives — manages company tiers and 360° directory |
| **EBSC (Education & Beyond SC)** | Strategic academic partnerships and higher studies MoUs |
| **Admin** | System-wide configuration, user creation, global audit |

### Who We Are NOT Building For (Yet)

- Direct students for company management.
- External corporate HRs for full-scale recruitment sourcing.

---

## 4. Value Proposition

| Before (Today) | After (With EduBridge Enterprise) |
|----------------|-----------------------------------|
| Data in per-department Excel files | Centralized 360° Company Directory with phone numbers, tier classification, and full interaction history |
| Cold leads from no follow-up structure | Kanban Deal Pipeline with Current Status tracking and automated stage progression |
| Manual email drafting for each recruiter | Gemini AI auto-generates personalized emails from company context and web-scraped intelligence |
| No systematic lead sourcing | Web scraping engine discovers new companies, extracts contacts, and auto-creates leads |
| MoU tracked per file, no department filter | Department-wise MoU Vault with filtered expiry alerts and Part A/B classification |
| Alumni data in disconnected spreadsheets | Alumni role-mapped to companies with influence scoring and outreach targeting |
| Placement results compiled after the season | Real-time Placement Calendar with student-to-selection ratios and Peak Package reporting |
| HTML-dependent card/template creation | No-Code Card Template Designer — drag-and-drop card builder for non-technical users |

---

## 5. Differentiator

| Dimension | Generic CRM (Salesforce/Zoho) | Transactional Portal (Superset) | EduBridge Enterprise |
|-----------|------------------------------|--------------------------------|---------------------|
| **Academic MoU Intelligence** | ❌ No department-wise MoU tracking | ❌ Not supported | ✅ Department-wise vault with filtered expiry alerts |
| **AI Email Automation** | Generic templates only | ❌ Not supported | ✅ Gemini AI generates personalized emails from company context |
| **Lead Generation** | Manual entry only | ❌ Not supported | ✅ Automated web scraping extracts leads from public sources |
| **Hierarchy Model** | Flat role system | ❌ Not supported | ✅ Head → Co-Head → Coordinator with RBSC/EBSC sub-committees |
| **Kanban Deal Pipeline** | Generic pipeline | ❌ Not supported | ✅ Institutional pipeline with Current Status, stage gates, and probability tracking |
| **No-Code Designer** | ❌ Not available | ❌ Not available | ✅ Drag-and-drop card template builder for non-technical TPO staff |
| **Placement Analytics** | Requires customization | Basic counts only | ✅ Selection ratios, calendars, Peak Package, historical trends |

---

## 6. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18+ with Tailwind CSS — responsive web application |
| **Backend** | Node.js + Express.js 5.x — modular REST API |
| **Database** | MySQL 8.0+ — relational schema via raw SQL / Knex.js query builder |
| **Authentication** | JWT (JSON Web Tokens) with Role-Based Access Control (RBAC) — Head, Co-Head, Coordinator, TPO, EBSC, RBSC, Admin |
| **AI Integration** | Gemini API for personalized email generation and contextual outreach drafting |
| **Web Scraping** | Puppeteer / Cheerio-based scraping engine for automated lead discovery |
| **Email Service** | Nodemailer / SendGrid for bulk and transactional emails |
| **File Storage** | Local / S3-compatible storage for MoU PDFs and card template assets |
| **Hosting** | Dockerized containers on Cloud VPS (AWS / DigitalOcean) |

---

## 7. Feature Catalog

### Core Features (Enterprise Suite)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Head → Co-Head → Coordinator Hierarchy** | Three-tier management structure with RBSC/EBSC sub-committees; each role has scoped permissions and inherited visibility |
| 2 | **Company Tiers** | Classify companies into Tier 1 / Tier 2 / Tier 3 based on hiring history, brand value, and package range |
| 3 | **360° Company Directory** | Centralized profiles with phone number field, industry tagging, interaction logs, and complete relationship history |
| 4 | **Kanban Deal Pipeline** | Multi-stage deal tracking from Cold Lead → Strategic Partner; Current Status field, probability %, expected CTC, and next-action scheduling |
| 5 | **Gemini AI Email Automation** | AI generates personalized outreach emails using company context, recipient details, and tone preference via Gemini API |
| 6 | **Web Scraping Lead Generation** | Automated scraper discovers new companies from job portals, extracts contact info, and creates lead records |
| 7 | **Department-wise MoU Intelligence** | MoUs tagged to academic departments; filtered expiry alerts for TPOs; Part A (Seminars) and Part B (Higher Studies) classification |
| 8 | **Alumni Role Mapping** | Alumni linked to companies with role/designation, seniority level, willingness to help, and influence scoring |
| 9 | **Student-to-Selection Ratios** | Per-drive and per-company analytics: students appeared vs. selected, conversion rates |
| 10 | **Placement Calendar** | Calendar view of all past and upcoming placement drives with filters by company, department, date range |
| 11 | **Peak Package Reporting** | Institutional highest package tracking with company, year, and student details; historical trend comparison |
| 12 | **No-Code Card Template Designer** | Drag-and-drop card builder for TPO staff to create outreach cards, offer letters, and notification templates without HTML knowledge |
| 13 | **Institutional Dashboard** | Aggregate KPIs: total students, highest/average package, company-wise distribution, selection trends |
| 14 | **Role-Based Access (RBAC)** | Granular permissions per module — 7 roles with CRUD scope definitions |
| 15 | **Shared Activity Logs** | Unified call/email/meeting history visible across all admin roles |
| 16 | **TPO Sync API** | REST endpoint to ingest placement drive data (students appeared, selected, package) |
| 17 | **Placement Drive Tracking** | Per-company drive records with job title, date, counts, and package offered |

### Additional Features (Nice to Have)

| # | Feature | Description |
|---|---------|-------------|
| 18 | **Relationship Health Score** | Algorithmic 0-100 score based on visit frequency, placement history, and interaction recency |
| 19 | **Skill-Gap Analytics** | Recruiter feedback aggregation into curriculum gap reports |
| 20 | **Multi-Institution Tenancy** | SaaS model allowing deployment across multiple colleges from a single instance |

---

## 8. Phase Themes

| Phase | Duration | Date Range | Focus |
|-------|----------|------------|-------|
| **Phase 1** | Days 1–30 | 24 Jul – 22 Aug 2026 | Foundation: MySQL schema, Auth & RBAC, User hierarchy (Head/Co-Head/Coordinator), Company tiers |
| **Phase 2** | Days 31–55 | 23 Aug – 16 Sep 2026 | Core CRM: 360° Directory, Kanban Deal Pipeline, Activity Logs |
| **Phase 3** | Days 56–75 | 17 Sep – 6 Oct 2026 | AI & Automation: Gemini email, Web scraping engine, MoU Intelligence, No-Code Card Designer |
| **Phase 4** | Days 76–90 | 7 Oct – 21 Oct 2026 | Analytics: Placement Calendar, Peak Package, Selection Ratios, Alumni Role Mapping |
| **Phase 5** | Days 91–100 | 22 Oct – 31 Oct 2026 | Hardening: UAT, bug fixing, performance optimization, production deployment |

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| **MoU Compliance** | 100% of MoUs renewed before expiry, driven by filtered department alerts |
| **Deal Pipeline Velocity** | 40% reduction in time from Cold Lead to MoU signing |
| **Email Outreach Efficiency** | 5× increase in emails sent per TPO staff member per week |
| **Lead Generation** | 50+ new company leads discovered per month via web scraping |
| **Placement Data Accuracy** | 100% of drives logged with correct student-to-selection ratios |
| **Peak Package Reporting** | Real-time updates within 24 hours of offer acceptance |
| **User Adoption** | 90% DAU among Head, Co-Heads, and Coordinators |
| **No-Code Designer Usage** | 80% of outreach cards created via the designer, not by developers |

---

## 10. Research References

- **Existing Products:** Superset (transactional analysis), HubSpot CRM (workflow analysis), Salesforce (pipeline management)
- **User Research:** Feedback from VPPCOE placement staff regarding Excel fragmentation, manual email overhead, and department-level MoU blind spots
- **Industry Standards:** AICTE guidelines for placement and industry-academia partnerships; NEP 2020 recommendations for institutional CRM adoption
- **AI Evaluation:** Gemini API vs. NVIDIA NIM comparison — Gemini selected for cost efficiency and contextual generation quality

---

## 11. Team Responsibilities

| Member | Role | Responsibility |
|--------|------|----------------|
| Member 1 | Tech Lead (AI/BE) | System architecture, Gemini AI integration, web scraping engine, security, V2 roadmap |
| Member 2 | Lead Engineer (BE/DB) | MySQL schema, API development, MoU Intelligence, Kanban pipeline, TPO Sync |
| Member 3 | Developer A (Fullstack) | Transactional flow (360° Directory, Placement Calendar, Peak Package) |
| Member 4 | Developer B (Fullstack) | CRM flow (Company Tiers, Alumni Role Mapping, Activity Logs) |
| Member 5 | UI/UX Lead (Frontend) | No-Code Card Designer, design system, responsive dashboards, Kanban UI |
