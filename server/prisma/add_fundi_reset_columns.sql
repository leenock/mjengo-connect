-- Add OTP and email password reset columns to Fundi_User (idempotent)
ALTER TABLE "Fundi_User" ADD COLUMN IF NOT EXISTS "otp" TEXT;
ALTER TABLE "Fundi_User" ADD COLUMN IF NOT EXISTS "otpExpiresAt" TIMESTAMP(3);
ALTER TABLE "Fundi_User" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
ALTER TABLE "Fundi_User" ADD COLUMN IF NOT EXISTS "passwordResetTokenExpiresAt" TIMESTAMP(3);
