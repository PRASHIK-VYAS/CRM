// models/JobTracker.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobTracker = sequelize.define(
  "JobTracker",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "student_id",
      comment: "Reference to StudentPortfolio",
    },

    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "company_id",
      comment: "Reference to Company360",
    },

    jobTitle: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "job_title",
      validate: {
        notEmpty: {
          msg: "Job title is required",
        },
        len: {
          args: [2, 150],
          msg: "Job title must be between 2 and 150 characters",
        },
      },
    },

    jobCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "job_code",
    },

    jobDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "job_description",
    },

    department: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    industry: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    employmentType: {
      type: DataTypes.ENUM(
        "Full-Time",
        "Part-Time",
        "Internship",
        "Contract",
        "Temporary",
        "Apprenticeship"
      ),
      allowNull: false,
      defaultValue: "Full-Time",
      field: "employment_type",
    },

    workMode: {
      type: DataTypes.ENUM(
        "On-Site",
        "Remote",
        "Hybrid"
      ),
      allowNull: false,
      defaultValue: "On-Site",
      field: "work_mode",
    },

    jobLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "job_location",
    },

    minimumSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: "minimum_salary",
      validate: {
        min: {
          args: [0],
          msg: "Minimum salary cannot be negative",
        },
      },
    },

    maximumSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: "maximum_salary",
      validate: {
        min: {
          args: [0],
          msg: "Maximum salary cannot be negative",
        },
      },
    },

    salaryCurrency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "INR",
      field: "salary_currency",
    },

    salaryPeriod: {
      type: DataTypes.ENUM(
        "Hourly",
        "Monthly",
        "Yearly",
        "One-Time"
      ),
      allowNull: false,
      defaultValue: "Yearly",
      field: "salary_period",
    },

    applicationSource: {
      type: DataTypes.ENUM(
        "Campus Placement",
        "Company Website",
        "LinkedIn",
        "Job Portal",
        "Referral",
        "Alumni Referral",
        "TPO Referral",
        "Walk-In",
        "Other"
      ),
      allowNull: false,
      defaultValue: "Campus Placement",
      field: "application_source",
    },

    sourceUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "source_url",
      validate: {
        isValidUrl(value) {
          if (value && !/^https?:\/\/.+/i.test(value)) {
            throw new Error("Source URL must be valid");
          }
        },
      },
    },

    applicationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "application_date",
    },

    applicationDeadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "application_deadline",
    },

    applicationStatus: {
      type: DataTypes.ENUM(
        "Saved",
        "Applied",
        "Under Review",
        "Shortlisted",
        "Assessment Scheduled",
        "Assessment Completed",
        "Interview Scheduled",
        "Interviewing",
        "Offer Received",
        "Offer Accepted",
        "Offer Declined",
        "Rejected",
        "Withdrawn",
        "Joined",
        "Closed"
      ),
      allowNull: false,
      defaultValue: "Applied",
      field: "application_status",
    },

    currentStage: {
      type: DataTypes.ENUM(
        "Application",
        "Resume Screening",
        "Aptitude Test",
        "Technical Assessment",
        "Group Discussion",
        "Technical Interview",
        "HR Interview",
        "Managerial Interview",
        "Final Interview",
        "Offer",
        "Background Verification",
        "Onboarding",
        "Completed"
      ),
      allowNull: false,
      defaultValue: "Application",
      field: "current_stage",
    },

    applicationReferenceNumber: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "application_reference_number",
    },

    resumeUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "resume_url",
      validate: {
        isValidUrl(value) {
          if (value && !/^https?:\/\/.+/i.test(value)) {
            throw new Error("Resume URL must be valid");
          }
        },
      },
    },

    coverLetterUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "cover_letter_url",
      validate: {
        isValidUrl(value) {
          if (value && !/^https?:\/\/.+/i.test(value)) {
            throw new Error("Cover letter URL must be valid");
          }
        },
      },
    },

    eligibilityStatus: {
      type: DataTypes.ENUM(
        "Pending",
        "Eligible",
        "Not Eligible",
        "Conditionally Eligible"
      ),
      allowNull: false,
      defaultValue: "Pending",
      field: "eligibility_status",
    },

    eligibilityRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "eligibility_remarks",
    },

    selectionRounds: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "selection_rounds",
      comment: `
        Example:
        [
          {
            "roundNumber": 1,
            "roundName": "Aptitude Test",
            "type": "Assessment",
            "scheduledAt": "2026-07-15T10:00:00.000Z",
            "completedAt": null,
            "status": "Scheduled",
            "score": null,
            "maximumScore": 100,
            "result": "Pending",
            "remarks": null
          }
        ]
      `,
      validate: {
        isValidSelectionRounds(value) {
          if (!Array.isArray(value)) {
            throw new Error("Selection rounds must be an array");
          }

          value.forEach((round) => {
            if (!round || typeof round !== "object") {
              throw new Error(
                "Each selection round must be an object"
              );
            }

            if (!round.roundName) {
              throw new Error(
                "Each selection round must have a round name"
              );
            }
          });
        },
      },
    },

    interviews: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "interviewType": "Technical Interview",
            "roundNumber": 1,
            "scheduledAt": "2026-07-20T11:00:00.000Z",
            "durationMinutes": 60,
            "mode": "Online",
            "meetingUrl": "https://meet.example.com/abc",
            "location": null,
            "interviewerName": "Rahul Sharma",
            "interviewerEmail": "rahul@example.com",
            "status": "Scheduled",
            "result": "Pending",
            "feedback": null,
            "rating": null
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Interviews must be an array");
          }
        },
      },
    },

    assessments: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "assessmentName": "Coding Assessment",
            "platform": "HackerRank",
            "scheduledAt": "2026-07-17T10:00:00.000Z",
            "completedAt": null,
            "score": 75,
            "maximumScore": 100,
            "status": "Completed",
            "result": "Passed",
            "assessmentUrl": "https://example.com/test"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Assessments must be an array");
          }
        },
      },
    },

    contacts: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "name": "Priya Mehta",
            "designation": "HR Manager",
            "email": "priya@example.com",
            "phone": "+919999999999",
            "linkedinUrl": "https://linkedin.com/in/priya"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Contacts must be an array");
          }
        },
      },
    },

    communications: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "type": "Email",
            "subject": "Interview Invitation",
            "message": "Your technical interview is scheduled",
            "sentBy": "Company",
            "sentAt": "2026-07-18T10:00:00.000Z"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Communications must be an array");
          }
        },
      },
    },

    followUps: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "follow_ups",
      comment: `
        Example:
        [
          {
            "title": "Follow up with HR",
            "dueDate": "2026-07-22",
            "status": "Pending",
            "notes": "Ask about interview result",
            "completedAt": null
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Follow-ups must be an array");
          }
        },
      },
    },

    nextFollowUpDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "next_follow_up_date",
    },

    nextAction: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "next_action",
    },

    offerStatus: {
      type: DataTypes.ENUM(
        "Not Applicable",
        "Pending",
        "Received",
        "Accepted",
        "Declined",
        "Expired",
        "Withdrawn"
      ),
      allowNull: false,
      defaultValue: "Not Applicable",
      field: "offer_status",
    },

    offerDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "offer_date",
    },

    offeredRole: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "offered_role",
    },

    offeredSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: "offered_salary",
      validate: {
        min: {
          args: [0],
          msg: "Offered salary cannot be negative",
        },
      },
    },

    offeredSalaryCurrency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "INR",
      field: "offered_salary_currency",
    },

    joiningBonus: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: "joining_bonus",
      validate: {
        min: 0,
      },
    },

    offerExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "offer_expiry_date",
    },

    proposedJoiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "proposed_joining_date",
    },

    actualJoiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "actual_joining_date",
    },

    offerLetterUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "offer_letter_url",
      validate: {
        isValidUrl(value) {
          if (value && !/^https?:\/\/.+/i.test(value)) {
            throw new Error("Offer letter URL must be valid");
          }
        },
      },
    },

    offerRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "offer_remarks",
    },

    rejectionStage: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "rejection_stage",
    },

    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "rejection_reason",
    },

    rejectionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "rejection_date",
    },

    withdrawalReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "withdrawal_reason",
    },

    withdrawnAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "withdrawn_at",
    },

    isCampusDrive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_campus_drive",
    },

    placementDriveId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "placement_drive_id",
      comment: "Reference to a campus placement drive",
    },

    jobPostingId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "job_posting_id",
      comment: "Reference to the original job posting",
    },

    assignedTpoId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "assigned_tpo_id",
      comment: "TPO or placement officer handling the application",
    },

    priority: {
      type: DataTypes.ENUM(
        "Low",
        "Medium",
        "High",
        "Critical"
      ),
      allowNull: false,
      defaultValue: "Medium",
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Student rating for the job opportunity",
      validate: {
        min: {
          args: [1],
          msg: "Rating must be at least 1",
        },
        max: {
          args: [5],
          msg: "Rating cannot exceed 5",
        },
      },
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    tags: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Tags must be an array");
          }
        },
      },
    },

    attachments: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "title": "Job Description",
            "type": "Job Description",
            "url": "https://example.com/file.pdf",
            "uploadedAt": "2026-07-10T10:00:00.000Z"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Attachments must be an array");
          }
        },
      },
    },

    statusHistory: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "status_history",
      comment: `
        Example:
        [
          {
            "fromStatus": "Applied",
            "toStatus": "Shortlisted",
            "changedAt": "2026-07-12T10:00:00.000Z",
            "changedBy": "user-uuid",
            "remarks": "Resume shortlisted"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Status history must be an array");
          }
        },
      },
    },

    lastStatusChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_status_changed_at",
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },

    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },

    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "created_by",
    },

    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "updated_by",
    },

    deletedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "deleted_by",
    },
  },
  {
    tableName: "job_trackers",

    timestamps: true,

    createdAt: "created_at",

    updatedAt: "updated_at",

    paranoid: true,

    deletedAt: "deleted_at",

    underscored: true,

    indexes: [
      {
        fields: ["student_id"],
        name: "job_trackers_student_id_index",
      },
      {
        fields: ["company_id"],
        name: "job_trackers_company_id_index",
      },
      {
        fields: ["application_status"],
        name: "job_trackers_application_status_index",
      },
      {
        fields: ["current_stage"],
        name: "job_trackers_current_stage_index",
      },
      {
        fields: ["application_date"],
        name: "job_trackers_application_date_index",
      },
      {
        fields: ["next_follow_up_date"],
        name: "job_trackers_next_follow_up_date_index",
      },
      {
        fields: ["offer_status"],
        name: "job_trackers_offer_status_index",
      },
      {
        fields: ["placement_drive_id"],
        name: "job_trackers_placement_drive_id_index",
      },
      {
        fields: ["job_posting_id"],
        name: "job_trackers_job_posting_id_index",
      },
      {
        fields: ["assigned_tpo_id"],
        name: "job_trackers_assigned_tpo_id_index",
      },
      {
        fields: ["is_active"],
        name: "job_trackers_is_active_index",
      },
      {
        fields: [
          "student_id",
          "company_id",
          "job_title",
        ],
        name: "job_trackers_student_company_job_index",
      },
    ],

    scopes: {
      active: {
        where: {
          isActive: true,
        },
      },

      applied: {
        where: {
          applicationStatus: "Applied",
        },
      },

      shortlisted: {
        where: {
          applicationStatus: "Shortlisted",
        },
      },

      interviewing: {
        where: {
          applicationStatus: [
            "Interview Scheduled",
            "Interviewing",
          ],
        },
      },

      offers: {
        where: {
          applicationStatus: [
            "Offer Received",
            "Offer Accepted",
          ],
        },
      },

      acceptedOffers: {
        where: {
          applicationStatus: "Offer Accepted",
          offerStatus: "Accepted",
        },
      },

      rejected: {
        where: {
          applicationStatus: "Rejected",
        },
      },

      joined: {
        where: {
          applicationStatus: "Joined",
        },
      },

      upcomingFollowUps: {
        where: {
          isActive: true,
        },
        order: [["nextFollowUpDate", "ASC"]],
      },

      withDeleted: {
        paranoid: false,
      },
    },

    hooks: {
      beforeValidate: (jobTracker) => {
        if (jobTracker.jobTitle) {
          jobTracker.jobTitle = jobTracker.jobTitle.trim();
        }

        if (jobTracker.jobCode) {
          jobTracker.jobCode = jobTracker.jobCode
            .trim()
            .toUpperCase();
        }

        if (jobTracker.applicationReferenceNumber) {
          jobTracker.applicationReferenceNumber =
            jobTracker.applicationReferenceNumber.trim();
        }
      },

      beforeSave: (jobTracker) => {
        if (
          jobTracker.minimumSalary !== null &&
          jobTracker.maximumSalary !== null &&
          Number(jobTracker.minimumSalary) >
            Number(jobTracker.maximumSalary)
        ) {
          throw new Error(
            "Minimum salary cannot be greater than maximum salary"
          );
        }

        if (
          jobTracker.applicationDate &&
          jobTracker.applicationDeadline &&
          new Date(jobTracker.applicationDate) >
            new Date(jobTracker.applicationDeadline)
        ) {
          throw new Error(
            "Application date cannot be after the application deadline"
          );
        }

        if (
          jobTracker.applicationStatus === "Offer Received" &&
          !jobTracker.offerDate
        ) {
          jobTracker.offerDate = new Date();
        }

        if (
          jobTracker.applicationStatus === "Offer Accepted"
        ) {
          jobTracker.offerStatus = "Accepted";
        }

        if (
          jobTracker.applicationStatus === "Offer Declined"
        ) {
          jobTracker.offerStatus = "Declined";
        }

        if (jobTracker.applicationStatus === "Rejected") {
          if (!jobTracker.rejectionDate) {
            jobTracker.rejectionDate = new Date();
          }

          jobTracker.isActive = false;
        }

        if (jobTracker.applicationStatus === "Withdrawn") {
          if (!jobTracker.withdrawnAt) {
            jobTracker.withdrawnAt = new Date();
          }

          jobTracker.isActive = false;
        }

        if (
          ["Joined", "Closed"].includes(
            jobTracker.applicationStatus
          )
        ) {
          jobTracker.isActive = false;
        }
      },
    },
  }
);

JobTracker.prototype.changeApplicationStatus =
  async function (
    newStatus,
    {
      changedBy = null,
      remarks = null,
      transaction = null,
    } = {}
  ) {
    const previousStatus = this.applicationStatus;

    const history = Array.isArray(this.statusHistory)
      ? [...this.statusHistory]
      : [];

    history.push({
      fromStatus: previousStatus,
      toStatus: newStatus,
      changedAt: new Date().toISOString(),
      changedBy,
      remarks,
    });

    this.applicationStatus = newStatus;
    this.statusHistory = history;
    this.lastStatusChangedAt = new Date();

    await this.save({ transaction });

    return this;
  };

JobTracker.prototype.addInterview =
  async function (
    interviewData,
    transaction = null
  ) {
    const interviews = Array.isArray(this.interviews)
      ? [...this.interviews]
      : [];

    interviews.push({
      id: interviewData.id || DataTypes.UUIDV4,
      interviewType: interviewData.interviewType,
      roundNumber: interviewData.roundNumber || 1,
      scheduledAt: interviewData.scheduledAt,
      durationMinutes:
        interviewData.durationMinutes || 60,
      mode: interviewData.mode || "Online",
      meetingUrl: interviewData.meetingUrl || null,
      location: interviewData.location || null,
      interviewerName:
        interviewData.interviewerName || null,
      interviewerEmail:
        interviewData.interviewerEmail || null,
      status: interviewData.status || "Scheduled",
      result: interviewData.result || "Pending",
      feedback: interviewData.feedback || null,
      rating: interviewData.rating || null,
    });

    this.interviews = interviews;
    this.applicationStatus = "Interview Scheduled";
    this.currentStage =
      interviewData.interviewType ||
      "Technical Interview";

    await this.save({ transaction });

    return this;
  };

JobTracker.prototype.recordOffer =
  async function (
    offerData,
    transaction = null
  ) {
    this.applicationStatus = "Offer Received";
    this.currentStage = "Offer";
    this.offerStatus = "Received";
    this.offerDate =
      offerData.offerDate || new Date();
    this.offeredRole =
      offerData.offeredRole || this.jobTitle;
    this.offeredSalary =
      offerData.offeredSalary || null;
    this.offeredSalaryCurrency =
      offerData.offeredSalaryCurrency || "INR";
    this.joiningBonus =
      offerData.joiningBonus || null;
    this.offerExpiryDate =
      offerData.offerExpiryDate || null;
    this.proposedJoiningDate =
      offerData.proposedJoiningDate || null;
    this.offerLetterUrl =
      offerData.offerLetterUrl || null;
    this.offerRemarks =
      offerData.offerRemarks || null;

    await this.save({ transaction });

    return this;
  };

JobTracker.findStudentApplications =
  async function (studentId, options = {}) {
    return this.findAll({
      where: {
        studentId,
      },
      order: [["applicationDate", "DESC"]],
      ...options,
    });
  };

JobTracker.findActiveApplications =
  async function (studentId, options = {}) {
    return this.scope("active").findAll({
      where: {
        studentId,
      },
      order: [["updatedAt", "DESC"]],
      ...options,
    });
  };

module.exports = JobTracker;
