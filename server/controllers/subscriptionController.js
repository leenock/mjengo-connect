import {
  subscribeToPremium,
  getSubscriptionDetails,
  downgradeExpiredSubscriptions,
} from "../services/subscriptionService.js";

/**
 * Subscribe to premium plan
 * POST /api/fundi/subscription/premium
 */
export const subscribeToPremiumController = async (req, res) => {
  try {
    const fundiId = req.user.id; // From auth middleware

    const result = await subscribeToPremium(fundiId);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.error("Subscribe to Premium Controller Error:", error);
    
    if (error.message.includes("Insufficient")) {
      return res.status(402).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to subscribe to premium",
    });
  }
};

/**
 * Get subscription details
 * GET /api/fundi/subscription/details
 */
export const getSubscriptionDetailsController = async (req, res) => {
  try {
    const fundiId = req.user.id; // From auth middleware

    const details = await getSubscriptionDetails(fundiId);

    res.status(200).json({
      success: true,
      data: details,
    });
  } catch (error) {
    console.error("Get Subscription Details Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get subscription details",
    });
  }
};

/**
 * Downgrade expired subscriptions (for cron job)
 * POST /api/fundi/subscription/downgrade-expired
 */
export const downgradeExpiredSubscriptionsController = async (req, res) => {
  try {
    const result = await downgradeExpiredSubscriptions();

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.error("Downgrade Expired Subscriptions Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to downgrade expired subscriptions",
    });
  }
};
