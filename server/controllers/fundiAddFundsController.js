import {
  getWalletBalance,
  depositToWallet,
  withdrawFromWallet,
  getWalletTransactions,
  getWalletDetails,
} from "../services/fundiAddFunds.js";

/**
 * Get fundi wallet balance
 * GET /api/fundi/wallet/balance
 */
export const getBalance = async (req, res) => {
  try {
    const fundiId = req.user.id; // From auth middleware

    const walletData = await getWalletBalance(fundiId);

    res.status(200).json({
      success: true,
      data: walletData,
    });
  } catch (error) {
    console.error("Get Balance Controller Error (Fundi):", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get wallet balance",
    });
  }
};

/**
 * Deposit funds to fundi wallet (manual deposit)
 * POST /api/fundi/wallet/deposit
 */
export const depositFunds = async (req, res) => {
  try {
    const fundiId = req.user.id; // From auth middleware
    const { amount, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const result = await depositToWallet(fundiId, amount, null, reference);

    res.status(200).json({
      success: true,
      message: "Funds deposited successfully",
      data: result,
    });
  } catch (error) {
    console.error("Deposit Funds Controller Error (Fundi):", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to deposit funds",
    });
  }
};

/**
 * Withdraw funds from fundi wallet
 * POST /api/fundi/wallet/withdraw
 */
export const withdrawFunds = async (req, res) => {
  try {
    const fundiId = req.user.id; // From auth middleware
    const { amount, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const result = await withdrawFromWallet(fundiId, amount, reference);

    res.status(200).json({
      success: true,
      message: "Funds withdrawn successfully",
      data: result,
    });
  } catch (error) {
    console.error("Withdraw Funds Controller Error (Fundi):", error);
    
    if (error.message.includes("Insufficient")) {
      return res.status(402).json({
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
 * GET /api/fundi/wallet/transactions
 */
export const getTransactions = async (req, res) => {
  try {
    const fundiId = req.user.id; // From auth middleware
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const result = await getWalletTransactions(fundiId, limit, offset);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get Transactions Controller Error (Fundi):", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get transactions",
    });
  }
};

/**
 * Get wallet details with statistics
 * GET /api/fundi/wallet/details
 */
export const getDetails = async (req, res) => {
  try {
    const fundiId = req.user.id; // From auth middleware

    const result = await getWalletDetails(fundiId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get Details Controller Error (Fundi):", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get wallet details",
    });
  }
};
