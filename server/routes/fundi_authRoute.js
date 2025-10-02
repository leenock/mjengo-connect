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

// Protected routes (authentication required)
router.get("/getAllFundis", getAllFundiUsers);
router.get("/getFundi/:id", authenticateFundiToken, getFundiUserById);
router.put(
  "/updateFundi/:id",
  authenticateFundiToken,
  validate(updateFundiUserSchema),
  updateFundiUserController
);
router.post(
  "/updateFundiPassword",
  authenticateFundiToken,
  updateFundiPasswordController
);
router.delete(
  "/deleteFundi/:id",
  authenticateFundiToken,
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
