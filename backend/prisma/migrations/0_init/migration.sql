-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "enum_Users_role" AS ENUM ('admin', 'tpo', 'coordinator', 'hod');

-- CreateEnum
CREATE TYPE "enum_alumni_seniorityLevel" AS ENUM ('Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager', 'Director', 'Founder', 'HR', 'Other');

-- CreateEnum
CREATE TYPE "enum_alumni_status" AS ENUM ('Active', 'Inactive', 'Not Reachable');

-- CreateEnum
CREATE TYPE "enum_alumni_willingnessToHelp" AS ENUM ('Yes', 'No', 'Maybe');

-- CreateEnum
CREATE TYPE "enum_company360_companySize" AS ENUM ('1-50', '51-200', '201-500', '501-1000', '1000+');

-- CreateEnum
CREATE TYPE "enum_company360_industry" AS ENUM ('IT', 'Finance', 'Healthcare', 'Manufacturing', 'Education', 'Consulting', 'Telecommunication', 'E-Commerce', 'Automobile', 'Construction', 'Other');

-- CreateEnum
CREATE TYPE "enum_company360_partnershipLevel" AS ENUM ('NONE', 'BASIC', 'PREMIUM', 'STRATEGIC');

-- CreateEnum
CREATE TYPE "enum_company360_relationshipStage" AS ENUM ('Cold Lead', 'Contacted', 'Interested', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'MoU Signed', 'Hiring', 'Strategic Partner', 'Inactive');

-- CreateEnum
CREATE TYPE "enum_company360_status" AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECT', 'BLACKLISTED');

-- CreateEnum
CREATE TYPE "enum_deal_pipeline_priority" AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- CreateEnum
CREATE TYPE "enum_deal_pipeline_riskLevel" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "enum_deal_pipeline_source" AS ENUM ('Cold Email', 'Referral', 'Alumni', 'Website', 'LinkedIn', 'Campus Drive', 'Previous Partner', 'Conference', 'Other');

-- CreateEnum
CREATE TYPE "enum_deal_pipeline_stage" AS ENUM ('Cold Lead', 'Contacted', 'Meeting Scheduled', 'Meeting Completed', 'Interested', 'Proposal Sent', 'Negotiation', 'MoU Discussion', 'MoU Signed', 'Hiring Started', 'Strategic Partner', 'On Hold', 'Lost');

-- CreateEnum
CREATE TYPE "enum_mous_collaborationType" AS ENUM ('PLACEMENTS', 'INTERNSHIPS', 'TRAINING', 'RESEARCH', 'CONSULTANCY', 'INDUSTRY_VISIT', 'WORKSHOP', 'MULTIPLE', 'OTHER');

-- CreateEnum
CREATE TYPE "enum_mous_status" AS ENUM ('DRAFT', 'PENDING', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'RENEWED');

-- CreateEnum
CREATE TYPE "enum_outreaches_outcome" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'NO_RESPONSE', 'FOLLOW_UP_REQUIRED');

-- CreateEnum
CREATE TYPE "enum_outreaches_outreachType" AS ENUM ('EMAIL', 'PHONE_CALL', 'MEETING', 'LINKEDIN', 'VISIT', 'EVENT', 'PLACEMENT_DRIVE', 'INTERNSHIP', 'MOU_DISCUSSION', 'FOLLOW_UP', 'OTHER');

-- CreateEnum
CREATE TYPE "enum_outreaches_status" AS ENUM ('PLANNED', 'COMPLETED', 'CANCELLED', 'MISSED');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "resetToken" VARCHAR(255),
    "resetTokenExpiry" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "role" "enum_Users_role" NOT NULL DEFAULT 'coordinator',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumni" (
    "id" UUID NOT NULL,
    "alumniCode" VARCHAR(20) NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "department" VARCHAR(100) NOT NULL,
    "batchYear" INTEGER NOT NULL,
    "currentDesignation" VARCHAR(150) NOT NULL,
    "seniorityLevel" "enum_alumni_seniorityLevel" NOT NULL DEFAULT 'Entry Level',
    "companyId" UUID,
    "linkedin" VARCHAR(255),
    "location" VARCHAR(255),
    "skills" JSON DEFAULT '[]',
    "willingnessToHelp" "enum_alumni_willingnessToHelp" NOT NULL DEFAULT 'Maybe',
    "helpTypes" JSON DEFAULT '[]',
    "influenceScore" INTEGER NOT NULL DEFAULT 0,
    "relationshipScore" INTEGER NOT NULL DEFAULT 0,
    "lastContactedAt" TIMESTAMPTZ(6),
    "status" "enum_alumni_status" NOT NULL DEFAULT 'Active',
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "alumni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company360" (
    "id" UUID NOT NULL,
    "companyCode" VARCHAR(20) NOT NULL,
    "companyName" VARCHAR(255) NOT NULL,
    "industry" "enum_company360_industry" NOT NULL,
    "website" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "linkedin" VARCHAR(255),
    "headOffice" VARCHAR(255),
    "city" VARCHAR(255),
    "country" VARCHAR(255) DEFAULT 'India',
    "postalCode" VARCHAR(15),
    "companySize" "enum_company360_companySize",
    "foundedYear" INTEGER,
    "description" TEXT,
    "status" "enum_company360_status" NOT NULL DEFAULT 'PROSPECT',
    "partnershipLevel" "enum_company360_partnershipLevel" NOT NULL DEFAULT 'NONE',
    "relationshipStage" "enum_company360_relationshipStage" NOT NULL DEFAULT 'Cold Lead',
    "healthScore" INTEGER NOT NULL DEFAULT 0,
    "nextFollowUpDate" TIMESTAMPTZ(6),
    "totalPlacements" INTEGER NOT NULL DEFAULT 0,
    "totalOffers" INTEGER NOT NULL DEFAULT 0,
    "totalVisits" INTEGER NOT NULL DEFAULT 0,
    "totalMoUs" INTEGER NOT NULL DEFAULT 0,
    "createdBy" UUID,
    "updatedBy" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "company360_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deal_pipeline" (
    "id" UUID NOT NULL,
    "dealCode" VARCHAR(20) NOT NULL,
    "companyId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "stage" "enum_deal_pipeline_stage" NOT NULL DEFAULT 'Cold Lead',
    "priority" "enum_deal_pipeline_priority" NOT NULL DEFAULT 'Medium',
    "probability" INTEGER NOT NULL DEFAULT 10,
    "expectedStudents" INTEGER DEFAULT 0,
    "expectedCTC" DECIMAL(10,2),
    "expectedHiringDate" DATE,
    "source" "enum_deal_pipeline_source" NOT NULL DEFAULT 'Other',
    "leadOwner" VARCHAR(255),
    "decisionMaker" VARCHAR(255),
    "decisionMakerEmail" VARCHAR(255),
    "decisionMakerPhone" VARCHAR(255),
    "lastActivityDate" TIMESTAMPTZ(6),
    "nextFollowUpDate" TIMESTAMPTZ(6),
    "nextAction" VARCHAR(255),
    "meetingDate" TIMESTAMPTZ(6),
    "proposalSentDate" TIMESTAMPTZ(6),
    "mouExpectedDate" TIMESTAMPTZ(6),
    "closeDate" TIMESTAMPTZ(6),
    "lostReason" TEXT,
    "competitorCollege" VARCHAR(255),
    "riskLevel" "enum_deal_pipeline_riskLevel" NOT NULL DEFAULT 'Low',
    "remarks" TEXT,
    "isArchived" BOOLEAN DEFAULT false,
    "createdBy" UUID,
    "updatedBy" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "deal_pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mous" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "mouNumber" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "purpose" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "signedDate" DATE NOT NULL,
    "status" "enum_mous_status" NOT NULL DEFAULT 'DRAFT',
    "collaborationType" "enum_mous_collaborationType" NOT NULL,
    "signedByCompany" VARCHAR(255),
    "signedByInstitute" VARCHAR(255),
    "renewalReminderDays" INTEGER DEFAULT 30,
    "documentUrl" VARCHAR(255),
    "remarks" TEXT,
    "createdBy" UUID,
    "updatedBy" UUID,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "mous_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outreaches" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "outreachType" "enum_outreaches_outreachType" NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "interactionDate" TIMESTAMPTZ(6) NOT NULL,
    "outcome" "enum_outreaches_outcome" DEFAULT 'NEUTRAL',
    "status" "enum_outreaches_status" DEFAULT 'PLANNED',
    "nextFollowUpDate" TIMESTAMPTZ(6),
    "notes" TIMESTAMPTZ(6),
    "createdBy" UUID NOT NULL,
    "updatedBy" UUID,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "outreaches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_alumniCode_key" ON "alumni"("alumniCode");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_email_key" ON "alumni"("email");

-- CreateIndex
CREATE INDEX "alumni_company_id" ON "alumni"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "company360_companyCode_key" ON "company360"("companyCode");

-- CreateIndex
CREATE UNIQUE INDEX "company360_companyName_key" ON "company360"("companyName");

-- CreateIndex
CREATE INDEX "company360_city" ON "company360"("city");

-- CreateIndex
CREATE INDEX "company360_health_score" ON "company360"("healthScore");

-- CreateIndex
CREATE INDEX "company360_industry" ON "company360"("industry");

-- CreateIndex
CREATE INDEX "company360_next_follow_up_date" ON "company360"("nextFollowUpDate");

-- CreateIndex
CREATE INDEX "company360_partnership_level" ON "company360"("partnershipLevel");

-- CreateIndex
CREATE INDEX "company360_relationship_stage" ON "company360"("relationshipStage");

-- CreateIndex
CREATE INDEX "company360_status" ON "company360"("status");

-- CreateIndex
CREATE UNIQUE INDEX "deal_pipeline_dealCode_key" ON "deal_pipeline"("dealCode");

-- CreateIndex
CREATE INDEX "deal_pipeline_company_id" ON "deal_pipeline"("companyId");

-- CreateIndex
CREATE INDEX "deal_pipeline_expected_hiring_date" ON "deal_pipeline"("expectedHiringDate");

-- CreateIndex
CREATE INDEX "deal_pipeline_next_follow_up_date" ON "deal_pipeline"("nextFollowUpDate");

-- CreateIndex
CREATE INDEX "deal_pipeline_owner_id" ON "deal_pipeline"("ownerId");

-- CreateIndex
CREATE INDEX "deal_pipeline_priority" ON "deal_pipeline"("priority");

-- CreateIndex
CREATE INDEX "deal_pipeline_probability" ON "deal_pipeline"("probability");

-- CreateIndex
CREATE INDEX "deal_pipeline_stage" ON "deal_pipeline"("stage");

-- CreateIndex
CREATE UNIQUE INDEX "mous_mouNumber_key" ON "mous"("mouNumber");

-- CreateIndex
CREATE INDEX "mous_collaboration_type" ON "mous"("collaborationType");

-- CreateIndex
CREATE INDEX "mous_company_id" ON "mous"("companyId");

-- CreateIndex
CREATE INDEX "mous_end_date" ON "mous"("endDate");

-- CreateIndex
CREATE INDEX "mous_status" ON "mous"("status");

-- CreateIndex
CREATE INDEX "outreaches_company_id" ON "outreaches"("companyId");

-- CreateIndex
CREATE INDEX "outreaches_interaction_date" ON "outreaches"("interactionDate");

-- CreateIndex
CREATE INDEX "outreaches_next_follow_up_date" ON "outreaches"("nextFollowUpDate");

-- CreateIndex
CREATE INDEX "outreaches_outcome" ON "outreaches"("outcome");

-- CreateIndex
CREATE INDEX "outreaches_status" ON "outreaches"("status");

-- AddForeignKey
ALTER TABLE "alumni" ADD CONSTRAINT "alumni_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company360"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deal_pipeline" ADD CONSTRAINT "deal_pipeline_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deal_pipeline" ADD CONSTRAINT "deal_pipeline_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mous" ADD CONSTRAINT "mous_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outreaches" ADD CONSTRAINT "outreaches_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

