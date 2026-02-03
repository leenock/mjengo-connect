import {
  requestPasswordReset,
  resetPasswordWithToken,
} from "../services/passwordResetEmailService.js";
import { isEmailConfigured } from "../services/emailService.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

/**
 * POST /api/client/auth/forgot-password
 * Body: { email: string }
 */
export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!isEmailConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Email service is not configured. Contact support.",
      });
    }

    const result = await requestPasswordReset(email.trim(), FRONTEND_URL);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error("Forgot password (email) error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send reset email.",
    });
  }
}

/**
 * POST /api/client/auth/reset-password-email
 * Body: { token: string, newPassword: string }
 */
export async function resetPasswordEmailController(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || typeof token !== "string" || !token.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required.",
      });
    }
    if (!newPassword || typeof newPassword !== "string") {
      return res.status(400).json({
        success: false,
        message: "New password is required.",
      });
    }

    const result = await resetPasswordWithToken(token.trim(), newPassword);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error("Reset password (email) error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to reset password.",
    });
  }
}

/**
 * GET /api/client/auth/check-email-service
 */
export async function checkEmailServiceController(req, res) {
  return res.status(200).json({
    success: true,
    configured: isEmailConfigured(),
  });
}
