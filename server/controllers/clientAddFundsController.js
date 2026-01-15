import {
  getWalletBalance,
  depositToWallet,
  withdrawFromWallet,
  getWalletTransactions,
  getWalletDetails,
} from "../services/clientAddFunds.js";

/**
 * Get client wallet balance
 * GET /api/client/wallet/balance
 */
export const getBalance = async (req, res) => {
  try {
    const clientId = req.user.id; // From auth middleware

    const walletData = await getWalletBalance(clientId);

    res.status(200).json({
      success: true,
      data: walletData,
    });
  } catch (error) {
    console.error("Get Balance Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get wallet balance",
    });
  }
};

/**
 * Deposit funds to wallet
 * POST /api/client/wallet/deposit
 */
export const depositFunds = async (req, res) => {
  try {
    const clientId = req.user.id; // From auth middleware
    const { amount, paymentLogId, reference } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Deposit to wallet
    const result = await depositToWallet(clientId, amount, paymentLogId, reference);

    res.status(200).json({
      success: true,
      message: "Funds deposited successfully",
      data: result,
    });
  } catch (error) {
    console.error("Deposit Funds Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to deposit funds",
    });
  }
};

/**
 * Withdraw funds from wallet
 * POST /api/client/wallet/withdraw
 */
export const withdrawFunds = async (req, res) => {
  try {
    const clientId = req.user.id; // From auth middleware
    const { amount, reference } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Withdraw from wallet
    const result = await withdrawFromWallet(clientId, amount, reference);

    res.status(200).json({
      success: true,
      message: "Funds withdrawn successfully",
      data: result,
    });
  } catch (error) {
    console.error("Withdraw Funds Controller Error:", error);
    
    // Handle insufficient balance error
    if (error.message.includes("Insufficient")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to withdraw funds",
    });
  }
};

/**
 * Get wallet transactions history
 * GET /api/client/wallet/transactions
 */
export const getTransactions = async (req, res) => {
  try {
    const clientId = req.user.id; // From auth middleware
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const result = await getWalletTransactions(clientId, limit, offset);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get Transactions Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get transactions",
    });
  }
};

/**
 * Get wallet details with statistics
 * GET /api/client/wallet/details
 */
export const getDetails = async (req, res) => {
  try {
    const clientId = req.user.id; // From auth middleware

    const walletDetails = await getWalletDetails(clientId);

    res.status(200).json({
      success: true,
      data: walletDetails,
    });
  } catch (error) {
    console.error("Get Wallet Details Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get wallet details",
    });
  }
};
