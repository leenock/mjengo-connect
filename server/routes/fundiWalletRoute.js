import express from "express";
import {
  initiateStkPush,
  handleKopokopoWebhook,
  getWalletBalance,
  getPaymentStatus,
} from "../controllers/fundiWalletController.js";
import {
  getBalance,
  depositFunds,
  withdrawFunds,
  getTransactions,
  getDetails,
} from "../controllers/fundiAddFundsController.js";
import { authenticateFundiToken } from "../middleware/fundiAuth.js";
import { validate } from "../middleware/validate.js";
import {
  initiateKopokopoStkPushSchema,
  kopokopoWebhookSchema,
} from "../utils/validation/kopokopoValidation.js";
import { processPendingFundiPayments } from "../services/kopokopoService.js";

const router = express.Router();

/**
 * @route   POST /api/fundi/wallet/add-funds/kopokopo
 * @desc    Initiate KopoKopo STK Push payment for Fundi wallet
 * @access  Private (Fundi authenticated)
 */
router.post(
  "/add-funds/kopokopo",
  authenticateFundiToken,
  validate(initiateKopokopoStkPushSchema),
  initiateStkPush
);

/**
 * @route   POST /api/fundi/wallet/kopokopo/webhook
 * @desc    Handle KopoKopo webhook callback for Fundi
 * @access  Public (Called by KopoKopo)
 * @note    This endpoint should be publicly accessible for KopoKopo to send webhooks
 */
router.post(
  "/kopokopo/webhook",
  validate(kopokopoWebhookSchema),
  handleKopokopoWebhook
);

/**
 * @route   GET /api/fundi/wallet/balance
 * @desc    Get fundi wallet balance
 * @access  Private (Fundi authenticated)
 */
router.get("/balance", authenticateFundiToken, getBalance);

/**
 * @route   GET /api/fundi/wallet/details
 * @desc    Get wallet details with statistics and recent transactions
 * @access  Private (Fundi authenticated)
 */
router.get("/details", authenticateFundiToken, getDetails);

/**
 * @route   POST /api/fundi/wallet/deposit
 * @desc    Deposit funds to wallet (manual deposit)
 * @access  Private (Fundi authenticated)
 */
router.post("/deposit", authenticateFundiToken, depositFunds);

/**
 * @route   POST /api/fundi/wallet/withdraw
 * @desc    Withdraw funds from wallet
 * @access  Private (Fundi authenticated)
 */
router.post("/withdraw", authenticateFundiToken, withdrawFunds);

/**
 * @route   GET /api/fundi/wallet/transactions
 * @desc    Get wallet transactions history
 * @access  Private (Fundi authenticated)
 */
router.get("/transactions", authenticateFundiToken, getTransactions);

/**
 * @route   GET /api/fundi/wallet/payment-status/:paymentRequestId
 * @desc    Get payment status from KopoKopo and update wallet if payment succeeded
 * @access  Private (Fundi authenticated)
 */
router.get(
  "/payment-status/:paymentRequestId",
  authenticateFundiToken,
  getPaymentStatus
);

/**
 * @route   POST /api/fundi/wallet/process-pending-payments
 * @desc    Check and process pending payments (useful for sandbox)
 * @access  Private (Fundi authenticated)
 */
router.post("/process-pending-payments", authenticateFundiToken, async (req, res) => {
  try {
    const fundiId = req.user.id;
    const results = await processPendingFundiPayments(fundiId);

    res.status(200).json({
      success: true,
      message: "Pending payments processed",
      data: results,
    });
  } catch (error) {
    console.error("Process Pending Payments Controller Error (Fundi):", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process pending payments",
    });
  }
});

export default router;
