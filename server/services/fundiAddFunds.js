import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fundi Wallet Service
 * Handles all wallet-related operations for fundis
 */

/**
 * Get or create fundi wallet
 * @param {string} fundiId - Fundi user ID
 * @returns {Promise<Object>} Wallet object
 */
export const getOrCreateWallet = async (fundiId) => {
  try {
    let wallet = await prisma.fundiWallet.findUnique({
      where: { fundiId },
      include: {
        fundi: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!wallet) {
      wallet = await prisma.fundiWallet.create({
        data: {
          fundiId,
          balance: 0,
          currency: "KES",
        },
        include: {
          fundi: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });
    }

    return wallet;
  } catch (error) {
    console.error("Get or Create Fundi Wallet Error:", error);
    throw new Error(`Failed to get or create wallet: ${error.message}`);
  }
};

/**
 * Get fundi wallet balance
 * @param {string} fundiId - Fundi user ID
 * @returns {Promise<Object>} Wallet balance data
 */
export const getWalletBalance = async (fundiId) => {
  try {
    const wallet = await getOrCreateWallet(fundiId);

    return {
      balance: wallet.balance / 100, // Convert from cents to KES
      currency: wallet.currency,
      walletId: wallet.id,
      fundiId: wallet.fundiId,
    };
  } catch (error) {
    console.error("Get Fundi Wallet Balance Error:", error);
    throw new Error(`Failed to get wallet balance: ${error.message}`);
  }
};

/**
 * Update wallet balance (deposit funds)
 * @param {string} fundiId - Fundi user ID
 * @param {number} amount - Amount in KES (will be converted to cents)
 * @param {string} paymentLogId - Payment log ID (optional)
 * @param {string} reference - Transaction reference (optional)
 * @returns {Promise<Object>} Updated wallet and transaction
 */
export const depositToWallet = async (
  fundiId,
  amount,
  paymentLogId = null,
  reference = null
) => {
  try {
    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Get or create wallet
    const wallet = await getOrCreateWallet(fundiId);

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);

    // Update wallet balance
    const updatedWallet = await prisma.fundiWallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: amountInCents,
        },
      },
    });

    // Create wallet transaction record
    const transaction = await prisma.fundiWalletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "DEPOSIT",
        amount: amountInCents,
        status: "SUCCESS",
        paymentLogId: paymentLogId,
        reference: reference || `DEPOSIT_${Date.now()}`,
      },
    });

    return {
      wallet: {
        id: updatedWallet.id,
        balance: updatedWallet.balance / 100, // Convert back to KES
        currency: updatedWallet.currency,
      },
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount / 100, // Convert back to KES
        status: transaction.status,
        reference: transaction.reference,
        createdAt: transaction.createdAt,
      },
    };
  } catch (error) {
    console.error("Deposit to Fundi Wallet Error:", error);
    throw new Error(`Failed to deposit to wallet: ${error.message}`);
  }
};

/**
 * Withdraw from wallet
 * @param {string} fundiId - Fundi user ID
 * @param {number} amount - Amount in KES (will be converted to cents)
 * @param {string} reference - Transaction reference (optional)
 * @returns {Promise<Object>} Updated wallet and transaction
 */
export const withdrawFromWallet = async (fundiId, amount, reference = null) => {
  try {
    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Get wallet
    const wallet = await getOrCreateWallet(fundiId);

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);

    // Check if sufficient balance
    if (wallet.balance < amountInCents) {
      throw new Error("Insufficient wallet balance");
    }

    // Update wallet balance
    const updatedWallet = await prisma.fundiWallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          decrement: amountInCents,
        },
      },
    });

    // Create wallet transaction record
    const transaction = await prisma.fundiWalletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "WITHDRAWAL",
        amount: amountInCents,
        status: "SUCCESS",
        reference: reference || `WITHDRAWAL_${Date.now()}`,
      },
    });

    return {
      wallet: {
        id: updatedWallet.id,
        balance: updatedWallet.balance / 100, // Convert back to KES
        currency: updatedWallet.currency,
      },
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount / 100, // Convert back to KES
        status: transaction.status,
        reference: transaction.reference,
        createdAt: transaction.createdAt,
      },
    };
  } catch (error) {
    console.error("Withdraw from Fundi Wallet Error:", error);
    throw new Error(`Failed to withdraw from wallet: ${error.message}`);
  }
};

/**
 * Get wallet transactions history
 * @param {string} fundiId - Fundi user ID
 * @param {number} limit - Number of transactions to return (default: 50)
 * @param {number} offset - Number of transactions to skip (default: 0)
 * @returns {Promise<Object>} Transactions list and pagination info
 */
export const getWalletTransactions = async (
  fundiId,
  limit = 50,
  offset = 0
) => {
  try {
    const wallet = await getOrCreateWallet(fundiId);

    const [transactions, total] = await Promise.all([
      prisma.fundiWalletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          paymentLog: {
            select: {
              id: true,
              receipt: true,
              status: true,
              amount: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.fundiWalletTransaction.count({
        where: { walletId: wallet.id },
      }),
    ]);

    return {
      transactions: transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount / 100, // Convert from cents to KES
        status: tx.status,
        reference: tx.reference,
        phone: tx.phone,
        paymentLog: tx.paymentLog,
        createdAt: tx.createdAt,
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  } catch (error) {
    console.error("Get Fundi Wallet Transactions Error:", error);
    throw new Error(`Failed to get wallet transactions: ${error.message}`);
  }
};

/**
 * Get wallet details with recent transactions
 * @param {string} fundiId - Fundi user ID
 * @returns {Promise<Object>} Wallet details with summary
 */
export const getWalletDetails = async (fundiId) => {
  try {
    const wallet = await getOrCreateWallet(fundiId);

    // Get recent transactions (last 10)
    const recentTransactions = await prisma.fundiWalletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        paymentLog: {
          select: {
            id: true,
            receipt: true,
            status: true,
            amount: true,
          },
        },
      },
    });

    // Calculate statistics
    const [totalDeposits, totalWithdrawals] = await Promise.all([
      prisma.fundiWalletTransaction.aggregate({
        where: {
          walletId: wallet.id,
          type: "DEPOSIT",
          status: "SUCCESS",
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.fundiWalletTransaction.aggregate({
        where: {
          walletId: wallet.id,
          type: "WITHDRAWAL",
          status: "SUCCESS",
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      wallet: {
        id: wallet.id,
        balance: wallet.balance / 100, // Convert from cents to KES
        currency: wallet.currency,
        fundiId: wallet.fundiId,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      },
      statistics: {
        totalDeposits: (totalDeposits._sum.amount || 0) / 100,
        totalWithdrawals: (totalWithdrawals._sum.amount || 0) / 100,
        currentBalance: wallet.balance / 100,
      },
      recentTransactions: recentTransactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount / 100,
        status: tx.status,
        reference: tx.reference,
        createdAt: tx.createdAt,
        paymentLog: tx.paymentLog,
      })),
    };
  } catch (error) {
    console.error("Get Fundi Wallet Details Error:", error);
    throw new Error(`Failed to get wallet details: ${error.message}`);
  }
};
