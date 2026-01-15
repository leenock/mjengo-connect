import {
  initiateKopokopoStkPush,
  processKopokopoWebhook,
  getClientWalletBalance,
  getKopokopoPaymentStatus,
} from "../services/kopokopoService.js";

/**
 * Initiate KopoKopo STK Push payment
 * POST /api/client/wallet/add-funds/kopokopo
 */
export const initiateStkPush = async (req, res) => {
  try {
    const clientId = req.user.id; // From auth middleware
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
    const result = await initiateKopokopoStkPush(paymentData, clientId);

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
    console.error("Initiate STK Push Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to initiate STK Push",
    });
  }
};

/**
 * Handle KopoKopo webhook callback
 * POST /api/client/wallet/kopokopo/webhook
 */
export const handleKopokopoWebhook = async (req, res) => {
  try {
    const webhookData = req.body;

    // Process webhook asynchronously (don't block response)
    processKopokopoWebhook(webhookData)
      .then((result) => {
        console.log("Webhook processed successfully:", result);
      })
      .catch((error) => {
        console.error("Webhook processing error:", error);
      });

    // Respond immediately to KopoKopo
    res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    // Still respond 200 to prevent KopoKopo from retrying
    res.status(200).json({
      success: false,
      message: "Webhook received but processing failed",
    });
  }
};

/**
 * Get client wallet balance (legacy - now uses clientAddFunds service)
 * GET /api/client/wallet/balance
 * @deprecated This is kept for backward compatibility, but routes now use getBalance from clientAddFundsController
 */
export const getWalletBalance = async (req, res) => {
  try {
    const clientId = req.user.id; // From auth middleware

    const walletData = await getClientWalletBalance(clientId);

    res.status(200).json({
      success: true,
      data: walletData,
    });
  } catch (error) {
    console.error("Get Wallet Balance Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get wallet balance",
    });
  }
};

/**
 * Get payment status and update wallet if payment succeeded
 * GET /api/client/wallet/payment-status/:paymentRequestId
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentRequestId } = req.params;
    const clientId = req.user.id; // From auth middleware

    if (!paymentRequestId) {
      return res.status(400).json({
        success: false,
        message: "Payment request ID is required",
      });
    }

    // Get status from KopoKopo API (this will also update wallet if payment succeeded)
    const status = await getKopokopoPaymentStatus(paymentRequestId);

    // Get updated wallet balance
    const { getClientWalletBalance } = await import("../services/kopokopoService.js");
    const walletData = await getClientWalletBalance(clientId);

    res.status(200).json({
      success: true,
      data: status,
      wallet: walletData, // Include updated wallet balance
    });
  } catch (error) {
    console.error("Get Payment Status Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get payment status",
    });
  }
};
