import express from 'express';
import { loginController } from "../controllers/clientUserController.js";
import { logoutController } from '../controllers/clientUserController.js';
import {
  sendOTPController,
  verifyOTPController,
  resendOTPController,
  checkSMSServiceController,
} from '../controllers/otpController.js';
import {
  forgotPasswordController,
  resetPasswordEmailController,
  checkEmailServiceController,
} from '../controllers/passwordResetEmailController.js';
import { authLimiter, strictAuthLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

// POST /api/client/auth/login
router.post('/login', authLimiter, loginController);
router.post('/logout', logoutController);

// OTP Password Reset Routes
router.post('/send-otp', strictAuthLimiter, sendOTPController);
router.post('/verify-otp', strictAuthLimiter, verifyOTPController);
router.post('/resend-otp', strictAuthLimiter, resendOTPController);
router.get('/check-sms-service', checkSMSServiceController);

// Email Password Reset Routes (reset link in email)
router.post('/forgot-password', strictAuthLimiter, forgotPasswordController);
router.post('/reset-password-email', strictAuthLimiter, resetPasswordEmailController);
router.get('/check-email-service', checkEmailServiceController);

export default router;
