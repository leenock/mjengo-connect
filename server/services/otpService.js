import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendOTPSMS } from "./twilioService.js";

const prisma = new PrismaClient();

// OTP configuration
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

/**
 * Generates a random 6-digit OTP
 * @returns {string} 6-digit OTP code
 */
export const generateOTP = () => {
  // Generate a cryptographically secure random number
  const randomBytes = crypto.randomBytes(3); // 3 bytes = 6 hex characters
  const randomNumber = parseInt(randomBytes.toString("hex"), 16);
  
  // Ensure it's exactly 6 digits
  const otp = String(randomNumber % 1000000).padStart(OTP_LENGTH, "0");
  
  return otp;
};

/**
 * Finds a client user by phone number
 * @param {string} phoneNumber - The phone number to search for
 * @returns {Promise<Object|null>} The user object or null
 */
export const findClientByPhone = async (phoneNumber) => {
  // Normalize phone number for search
  // Search for various formats the phone might be stored as
  const normalizedPhone = normalizePhoneForSearch(phoneNumber);
  
  const user = await prisma.client_User.findFirst({
    where: {
      OR: normalizedPhone.map(phone => ({ phone }))
    }
  });
  
  return user;
};

/**
 * Normalizes phone number to various formats for database search
 * @param {string} phoneNumber - The input phone number
 * @returns {string[]} Array of possible phone number formats
 */
const normalizePhoneForSearch = (phoneNumber) => {
  if (!phoneNumber) return [];
  
  // Remove all spaces, dashes, and parentheses
  let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, "");
  
  const formats = new Set();
  
  // Add the original cleaned format
  formats.add(cleaned);
  
  // If starts with +254, also search for 07/01 format
  if (cleaned.startsWith("+254")) {
    const localNumber = "0" + cleaned.substring(4);
    formats.add(localNumber);
    formats.add(cleaned.substring(1)); // 254...
  }
  
  // If starts with 254 (without +), add other formats
  if (cleaned.startsWith("254") && !cleaned.startsWith("+")) {
    formats.add("+" + cleaned);
    formats.add("0" + cleaned.substring(3));
  }
  
  // If starts with 07 or 01, add +254 format
  if (cleaned.startsWith("07") || cleaned.startsWith("01")) {
    formats.add("+254" + cleaned.substring(1));
    formats.add("254" + cleaned.substring(1));
  }
  
  // If starts with 7 or 1 (without leading 0)
  if (/^[71]/.test(cleaned) && !cleaned.startsWith("7") && !cleaned.startsWith("1")) {
    formats.add("+254" + cleaned);
    formats.add("254" + cleaned);
    formats.add("0" + cleaned);
  }
  
  return Array.from(formats);
};

/**
 * Sends OTP to a client's phone number for password reset
 * @param {string} phoneNumber - The phone number to send OTP to
 * @returns {Promise<Object>} Result object with success status
 */
export const sendPasswordResetOTP = async (phoneNumber) => {
  if (!phoneNumber) {
    throw new Error("Phone number is required");
  }
  
  // Find the user by phone number
  const user = await findClientByPhone(phoneNumber);
  
  if (!user) {
    // For security, don't reveal if the phone number exists
    // But still return success to prevent enumeration attacks
    console.log(`[OTP] Phone number not found in database: ${phoneNumber}`);
    return {
      success: true,
      message: "If this phone number is registered, you will receive an OTP shortly.",
    };
  }
  
  // Check if account is active
  if (!user.isActive || user.accountStatus !== "ACTIVE") {
    throw new Error("This account is not active. Please contact support.");
  }
  
  // Generate OTP
  const otp = generateOTP();
  
  // Calculate expiry time (10 minutes from now)
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  
  // Hash the OTP before storing (for security)
  const hashedOTP = await bcrypt.hash(otp, 10);
  
  // Update user with OTP and expiry
  await prisma.client_User.update({
    where: { id: user.id },
    data: {
      otp: hashedOTP,
      otpExpiresAt: otpExpiresAt,
    },
  });
  
  console.log(`[OTP] Generated OTP for user ${user.id}, expires at ${otpExpiresAt}`);
  
  // Send OTP via SMS
  try {
    await sendOTPSMS(phoneNumber, otp);
    console.log(`[OTP] SMS sent successfully to ${phoneNumber}`);
  } catch (smsError) {
    console.error(`[OTP] Failed to send SMS:`, smsError.message);
    
    // Clear the OTP since we couldn't send it
    await prisma.client_User.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiresAt: null,
      },
    });
    
    throw new Error(`Failed to send OTP: ${smsError.message}`);
  }
  
  return {
    success: true,
    message: "OTP sent successfully. Please check your phone.",
    expiresIn: OTP_EXPIRY_MINUTES,
  };
};

/**
 * Verifies OTP and resets password
 * @param {string} phoneNumber - The user's phone number
 * @param {string} otp - The OTP code entered by user
 * @param {string} newPassword - The new password
 * @returns {Promise<Object>} Result object with success status
 */
export const verifyOTPAndResetPassword = async (phoneNumber, otp, newPassword) => {
  if (!phoneNumber || !otp || !newPassword) {
    throw new Error("Phone number, OTP, and new password are required");
  }
  
  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  
  // Find the user by phone number
  const user = await findClientByPhone(phoneNumber);
  
  if (!user) {
    throw new Error("User not found. Please check your phone number.");
  }
  
  // Check if OTP exists and hasn't expired
  if (!user.otp || !user.otpExpiresAt) {
    throw new Error("No OTP request found. Please request a new OTP.");
  }
  
  // Check if OTP has expired
  if (new Date() > user.otpExpiresAt) {
    // Clear expired OTP
    await prisma.client_User.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiresAt: null,
      },
    });
    throw new Error("OTP has expired. Please request a new one.");
  }
  
  // Verify OTP (compare with hashed OTP)
  const isOTPValid = await bcrypt.compare(otp, user.otp);
  
  if (!isOTPValid) {
    throw new Error("Invalid OTP. Please check and try again.");
  }
  
  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // Update password and clear OTP
  await prisma.client_User.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpiresAt: null,
    },
  });
  
  console.log(`[OTP] Password reset successful for user ${user.id}`);
  
  return {
    success: true,
    message: "Password reset successfully. You can now login with your new password.",
  };
};

/**
 * Resends OTP to a phone number
 * @param {string} phoneNumber - The phone number to resend OTP to
 * @returns {Promise<Object>} Result object with success status
 */
export const resendOTP = async (phoneNumber) => {
  // Simply call sendPasswordResetOTP again
  // It will generate a new OTP and send it
  return await sendPasswordResetOTP(phoneNumber);
};

/**
 * Clears OTP data for a user (useful for cleanup)
 * @param {string} userId - The user ID
 * @returns {Promise<void>}
 */
export const clearOTP = async (userId) => {
  await prisma.client_User.update({
    where: { id: userId },
    data: {
      otp: null,
      otpExpiresAt: null,
    },
  });
};

export default {
  generateOTP,
  sendPasswordResetOTP,
  verifyOTPAndResetPassword,
  resendOTP,
  clearOTP,
  findClientByPhone,
};
