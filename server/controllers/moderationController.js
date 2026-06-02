import { getModerationCounts } from "../services/moderationService.js";
import { serverLog } from "../utils/appLogger.js";

export const getModerationCountsController = async (_req, res) => {
  try {
    const counts = await getModerationCounts();
    res.status(200).json({ success: true, counts });
  } catch (error) {
    serverLog.error("Moderation", "Failed to fetch counts", error);
    res.status(500).json({ success: false, message: "Failed to fetch moderation counts" });
  }
};
