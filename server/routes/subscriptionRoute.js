import express from "express";
import {
  subscribeToPremiumController,
  getSubscriptionDetailsController,
  downgradeExpiredSubscriptionsController,
} from "../controllers/subscriptionController.js";
import { authenticateFundiToken } from "../middleware/fundiAuth.js";

const router = express.Router();

/**
 * @route   POST /api/fundi/subscription/premium
 * @desc    Subscribe to premium plan (deducts 200 KES from wallet)
 * @access  Private (Fundi authenticated)
 */
router.post("/premium", authenticateFundiToken, subscribeToPremiumController);

/**
 * @route   GET /api/fundi/subscription/details
 * @desc    Get subscription details including current plan, next billing date, total paid
 * @access  Private (Fundi authenticated)
 */
router.get("/details", authenticateFundiToken, getSubscriptionDetailsController);

/**
 * @route   POST /api/fundi/subscription/downgrade-expired
 * @desc    Downgrade expired premium subscriptions to free plan (for cron job)
 * @access  Private (Admin or system)
 */
router.post("/downgrade-expired", downgradeExpiredSubscriptionsController);

export default router;
