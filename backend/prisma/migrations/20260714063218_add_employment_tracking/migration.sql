-- CreateEnum
CREATE TYPE "enum_employment_employmentType" AS ENUM ('Full Time', 'Part Time', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "enum_employment_workMode" AS ENUM ('On Site', 'REMOTE', 'HYBRID');

-- CreateTable
CREATE TABLE "employment" (
    "id" UUID NOT NULL,
    "alumniId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "designation" VARCHAR(255) NOT NULL,
    "department" VARCHAR(100),
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "employmentType" "enum_employment_employmentType" NOT NULL DEFAULT 'Full Time',
    "workMode" "enum_employment_workMode" NOT NULL DEFAULT 'On Site',
    "location" VARCHAR(255),
    "description" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "employment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "employment_alumniId_idx" ON "employment"("alumniId");

-- CreateIndex
CREATE INDEX "employment_companyId_idx" ON "employment"("companyId");

-- CreateIndex
CREATE INDEX "employment_alumniId_isCurrent_idx" ON "employment"("alumniId", "isCurrent");

-- CreateIndex
CREATE INDEX "employment_companyId_isCurrent_idx" ON "employment"("companyId", "isCurrent");

-- AddForeignKey
ALTER TABLE "employment" ADD CONSTRAINT "employment_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "alumni"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employment" ADD CONSTRAINT "employment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company360"("id") ON DELETE CASCADE ON UPDATE CASCADE;
