// models/studentPortfolio.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const StudentPortfolio = sequelize.define(
  "StudentPortfolio",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // Student identification
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: "student_id",
      comment: "Reference to the student/user record",
    },

    enrollmentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "enrollment_number",
      validate: {
        notEmpty: {
          msg: "Enrollment number is required",
        },
        len: {
          args: [2, 50],
          msg: "Enrollment number must be between 2 and 50 characters",
        },
      },
    },

    rollNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "roll_number",
    },

    // Personal information
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "first_name",
      validate: {
        notEmpty: {
          msg: "First name is required",
        },
        len: {
          args: [2, 100],
          msg: "First name must be between 2 and 100 characters",
        },
      },
    },

    middleName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "middle_name",
    },

    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "last_name",
      validate: {
        notEmpty: {
          msg: "Last name is required",
        },
      },
    },

    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "date_of_birth",
      validate: {
        isDate: {
          msg: "Date of birth must be a valid date",
        },
        isBeforeToday(value) {
          if (value && new Date(value) >= new Date()) {
            throw new Error("Date of birth must be before today");
          }
        },
      },
    },

    gender: {
      type: DataTypes.ENUM(
        "Male",
        "Female",
        "Non-Binary",
        "Prefer Not To Say",
        "Other"
      ),
      allowNull: true,
    },

    profilePhotoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "profile_photo_url",
      validate: {
        isUrlOrEmpty(value) {
          if (value && !/^https?:\/\/.+/i.test(value)) {
            throw new Error("Profile photo URL must be valid");
          }
        },
      },
    },

    headline: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Short professional headline",
      validate: {
        len: {
          args: [0, 255],
          msg: "Headline cannot exceed 255 characters",
        },
      },
    },

    professionalSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "professional_summary",
    },

    careerObjective: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "career_objective",
    },

    // Contact information
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "A valid email address is required",
        },
      },
      set(value) {
        this.setDataValue(
          "email",
          value ? value.trim().toLowerCase() : value
        );
      },
    },

    alternateEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "alternate_email",
      validate: {
        isEmailOrEmpty(value) {
          if (
            value &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ) {
            throw new Error("Alternate email must be valid");
          }
        },
      },
      set(value) {
        this.setDataValue(
          "alternateEmail",
          value ? value.trim().toLowerCase() : null
        );
      },
    },

    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "phone_number",
      validate: {
        is: {
          args: /^[+]?[0-9\s()-]{7,20}$/,
          msg: "Phone number format is invalid",
        },
      },
    },

    alternatePhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "alternate_phone_number",
      validate: {
        isPhoneOrEmpty(value) {
          if (value && !/^[+]?[0-9\s()-]{7,20}$/.test(value)) {
            throw new Error("Alternate phone number format is invalid");
          }
        },
      },
    },

    addressLine1: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "address_line_1",
    },

    addressLine2: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "address_line_2",
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "India",
    },

    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "postal_code",
    },

    // Academic information
    institutionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "institution_id",
      comment: "Reference to the institution/college",
    },

    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "department_id",
      comment: "Reference to the department",
    },

    courseName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "course_name",
    },

    courseType: {
      type: DataTypes.ENUM(
        "Diploma",
        "Undergraduate",
        "Postgraduate",
        "Doctorate",
        "Certificate",
        "Other"
      ),
      allowNull: true,
      field: "course_type",
    },

    specialization: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    currentSemester: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "current_semester",
      validate: {
        min: {
          args: [1],
          msg: "Current semester must be at least 1",
        },
        max: {
          args: [20],
          msg: "Current semester cannot exceed 20",
        },
      },
    },

    admissionYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "admission_year",
      validate: {
        min: 1950,
        max: 2100,
      },
    },

    graduationYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "graduation_year",
      validate: {
        min: 1950,
        max: 2100,
      },
    },

    academicStatus: {
      type: DataTypes.ENUM(
        "Active",
        "Graduated",
        "On Leave",
        "Dropped",
        "Suspended",
        "Transferred"
      ),
      allowNull: false,
      defaultValue: "Active",
      field: "academic_status",
    },

    cgpa: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: "CGPA cannot be less than 0",
        },
        max: {
          args: [10],
          msg: "CGPA cannot be greater than 10",
        },
      },
    },

    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: "Percentage cannot be less than 0",
        },
        max: {
          args: [100],
          msg: "Percentage cannot be greater than 100",
        },
      },
    },

    activeBacklogs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "active_backlogs",
      validate: {
        min: {
          args: [0],
          msg: "Active backlogs cannot be negative",
        },
      },
    },

    totalBacklogs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "total_backlogs",
      validate: {
        min: {
          args: [0],
          msg: "Total backlogs cannot be negative",
        },
      },
    },

    educationGapMonths: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "education_gap_months",
      validate: {
        min: 0,
      },
    },

    educationGapReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "education_gap_reason",
    },

    // School academic records
    tenthBoard: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "tenth_board",
    },

    tenthSchool: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "tenth_school",
    },

    tenthPassingYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "tenth_passing_year",
      validate: {
        min: 1950,
        max: 2100,
      },
    },

    tenthPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "tenth_percentage",
      validate: {
        min: 0,
        max: 100,
      },
    },

    twelfthBoard: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "twelfth_board",
    },

    twelfthSchool: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "twelfth_school",
    },

    twelfthStream: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "twelfth_stream",
    },

    twelfthPassingYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "twelfth_passing_year",
      validate: {
        min: 1950,
        max: 2100,
      },
    },

    twelfthPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "twelfth_percentage",
      validate: {
        min: 0,
        max: 100,
      },
    },

    diplomaInstitute: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "diploma_institute",
    },

    diplomaSpecialization: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "diploma_specialization",
    },

    diplomaPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "diploma_percentage",
      validate: {
        min: 0,
        max: 100,
      },
    },

    // Skills and portfolio data
    technicalSkills: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "technical_skills",
      comment: `
        Example:
        [
          {
            "name": "JavaScript",
            "level": "Advanced",
            "yearsOfExperience": 2,
            "verified": true
          }
        ]
      `,
      validate: {
        isValidTechnicalSkills(value) {
          if (!Array.isArray(value)) {
            throw new Error("Technical skills must be an array");
          }

          const validLevels = [
            "Beginner",
            "Intermediate",
            "Advanced",
            "Expert",
          ];

          value.forEach((skill) => {
            if (!skill || typeof skill !== "object") {
              throw new Error("Each technical skill must be an object");
            }

            if (!skill.name || typeof skill.name !== "string") {
              throw new Error("Each technical skill must have a name");
            }

            if (skill.level && !validLevels.includes(skill.level)) {
              throw new Error(
                `Skill level must be one of: ${validLevels.join(", ")}`
              );
            }
          });
        },
      },
    },

    softSkills: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "soft_skills",
      comment: `
        Example:
        [
          {
            "name": "Communication",
            "level": "Advanced"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Soft skills must be an array");
          }
        },
      },
    },

    toolsAndTechnologies: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "tools_and_technologies",
      comment: 'Example: ["Git", "Docker", "Figma", "Postman"]',
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Tools and technologies must be an array");
          }
        },
      },
    },

    programmingLanguages: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "programming_languages",
      comment: 'Example: ["JavaScript", "Python", "Java"]',
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Programming languages must be an array");
          }
        },
      },
    },

    languagesKnown: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "languages_known",
      comment: `
        Example:
        [
          {
            "language": "English",
            "read": true,
            "write": true,
            "speak": true,
            "proficiency": "Fluent"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Languages known must be an array");
          }
        },
      },
    },

    interests: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Example: ["Web Development", "AI", "Cloud Computing"]',
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Interests must be an array");
          }
        },
      },
    },

    // Project details
    projects: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "id": "project-uuid",
            "title": "EduBridge CRM",
            "description": "Industry-academia relationship management system",
            "role": "Backend Developer",
            "technologies": ["Node.js", "PostgreSQL", "Sequelize"],
            "startDate": "2026-01-01",
            "endDate": "2026-05-01",
            "isOngoing": false,
            "repositoryUrl": "https://github.com/user/project",
            "liveUrl": "https://project.example.com",
            "teamSize": 4,
            "achievements": []
          }
        ]
      `,
      validate: {
        isValidProjects(value) {
          if (!Array.isArray(value)) {
            throw new Error("Projects must be an array");
          }

          value.forEach((project) => {
            if (!project || typeof project !== "object") {
              throw new Error("Each project must be an object");
            }

            if (!project.title) {
              throw new Error("Each project must have a title");
            }
          });
        },
      },
    },

    // Internship and work experience
    internships: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "companyName": "ABC Technologies",
            "role": "Backend Developer Intern",
            "location": "Pune",
            "workMode": "Hybrid",
            "startDate": "2026-01-01",
            "endDate": "2026-04-01",
            "isOngoing": false,
            "description": "Worked on REST APIs",
            "technologies": ["Node.js", "Express"],
            "certificateUrl": "https://example.com/certificate"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Internships must be an array");
          }
        },
      },
    },

    workExperience: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "work_experience",
      comment: `
        Example:
        [
          {
            "companyName": "XYZ Pvt Ltd",
            "designation": "Junior Developer",
            "employmentType": "Part-Time",
            "startDate": "2025-01-01",
            "endDate": "2025-12-31",
            "isOngoing": false,
            "description": "Developed internal dashboards"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Work experience must be an array");
          }
        },
      },
    },

    // Certifications and achievements
    certifications: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "name": "AWS Cloud Practitioner",
            "issuingOrganization": "Amazon Web Services",
            "issueDate": "2026-01-01",
            "expiryDate": null,
            "credentialId": "ABC123",
            "credentialUrl": "https://example.com/credential"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Certifications must be an array");
          }
        },
      },
    },

    achievements: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "title": "Hackathon Winner",
            "description": "Won first place in college hackathon",
            "date": "2026-02-01",
            "organization": "ABC College",
            "certificateUrl": "https://example.com/certificate"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Achievements must be an array");
          }
        },
      },
    },

    awards: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "title": "Best Student Developer",
            "issuer": "Computer Department",
            "date": "2026-03-01",
            "description": "Awarded for technical contributions"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Awards must be an array");
          }
        },
      },
    },

    publications: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "title": "Machine Learning in Education",
            "publisher": "ABC Journal",
            "publicationDate": "2026-01-01",
            "authors": ["Student Name", "Faculty Name"],
            "url": "https://example.com/paper"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Publications must be an array");
          }
        },
      },
    },

    patents: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "title": "Smart Attendance System",
            "applicationNumber": "IN123456",
            "status": "Filed",
            "filingDate": "2026-01-01"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Patents must be an array");
          }
        },
      },
    },

    extracurricularActivities: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "extracurricular_activities",
      comment: `
        Example:
        [
          {
            "activity": "Coding Club",
            "role": "Technical Lead",
            "organization": "College Coding Club",
            "startDate": "2025-01-01",
            "endDate": null,
            "description": "Conducted coding workshops"
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error(
              "Extracurricular activities must be an array"
            );
          }
        },
      },
    },

    volunteeringExperience: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "volunteering_experience",
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Volunteering experience must be an array");
          }
        },
      },
    },

    // Coding and professional profiles
    linkedinUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "linkedin_url",
      validate: {
        isLinkedInUrl(value) {
          if (
            value &&
            !/^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(value)
          ) {
            throw new Error("LinkedIn URL must be valid");
          }
        },
      },
    },

    githubUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "github_url",
      validate: {
        isGithubUrl(value) {
          if (
            value &&
            !/^https?:\/\/(www\.)?github\.com\/.+/i.test(value)
          ) {
            throw new Error("GitHub URL must be valid");
          }
        },
      },
    },

    portfolioUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "portfolio_url",
      validate: {
        isUrlOrEmpty(value) {
          if (value && !/^https?:\/\/.+/i.test(value)) {
            throw new Error("Portfolio URL must be valid");
          }
        },
      },
    },

    leetcodeUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "leetcode_url",
    },

    hackerrankUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "hackerrank_url",
    },

    codechefUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "codechef_url",
    },

    codingProfiles: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "coding_profiles",
      comment: `
        Example:
        [
          {
            "platform": "Codeforces",
            "username": "student123",
            "profileUrl": "https://codeforces.com/profile/student123",
            "rating": 1400,
            "problemsSolved": 300
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Coding profiles must be an array");
          }
        },
      },
    },

    // Resume and documents
    resumeUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "resume_url",
      validate: {
        isUrlOrEmpty(value) {
          if (value && !/^https?:\/\/.+/i.test(value)) {
            throw new Error("Resume URL must be valid");
          }
        },
      },
    },

    resumeFileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "resume_file_name",
    },

    resumeVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "resume_version",
      validate: {
        min: 1,
      },
    },

    resumeUploadedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "resume_uploaded_at",
    },

    documents: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: `
        Example:
        [
          {
            "type": "Marksheet",
            "title": "Semester 5 Marksheet",
            "url": "https://example.com/document",
            "uploadedAt": "2026-01-01T10:00:00.000Z",
            "verified": false
          }
        ]
      `,
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Documents must be an array");
          }
        },
      },
    },

    // Placement preferences
    placementStatus: {
      type: DataTypes.ENUM(
        "Not Eligible",
        "Eligible",
        "Interested",
        "Not Interested",
        "In Process",
        "Placed",
        "Higher Studies",
        "Entrepreneurship",
        "Opted Out"
      ),
      allowNull: false,
      defaultValue: "Not Eligible",
      field: "placement_status",
    },

    placementEligibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "placement_eligibility",
    },

    eligibilityRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "eligibility_remarks",
    },

    preferredJobRoles: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "preferred_job_roles",
      comment:
        'Example: ["Backend Developer", "Software Engineer", "Data Analyst"]',
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Preferred job roles must be an array");
          }
        },
      },
    },

    preferredIndustries: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "preferred_industries",
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Preferred industries must be an array");
          }
        },
      },
    },

    preferredLocations: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "preferred_locations",
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Preferred locations must be an array");
          }
        },
      },
    },

    preferredWorkModes: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "preferred_work_modes",
      comment: 'Example: ["On-Site", "Remote", "Hybrid"]',
      validate: {
        isValidModes(value) {
          if (!Array.isArray(value)) {
            throw new Error("Preferred work modes must be an array");
          }

          const validModes = ["On-Site", "Remote", "Hybrid"];

          value.forEach((mode) => {
            if (!validModes.includes(mode)) {
              throw new Error(
                `Work mode must be one of: ${validModes.join(", ")}`
              );
            }
          });
        },
      },
    },

    preferredEmploymentTypes: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "preferred_employment_types",
      comment:
        'Example: ["Full-Time", "Internship", "Contract"]',
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error(
              "Preferred employment types must be an array"
            );
          }
        },
      },
    },

    expectedSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: "expected_salary",
      validate: {
        min: 0,
      },
    },

    salaryCurrency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "INR",
      field: "salary_currency",
    },

    willingToRelocate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "willing_to_relocate",
    },

    availableFrom: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "available_from",
    },

    noticePeriodDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "notice_period_days",
      validate: {
        min: 0,
        max: 365,
      },
    },

    // Placement result
    placedCompanyId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "placed_company_id",
      comment: "Reference to Company360",
    },

    placedJobRole: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "placed_job_role",
    },

    placedPackage: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: "placed_package",
      validate: {
        min: 0,
      },
    },

    placementDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "placement_date",
    },

    offerLetterUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "offer_letter_url",
    },

    // Assessment and placement readiness
    aptitudeScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "aptitude_score",
      validate: {
        min: 0,
        max: 100,
      },
    },

    technicalScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "technical_score",
      validate: {
        min: 0,
        max: 100,
      },
    },

    communicationScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "communication_score",
      validate: {
        min: 0,
        max: 100,
      },
    },

    interviewScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "interview_score",
      validate: {
        min: 0,
        max: 100,
      },
    },

    codingScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "coding_score",
      validate: {
        min: 0,
        max: 100,
      },
    },

    placementReadinessScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      field: "placement_readiness_score",
      validate: {
        min: 0,
        max: 100,
      },
    },

    profileCompletionPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      field: "profile_completion_percentage",
      validate: {
        min: 0,
        max: 100,
      },
    },

    // Verification
    verificationStatus: {
      type: DataTypes.ENUM(
        "Draft",
        "Submitted",
        "Under Review",
        "Verified",
        "Rejected",
        "Needs Changes"
      ),
      allowNull: false,
      defaultValue: "Draft",
      field: "verification_status",
    },

    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "verified_by",
      comment: "Reference to faculty/admin who verified the portfolio",
    },

    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "verified_at",
    },

    verificationRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "verification_remarks",
    },

    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "submitted_at",
    },

    lastReviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_reviewed_at",
    },

    // Visibility and privacy
    visibility: {
      type: DataTypes.ENUM(
        "Private",
        "Institution Only",
        "Recruiters Only",
        "Public"
      ),
      allowNull: false,
      defaultValue: "Institution Only",
    },

    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_public",
    },

    publicSlug: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: true,
      field: "public_slug",
      validate: {
        is: {
          args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          msg: "Public slug may contain lowercase letters, numbers, and hyphens only",
        },
      },
    },

    allowRecruiterContact: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "allow_recruiter_contact",
    },

    showContactInformation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "show_contact_information",
    },

    // System fields
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

    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      comment: "Additional system-specific data",
    },

    status: {
      type: DataTypes.ENUM(
        "Active",
        "Inactive",
        "Archived",
        "Blocked"
      ),
      allowNull: false,
      defaultValue: "Active",
    },

    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_login_at",
    },

    lastProfileUpdateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_profile_update_at",
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
    tableName: "student_portfolios",

    timestamps: true,

    createdAt: "created_at",

    updatedAt: "updated_at",

    paranoid: true,

    deletedAt: "deleted_at",

    underscored: true,

    indexes: [
      {
        unique: true,
        fields: ["student_id"],
        name: "student_portfolios_student_id_unique",
      },
      {
        unique: true,
        fields: ["enrollment_number"],
        name: "student_portfolios_enrollment_number_unique",
      },
      {
        unique: true,
        fields: ["email"],
        name: "student_portfolios_email_unique",
      },
      {
        unique: true,
        fields: ["public_slug"],
        name: "student_portfolios_public_slug_unique",
      },
      {
        fields: ["institution_id"],
        name: "student_portfolios_institution_id_index",
      },
      {
        fields: ["department_id"],
        name: "student_portfolios_department_id_index",
      },
      {
        fields: ["course_name"],
        name: "student_portfolios_course_name_index",
      },
      {
        fields: ["graduation_year"],
        name: "student_portfolios_graduation_year_index",
      },
      {
        fields: ["academic_status"],
        name: "student_portfolios_academic_status_index",
      },
      {
        fields: ["placement_status"],
        name: "student_portfolios_placement_status_index",
      },
      {
        fields: ["placement_eligibility"],
        name: "student_portfolios_placement_eligibility_index",
      },
      {
        fields: ["verification_status"],
        name: "student_portfolios_verification_status_index",
      },
      {
        fields: ["status"],
        name: "student_portfolios_status_index",
      },
      {
        fields: ["cgpa"],
        name: "student_portfolios_cgpa_index",
      },
      {
        fields: ["active_backlogs"],
        name: "student_portfolios_active_backlogs_index",
      },
      {
        fields: ["placed_company_id"],
        name: "student_portfolios_placed_company_id_index",
      },
      {
        fields: ["created_at"],
        name: "student_portfolios_created_at_index",
      },
      {
        fields: [
          "institution_id",
          "department_id",
          "graduation_year",
          "placement_eligibility",
        ],
        name: "student_portfolios_placement_filter_index",
      },
    ],

    defaultScope: {
      attributes: {
        exclude: ["deleted_by"],
      },
    },

    scopes: {
      active: {
        where: {
          status: "Active",
        },
      },

      placementEligible: {
        where: {
          placementEligibility: true,
          status: "Active",
        },
      },

      verified: {
        where: {
          verificationStatus: "Verified",
        },
      },

      publicProfiles: {
        where: {
          isPublic: true,
          visibility: "Public",
          status: "Active",
        },
      },

      placedStudents: {
        where: {
          placementStatus: "Placed",
        },
      },

      unplacedStudents: {
        where: {
          placementStatus: [
            "Eligible",
            "Interested",
            "In Process",
          ],
        },
      },

      withDeleted: {
        paranoid: false,
      },
    },

    hooks: {
      beforeValidate: (portfolio) => {
        if (portfolio.firstName) {
          portfolio.firstName = portfolio.firstName.trim();
        }

        if (portfolio.middleName) {
          portfolio.middleName = portfolio.middleName.trim();
        }

        if (portfolio.lastName) {
          portfolio.lastName = portfolio.lastName.trim();
        }

        if (portfolio.enrollmentNumber) {
          portfolio.enrollmentNumber = portfolio.enrollmentNumber
            .trim()
            .toUpperCase();
        }

        if (portfolio.publicSlug) {
          portfolio.publicSlug = portfolio.publicSlug
            .trim()
            .toLowerCase();
        }
      },

      beforeSave: (portfolio) => {
        portfolio.lastProfileUpdateAt = new Date();

        if (
          portfolio.totalBacklogs !== null &&
          portfolio.activeBacklogs !== null &&
          portfolio.activeBacklogs > portfolio.totalBacklogs
        ) {
          throw new Error(
            "Active backlogs cannot be greater than total backlogs"
          );
        }

        if (
          portfolio.admissionYear &&
          portfolio.graduationYear &&
          portfolio.graduationYear < portfolio.admissionYear
        ) {
          throw new Error(
            "Graduation year cannot be before admission year"
          );
        }

        if (
          portfolio.verificationStatus === "Verified" &&
          !portfolio.verifiedAt
        ) {
          portfolio.verifiedAt = new Date();
        }

        if (
          portfolio.placementStatus === "Placed" &&
          !portfolio.placedCompanyId
        ) {
          throw new Error(
            "Placed company is required when placement status is Placed"
          );
        }

        if (portfolio.visibility === "Public") {
          portfolio.isPublic = true;
        }

        if (portfolio.visibility !== "Public") {
          portfolio.isPublic = false;
        }
      },
    },
  }
);

/**
 * Instance method: get student's full name.
 */
StudentPortfolio.prototype.getFullName = function () {
  return [
    this.firstName,
    this.middleName,
    this.lastName,
  ]
    .filter(Boolean)
    .join(" ");
};

/**
 * Instance method: check basic placement eligibility.
 *
 * The actual eligibility rules should preferably come from the
 * placement drive or company criteria.
 */
StudentPortfolio.prototype.checkBasicPlacementEligibility = function ({
  minimumCgpa = 0,
  maximumActiveBacklogs = 0,
  allowedGraduationYears = [],
} = {}) {
  const cgpa = Number(this.cgpa || 0);
  const activeBacklogs = Number(this.activeBacklogs || 0);

  const cgpaEligible = cgpa >= Number(minimumCgpa);

  const backlogEligible =
    activeBacklogs <= Number(maximumActiveBacklogs);

  const graduationYearEligible =
    allowedGraduationYears.length === 0 ||
    allowedGraduationYears.includes(this.graduationYear);

  return {
    eligible:
      cgpaEligible &&
      backlogEligible &&
      graduationYearEligible,
    checks: {
      cgpaEligible,
      backlogEligible,
      graduationYearEligible,
    },
  };
};

/**
 * Instance method: calculate approximate profile completion.
 */
StudentPortfolio.prototype.calculateProfileCompletion = function () {
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "courseName",
    "graduationYear",
    "cgpa",
    "professionalSummary",
    "resumeUrl",
    "linkedinUrl",
    "githubUrl",
  ];

  const requiredArrays = [
    "technicalSkills",
    "softSkills",
    "projects",
    "certifications",
    "preferredJobRoles",
  ];

  let completed = 0;

  requiredFields.forEach((field) => {
    const value = this[field];

    if (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    ) {
      completed += 1;
    }
  });

  requiredArrays.forEach((field) => {
    const value = this[field];

    if (Array.isArray(value) && value.length > 0) {
      completed += 1;
    }
  });

  const total = requiredFields.length + requiredArrays.length;

  return Number(((completed / total) * 100).toFixed(2));
};

/**
 * Instance method: calculate approximate placement readiness.
 */
StudentPortfolio.prototype.calculatePlacementReadiness = function () {
  const scores = [
    Number(this.aptitudeScore || 0),
    Number(this.technicalScore || 0),
    Number(this.communicationScore || 0),
    Number(this.interviewScore || 0),
    Number(this.codingScore || 0),
  ];

  const assessmentAverage =
    scores.reduce((total, score) => total + score, 0) /
    scores.length;

  const profileCompletion =
    Number(this.profileCompletionPercentage) ||
    this.calculateProfileCompletion();

  const academicScore = this.cgpa
    ? Math.min(Number(this.cgpa) * 10, 100)
    : 0;

  const backlogPenalty =
    Number(this.activeBacklogs || 0) * 5;

  const readinessScore =
    assessmentAverage * 0.5 +
    profileCompletion * 0.3 +
    academicScore * 0.2 -
    backlogPenalty;

  return Number(
    Math.max(0, Math.min(100, readinessScore)).toFixed(2)
  );
};

/**
 * Instance method: update calculated portfolio scores.
 */
StudentPortfolio.prototype.updateCalculatedScores =
  async function (transaction = null) {
    this.profileCompletionPercentage =
      this.calculateProfileCompletion();

    this.placementReadinessScore =
      this.calculatePlacementReadiness();

    await this.save({
      transaction,
      fields: [
        "profileCompletionPercentage",
        "placementReadinessScore",
        "lastProfileUpdateAt",
      ],
    });

    return {
      profileCompletionPercentage:
        this.profileCompletionPercentage,
      placementReadinessScore:
        this.placementReadinessScore,
    };
  };

/**
 * Static method: find a student by enrollment number.
 */
StudentPortfolio.findByEnrollmentNumber = async function (
  enrollmentNumber,
  options = {}
) {
  if (!enrollmentNumber) {
    return null;
  }

  return this.findOne({
    where: {
      enrollmentNumber: enrollmentNumber
        .trim()
        .toUpperCase(),
    },
    ...options,
  });
};

/**
 * Static method: find public portfolio by slug.
 */
StudentPortfolio.findPublicPortfolio = async function (
  publicSlug,
  options = {}
) {
  if (!publicSlug) {
    return null;
  }

  return this.scope("publicProfiles").findOne({
    where: {
      publicSlug: publicSlug.trim().toLowerCase(),
    },
    ...options,
  });
};

module.exports = StudentPortfolio;




  


