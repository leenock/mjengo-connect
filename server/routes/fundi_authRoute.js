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
import {
  authenticateFundiToken,
  requireActiveSubscription,
  requirePremiumSubscription,
} from "../middleware/fundiAuth.js";
import {
  registerFundiUserSchema,
  updateFundiUserSchema,
  loginFundiUserSchema,
} from "../utils/validation/fundi_UserValidation.js";

import { adminAuthMiddleware, superAdminMiddleware } from "../middleware/adminAuth.js";


const router = express.Router();

// Public routes (no authentication required)
router.post(
  "/registerFundi",
  validate(registerFundiUserSchema),
  registerFundiUserController
);

router.post(
  "/loginFundi",
  validate(loginFundiUserSchema),
  loginFundiController
);

// Fundi forgot password (OTP + Email)
router.post("/send-otp", sendFundiOtpController);
router.post("/verify-otp", verifyFundiOtpController);
router.post("/resend-otp", resendFundiOtpController);
router.post("/forgot-password", fundiForgotPasswordController);
router.post("/reset-password-email", fundiResetPasswordEmailController);
router.get("/check-sms-service", checkFundiSmsServiceController);
router.get("/check-email-service", checkFundiEmailServiceController);

// Protected routes (authentication required)
router.get("/getAllFundis", adminAuthMiddleware, getAllFundiUsers);
router.get("/getFundi/:id", getFundiUserById);
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
  validate(updateFundiUserSchema),
  updateFundiUserController
);
router.post(
  "/updateFundiPassword",
  authenticateFundiToken,
  updateFundiPasswordController
);

// Delete fundi user (admin only)
router.delete(
  "/deleteFundi/:id",
  adminAuthMiddleware,superAdminMiddleware,
  deleteFundiUserController
);
router.post("/logoutFundi", authenticateFundiToken, logoutFundiController);

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
