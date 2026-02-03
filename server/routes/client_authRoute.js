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

const router = express.Router();

// POST /api/client/auth/login
router.post('/login', loginController);
router.post('/logout', logoutController);

// OTP Password Reset Routes
router.post('/send-otp', sendOTPController);
router.post('/verify-otp', verifyOTPController);
router.post('/resend-otp', resendOTPController);
router.get('/check-sms-service', checkSMSServiceController);

// Email Password Reset Routes (reset link in email)
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password-email', resetPasswordEmailController);
router.get('/check-email-service', checkEmailServiceController);

export default router;
