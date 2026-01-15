import express from "express";
import {
  initiateStkPush,
  handleKopokopoWebhook,
  getWalletBalance,
  getPaymentStatus,
} from "../controllers/clientWalletController.js";
import { processPendingPayments } from "../services/kopokopoService.js";
import {
  getBalance,
  depositFunds,
  withdrawFunds,
  getTransactions,
  getDetails,
} from "../controllers/clientAddFundsController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  initiateKopokopoStkPushSchema,
  kopokopoWebhookSchema,
} from "../utils/validation/kopokopoValidation.js";

const router = express.Router();

/**
 * @route   POST /api/client/wallet/add-funds/kopokopo
 * @desc    Initiate KopoKopo STK Push payment
 * @access  Private (Client authenticated)
 */
router.post(
  "/add-funds/kopokopo",
  authenticateToken,
  validate(initiateKopokopoStkPushSchema),
  initiateStkPush
);

/**
 * @route   POST /api/client/wallet/kopokopo/webhook
 * @desc    Handle KopoKopo webhook callback
 * @access  Public (Called by KopoKopo)
 * @note    This endpoint should be publicly accessible for KopoKopo to send webhooks
 */
router.post(
  "/kopokopo/webhook",
  validate(kopokopoWebhookSchema),
  handleKopokopoWebhook
);

/**
 * @route   GET /api/client/wallet/balance
 * @desc    Get client wallet balance
 * @access  Private (Client authenticated)
 */
router.get("/balance", authenticateToken, getBalance);

/**
 * @route   GET /api/client/wallet/details
 * @desc    Get wallet details with statistics and recent transactions
 * @access  Private (Client authenticated)
 */
router.get("/details", authenticateToken, getDetails);

/**
 * @route   POST /api/client/wallet/deposit
 * @desc    Deposit funds to wallet (manual deposit)
 * @access  Private (Client authenticated)
 */
router.post("/deposit", authenticateToken, depositFunds);

/**
 * @route   POST /api/client/wallet/withdraw
 * @desc    Withdraw funds from wallet
 * @access  Private (Client authenticated)
 */
router.post("/withdraw", authenticateToken, withdrawFunds);

/**
 * @route   GET /api/client/wallet/transactions
 * @desc    Get wallet transactions history
 * @access  Private (Client authenticated)
 */
router.get("/transactions", authenticateToken, getTransactions);

/**
 * @route   GET /api/client/wallet/payment-status/:paymentRequestId
 * @desc    Get payment status from KopoKopo and update wallet if payment succeeded
 * @access  Private (Client authenticated)
 */
router.get(
  "/payment-status/:paymentRequestId",
  authenticateToken,
  getPaymentStatus
);

/**
 * @route   POST /api/client/wallet/process-pending-payments
 * @desc    Check and process pending payments (useful for sandbox)
 * @access  Private (Client authenticated)
 */
router.post("/process-pending-payments", authenticateToken, async (req, res) => {
  try {
    const clientId = req.user.id;
    const results = await processPendingPayments(clientId);

    res.status(200).json({
      success: true,
      message: "Pending payments processed",
      data: results,
    });
  } catch (error) {
    console.error("Process Pending Payments Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process pending payments",
    });
  }
});

export default router;
