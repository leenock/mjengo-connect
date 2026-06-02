import {
  initiateKopokopoStkPushForFundi,
  processKopokopoWebhookForFundi,
  getFundiWalletBalanceFromService,
  getKopokopoPaymentStatusForFundi,
} from "../services/kopokopoService.js";
import { paymentLog as payLog } from "../utils/paymentLogger.js";
import { assertFundiPaymentOwnership } from "../utils/paymentOwnership.js";

/**
 * Initiate KopoKopo STK Push payment for Fundi wallet
 * POST /api/fundi/wallet/add-funds/kopokopo
 */
export const initiateStkPush = async (req, res) => {
  try {
    const fundiId = req.user.id; // From auth middleware
    const paymentData = req.body;

    // Validate required fields
    if (!paymentData.amount || paymentData.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (!paymentData.firstName || !paymentData.lastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required",
      });
    }

    if (!paymentData.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Initiate STK Push
    const result = await initiateKopokopoStkPushForFundi(paymentData, fundiId);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        paymentRequestId: result.paymentRequestId,
        paymentRequestUrl: result.paymentRequestUrl,
        paymentLogId: result.paymentLogId,
      },
    });
  } catch (error) {
    payLog.error("STK Push controller failed", error, { role: "fundi" });
    const message = error.message || "Failed to initiate STK Push";
    const isPendingPhoneRequest = /pending for this phone number|pending request for the phone number/i.test(
      message
    );
    res.status(isPendingPhoneRequest ? 429 : 500).json({
      success: false,
      code: isPendingPhoneRequest ? "PENDING_STK_REQUEST" : "INTERNAL_ERROR",
      message,
    });
  }
};

/**
 * Handle KopoKopo webhook callback for Fundi
 * POST /api/fundi/wallet/kopokopo/webhook
 */
export const handleKopokopoWebhook = async (req, res) => {
  try {
    const webhookData = req.body;

    // Process webhook asynchronously (don't block response)
    processKopokopoWebhookForFundi(webhookData).catch((error) => {
      payLog.error("Webhook processing failed", error, { role: "fundi" });
    });

    // Respond immediately to KopoKopo
    res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  } catch (error) {
    payLog.error("Webhook handler failed", error, { role: "fundi" });
    // Still respond 200 to prevent KopoKopo from retrying
    res.status(200).json({
      success: false,
      message: "Webhook received but processing failed",
    });
  }
};

/**
 * Get fundi wallet balance
 * GET /api/fundi/wallet/balance
 */
export const getWalletBalance = async (req, res) => {
  try {
    const fundiId = req.user.id; // From auth middleware

    const walletData = await getFundiWalletBalanceFromService(fundiId);

    res.status(200).json({
      success: true,
      data: walletData,
    });
  } catch (error) {
    payLog.error("Get wallet balance controller failed", error, { role: "fundi" });
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get wallet balance",
    });
  }
};

/**
 * Get payment status and update wallet if payment succeeded
 * GET /api/fundi/wallet/payment-status/:paymentRequestId
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentRequestId } = req.params;
    const fundiId = req.user.id; // From auth middleware

    if (!paymentRequestId) {
      return res.status(400).json({
        success: false,
        message: "Payment request ID is required",
      });
    }

    await assertFundiPaymentOwnership(paymentRequestId, fundiId);

    // Get status from KopoKopo API (this will also update wallet if payment succeeded)
    const status = await getKopokopoPaymentStatusForFundi(paymentRequestId);

    // Get updated wallet balance
    const walletData = await getFundiWalletBalanceFromService(fundiId);

    res.status(200).json({
      success: true,
      data: status,
      wallet: walletData, // Include updated wallet balance
    });
  } catch (error) {
    if (error.code === "PAYMENT_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    payLog.error("Get payment status controller failed", error, { role: "fundi" });
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get payment status",
    });
  }
};
