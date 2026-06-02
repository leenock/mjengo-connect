import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Counts job reports that need admin attention (content moderation queue).
 */
export const getModerationCounts = async () => {
  const [pending, underReview, total] = await Promise.all([
    prisma.jobReport.count({ where: { status: "PENDING" } }),
    prisma.jobReport.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.jobReport.count(),
  ]);

  return {
    pending,
    underReview,
    open: pending + underReview,
    total,
  };
};
