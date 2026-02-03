-- Add email password reset fields to Client_User
ALTER TABLE "Client_User" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
ALTER TABLE "Client_User" ADD COLUMN IF NOT EXISTS "passwordResetTokenExpiresAt" TIMESTAMP(3);
