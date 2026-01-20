import { PrismaClient } from "@prisma/client";
import { withdrawFromWallet, getWalletBalance } from "./fundiAddFunds.js";

const prisma = new PrismaClient();

/**
 * Subscription Service
 * Handles fundi subscription operations
 */

/**
 * Subscribe to premium plan
 * Deducts 200 KES from wallet and activates premium subscription
 * @param {string} fundiId - Fundi user ID
 * @returns {Promise<Object>} Subscription result
 */
export const subscribeToPremium = async (fundiId) => {
  try {
    const PREMIUM_PRICE = 200; // KES per month

    // Check wallet balance
    const walletData = await getWalletBalance(fundiId);
    if (walletData.balance < PREMIUM_PRICE) {
      throw new Error("Insufficient wallet balance. Please add funds to your wallet.");
    }

    // Get current fundi data
    const fundi = await prisma.fundi_User.findUnique({
      where: { id: fundiId },
    });

    if (!fundi) {
      throw new Error("Fundi not found");
    }

    // Calculate subscription dates
    const now = new Date();
    const startDate = fundi.planEndDate && fundi.planEndDate > now 
      ? fundi.planEndDate // Continue from previous subscription
      : now; // Start new subscription
    
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Add 1 month

    // Withdraw from wallet
    const withdrawalResult = await withdrawFromWallet(
      fundiId,
      PREMIUM_PRICE,
      `PREMIUM_SUBSCRIPTION_${Date.now()}`
    );

    // Update fundi subscription
    const updatedFundi = await prisma.fundi_User.update({
      where: { id: fundiId },
      data: {
        subscriptionPlan: "PREMIUM",
        subscriptionStatus: "ACTIVE",
        planStartDate: startDate,
        planEndDate: endDate,
      },
    });

    // Create subscription record
    const subscription = await prisma.subscription.create({
      data: {
        fundiId: fundiId,
        plan: "PREMIUM",
        startDate: startDate,
        endDate: endDate,
        status: "ACTIVE",
        receipt: withdrawalResult.transaction.reference,
      },
    });

    // Calculate total amount paid (sum of all successful premium subscriptions)
    const totalPaid = await calculateTotalPaid(fundiId);

    return {
      success: true,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status,
      },
      fundi: {
        subscriptionPlan: updatedFundi.subscriptionPlan,
        subscriptionStatus: updatedFundi.subscriptionStatus,
        planStartDate: updatedFundi.planStartDate,
        planEndDate: updatedFundi.planEndDate,
      },
      wallet: {
        balance: withdrawalResult.wallet.balance,
        previousBalance: walletData.balance,
        amountDeducted: PREMIUM_PRICE,
      },
      totalPaid: totalPaid,
      message: "Successfully subscribed to Premium plan",
    };
  } catch (error) {
    console.error("Subscribe to Premium Error:", error);
    throw new Error(`Failed to subscribe to premium: ${error.message}`);
  }
};

/**
 * Calculate total amount paid for subscriptions
 * @param {string} fundiId - Fundi user ID
 * @returns {Promise<number>} Total amount paid in KES
 */
export const calculateTotalPaid = async (fundiId) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        fundiId: fundiId,
        plan: "PREMIUM",
        status: "ACTIVE",
      },
    });

    // Each premium subscription is 200 KES
    return subscriptions.length * 200;
  } catch (error) {
    console.error("Calculate Total Paid Error:", error);
    return 0;
  }
};

/**
 * Get subscription details for a fundi
 * @param {string} fundiId - Fundi user ID
 * @returns {Promise<Object>} Subscription details
 */
export const getSubscriptionDetails = async (fundiId) => {
  try {
    const fundi = await prisma.fundi_User.findUnique({
      where: { id: fundiId },
      include: {
        subscriptions: {
          where: {
            plan: "PREMIUM",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10, // Last 10 subscriptions
        },
      },
    });

    if (!fundi) {
      throw new Error("Fundi not found");
    }

    const totalPaid = await calculateTotalPaid(fundiId);
    const walletData = await getWalletBalance(fundiId);

    // Get current active subscription
    const activeSubscription = fundi.subscriptions.find(
      (sub) => sub.status === "ACTIVE" && sub.endDate > new Date()
    );

    return {
      currentPlan: fundi.subscriptionPlan,
      subscriptionStatus: fundi.subscriptionStatus,
      planStartDate: fundi.planStartDate,
      planEndDate: fundi.planEndDate,
      nextBillingDate: fundi.planEndDate || null,
      totalPaid: totalPaid,
      walletBalance: walletData.balance,
      activeSubscription: activeSubscription || null,
      subscriptionHistory: fundi.subscriptions,
    };
  } catch (error) {
    console.error("Get Subscription Details Error:", error);
    throw new Error(`Failed to get subscription details: ${error.message}`);
  }
};

/**
 * Downgrade expired premium subscriptions to free plan
 * This is called by the cron job
 * @returns {Promise<Object>} Downgrade results
 */
export const downgradeExpiredSubscriptions = async () => {
  try {
    const now = new Date();

    // Find all fundis with expired premium subscriptions
    const expiredFundis = await prisma.fundi_User.findMany({
      where: {
        subscriptionPlan: "PREMIUM",
        planEndDate: {
          lte: now, // Plan end date has passed
        },
      },
    });

    if (expiredFundis.length === 0) {
      return {
        downgraded: 0,
        message: "No expired subscriptions to downgrade",
      };
    }

    // Update all expired subscriptions
    const updatePromises = expiredFundis.map(async (fundi) => {
      // Update fundi to free plan
      await prisma.fundi_User.update({
        where: { id: fundi.id },
        data: {
          subscriptionPlan: "FREE",
          subscriptionStatus: "EXPIRED",
        },
      });

      // Update subscription records
      await prisma.subscription.updateMany({
        where: {
          fundiId: fundi.id,
          status: "ACTIVE",
          endDate: {
            lte: now,
          },
        },
        data: {
          status: "EXPIRED",
        },
      });
    });

    await Promise.all(updatePromises);

    console.log(`✅ Downgraded ${expiredFundis.length} expired premium subscription(s) to free plan`);

    return {
      downgraded: expiredFundis.length,
      fundis: expiredFundis.map((f) => ({
        id: f.id,
        email: f.email,
        phone: f.phone,
      })),
      message: `Successfully downgraded ${expiredFundis.length} subscription(s)`,
    };
  } catch (error) {
    console.error("Downgrade Expired Subscriptions Error:", error);
    throw new Error(`Failed to downgrade expired subscriptions: ${error.message}`);
  }
};
