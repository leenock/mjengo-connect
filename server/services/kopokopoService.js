import { PrismaClient } from "@prisma/client";
import { depositToWallet, getWalletBalance } from "./clientAddFunds.js";
import { 
  depositToWallet as depositToFundiWallet, 
  getWalletBalance as getFundiWalletBalance 
} from "./fundiAddFunds.js";

const prisma = new PrismaClient();

/**
 * KopoKopo API Configuration
 * These should be set in your .env file:
 * - KOPOKOPO_CLIENT_ID
 * - KOPOKOPO_CLIENT_SECRET
 * - KOPOKOPO_TILL_NUMBER (e.g., "K000000")
 * - KOPOKOPO_BASE_URL (sandbox: "https://sandbox.kopokopo.com", production: "https://api.kopokopo.com")
 * - KOPOKOPO_CALLBACK_URL (your webhook endpoint URL)
 */
const KOPOKOPO_CONFIG = {
  clientId: process.env.KOPOKOPO_CLIENT_ID,
  clientSecret: process.env.KOPOKOPO_CLIENT_SECRET,
  tillNumber: process.env.KOPOKOPO_TILL_NUMBER,
  baseUrl: process.env.KOPOKOPO_BASE_URL || "https://sandbox.kopokopo.com",
  callbackUrl: process.env.KOPOKOPO_CALLBACK_URL || "http://localhost:5000/api/client/wallet/kopokopo/webhook",
  grantType: "client_credentials"
};

// Verbose logs only in development (set KOPOKOPO_VERBOSE=true to enable in production)
const KOPOKOPO_VERBOSE = process.env.KOPOKOPO_VERBOSE === "true" || process.env.NODE_ENV !== "production";
const logInfo = (...args) => { if (KOPOKOPO_VERBOSE) console.log(...args); };

/**
 * Get OAuth access token from KopoKopo
 * @returns {Promise<string>} Access token
 */
export const getKopokopoAccessToken = async () => {
  try {
    // KopoKopo OAuth endpoint expects form-urlencoded data
    const params = new URLSearchParams();
    params.append("client_id", KOPOKOPO_CONFIG.clientId);
    params.append("client_secret", KOPOKOPO_CONFIG.clientSecret);
    params.append("grant_type", KOPOKOPO_CONFIG.grantType);

    const response = await fetch(`${KOPOKOPO_CONFIG.baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const responseText = await response.text();
    
    // Log token response only in development
    if (process.env.NODE_ENV !== "production") {
      logInfo("🔑 KopoKopo Access Token obtained");
    }

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText || "Unknown error" };
      }
      throw new Error(
        `Failed to get access token: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = JSON.parse(responseText);
    if (!data.access_token) {
      throw new Error("Access token not found in response");
    }
    return data.access_token;
  } catch (error) {
    console.error("KopoKopo Access Token Error:", error);
    throw new Error(`Failed to authenticate with KopoKopo: ${error.message}`);
  }
};

/**
 * Initiate STK Push payment request to KopoKopo
 * @param {Object} paymentData - Payment data
 * @param {string} paymentData.firstName - Customer first name
 * @param {string} paymentData.lastName - Customer last name
 * @param {string} paymentData.phoneNumber - Customer phone number
 * @param {string} paymentData.email - Customer email (optional)
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.currency - Currency (default: KES)
 * @param {Object} paymentData.metadata - Additional metadata
 * @param {string} clientId - Client user ID
 * @returns {Promise<Object>} Payment request response
 */
export const initiateKopokopoStkPush = async (paymentData, clientId) => {
  try {
    // Validate configuration
    if (!KOPOKOPO_CONFIG.clientId || !KOPOKOPO_CONFIG.clientSecret) {
      throw new Error("KopoKopo credentials not configured. Please set KOPOKOPO_CLIENT_ID and KOPOKOPO_CLIENT_SECRET in your .env file.");
    }

    if (!KOPOKOPO_CONFIG.tillNumber) {
      throw new Error("KopoKopo till number not configured. Please set KOPOKOPO_TILL_NUMBER in your .env file.");
    }

    // Validate payment data
    if (!paymentData.amount || paymentData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (!paymentData.phoneNumber) {
      throw new Error("Phone number is required");
    }

    // Get access token
    const accessToken = await getKopokopoAccessToken();
    
    if (!accessToken) {
      throw new Error("Failed to obtain access token from KopoKopo");
    }

    // Prepare STK Push request payload according to KopoKopo API format
    // KopoKopo expects: subscriber object, amount object, and _links for callback
    const stkPushPayload = {
      payment_channel: paymentData.paymentChannel || "M-PESA STK Push",
      till_number: KOPOKOPO_CONFIG.tillNumber,
      subscriber: {
        first_name: paymentData.firstName,
        last_name: paymentData.lastName,
        phone_number: paymentData.phoneNumber,
        ...(paymentData.email && { email: paymentData.email }),
      },
      amount: {
        currency: paymentData.currency || "KES",
        value: paymentData.amount.toString(), // Amount as string
      },
      metadata: {
        customer_id: clientId,
        reference: paymentData.metadata?.reference || `WALLET_TOPUP_${Date.now()}`,
        notes: paymentData.metadata?.notes || `Wallet top-up of KES ${paymentData.amount}`,
      },
      _links: {
        callback_url: KOPOKOPO_CONFIG.callbackUrl,
      },
    };

    // Log request details (can be removed in production or made conditional)
    if (process.env.NODE_ENV !== "production") {
      logInfo("📤 Initiating KopoKopo STK Push...");
      logInfo("   Amount: KES", paymentData.amount);
      logInfo("   Phone:", paymentData.phoneNumber);
    }

    // Make API request to KopoKopo
    const response = await fetch(`${KOPOKOPO_CONFIG.baseUrl}/api/v1/incoming_payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(stkPushPayload),
    });

    // Get response text first to see what we're dealing with
    const responseText = await response.text();
    
    // Log response details only in development
    if (process.env.NODE_ENV !== "production") {
      logInfo("📥 KopoKopo API Response Status:", response.status);
    }

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText || "Unknown error" };
      }
      
      console.error("KopoKopo API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestPayload: stkPushPayload,
      });
      
      // 403: use KopoKopo's error_message when present (e.g. app not approved)
      if (response.status === 403) {
        const msg = errorData.error_message || errorData.error?.error_message;
        if (msg) {
          throw new Error(`KopoKopo: ${msg}`);
        }
        const callbackUrl = KOPOKOPO_CONFIG.callbackUrl || "";
        const isLocalhost = /^http:\/\/localhost/i.test(callbackUrl);
        const hint = isLocalhost
          ? " KopoKopo requires a public HTTPS callback URL. Use ngrok and set KOPOKOPO_CALLBACK_URL to your https ngrok URL in .env."
          : " Ensure KOPOKOPO_CALLBACK_URL is HTTPS and whitelisted in your KopoKopo dashboard.";
        throw new Error(
          `KopoKopo API returned 403 Forbidden. Callback URL may be invalid.${hint}`
        );
      }
      
      throw new Error(
        `KopoKopo API Error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    // Get the payment request URL from Location header
    const paymentRequestUrl = response.headers.get("Location") || response.headers.get("location");
    
    // Parse response body
    let responseData = {};
    try {
      if (responseText) {
        responseData = JSON.parse(responseText);
      }
    } catch (e) {
      console.warn("Could not parse response body as JSON:", e);
    }

    // Extract payment request ID from URL
    const paymentRequestId = paymentRequestUrl
      ? paymentRequestUrl.split("/").pop()
      : responseData.id || null;

    if (!paymentRequestId) {
      throw new Error("Payment request ID not found in response");
    }

    logInfo("✅ KopoKopo STK Push initiated successfully!");
    logInfo("   Payment Request ID:", paymentRequestId);
    logInfo("   Payment Request URL:", paymentRequestUrl);
    
    // Note about sandbox behavior
    if (KOPOKOPO_CONFIG.baseUrl.includes("sandbox")) {
      logInfo("   ⚠️  SANDBOX MODE: No actual STK push will be sent to phone.");
      logInfo("   Payment will be simulated via webhook callback.");
      logInfo("   Check webhook endpoint for payment status updates.");
    } else {
      logInfo("   📱 PRODUCTION MODE: STK push should appear on phone shortly.");
    }

    // Save payment log to database
    const paymentLog = await prisma.clientPaymentLog.create({
      data: {
        clientId: clientId,
        phone: paymentData.phoneNumber,
        amount: Math.round(paymentData.amount * 100), // Convert to cents
        status: "PENDING",
        paymentProvider: "KOPOKOPO",
        kopokopoPaymentRequestId: paymentRequestId,
        kopokopoPaymentRequestUrl: paymentRequestUrl,
        kopokopoTillNumber: KOPOKOPO_CONFIG.tillNumber,
        kopokopoCallbackUrl: KOPOKOPO_CONFIG.callbackUrl,
        kopokopoReference: paymentData.metadata?.reference || `WALLET_TOPUP_${Date.now()}`,
        kopokopoMetadata: paymentData.metadata || {},
        rawPayload: responseData,
      },
    });

    logInfo("✅ Payment log saved to database. ID:", paymentLog.id);

    return {
      success: true,
      paymentRequestId,
      paymentRequestUrl,
      paymentLogId: paymentLog.id,
      message: "STK Push initiated successfully. Please check your phone.",
    };
  } catch (error) {
    console.error("KopoKopo STK Push Error:", error);
    throw new Error(`Failed to initiate STK Push: ${error.message}`);
  }
};

/**
 * Process webhook callback from KopoKopo
 * @param {Object} webhookData - Webhook payload from KopoKopo
 * @returns {Promise<Object>} Processing result
 */
export const processKopokopoWebhook = async (webhookData) => {
  try {
    const { data } = webhookData;
    const { attributes } = data;
    const { event, status } = attributes;

    // Find payment log by KopoKopo payment request ID
    const paymentRequestId = data.id;
    const paymentLog = await prisma.clientPaymentLog.findFirst({
      where: {
        kopokopoPaymentRequestId: paymentRequestId,
      },
      include: {
        client: true,
      },
    });

    if (!paymentLog) {
      console.error(`Payment log not found for KopoKopo request ID: ${paymentRequestId}`);
      return {
        success: false,
        message: "Payment log not found",
      };
    }

    // Update payment log with webhook data
    const updateData = {
      rawPayload: webhookData,
      updatedAt: new Date(),
    };

    if (status === "Success" && event.resource) {
      const resource = event.resource;
      updateData.status = "SUCCESS";
      updateData.receipt = resource.reference || resource.id;
      updateData.amount = Math.round(parseFloat(resource.amount) * 100); // Convert to cents

      // Update wallet balance
      await updateClientWallet(paymentLog.clientId, updateData.amount, paymentLog.id);
    } else if (status === "Failed") {
      updateData.status = "FAILED";
    }

    // Update payment log
    await prisma.clientPaymentLog.update({
      where: { id: paymentLog.id },
      data: updateData,
    });

    return {
      success: true,
      paymentLogId: paymentLog.id,
      status: updateData.status,
      message: `Payment ${updateData.status.toLowerCase()}`,
    };
  } catch (error) {
    console.error("KopoKopo Webhook Processing Error:", error);
    throw new Error(`Failed to process webhook: ${error.message}`);
  }
};

/**
 * Update client wallet balance after successful payment
 * @param {string} clientId - Client user ID
 * @param {number} amount - Amount in cents
 * @param {string} paymentLogId - Payment log ID
 */
const updateClientWallet = async (clientId, amount, paymentLogId) => {
  try {
    // Convert amount from cents to KES
    const amountInKES = amount / 100;
    
    // Generate reference
    const reference = `KOPOKOPO_${Date.now()}`;

    // Use the clientAddFunds service to deposit
    const result = await depositToWallet(
      clientId,
      amountInKES,
      paymentLogId,
      reference
    );

    return result.wallet;
  } catch (error) {
    console.error("Wallet Update Error:", error);
    throw new Error(`Failed to update wallet: ${error.message}`);
  }
};

/**
 * Get client wallet balance
 * @param {string} clientId - Client user ID
 * @returns {Promise<Object>} Wallet data
 */
export const getClientWalletBalance = async (clientId) => {
  try {
    // Use the clientAddFunds service
    return await getWalletBalance(clientId);
  } catch (error) {
    console.error("Get Wallet Balance Error:", error);
    throw new Error(`Failed to get wallet balance: ${error.message}`);
  }
};

/**
 * Get payment status by payment request ID and update wallet if payment succeeded
 * @param {string} paymentRequestId - KopoKopo payment request ID
 * @returns {Promise<Object>} Payment status
 */
export const getKopokopoPaymentStatus = async (paymentRequestId) => {
  try {
    const accessToken = await getKopokopoAccessToken();

    const response = await fetch(
      `${KOPOKOPO_CONFIG.baseUrl}/api/v1/incoming_payments/${paymentRequestId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to get payment status: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    logInfo("📊 Payment Status Check:", {
      paymentRequestId,
      status: data.data?.attributes?.status,
      hasEvent: !!data.data?.attributes?.event,
      hasResource: !!data.data?.attributes?.event?.resource,
    });
    
    // Check if payment succeeded and update wallet if needed
    if (data.data?.attributes?.status === "Success") {
      logInfo("✅ Payment status is Success, updating wallet...");
      const updateResult = await checkAndUpdateWalletFromPaymentStatus(paymentRequestId, data);
      logInfo("💰 Wallet update result:", updateResult);
    } else {
      logInfo(`⏳ Payment status: ${data.data?.attributes?.status || "Unknown"}`);
    }
    
    return data;
  } catch (error) {
    console.error("Get Payment Status Error:", error);
    throw new Error(`Failed to get payment status: ${error.message}`);
  }
};

/**
 * Check payment status and update wallet if payment succeeded
 * This is useful for sandbox where webhooks might not arrive
 * @param {string} paymentRequestId - KopoKopo payment request ID
 * @param {Object} statusData - Payment status data from KopoKopo (optional)
 * @returns {Promise<Object>} Update result
 */
const checkAndUpdateWalletFromPaymentStatus = async (paymentRequestId, statusData = null) => {
  try {
    // Find payment log
    const paymentLog = await prisma.clientPaymentLog.findFirst({
      where: {
        kopokopoPaymentRequestId: paymentRequestId,
      },
      include: {
        client: true,
      },
    });

    if (!paymentLog) {
      logInfo(`Payment log not found for request ID: ${paymentRequestId}`);
      return { updated: false, reason: "Payment log not found" };
    }

    // If payment log is already SUCCESS, skip
    if (paymentLog.status === "SUCCESS") {
      logInfo(`Payment log ${paymentLog.id} already processed`);
      return { updated: false, reason: "Already processed" };
    }

    // Get status data if not provided
    if (!statusData) {
      const accessToken = await getKopokopoAccessToken();
      const response = await fetch(
        `${KOPOKOPO_CONFIG.baseUrl}/api/v1/incoming_payments/${paymentRequestId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch payment status: ${response.status}`);
      }

      statusData = await response.json();
    }

    const { attributes } = statusData.data || {};
    const { status, event } = attributes || {};

    logInfo("🔍 Checking payment status for wallet update:", {
      paymentLogId: paymentLog.id,
      currentStatus: paymentLog.status,
      kopokopoStatus: status,
      hasEvent: !!event,
      hasResource: !!event?.resource,
    });

    // Update payment log and wallet if payment succeeded
    if (status === "Success" && event?.resource) {
      const resource = event.resource;
      const amountInCents = Math.round(parseFloat(resource.amount) * 100);
      
      logInfo("💵 Processing successful payment:", {
        amount: amountInCents / 100,
        clientId: paymentLog.clientId,
        paymentLogId: paymentLog.id,
      });

      // Update payment log
      await prisma.clientPaymentLog.update({
        where: { id: paymentLog.id },
        data: {
          status: "SUCCESS",
          receipt: resource.reference || resource.id,
          amount: amountInCents,
          rawPayload: statusData,
          updatedAt: new Date(),
        },
      });

      // Update wallet balance
      await updateClientWallet(paymentLog.clientId, amountInCents, paymentLog.id);

      logInfo(`✅ Wallet updated for client ${paymentLog.clientId}: +${amountInCents / 100} KES`);
      
      return {
        updated: true,
        amount: amountInCents / 100,
        clientId: paymentLog.clientId,
      };
    } else if (status === "Failed") {
      // Update payment log to failed
      await prisma.clientPaymentLog.update({
        where: { id: paymentLog.id },
        data: {
          status: "FAILED",
          rawPayload: statusData,
          updatedAt: new Date(),
        },
      });

      return { updated: false, reason: "Payment failed" };
    }

    return { updated: false, reason: "Payment still pending" };
  } catch (error) {
    console.error("Check and Update Wallet Error:", error);
    throw new Error(`Failed to check and update wallet: ${error.message}`);
  }
};

/**
 * Process pending payments and update wallets
 * Useful for checking pending payments that might have succeeded
 * @param {string} clientId - Optional client ID to check only their payments
 * @returns {Promise<Object>} Processing results
 */
export const processPendingPayments = async (clientId = null) => {
  try {
    // Find pending payment logs
    const whereClause = {
      status: "PENDING",
      paymentProvider: "KOPOKOPO",
      kopokopoPaymentRequestId: { not: null },
    };

    if (clientId) {
      whereClause.clientId = clientId;
    }

    const pendingPayments = await prisma.clientPaymentLog.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 50, // Process up to 50 at a time
    });

    logInfo(`Found ${pendingPayments.length} pending payments to check`);

    const results = {
      checked: 0,
      updated: 0,
      failed: 0,
      stillPending: 0,
    };

    for (const payment of pendingPayments) {
      try {
        results.checked++;
        const result = await checkAndUpdateWalletFromPaymentStatus(
          payment.kopokopoPaymentRequestId
        );

        if (result.updated) {
          results.updated++;
        } else if (result.reason === "Payment failed") {
          results.failed++;
        } else {
          results.stillPending++;
        }
      } catch (error) {
        console.error(`Error processing payment ${payment.id}:`, error);
        results.failed++;
      }
    }

    logInfo("Pending payments processing results:", results);
    return results;
  } catch (error) {
    console.error("Process Pending Payments Error:", error);
    throw new Error(`Failed to process pending payments: ${error.message}`);
  }
};

// ==================== FUNDI WALLET FUNCTIONS ====================

/**
 * Initiate STK Push payment request to KopoKopo for Fundi wallet
 * @param {Object} paymentData - Payment data
 * @param {string} fundiId - Fundi user ID
 * @returns {Promise<Object>} Payment request response
 */
export const initiateKopokopoStkPushForFundi = async (paymentData, fundiId) => {
  try {
    // Validate configuration
    if (!KOPOKOPO_CONFIG.clientId || !KOPOKOPO_CONFIG.clientSecret) {
      throw new Error("KopoKopo credentials not configured. Please set KOPOKOPO_CLIENT_ID and KOPOKOPO_CLIENT_SECRET in your .env file.");
    }

    if (!KOPOKOPO_CONFIG.tillNumber) {
      throw new Error("KopoKopo till number not configured. Please set KOPOKOPO_TILL_NUMBER in your .env file.");
    }

    // Use fundi-specific callback URL
    const fundiCallbackUrl = process.env.KOPOKOPO_FUNDI_CALLBACK_URL || 
      "http://localhost:5000/api/fundi/wallet/kopokopo/webhook";

    // Get access token
    const accessToken = await getKopokopoAccessToken();
    
    if (!accessToken) {
      throw new Error("Failed to obtain access token from KopoKopo");
    }

    // Prepare STK Push request payload according to KopoKopo API format
    // KopoKopo expects: subscriber object, amount object, and _links for callback
    const stkPushPayload = {
      payment_channel: paymentData.paymentChannel || "M-PESA STK Push",
      till_number: KOPOKOPO_CONFIG.tillNumber,
      subscriber: {
        first_name: paymentData.firstName,
        last_name: paymentData.lastName,
        phone_number: paymentData.phoneNumber,
        ...(paymentData.email && { email: paymentData.email }),
      },
      amount: {
        currency: paymentData.currency || "KES",
        value: paymentData.amount.toString(), // Amount as string
      },
      metadata: {
        fundi_id: fundiId,
        reference: paymentData.metadata?.reference || `FUNDI_WALLET_TOPUP_${Date.now()}`,
        notes: paymentData.metadata?.notes || `Fundi wallet top-up of KES ${paymentData.amount}`,
      },
      _links: {
        callback_url: fundiCallbackUrl,
      },
    };

    // Log request details (can be removed in production or made conditional)
    if (process.env.NODE_ENV !== "production") {
      logInfo("📤 Initiating KopoKopo STK Push for Fundi...");
      logInfo("   Amount: KES", paymentData.amount);
      logInfo("   Phone:", paymentData.phoneNumber);
    }

    // Make STK Push request
    const response = await fetch(
      `${KOPOKOPO_CONFIG.baseUrl}/api/v1/incoming_payments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(stkPushPayload),
      }
    );

    // Get response text first to see what we're dealing with
    const responseText = await response.text();
    
    // Log response details only in development
    if (process.env.NODE_ENV !== "production") {
      logInfo("📥 KopoKopo API Response Status (Fundi):", response.status);
    }

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText || "Unknown error" };
      }
      
      console.error("KopoKopo API Error Details (Fundi):", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestPayload: stkPushPayload,
      });
      
      if (response.status === 403) {
        const msg = errorData.error_message || errorData.error?.error_message;
        if (msg) {
          throw new Error(`KopoKopo: ${msg}`);
        }
        const callbackUrl = fundiCallbackUrl || "";
        const isLocalhost = /^http:\/\/localhost/i.test(callbackUrl);
        const hint = isLocalhost
          ? " KopoKopo requires a public HTTPS callback URL. Use ngrok and set KOPOKOPO_FUNDI_CALLBACK_URL to your https ngrok URL in .env."
          : " Ensure KOPOKOPO_FUNDI_CALLBACK_URL is HTTPS and whitelisted in your KopoKopo dashboard.";
        throw new Error(
          `KopoKopo API returned 403 Forbidden. Callback URL may be invalid.${hint}`
        );
      }
      
      throw new Error(
        `KopoKopo API Error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    // Get the payment request URL from Location header
    const paymentRequestUrl = response.headers.get("Location") || response.headers.get("location");
    
    // Parse response body (may be empty for 201 Created)
    let responseData = {};
    try {
      if (responseText) {
        responseData = JSON.parse(responseText);
      }
    } catch (e) {
      console.warn("Could not parse response body as JSON (Fundi):", e);
      // This is normal - KopoKopo may return empty body with just Location header
    }

    // Extract payment request ID from URL
    const paymentRequestId = paymentRequestUrl
      ? paymentRequestUrl.split("/").pop()
      : responseData.id || null;

    if (!paymentRequestId) {
      throw new Error("Payment request ID not found in response");
    }

    logInfo("✅ KopoKopo STK Push initiated successfully for Fundi!");
    logInfo("   Payment Request ID:", paymentRequestId);
    logInfo("   Payment Request URL:", paymentRequestUrl);
    
    // Note about sandbox behavior
    if (KOPOKOPO_CONFIG.baseUrl.includes("sandbox")) {
      logInfo("   ⚠️  SANDBOX MODE: No actual STK push will be sent to phone.");
      logInfo("   Payment will be simulated via webhook callback.");
      logInfo("   Check webhook endpoint for payment status updates.");
    } else {
      logInfo("   📱 PRODUCTION MODE: STK push should appear on phone shortly.");
    }

    // Save payment log to database (PaymentLog for fundi)
    const paymentLog = await prisma.paymentLog.create({
      data: {
        fundiId: fundiId,
        phone: paymentData.phoneNumber,
        amount: Math.round(paymentData.amount * 100), // Convert to cents
        status: "PENDING",
        paymentProvider: "KOPOKOPO",
        kopokopoPaymentRequestId: paymentRequestId,
        kopokopoPaymentRequestUrl: paymentRequestUrl,
        kopokopoTillNumber: KOPOKOPO_CONFIG.tillNumber,
        kopokopoCallbackUrl: fundiCallbackUrl,
        kopokopoReference: paymentData.metadata?.reference || `FUNDI_WALLET_TOPUP_${Date.now()}`,
        kopokopoMetadata: paymentData.metadata || {},
        rawPayload: responseData,
      },
    });

    logInfo("✅ Fundi payment log saved to database. ID:", paymentLog.id);

    return {
      success: true,
      paymentRequestId,
      paymentRequestUrl,
      paymentLogId: paymentLog.id,
      message: "STK Push initiated successfully. Please check your phone.",
    };
  } catch (error) {
    console.error("KopoKopo STK Push Error (Fundi):", error);
    throw new Error(`Failed to initiate STK Push: ${error.message}`);
  }
};

/**
 * Process webhook callback from KopoKopo for Fundi wallet
 * @param {Object} webhookData - Webhook payload from KopoKopo
 * @returns {Promise<Object>} Processing result
 */
export const processKopokopoWebhookForFundi = async (webhookData) => {
  try {
    const { data } = webhookData;
    const { attributes } = data;
    const { event, status } = attributes;

    // Find payment log by KopoKopo payment request ID
    const paymentRequestId = data.id;
    const paymentLog = await prisma.paymentLog.findFirst({
      where: {
        kopokopoPaymentRequestId: paymentRequestId,
      },
      include: {
        fundi: true,
      },
    });

    if (!paymentLog) {
      console.error(`Fundi payment log not found for KopoKopo request ID: ${paymentRequestId}`);
      return {
        success: false,
        message: "Payment log not found",
      };
    }

    // Update payment log with webhook data
    const updateData = {
      rawPayload: webhookData,
      updatedAt: new Date(),
    };

    if (status === "Success" && event.resource) {
      const resource = event.resource;
      updateData.status = "SUCCESS";
      updateData.receipt = resource.reference || resource.id;
      updateData.amount = Math.round(parseFloat(resource.amount) * 100); // Convert to cents

      // Update fundi wallet balance
      if (paymentLog.fundiId) {
        await updateFundiWallet(paymentLog.fundiId, updateData.amount, paymentLog.id);
      }
    } else if (status === "Failed") {
      updateData.status = "FAILED";
    }

    // Update payment log
    await prisma.paymentLog.update({
      where: { id: paymentLog.id },
      data: updateData,
    });

    return {
      success: true,
      paymentLogId: paymentLog.id,
      status: updateData.status,
      message: `Payment ${updateData.status.toLowerCase()}`,
    };
  } catch (error) {
    console.error("KopoKopo Webhook Processing Error (Fundi):", error);
    throw new Error(`Failed to process webhook: ${error.message}`);
  }
};

/**
 * Update fundi wallet balance after successful payment
 * @param {string} fundiId - Fundi user ID
 * @param {number} amount - Amount in cents
 * @param {string} paymentLogId - Payment log ID
 */
const updateFundiWallet = async (fundiId, amount, paymentLogId) => {
  try {
    // Convert amount from cents to KES
    const amountInKES = amount / 100;
    
    // Generate reference
    const reference = `KOPOKOPO_FUNDI_${Date.now()}`;

    // Use the fundiAddFunds service to deposit
    const result = await depositToFundiWallet(
      fundiId,
      amountInKES,
      paymentLogId,
      reference
    );

    return result.wallet;
  } catch (error) {
    console.error("Fundi Wallet Update Error:", error);
    throw new Error(`Failed to update fundi wallet: ${error.message}`);
  }
};

/**
 * Get fundi wallet balance
 * @param {string} fundiId - Fundi user ID
 * @returns {Promise<Object>} Wallet data
 */
export const getFundiWalletBalanceFromService = async (fundiId) => {
  try {
    return await getFundiWalletBalance(fundiId);
  } catch (error) {
    console.error("Get Fundi Wallet Balance Error:", error);
    throw new Error(`Failed to get fundi wallet balance: ${error.message}`);
  }
};

/**
 * Get payment status by payment request ID for Fundi and update wallet if payment succeeded
 * @param {string} paymentRequestId - KopoKopo payment request ID
 * @returns {Promise<Object>} Payment status
 */
export const getKopokopoPaymentStatusForFundi = async (paymentRequestId) => {
  try {
    const accessToken = await getKopokopoAccessToken();

    const response = await fetch(
      `${KOPOKOPO_CONFIG.baseUrl}/api/v1/incoming_payments/${paymentRequestId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to get payment status: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    // Check if payment succeeded and update wallet if needed
    if (data.data?.attributes?.status === "Success") {
      await checkAndUpdateFundiWalletFromPaymentStatus(paymentRequestId);
    }

    return data;
  } catch (error) {
    console.error("Get Payment Status Error (Fundi):", error);
    throw new Error(`Failed to get payment status: ${error.message}`);
  }
};

/**
 * Check payment status from KopoKopo and update fundi wallet if payment succeeded
 * @param {string} paymentRequestId - KopoKopo payment request ID
 * @returns {Promise<Object>} Update result
 */
export const checkAndUpdateFundiWalletFromPaymentStatus = async (paymentRequestId) => {
  try {
    // Find payment log
    const paymentLog = await prisma.paymentLog.findFirst({
      where: {
        kopokopoPaymentRequestId: paymentRequestId,
      },
      include: {
        fundi: true,
      },
    });

    if (!paymentLog) {
      return {
        updated: false,
        reason: "Payment log not found",
      };
    }

    // If already processed, skip
    if (paymentLog.status === "SUCCESS") {
      return {
        updated: false,
        reason: "Payment already processed",
      };
    }

    // Get access token and fetch payment status
    const accessToken = await getKopokopoAccessToken();
    const response = await fetch(
      `${KOPOKOPO_CONFIG.baseUrl}/api/v1/incoming_payments/${paymentRequestId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get payment status: ${response.status}`);
    }

    const statusData = await response.json();

    if (statusData.data?.attributes?.status === "Success" && statusData.data?.attributes?.event?.resource) {
      const resource = statusData.data.attributes.event.resource;
      const amount = Math.round(parseFloat(resource.amount) * 100); // Convert to cents

      // Update payment log
      await prisma.paymentLog.update({
        where: { id: paymentLog.id },
        data: {
          status: "SUCCESS",
          receipt: resource.reference || resource.id,
          amount: amount,
          rawPayload: statusData,
        },
      });

      // Update fundi wallet
      if (paymentLog.fundiId) {
        await updateFundiWallet(paymentLog.fundiId, amount, paymentLog.id);
      }

      return {
        updated: true,
        paymentLogId: paymentLog.id,
      };
    } else if (statusData.data?.attributes?.status === "Failed") {
      await prisma.paymentLog.update({
        where: { id: paymentLog.id },
        data: {
          status: "FAILED",
          rawPayload: statusData,
        },
      });

      return {
        updated: false,
        reason: "Payment failed",
      };
    }

    return {
      updated: false,
      reason: "Payment still pending",
    };
  } catch (error) {
    console.error("Check and Update Fundi Wallet Error:", error);
    throw new Error(`Failed to check and update wallet: ${error.message}`);
  }
};

/**
 * Process pending fundi payments
 * @param {string} fundiId - Optional fundi ID to filter by
 * @returns {Promise<Object>} Processing results
 */
export const processPendingFundiPayments = async (fundiId = null) => {
  try {
    const whereClause = {
      status: "PENDING",
      paymentProvider: "KOPOKOPO",
      kopokopoPaymentRequestId: { not: null },
    };

    if (fundiId) {
      whereClause.fundiId = fundiId;
    }

    const pendingPayments = await prisma.paymentLog.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 50, // Process up to 50 at a time
    });

    logInfo(`Found ${pendingPayments.length} pending fundi payments to check`);

    const results = {
      checked: 0,
      updated: 0,
      failed: 0,
      stillPending: 0,
    };

    for (const payment of pendingPayments) {
      try {
        results.checked++;
        const result = await checkAndUpdateFundiWalletFromPaymentStatus(
          payment.kopokopoPaymentRequestId
        );

        if (result.updated) {
          results.updated++;
        } else if (result.reason === "Payment failed") {
          results.failed++;
        } else {
          results.stillPending++;
        }
      } catch (error) {
        console.error(`Error processing fundi payment ${payment.id}:`, error);
        results.failed++;
      }
    }

    logInfo("Pending fundi payments processing results:", results);
    return results;
  } catch (error) {
    console.error("Process Pending Fundi Payments Error:", error);
    throw new Error(`Failed to process pending fundi payments: ${error.message}`);
  }
};
