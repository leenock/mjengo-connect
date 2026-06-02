import express from "express";
import {
  registerFundiUserController,
  getAllFundiUsers,
  getFundiUserById,
  updateFundiUserController,
  updateFundiPasswordController,
  deleteFundiUserController,
  loginFundiController,
  logoutFundiController,
} from "../controllers/fundiUserController.js";
import {
  sendFundiOtpController,
  verifyFundiOtpController,
  resendFundiOtpController,
  fundiForgotPasswordController,
  fundiResetPasswordEmailController,
  checkFundiSmsServiceController,
  checkFundiEmailServiceController,
} from "../controllers/fundiForgotPasswordController.js";
import { validate } from "../middleware/validate.js";
import { authLimiter, strictAuthLimiter, registrationLimiter } from "../middleware/rateLimit.js";
import {
  authenticateFundiToken,
  requireActiveSubscription,
  requirePremiumSubscription,
} from "../middleware/fundiAuth.js";
import { optionalAuthenticateFundiToken } from "../middleware/optionalAuth.js";
import {
  registerFundiUserSchema,
  updateFundiUserSchema,
  adminUpdateFundiUserSchema,
  loginFundiUserSchema,
  changeFundiPasswordSchema,
} from "../utils/validation/fundi_UserValidation.js";

import { adminAuthMiddleware, superAdminMiddleware } from "../middleware/adminAuth.js";


const router = express.Router();

// Public routes (no authentication required)
router.post(
  "/registerFundi",
  registrationLimiter,
  validate(registerFundiUserSchema),
  registerFundiUserController
);

router.post(
  "/loginFundi",
  authLimiter,
  validate(loginFundiUserSchema),
  loginFundiController
);

// Fundi forgot password (OTP + Email)
router.post("/send-otp", strictAuthLimiter, sendFundiOtpController);
router.post("/verify-otp", strictAuthLimiter, verifyFundiOtpController);
router.post("/resend-otp", strictAuthLimiter, resendFundiOtpController);
router.post("/forgot-password", strictAuthLimiter, fundiForgotPasswordController);
router.post("/reset-password-email", strictAuthLimiter, fundiResetPasswordEmailController);
router.get("/check-sms-service", checkFundiSmsServiceController);
router.get("/check-email-service", checkFundiEmailServiceController);

// Protected routes (authentication required)
router.get("/getAllFundis", adminAuthMiddleware, getAllFundiUsers);
router.get("/getFundi/:id", authenticateFundiToken, getFundiUserById);
router.put(
  "/updateFundi/:id",
  authenticateFundiToken,
  validate(updateFundiUserSchema),
  updateFundiUserController
);
// update fundi admin API 
router.put(
  "/updateFundiAdmin/:id",
  adminAuthMiddleware,
  validate(adminUpdateFundiUserSchema),
  updateFundiUserController
);
router.post(
  "/updateFundiPassword",
  strictAuthLimiter,
  authenticateFundiToken,
  validate(changeFundiPasswordSchema),
  updateFundiPasswordController
);

// Delete fundi user (admin only)
router.delete(
  "/deleteFundi/:id",
  adminAuthMiddleware,superAdminMiddleware,
  deleteFundiUserController
);
router.post("/logoutFundi", optionalAuthenticateFundiToken, logoutFundiController);

// Premium feature routes (require active subscription)
router.get(
  "/premium/features",
  authenticateFundiToken,
  requireActiveSubscription,
  (req, res) => {
    res.json({ message: "Premium features accessible" });
  }
);

// Premium only routes (require premium subscription)
router.get(
  "/premium/exclusive",
  authenticateFundiToken,
  requirePremiumSubscription,
  (req, res) => {
    res.json({ message: "Premium exclusive features accessible" });
  }
);

export default router;
