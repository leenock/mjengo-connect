-- Add OTP fields to Client_User table for password reset functionality
ALTER TABLE "Client_User" ADD COLUMN IF NOT EXISTS "otp" TEXT;
ALTER TABLE "Client_User" ADD COLUMN IF NOT EXISTS "otpExpiresAt" TIMESTAMP(3);
