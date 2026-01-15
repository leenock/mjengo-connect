import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Client Wallet Service
 * Handles all wallet-related operations for clients
 */

/**
 * Get or create client wallet
 * @param {string} clientId - Client user ID
 * @returns {Promise<Object>} Wallet object
 */
export const getOrCreateWallet = async (clientId) => {
  try {
    let wallet = await prisma.clientWallet.findUnique({
      where: { clientId },
      include: {
        client: {
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
      wallet = await prisma.clientWallet.create({
        data: {
          clientId,
          balance: 0,
          currency: "KES",
        },
        include: {
          client: {
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
    console.error("Get or Create Wallet Error:", error);
    throw new Error(`Failed to get or create wallet: ${error.message}`);
  }
};

/**
 * Get client wallet balance
 * @param {string} clientId - Client user ID
 * @returns {Promise<Object>} Wallet balance data
 */
export const getWalletBalance = async (clientId) => {
  try {
    const wallet = await getOrCreateWallet(clientId);

    return {
      balance: wallet.balance / 100, // Convert from cents to KES
      currency: wallet.currency,
      walletId: wallet.id,
      clientId: wallet.clientId,
    };
  } catch (error) {
    console.error("Get Wallet Balance Error:", error);
    throw new Error(`Failed to get wallet balance: ${error.message}`);
  }
};

/**
 * Update wallet balance (deposit funds)
 * @param {string} clientId - Client user ID
 * @param {number} amount - Amount in KES (will be converted to cents)
 * @param {string} paymentLogId - Payment log ID (optional)
 * @param {string} reference - Transaction reference (optional)
 * @returns {Promise<Object>} Updated wallet and transaction
 */
export const depositToWallet = async (
  clientId,
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
    const wallet = await getOrCreateWallet(clientId);

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);

    // Update wallet balance
    const updatedWallet = await prisma.clientWallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: amountInCents,
        },
      },
    });

    // Create wallet transaction record
    const transaction = await prisma.clientWalletTransaction.create({
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
    console.error("Deposit to Wallet Error:", error);
    throw new Error(`Failed to deposit to wallet: ${error.message}`);
  }
};

/**
 * Withdraw from wallet
 * @param {string} clientId - Client user ID
 * @param {number} amount - Amount in KES (will be converted to cents)
 * @param {string} reference - Transaction reference (optional)
 * @returns {Promise<Object>} Updated wallet and transaction
 */
export const withdrawFromWallet = async (clientId, amount, reference = null) => {
  try {
    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Get wallet
    const wallet = await getOrCreateWallet(clientId);

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);

    // Check if sufficient balance
    if (wallet.balance < amountInCents) {
      throw new Error("Insufficient wallet balance");
    }

    // Update wallet balance
    const updatedWallet = await prisma.clientWallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          decrement: amountInCents,
        },
      },
    });

    // Create wallet transaction record
    const transaction = await prisma.clientWalletTransaction.create({
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
    console.error("Withdraw from Wallet Error:", error);
    throw new Error(`Failed to withdraw from wallet: ${error.message}`);
  }
};

/**
 * Get wallet transactions history
 * @param {string} clientId - Client user ID
 * @param {number} limit - Number of transactions to return (default: 50)
 * @param {number} offset - Number of transactions to skip (default: 0)
 * @returns {Promise<Object>} Transactions list and pagination info
 */
export const getWalletTransactions = async (
  clientId,
  limit = 50,
  offset = 0
) => {
  try {
    const wallet = await getOrCreateWallet(clientId);

    const [transactions, total] = await Promise.all([
      prisma.clientWalletTransaction.findMany({
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
      prisma.clientWalletTransaction.count({
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
    console.error("Get Wallet Transactions Error:", error);
    throw new Error(`Failed to get wallet transactions: ${error.message}`);
  }
};

/**
 * Get wallet details with recent transactions
 * @param {string} clientId - Client user ID
 * @returns {Promise<Object>} Wallet details with summary
 */
export const getWalletDetails = async (clientId) => {
  try {
    const wallet = await getOrCreateWallet(clientId);

    // Get recent transactions (last 10)
    const recentTransactions = await prisma.clientWalletTransaction.findMany({
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
      prisma.clientWalletTransaction.aggregate({
        where: {
          walletId: wallet.id,
          type: "DEPOSIT",
          status: "SUCCESS",
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.clientWalletTransaction.aggregate({
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
        clientId: wallet.clientId,
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
    console.error("Get Wallet Details Error:", error);
    throw new Error(`Failed to get wallet details: ${error.message}`);
  }
};
