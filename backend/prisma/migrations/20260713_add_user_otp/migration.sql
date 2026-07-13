-- Preserve the password-reset flow that was declared in Sequelize but was
-- missing from the live PostgreSQL table.
ALTER TABLE "Users"
ADD COLUMN "otp" VARCHAR(255),
ADD COLUMN "otpExpiry" TIMESTAMPTZ(6);
