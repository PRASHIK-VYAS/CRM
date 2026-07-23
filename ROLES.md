# EduBridge Enterprise — Role Matrix

> **Version:** 1.0 — EduBridge Enterprise  
> **Last Updated:** 2026-07-23

## Role Hierarchy

```
admin  >  tpo  >  ebsc  >  rbsc  >  hod  >  coordinator
```

Higher roles inherit all permissions of lower roles.

## Role Definitions

| Role | Identifier | Description |
|------|-----------|-------------|
| **Admin** | `admin` | System administrator — full access to all modules, user management, and system configuration. |
| **TPO** | `tpo` | Training & Placement Officer — primary power user. Full access to CRM, drives, analytics, AI tools, and data ingestion. |
| **EBSC** | `ebsc` | Education & Beyond Sub-Committee — strategic academic partnerships and higher studies collaboration. Same access as TPO except no user management. |
| **RBSC** | `rbsc` | Recruitment & Branding Sub-Committee — corporate outreach and branding initiatives. Can manage companies, deals, outreach, and view analytics. |
| **HOD** | `hod` | Head of Department — read and manage entities within their department scope. Receives all faculty alerts and notifications. |
| **Coordinator** | `coordinator` | Department coordinator — basic CRUD access to company, alumni, and MoU records. |

## Permission Matrix

### Core Modules

| Module | Operation | Admin | TPO | EBSC | RBSC | HOD | Coordinator |
|--------|-----------|-------|-----|------|------|-----|-------------|
| **Users** | Create | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Users** | Read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Users** | Update/Delete | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Auth** | Login | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Auth** | Password reset | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### CRM Module (Company360)

| Operation | Admin | TPO | EBSC | RBSC | HOD | Coordinator |
|-----------|-------|-----|------|------|-----|-------------|
| Create company | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read companies | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update company | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Soft delete / Restore | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Permanently delete | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| View company details | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View company statistics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Deal Pipeline

| Operation | Admin | TPO | EBSC | RBSC | HOD | Coordinator |
|-----------|-------|-----|------|------|-----|-------------|
| Create deal | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read deals | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update deal | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Change deal stage | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reassign deal | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Archive / Restore | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View pipeline statistics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### MoU Vault

| Operation | Admin | TPO | EBSC | RBSC | HOD | Coordinator |
|-----------|-------|-----|------|------|-----|-------------|
| Create MoU | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read MoUs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update MoU | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Change MoU status | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Soft delete / Restore | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Permanently delete | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| View MoU statistics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Outreach

| Operation | Admin | TPO | EBSC | RBSC | HOD | Coordinator |
|-----------|-------|-----|------|------|-----|-------------|
| Create outreach | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read outreaches | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update outreach | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Complete / Cancel | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Schedule follow-up | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View outreach statistics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Alumni

| Operation | Admin | TPO | EBSC | RBSC | HOD | Coordinator |
|-----------|-------|-----|------|------|-----|-------------|
| Create alumni | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read alumni | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update alumni | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Assign company | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update scores | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Permanently delete | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| View alumni statistics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Employment

| Operation | Admin | TPO | EBSC | RBSC | HOD | Coordinator |
|-----------|-------|-----|------|------|-----|-------------|
| Create / Read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update / Delete | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Analytics & Enterprise

| Module | Operation | Admin | TPO | EBSC | RBSC | HOD | Coordinator |
|--------|-----------|-------|-----|------|------|-----|-------------|
| Dashboard | View summary | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Institutional Dashboard | View full | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TPO Sync | Ingest drive data | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| AI Email Gen | Generate emails | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Activity Logs | View all | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Activity Logs | Create entries | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Notification Routing

| Notification Type | Recipients |
|-----------------|------------|
| MoU expiry alert (30 days before) | All users with `hod` or `tpo` role |
| High-priority company inactivity (90 days) | All users with `hod` or `tpo` role |
| Follow-up reminders | Deal owner + `hod` and `tpo` roles |
| System alerts | All users with `admin` role |

## Department Scope

- **HOD** can view and manage resources scoped to their department (via `departmentId` on MoU and Alumni).
- **Coordinator** can view and manage resources scoped to their department.
- **Admin, TPO, EBSC, RBSC** have cross-department visibility.
