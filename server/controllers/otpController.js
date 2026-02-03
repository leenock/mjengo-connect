import {
  sendPasswordResetOTP,
  verifyOTPAndResetPassword,
  resendOTP,
} from "../services/otpService.js";
import { isTwilioConfigured } from "../services/twilioService.js";

/**
 * Controller to send OTP for password reset
 * POST /api/client/auth/send-otp
 */
export const sendOTPController = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required",
    });
  }

  // Check if Twilio is configured
  if (!isTwilioConfigured()) {
    console.error("[OTP Controller] Twilio is not properly configured");
    return res.status(500).json({
      success: false,
      message: "SMS service is not available. Please contact support.",
    });
  }

  try {
    const result = await sendPasswordResetOTP(phoneNumber);

    res.status(200).json({
      success: true,
      message: result.message,
      expiresIn: result.expiresIn,
    });
  } catch (error) {
    console.error("[OTP Controller] Send OTP Error:", error.message);

    // Determine appropriate status code
    let statusCode = 400;
    if (error.message.includes("not active") || error.message.includes("contact support")) {
      statusCode = 403;
    } else if (error.message.includes("Failed to send")) {
      statusCode = 500;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Controller to verify OTP and reset password
 * POST /api/client/auth/verify-otp
 */
export const verifyOTPController = async (req, res) => {
  const { phoneNumber, otp, newPassword } = req.body;

  // Validate required fields
  if (!phoneNumber || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Phone number, OTP, and new password are required",
    });
  }

  // Validate OTP format (should be 6 digits)
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: "OTP must be a 6-digit number",
    });
  }

  // Validate password length
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    const result = await verifyOTPAndResetPassword(phoneNumber, otp, newPassword);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("[OTP Controller] Verify OTP Error:", error.message);

    // Determine appropriate status code
    let statusCode = 400;
    if (error.message.includes("not found")) {
      statusCode = 404;
    } else if (error.message.includes("expired")) {
      statusCode = 410; // Gone - resource no longer available
    } else if (error.message.includes("Invalid OTP")) {
      statusCode = 401;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Controller to resend OTP
 * POST /api/client/auth/resend-otp
 */
export const resendOTPController = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required",
    });
  }

  // Check if Twilio is configured
  if (!isTwilioConfigured()) {
    console.error("[OTP Controller] Twilio is not properly configured");
    return res.status(500).json({
      success: false,
      message: "SMS service is not available. Please contact support.",
    });
  }

  try {
    const result = await resendOTP(phoneNumber);

    res.status(200).json({
      success: true,
      message: result.message,
      expiresIn: result.expiresIn,
    });
  } catch (error) {
    console.error("[OTP Controller] Resend OTP Error:", error.message);

    // Determine appropriate status code
    let statusCode = 400;
    if (error.message.includes("not active") || error.message.includes("contact support")) {
      statusCode = 403;
    } else if (error.message.includes("Failed to send")) {
      statusCode = 500;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Controller to check if Twilio SMS service is available
 * GET /api/client/auth/check-sms-service
 */
export const checkSMSServiceController = async (req, res) => {
  const isConfigured = isTwilioConfigured();

  res.status(200).json({
    success: true,
    smsServiceAvailable: isConfigured,
  });
};

export default {
  sendOTPController,
  verifyOTPController,
  resendOTPController,
  checkSMSServiceController,
};
