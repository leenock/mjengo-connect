import express from 'express';
import { loginController } from "../controllers/clientUserController.js";
import { logoutController } from '../controllers/clientUserController.js';
import {
  sendOTPController,
  verifyOTPController,
  resendOTPController,
  checkSMSServiceController,
} from '../controllers/otpController.js';

const router = express.Router();

// POST /api/client/auth/login
router.post('/login', loginController);
router.post('/logout', logoutController);

// OTP Password Reset Routes
// POST /api/client/auth/send-otp - Send OTP to phone number
router.post('/send-otp', sendOTPController);

// POST /api/client/auth/verify-otp - Verify OTP and reset password
router.post('/verify-otp', verifyOTPController);

// POST /api/client/auth/resend-otp - Resend OTP to phone number
router.post('/resend-otp', resendOTPController);

// GET /api/client/auth/check-sms-service - Check if SMS service is available
router.get('/check-sms-service', checkSMSServiceController);

export default router;
