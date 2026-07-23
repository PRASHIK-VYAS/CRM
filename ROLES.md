# EduBridge Enterprise — Role Matrix

> **Version:** 2.0 — Enterprise Suite  
> **Last Updated:** 2026-07-23  
> **Status:** Internal — Confidential

## Role Hierarchy

```
admin  >  head  >  tpo  >  co_head  >  ebsc  >  rbsc  >  coordinator
```

Higher roles inherit all permissions of lower roles. Coordinator scope is limited to their assigned department.

## Role Definitions

| Role | Identifier | Description |
|------|-----------|-------------|
| **Admin** | `admin` | System administrator — full access to all modules, user management, system configuration, and audit. |
| **Head** | `head` | Top-level TPO lead — cross-department visibility, all modules, Peak Package reporting, institutional dashboard, executive KPIs. |
| **TPO** | `tpo` | Training & Placement Officer — primary power user. Full CRM, AI email generation, web scraping review, drive ingestion, analytics. |
| **Co-Head** | `co_head` | Deputy to Head — manages a vertical/team of Coordinators. Kanban pipeline ownership, team oversight, department-filtered views. |
| **EBSC** | `ebsc` | Education & Beyond Sub-Committee — strategic academic partnerships and higher studies MoUs. |
| **RBSC** | `rbsc` | Recruitment & Branding Sub-Committee — corporate outreach, company tier classification, branding initiatives. |
| **Coordinator** | `coordinator` | Department-level operator — scoped to own department's companies, MoUs, alumni, deals, and drives. |

## Permission Matrix

### Core Modules

| Module | Operation | Admin | Head | TPO | Co-Head | EBSC | RBSC | Coordinator |
|--------|-----------|-------|------|-----|---------|------|------|-------------|
| **Users** | Create | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Users** | Read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Users** | Update/Delete | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Auth** | Login | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Auth** | Password reset | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Company Tiers & 360° Directory

| Operation | Admin | Head | TPO | Co-Head | EBSC | RBSC | Coordinator |
|-----------|-------|------|-----|---------|------|------|-------------|
| Create company | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read companies | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (dept-scoped) |
| Update company | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Set company tier | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| Set hireKey | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Soft delete / Restore | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Permanently delete | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |

### Kanban Deal Pipeline

| Operation | Admin | Head | TPO | Co-Head | EBSC | RBSC | Coordinator |
|-----------|-------|------|-----|---------|------|------|-------------|
| Create deal | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read deals | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (dept-scoped) |
| Update deal | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Change deal stage | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reassign deal | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Set Current Status | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Archive / Restore | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View pipeline statistics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### MoU Vault

| Operation | Admin | Head | TPO | Co-Head | EBSC | RBSC | Coordinator |
|-----------|-------|------|-----|---------|------|------|-------------|
| Create MoU | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read MoUs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (dept-scoped) |
| Update MoU | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Change MoU status | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Soft delete / Restore | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Permanently delete | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| View MoU statistics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (dept-scoped) |
| Receive all department alerts | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ (own dept only) |

### Outreach

| Operation | Admin | Head | TPO | Co-Head | EBSC | RBSC | Coordinator |
|-----------|-------|------|-----|---------|------|------|-------------|
| Create outreach | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read outreaches | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update outreach | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Complete / Cancel | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Schedule follow-up | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View outreach statistics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Alumni Role Mapping

| Operation | Admin | Head | TPO | Co-Head | EBSC | RBSC | Coordinator |
|-----------|-------|------|-----|---------|------|------|-------------|
| Create alumni | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read alumni | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (dept-scoped) |
| Update alumni | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Assign company | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update scores | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Permanently delete | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| View alumni statistics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (dept-scoped) |

### Employment

| Operation | Admin | Head | TPO | Co-Head | EBSC | RBSC | Coordinator |
|-----------|-------|------|-----|---------|------|------|-------------|
| Create / Read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update / Delete | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Placement Analytics

| Operation | Admin | Head | TPO | Co-Head | EBSC | RBSC | Coordinator |
|-----------|-------|------|-----|---------|------|------|-------------|
| View Selection Ratios | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (dept-scoped) |
| View Placement Calendar | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create/Edit drives | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ (own dept) |
| View Peak Package | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Export reports | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |

### Enterprise Features

| Module | Operation | Admin | Head | TPO | Co-Head | EBSC | RBSC | Coordinator |
|--------|-----------|-------|------|-----|---------|------|------|-------------|
| Dashboard | Institutional view | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| TPO Sync | Ingest drive data | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| AI Email | Generate via Gemini | ✗ | Review | ✓ | ✓ | ✓ | ✓ | ✗ |
| Web Scraping | Run / Review | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Web Scraping | View only | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Activity Logs | View all | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Activity Logs | Create entries | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Card Templates | Create/Edit | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Card Templates | Use published | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Card Templates | Publish | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

### Department Management

| Operation | Admin | Head | TPO | Co-Head | EBSC | RBSC | Coordinator |
|-----------|-------|------|-----|---------|------|------|-------------|
| Create/Edit departments | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Assign user department | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

## Notification Routing

| Notification Type | Recipients |
|-----------------|------------|
| MoU expiry alert (configurable days before) | Head + TPO (all depts); Coordinator (own dept only) |
| High-priority deal inactivity (60 days) | Head + Deal owner |
| Scraped leads available for review | Head + TPO |
| Deal stage change | Deal owner + Co-Head (if different) |
| System alerts | Admin |
| Password reset OTP | Requesting user |

## Department Scoping

- **Coordinator** CRUD scope is limited to their assigned `department_id` for: MoUs, alumni, drives, deals.
- **Head, TPO, Co-Head, EBSC, RBSC, Admin** have cross-department visibility.
- Companies are NOT department-scoped (they are institutional resources).
- Outreach and Activity Logs are NOT department-scoped (team-wide visibility).
