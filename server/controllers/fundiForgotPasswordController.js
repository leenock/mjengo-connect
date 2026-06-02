import {
  sendFundiPasswordResetOTP,
  verifyFundiOTPAndResetPassword,
  resendFundiOTP,
} from "../services/fundiOtpService.js";
import {
  requestFundiPasswordReset,
  resetFundiPasswordWithToken,
} from "../services/fundiPasswordResetEmailService.js";
import { isEmailConfigured } from "../services/emailService.js";
import { isTwilioConfigured } from "../services/twilioService.js";
import { serverLog } from "../utils/appLogger.js";

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://mjengoconnect.site"
    : "http://localhost:3000");

export async function sendFundiOtpController(req, res) {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber || typeof phoneNumber !== "string" || !phoneNumber.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required." });
    }
    if (!isTwilioConfigured()) {
      return res.status(503).json({ success: false, message: "SMS service is not configured. Contact support." });
    }
    const result = await sendFundiPasswordResetOTP(phoneNumber.trim());
    return res.status(200).json({ success: true, message: result.message, expiresIn: result.expiresIn });
  } catch (err) {
    serverLog.error("Fundi OTP Controller", "Send OTP failed", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to send OTP." });
  }
}

export async function verifyFundiOtpController(req, res) {
  try {
    const { phoneNumber, otp, newPassword } = req.body;
    if (!phoneNumber || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Phone number, OTP, and new password are required." });
    }
    const result = await verifyFundiOTPAndResetPassword(phoneNumber.trim(), otp.trim(), newPassword);
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    serverLog.error("Fundi OTP Controller", "Verify OTP failed", err);
    return res.status(400).json({ success: false, message: err.message || "Password reset failed." });
  }
}

export async function resendFundiOtpController(req, res) {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber || typeof phoneNumber !== "string" || !phoneNumber.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required." });
    }
    if (!isTwilioConfigured()) {
      return res.status(503).json({ success: false, message: "SMS service is not configured." });
    }
    const result = await resendFundiOTP(phoneNumber.trim());
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    serverLog.error("Fundi OTP Controller", "Resend OTP failed", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to resend OTP." });
  }
}

export async function fundiForgotPasswordController(req, res) {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    if (!isEmailConfigured()) {
      return res.status(503).json({ success: false, message: "Email service is not configured. Contact support." });
    }
    const result = await requestFundiPasswordReset(email.trim(), FRONTEND_URL);
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    serverLog.error("Fundi Forgot Password", "Request failed", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to send reset email." });
  }
}

export async function fundiResetPasswordEmailController(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || typeof token !== "string" || !token.trim()) {
      return res.status(400).json({ success: false, message: "Reset token is required." });
    }
    if (!newPassword || typeof newPassword !== "string") {
      return res.status(400).json({ success: false, message: "New password is required." });
    }
    const result = await resetFundiPasswordWithToken(token.trim(), newPassword);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    serverLog.error("Fundi Reset Password Email", "Reset failed", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to reset password." });
  }
}

export async function checkFundiSmsServiceController(req, res) {
  return res.status(200).json({ success: true, configured: isTwilioConfigured() });
}

export async function checkFundiEmailServiceController(req, res) {
  return res.status(200).json({ success: true, configured: isEmailConfigured() });
}
