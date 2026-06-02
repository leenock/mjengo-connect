import { getAllJobs, getJobById } from "../services/jobService.js";

const FREE_PLAN_JOB_LIMIT = 3;

function fundiHasPremiumAccess(user) {
  const { subscriptionPlan, subscriptionStatus } = user;
  return (
    (subscriptionPlan === "PREMIUM" && subscriptionStatus === "ACTIVE") ||
    subscriptionStatus === "TRIAL"
  );
}

function filterPaidActiveJobs(jobs) {
  return jobs.filter((job) => job.isPaid && job.status === "ACTIVE");
}

function applyFreePlanLimit(jobs) {
  return [...filterPaidActiveJobs(jobs)]
    .sort(
      (a, b) =>
        new Date(a.timePosted).getTime() - new Date(b.timePosted).getTime()
    )
    .slice(0, FREE_PLAN_JOB_LIMIT);
}

/**
 * GET /api/fundi/job-listings
 * Premium/trial: full listing. Free/expired: oldest 3 paid active jobs.
 */
export const getFundiJobListingsController = async (req, res) => {
  try {
    const { page, limit, category, location, jobType, status, isUrgent } =
      req.query;

    const filters = {};
    if (category) filters.category = category;
    if (location) filters.location = location;
    if (jobType) filters.jobType = jobType;
    if (status) filters.status = status;
    if (isUrgent !== undefined) filters.isUrgent = isUrgent === "true";

    const pagination = { page, limit };
    const result = await getAllJobs(filters, pagination);

    if (fundiHasPremiumAccess(req.user)) {
      const jobs = filterPaidActiveJobs(result.jobs);
      return res.status(200).json({ ...result, jobs, totalCount: jobs.length });
    }

    const jobs = applyFreePlanLimit(result.jobs);
    return res.status(200).json({
      ...result,
      jobs,
      totalCount: jobs.length,
      pagination: {
        ...result.pagination,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error("Get Fundi Job Listings Error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch jobs",
    });
  }
};

/**
 * GET /api/fundi/job-listings/:id
 */
export const getFundiJobListingByIdController = async (req, res) => {
  try {
    const job = await getJobById(req.params.id);

    if (job.status !== "ACTIVE" || !job.isPaid) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!fundiHasPremiumAccess(req.user)) {
      const listing = await getAllJobs({}, { page: 1, limit: 110 });
      const allowedIds = new Set(
        applyFreePlanLimit(listing.jobs).map((j) => j.id)
      );
      if (!allowedIds.has(job.id)) {
        return res.status(403).json({
          message: "Upgrade to Premium to view this job.",
          upgradeRequired: true,
        });
      }
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Get Fundi Job Listing By ID Error:", error);
    res.status(404).json({
      message: error.message || "Job not found",
    });
  }
};
