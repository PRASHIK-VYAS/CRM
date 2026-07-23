# PRODUCT VISION DOCUMENT
    
    *Team Name*: TrailBlazers  
    Product Name: EduBridge Enterprise  
    Date: 8th July, 2026  
    Version: 1.0   
    
    
    
    1. Vision Statement
    For Training and Placement Offices (TPOs), who struggle with fragmented corporate data and decaying industry relationships, EduBridge Enterprise is a SaaS-based Institutional CRM that transforms manual placement coordination into a strategic corporate partnership hub. Unlike generic CRMs or transactional portals, we provide a 360° relationship intelligence layer that preserves institutional memory and maximizes student employability.
    
    
    
    2. Problem Statement
    Problem: The "Relationship Gap." Campus placements currently rely on fragmented Excel sheets and individual memories, leading to a loss of corporate ties when staff change.
    
    - Who feels this pain most: TPO Administrators and Placement Officers.
    - Evidence / Proof Points:
        - Data Silos: No single source of truth for company contacts; duplicated records across departments.
        - Relationship Decay: Corporate leads go cold due to a lack of structured follow-up reminders.
        - Inefficient Matching: Relying on text-based resumes leads to a mismatch between industry needs and student skills.
        - Memory Loss: Historical interaction data is lost during staff turnover.
    
    
    
    3. Target User
    - Primary User: The Training and Placement Officer (TPO).
    - Their Context / Situation: Managing hundreds of recruiters, thousands of students, and multiple academic departments under strict seasonal deadlines.
    - Current Workaround / Competitor: Fragmented Excel sheets, WhatsApp groups, and transactional portals like Superset.
    - Who we are NOT building for (yet): Direct students (for company management) or external corporate HRs (for full-scale recruitment sourcing).
    
    
    
    4. Value Proposition
    
    | Before (Today)                                                   | After (With EduBridge)                                                |
    |------------------------------------------------------------------|-----------------------------------------------------------------------|
    | Data stored in individual Excel files $\rightarrow$ Risk of loss | Centralized Institutional Database $\rightarrow$ Permanent Asset      |
    | Manual, memory-based follow-ups $\rightarrow$ Cold leads         | Automated Engagement Nudges $\rightarrow$ Sustained Partnerships      |
    | Static PDF Resumes $\rightarrow$ Hidden Talent                   | Live Talent Showcase (Portfolios) $\rightarrow$ Evidence-based Hiring |
    | Verbal recruiter feedback $\rightarrow$ Anecdotal                | Quantitative Feedback Loop $\rightarrow$ Data-driven Curriculum       |
    
    
    
    5. Differentiator
    - Existing Alternatives: Generic CRMs (Salesforce/Zoho) or Transactional Portals (Superset).
    - Why They Fall Short: Generic CRMs aren't built for academic cycles (MoUs, HODs); Transactional portals focus only on the "Hire" and ignore the "Relationship" and "Alumni Influence."
    - Our Unique Advantage: We combine Transactional Power (Job $\rightarrow$ Offer) with Strategic Intelligence (Health Scores, Alumni Mapping, and Live Portfolio Galleries).
    
    
    
    6. Tech Stack (Technical Requirements)
    - Frontend: Next.js + Tailwind CSS (Responsive Web Application).
    - Backend: Node.js + Express.js (Modular REST API).
    - Database: PostgreSQL 15+ via Supabase (Relational mapping via Prisma ORM).
    - Authentication: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC).
    - APIs / Third-party Services: Nodemailer / SendGrid (for bulk outreach).
    - AI Models: NVIDIA NIM API for email generation (Enterprise extension).
    - Hosting / Deployment: Dockerized containers on a Cloud VPS.
    
    
    
    7. Feature Finalization
    
    Core Features (MVP)
    - Company 360° Directory: Centralized profiles with interaction logs and industry tagging.
    - Transactional Engine: End-to-end Job Posting $\rightarrow$ Application $\rightarrow$ Shortlisting $\rightarrow$ Offer.
    - Alumni Influence Network: Mapping alumni by company, role, and seniority.
    - Digital MoU Vault: Agreement tracking with automated expiry alerts.
    - Outreach Engine: Bulk email campaigns with dynamic templates and tracking.
    - Live Talent Showcase: Integrated portfolio links (GitHub/Behance) for all students.
    - Role-Based Access (RBAC): Secure portals for Admins, TPOs, EBSC, RBSC, HODs, and Coordinators.
    - Activity Logs: Shared call/email/meeting history visible to all admins.
    - AI Email Automation: NVIDIA NIM-powered personalized outreach email generation.
    - MoU Deliverable Types: Part A (Seminars) and Part B (Higher Studies) classification.
    - Placement Drive Tracking: Student appearance/selection tracking per company drive.
    - Institutional Dashboard: Aggregate placement metrics and package distribution.

    Additional Features (Nice to Have)
    - Relationship Health Score: Point-based ranking of company loyalty.
    - Skill-Gap Analytics: Converting recruiter feedback into curriculum reports.
    - SaaS Multi-Tenancy: Capability to sell the platform to other colleges.
    
    
    
    8. Phase Themes
    
    | Phase       |    Working Days | Date Range                                | Focus                                                           |
    | ----------- | --------------: | ----------------------------------------- | --------------------------------------------------------------- |
    | **Phase 1** |   Days **1-25** | **7 Jul 2026 (Tue) → 10 Aug 2026 (Mon)**  | Foundation: DB Schema, Auth, and Core Entity Profiles           |
    | **Phase 2** |  Days **26-50** | **11 Aug 2026 (Tue) → 14 Sep 2026 (Mon)** | Transactional Flow: Job → Application → Offer Engine            |
    | **Phase 3** |  Days **51-75** | **15 Sep 2026 (Tue) → 19 Oct 2026 (Mon)** | Strategic Layer: Alumni Map, Outreach Engine, and MoU Vault     |
    | **Phase 4** | Days **76-100** | **20 Oct 2026 (Tue) → 23 Nov 2026 (Mon)** | Hardening: Health Score, UAT, Bug Fixing, and Production Launch |
    
    
    
    9. Success Metrics
    - Reduction in Onboarding Time: Time taken to move a new company from 'Lead' to 'Partner.'
    - MoU Compliance: 100% of MoUs renewed before the expiry date.
    - Alumni Engagement: Number of alumni successfully mapped and leveraged for referrals.
    - User Adoption: Daily Active Users (DAU) among TPO staff.
    
    
    
    10. Research References
    - Existing Products: Superset (Transactional analysis), HubSpot (CRM workflow analysis).
    - User Interviews: Feedback from VPPCOE placement staff regarding Excel fragmentation.
    - Industry Standards: Analysis of AICTE guidelines for placement and industry-academia partnerships.
    
    
    
    11. Team Responsibilities
    
    | Member   | Role                    | Responsibility                                                             |
    |----------|-------------------------|----------------------------------------------------------------------------|
    | Member 1 | Tech Lead (AI/BE)       | System Architecture, Security, Matching Logic, V2 Roadmap.                 |
    | Member 2 | Lead Engineer (BE/DB)   | MySQL Schema, API Development, Email Engine, MoU Vault.                    |
    | Member 3 | Developer A (Fullstack) | Transactional Flow (Jobs $\rightarrow$ Applications $\rightarrow$ Offers). |
    | Member 4 | Developer B (Fullstack) | CRM Flow (Company DB, Alumni Tracking, Outreach).                          |
    | Member 5 | UI/UX Lead (Frontend)   | Design System, Responsive Dashboards, Portfolio Gallery.                   |
    
    
    
    <!-- 12. Open Questions
    - Data Migration: What is the exact format of the existing Excel sheets to ensure a 100% clean import?
    - Email Limits: Will the college provide an SMTP server, or should we use a third-party service like SendGrid?
    - Alumni Sourcing: How will we initially populate the Alumni database? (Manual upload vs. LinkedIn scraping). -->
