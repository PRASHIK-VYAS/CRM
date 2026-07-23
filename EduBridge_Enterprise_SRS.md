──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
SOFTWARE REQUIREMENTS SPECIFICATION Project Name: EduBridge Enterprise\
Document Title: SRS -- EduBridge Enterprise\
Version: 1.0 -- Final Baseline\
Prepared For: Development & DBA Team\
Status: Internal -- Confidential\
Date: 26 June 2026

    CONFIDENTIAL – FOR INTERNAL USE ONLY

    Document Revision History
    | Ver.  | Date        | Description                                                 | Author       |
    |-------|-------------|-------------------------------------------------------------|--------------|
    | [1.0] | 26 Jun 2026 | Initial draft – Comprehensive specification for MVP release | Trailblazers |



    1. Introduction

    1.1 Purpose
    This SRS defines the functional and non-functional requirements for EduBridge Enterprise, a centralized SaaS platform for Training and Placement Offices (TPOs). It serves as the contractual baseline between the stakeholders and the development team to ensure a predictable, high-quality delivery within a 100-day window.

    EduBridge Enterprise is a comprehensive relationship management system that digitizes the recruiter lifecycle—from initial outreach and MoU signing to placement transactions and alumni networking—serving TPO Admins, Officers, Students, and Recruiters.

    1.2 Document Conventions
    | Term   | Description                                                  |
    |--------|--------------------------------------------------------------|
    | SHALL  | Mandatory requirement – must be implemented in this release. |
    | SHOULD | Recommended requirement – strongly desired but negotiable.   |
    | MAY    | Optional feature – implement if time/resources permit.       |
    | FR-XX  | Functional Requirement identifier.                           |
    | NFR-XX | Non-Functional Requirement identifier.                       |
    | TBD    | To Be Determined.                                            |
    | TPO    | Training and Placement Office.                               |
    | RBAC   | Role-Based Access Control.                                   |
    | MoU    | Memorandum of Understanding.                                 |

    1.3 Intended Audience
    | Stakeholder                  | Purpose                                                                           |
    |------------------------------|-----------------------------------------------------------------------------------|
    | Database Administrator (DBA) | Design normalized MySQL schema aligned with the Alumni-Company-Student relations. |
    | Backend Developers           | Implement REST APIs, Rule-based matching logic, and Email Automation.             |
    | Frontend Developers          | Build responsive React dashboards and the Live Talent Showcase gallery.           |
    | Project Manager              | Baseline for 100-day sprint planning and scope control.                           |
    | QA / Test Engineers          | Derive test cases for the transactional and strategic modules.                    |
    | System Administrators        | Setup Node.js environment and MySQL hosting.                                      |

    1.4 Project Scope
    EduBridge Enterprise provides a centralized capability to manage the institutional memory of corporate relations and the transactional flow of placements.

    - Phase 1 (Foundation): Core Entity Management (Companies, Students, Users) and RBAC.
    - Phase 2 (Transactional): Job Lifecycle (Posting -> Application -> Offer).
    - Phase 3 (Strategic): CRM Outreach, MoU Vault, and Alumni Mapping.
    - Phase 4 (Hardening): Relationship Health Score, Live Portfolios, and Production Deployment.
    - Phase 5 (Enterprise): Institutional Dashboard, TPO Sync, AI Email Automation, Activity Logs.

    User Roles: Super Admin, TPO Officer, EBSC, RBSC, HOD, Student.  
    Out of scope for this release: Native mobile apps (iOS/Android), AI-based predictive matching (reserved for V2), and integrated payment gateways.

    1.5 References
    - Competitive analysis of Superset and HubSpot CRM.
    - Internal VPPCOE TPO workflow/Excel data models.
    - IEEE Std 830-1998 – Recommended Practice for Software Requirements Specifications.



    2. Overall Description

    2.1 Product Perspective
    EduBridge is a standalone, web-based B2B SaaS application. It replaces fragmented manual processes (Excel, WhatsApp, physical files) with a unified relational system.

    The system interfaces with:
    - Email Gateways: Via SMTP/SendGrid for bulk outreach and notifications.
    - External Portfolio Sites: Read-only integration/linking to GitHub, Behance, and Dribbble.
    - CSV/Excel: Data import tools for legacy contact migration.

    The system utilizes a centralized relational database (MySQL) with Role-Based Access Control (RBAC) governing visibility across all login types.

    2.2 Product Functions – High-Level Summary
    | Sr No. | Login       | Phase 1 (Foundation) | Phase 2 (Transaction)       | Phase 3 (Strategy)    | Phase 4 (Refinement)    |
    |--------|-------------|----------------------|-----------------------------|-----------------------|-------------------------|
    | 1      | Admin       | User Mgmt, RBAC      | System Config               | Report Generation     | Global Audit            |
    | 2      | TPO Officer | Company/Contact DB   | Job Drive Mgmt              | Outreach, MoU, Alumni | Health Score, Analytics |
    | 3      | Student     | Profile Mgmt         | App Tracking                | Portfolio Update      | Offer Acceptance        |
    | 4      | Recruiter   | Account Setup        | Job Post -> Hire            | Feedback Submission   | Portfolio Review        |
    | 5      | System      | Auth/Session Mgmt    | App Logic                   | Email Queue/Reminders | Health Score Calc       |

    2.3 User Classes and Characteristics
    - Super Admin: High technical proficiency; manages system health and users.
    - TPO Officer: Moderate technical proficiency; primary power user focused on efficiency.
    - Student: High technical proficiency; expects a seamless, modern UI.
    - Recruiter: High professional expectations; requires a fast, no-friction experience.

    2.4 Operating Environment
    - Client: Any modern web browser (Chrome, Firefox, Safari, Edge).
    - Server OS: Linux (Ubuntu/Debian) via Node.js runtime.
    - Database: MySQL 8.0+.
    - Hosting: Cloud VPS (AWS/Azure/DigitalOcean).
    - Screen Expectations: Fully responsive (Desktop, Tablet, Mobile).

    2.5 Design and Implementation Constraints
    - Timeline: Hard deadline of 100 days.
    - Tech Stack: Mandated MERN-S (MySQL, Express, React, Node).
    - Logic: Rule-based deterministic matching only for V1.

    2.6 Assumptions and Dependencies
    - Data Availability: Assumption that current Excel data can be cleaned for import.
    - Email Service: Dependency on a third-party SMTP provider for bulk mailing.
    - Staff Availability: TPO staff must be available for bi-weekly UAT.



    3. System Features and Functional Requirements

    3.1 Login: TPO Officer
    3.1.1 Phase 1: Foundation
    Module: Company Intelligence
    A centralized record of all corporate entities to prevent data loss.
    - Sub-module: Company Management
        - FR-001 SHALL The system SHALL allow adding/editing companies with industry and hiring history.
        - FR-002 SHALL The system SHALL allow importing contacts via CSV/Excel.
    - Sub-module: Contact Matrix
        - FR-003 SHALL The system SHALL associate multiple recruiters with a single company.

    3.1.2 Phase 2: Transactional
    Module: Placement Drive Manager
    Management of the a a a job cycle from posting to offer.
    - Sub-module: Job Lifecycle
        - FR-004 SHALL The system SHALL allow TPOs to track students through Applied $\rightarrow$ Shortlisted $\rightarrow$ Offered.
    - Sub-module: Offer Ledger
        - FR-005 SHALL The system SHALL record CTC and joining dates for every offer.

    3.1.3 Phase 3: Strategic
    Module: Corporate Outreach
    Automating the "bridge" between college and industry.
    - Sub-module: Email Broadcaster
        - FR-006 SHALL The system SHALL send bulk emails using predefined templates with variables.
        - FR-007 SHALL The system SHALL track open and click rates for sent emails.
    - Sub-module: MoU Vault
        - FR-008 SHALL The system SHALL store MoU PDFs and trigger alerts 30 days before expiry.
    - Sub-module: Alumni Influence Map
        - FR-009 SHALL The system SHALL allow mapping alumni to current company and role.

    3.1.4 Phase 4: Refinement
    Module: Relationship Analytics
    - Sub-module: Health Score
        - FR-010 SHALL The system SHALL calculate a company health score based on visits and placements.



    3.2 Login: Student
    3.2.1 Phase 1 & 2
    Module: Career Portal
    - Sub-module: Profile Mgmt
        - FR-011 SHALL The system SHALL allow students to maintain a digital resume.
    - Sub-module: Job Application
        - FR-012 SHALL The system SHALL allow students to apply to jobs they are eligible for.

    3.2.2 Phase 4
    Module: Live Talent Showcase
    - Sub-module: Portfolio Integration
        - FR-013 SHALL The system SHALL allow students to link live URLs (GitHub, Behance) to their profile.



    3.3 Login: Recruiter
    3.3.1 Phase 2
    Module: Hiring Hub
    - Sub-module: Job Posting
        - FR-014 SHALL The system SHALL allow recruiters to create JDs with specific skill tags.
    - Sub-module: Candidate Review
        - FR-015 SHALL The system SHALL allow recruiters to shortlist candidates based on keyword matching.



    3.4 System (Automation)
    3.4.1 All Phases
    Module: Background Engines
    - Sub-module: Notification Engine
        - FR-016 SHALL The system SHALL trigger a reminder for an expiring MoU.
        - FR-017 SHALL The system SHALL alert the TPO when a high-priority company has not been contacted for 90 days.



    4. Database Design Guidance (For DBA)

    4.1 Core Entity Groups
    - Company Group – Company, Contact, MoU (Stores corporate identity and legal ties).
    - Student Group – Student, Portfolio, Application (Stores candidate data and talent links).
    - Job Group – Job, Requirement, Offer (Stores the transactional hiring flow).
    - Interaction Group – CommunicationLog, Feedback, AlumniMap (Stores the history of engagement).

    4.2 Key Relationships and Constraints
    - Company $\rightarrow$ Contact: (1:N) One company has multiple recruiter contacts.
    - Student $\rightarrow$ Application $\rightarrow$ Job: (N:N) Multiple students can apply to multiple jobs.
    - Alumni $\rightarrow$ Company: (N:1) An alumnus is mapped to one current company.
    - Constraint: A student cannot apply to the same job twice.

    4.3 Indexing Recommendations
    - Companies.industry (For fast filtering of sector-specific leads).
    - Students.skill_tags (For rapid keyword matching during shortlisting).
    - Applications.status (For dashboard reporting).



    5. Non-Functional Requirements
    | NFR ID  | Category        | Requirement                                                              |
    |---------|-----------------|--------------------------------------------------------------------------|
    | NFR-001 | Performance     | Dashboard and profile pages SHALL load in $< 2$ seconds.                 |
    | NFR-002 | Security        | All APIs SHALL be protected via JWT; Passwords SHALL be hashed (bcrypt). |
    | NFR-003 | Availability    | The system SHOULD maintain 99.9% uptime during placement season.         |
    | NFR-004 | Scalability     | Database SHALL handle up to 10,000 student applications per drive.       |
    | NFR-005 | Usability       | The UI SHALL be fully responsive (Mobile/Desktop) using Tailwind CSS.    |
    | NFR-006 | Maintainability | Code SHALL follow a modular structure to support AI-plugins in V2.       |
    | NFR-007 | Compatibility   | SHALL support latest versions of Chrome, Firefox, and Safari.            |
    | NFR-008 | Compliance      | All data handling SHALL comply with institutional privacy standards.     |



    6. External Interface Requirements

    6.1 User Interface Requirements
    - Layout: Role-based dashboards (TPO vs Student).
    - Navigation: Sidebar-driven navigation with a global search bar for companies.
    - Feedback: Toast notifications for successful actions (e.g., "Job Posted Successfully").
    - Data Handling: Server-side pagination for large student lists.

    6.2 Hardware Interfaces
    - Confirmation: No proprietary hardware required.
    - Server: Standard Cloud VPS with minimum 4GB RAM / 2 vCPUs.

    6.3 Software Interfaces
    | Interface       | Technology       | Purpose                                        |
    |-----------------|------------------|------------------------------------------------|
    | Email Service   | SMTP / SendGrid  | Bulk communication and outreach.               |
    | Portfolio Links | HTTP/HTTPS       | External linking to GitHub, Behance, Dribbble. |
    | Import Tool     | CSV/Excel Parser | Bulk upload of legacy corporate data.          |

    6.4 Communication Interfaces
    - API: HTTPS REST protocol using JSON for all frontend-backend communication.
    - Session: JWT stored in secure cookies/local storage.



    7. Glossary
    | Term     | Definition                                  |
    |----------|---------------------------------------------|
    | B2B SaaS | Business-to-Business Software as a Service. |
    | RBAC     | Role-Based Access Control.                  |
    | TPO      | Training and Placement Office.              |
    | MoU      | Memorandum of Understanding.                |



    8. Appendix – Issues & Open Items
    | Issue ID | Category  | Description                                             | Owner     | Status |
    |----------|-----------|---------------------------------------------------------|-----------|--------|
    | ISS-001  | Data      | Verification of existing Excel data quality for import. | TPO       | Open   |
    | ISS-002  | Email     | Selection of SMTP provider (Internal vs Third-party).   | Tech Lead | Open   |
    | ISS-003  | Portfolio | Defining the set of approved "Live Link" platforms.     | UX Lead   | Open   |
