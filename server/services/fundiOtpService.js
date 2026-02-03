/**
 * Fundi OTP service for password reset (phone) - same flow as client.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendOTPSMS } from "./twilioService.js";

const prisma = new PrismaClient();

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

function generateOTP() {
  const randomBytes = crypto.randomBytes(3);
  const randomNumber = parseInt(randomBytes.toString("hex"), 16);
  return String(randomNumber % 1000000).padStart(OTP_LENGTH, "0");
}

const normalizePhoneForSearch = (phoneNumber) => {
  if (!phoneNumber) return [];
  let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, "");
  const formats = new Set();
  formats.add(cleaned);
  if (cleaned.startsWith("+254")) {
    formats.add("0" + cleaned.substring(4));
    formats.add(cleaned.substring(1));
  }
  if (cleaned.startsWith("254") && !cleaned.startsWith("+")) {
    formats.add("+" + cleaned);
    formats.add("0" + cleaned.substring(3));
  }
  if (cleaned.startsWith("07") || cleaned.startsWith("01")) {
    formats.add("+254" + cleaned.substring(1));
    formats.add("254" + cleaned.substring(1));
  }
  return Array.from(formats);
};

export const findFundiByPhone = async (phoneNumber) => {
  const normalizedPhone = normalizePhoneForSearch(phoneNumber);
  if (normalizedPhone.length === 0) return null;
  return prisma.fundi_User.findFirst({
    where: { OR: normalizedPhone.map((phone) => ({ phone })) },
  });
};

export const sendFundiPasswordResetOTP = async (phoneNumber) => {
  if (!phoneNumber) throw new Error("Phone number is required");
  const user = await findFundiByPhone(phoneNumber);
  if (!user) {
    console.log(`[OTP Fundi] Phone number not found: ${phoneNumber}`);
    return { success: true, message: "If this phone number is registered, you will receive an OTP shortly." };
  }
  if (user.accountStatus !== "ACTIVE") {
    throw new Error("This account is not active. Please contact support.");
  }
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  const hashedOTP = await bcrypt.hash(otp, 10);
  await prisma.fundi_User.update({
    where: { id: user.id },
    data: { otp: hashedOTP, otpExpiresAt },
  });
  try {
    await sendOTPSMS(phoneNumber, otp);
  } catch (smsError) {
    await prisma.fundi_User.update({
      where: { id: user.id },
      data: { otp: null, otpExpiresAt: null },
    });
    throw new Error(`Failed to send OTP: ${smsError.message}`);
  }
  return { success: true, message: "OTP sent successfully. Please check your phone.", expiresIn: OTP_EXPIRY_MINUTES };
};

export const verifyFundiOTPAndResetPassword = async (phoneNumber, otp, newPassword) => {
  if (!phoneNumber || !otp || !newPassword) throw new Error("Phone number, OTP, and new password are required");
  if (newPassword.length < 6) throw new Error("Password must be at least 6 characters long");
  const user = await findFundiByPhone(phoneNumber);
  if (!user) throw new Error("User not found. Please check your phone number.");
  if (!user.otp || !user.otpExpiresAt) throw new Error("No OTP request found. Please request a new OTP.");
  if (new Date() > user.otpExpiresAt) {
    await prisma.fundi_User.update({
      where: { id: user.id },
      data: { otp: null, otpExpiresAt: null },
    });
    throw new Error("OTP has expired. Please request a new one.");
  }
  const isOTPValid = await bcrypt.compare(otp, user.otp);
  if (!isOTPValid) throw new Error("Invalid OTP. Please check and try again.");
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.fundi_User.update({
    where: { id: user.id },
    data: { password: hashedPassword, otp: null, otpExpiresAt: null },
  });
  return { success: true, message: "Password reset successfully. You can now login with your new password." };
};

export const resendFundiOTP = async (phoneNumber) => {
  return sendFundiPasswordResetOTP(phoneNumber);
};
