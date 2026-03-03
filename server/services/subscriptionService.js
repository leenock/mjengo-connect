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

const EXPIRED_STATUSES = ["EXPIRED", "TRIAL", "CANCELLED"];

/**
 * Returns true if this Premium fundi should be on Free plan: plan ended or status is Expired/Trial/Cancelled.
 */
const shouldDowngradeToFree = (fundi) => {
  if (fundi.subscriptionPlan !== "PREMIUM") return false;
  const status = (fundi.subscriptionStatus || "").toUpperCase();
  if (EXPIRED_STATUSES.includes(status)) return true;
  if (!fundi.planEndDate) return false;
  const now = new Date();
  const planEnd = new Date(fundi.planEndDate);
  return planEnd <= now;
};

/**
 * Downgrade a single fundi to Free with status Active when premium has expired or status is Expired/Trial/Cancelled.
 * Used when fetching subscription details so the user is updated to Free as soon as they load the page.
 * @param {Object} fundi - Fundi record from DB
 * @returns {Promise<Object|null>} Updated fundi or null if no change
 */
const downgradeFundiIfExpired = async (fundi) => {
  if (!shouldDowngradeToFree(fundi)) return null;
  const now = new Date();

  await prisma.fundi_User.update({
    where: { id: fundi.id },
    data: {
      subscriptionPlan: "FREE",
      subscriptionStatus: "ACTIVE",
    },
  });

  await prisma.subscription.updateMany({
    where: {
      fundiId: fundi.id,
      status: "ACTIVE",
      endDate: { lte: now },
    },
    data: { status: "EXPIRED" },
  });

  return {
    ...fundi,
    subscriptionPlan: "FREE",
    subscriptionStatus: "ACTIVE",
  };
};

/**
 * Get subscription details for a fundi
 * If premium has expired, downgrades the user to Free first so the UI shows Free plan immediately.
 * @param {string} fundiId - Fundi user ID
 * @returns {Promise<Object>} Subscription details
 */
export const getSubscriptionDetails = async (fundiId) => {
  try {
    let fundi = await prisma.fundi_User.findUnique({
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

    // If premium has expired, downgrade to Free now so user sees Free plan on this request
    const updated = await downgradeFundiIfExpired(fundi);
    if (updated) {
      fundi = updated;
    }

    const totalPaid = await calculateTotalPaid(fundiId);
    const walletData = await getWalletBalance(fundiId);

    // Get current active subscription
    const now = new Date();
    const activeSubscription = fundi.subscriptions.find(
      (sub) => sub.status === "ACTIVE" && sub.endDate > now
    );

    // When FREE (after cron or on-the-fly downgrade), no next billing. When PREMIUM, return planEndDate so UI can show date or "Expired"
    const nextBillingDate =
      fundi.subscriptionPlan === "PREMIUM" && fundi.planEndDate ? fundi.planEndDate : null;

    return {
      currentPlan: fundi.subscriptionPlan,
      subscriptionStatus: fundi.subscriptionStatus,
      planStartDate: fundi.planStartDate,
      planEndDate: fundi.planEndDate,
      nextBillingDate,
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
 * Downgrade expired premium subscriptions to free plan (Subscription Plan = Free, Subscription Status = Active).
 * Also catches Premium with status Expired, Trial, or Cancelled.
 * This is called by the cron job.
 * @returns {Promise<Object>} Downgrade results
 */
export const downgradeExpiredSubscriptions = async () => {
  try {
    const now = new Date();

    // Find all fundis who are Premium but should be Free: planEndDate passed OR status is EXPIRED/TRIAL/CANCELLED
    const allPremium = await prisma.fundi_User.findMany({
      where: { subscriptionPlan: "PREMIUM" },
    });
    const expiredFundis = allPremium.filter((f) => shouldDowngradeToFree(f));

    if (expiredFundis.length === 0) {
      return {
        downgraded: 0,
        message: "No expired subscriptions to downgrade",
      };
    }

    // Update all to Free plan with Active status
    const updatePromises = expiredFundis.map(async (fundi) => {
      await prisma.fundi_User.update({
        where: { id: fundi.id },
        data: {
          subscriptionPlan: "FREE",
          subscriptionStatus: "ACTIVE",
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
