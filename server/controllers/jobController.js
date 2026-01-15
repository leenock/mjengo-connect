import {
  createJob,
  getAllJobs,
  getJobsByClientId,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  payForJob,
  expirePaidJobs,
} from "../services/jobService.js";

/**
 * Create a new job posting
 */
export const createJobController = async (req, res) => {
  try {
    const postedById = req.user?.id; // Assuming you have auth middleware that sets req.user

    if (!postedById) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const job = await createJob(req.body, postedById);

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Controller Error:", error);
    res.status(400).json({
      message: error.message || "Failed to create job",
    });
  }
};

/**
 * Get all jobs with optional filtering and pagination
 */
export const getAllJobsController = async (req, res) => {
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

    res.status(200).json(result);
  } catch (error) {
    console.error("Get All Jobs Controller Error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch jobs",
    });
  }
};

/**
 * Get jobs by client ID
 */
export const getJobsByClientController = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { page, limit } = req.query;

    // Check if user is requesting their own jobs or has admin privileges
    if (req.user?.id !== clientId && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const pagination = { page, limit };
    const result = await getJobsByClientId(clientId, pagination);

    res.status(200).json(result);
  } catch (error) {
    console.error("Get Jobs By Client Controller Error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch client jobs",
    });
  }
};

/**
 * Get my jobs (for authenticated user)
 */
export const getMyJobsController = async (req, res) => {
  try {
    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { page, limit } = req.query;
    const pagination = { page, limit };

    const result = await getJobsByClientId(clientId, pagination);

    res.status(200).json(result);
  } catch (error) {
    console.error("Get My Jobs Controller Error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch your jobs",
    });
  }
};

/**
 * Get job by ID
 */
export const getJobByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await getJobById(id);

    res.status(200).json(job);
  } catch (error) {
    console.error("Get Job By ID Controller Error:", error);
    res.status(404).json({
      message: error.message || "Job not found",
    });
  }
};

/**
 * Update job
 */
export const updateJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const updatedJob = await updateJob(id, clientId, req.body);

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Controller Error:", error);
    res.status(400).json({
      message: error.message || "Failed to update job",
    });
  }
};

/**
 * Delete job
 */
export const deleteJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const result = await deleteJob(id, clientId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Delete Job Controller Error:", error);
    res.status(400).json({
      message: error.message || "Failed to delete job",
    });
  }
};

/**
 * Update job status
 */
export const updateJobStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedJob = await updateJobStatus(id, clientId, status);

    res.status(200).json({
      message: "Job status updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Status Controller Error:", error);
    res.status(400).json({
      message: error.message || "Failed to update job status",
    });
  }
};

/**
 * Pay for a job posting
 */
export const payForJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body; // Optional, defaults to 300
    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const paymentAmount = amount || 300; // Default to 300 KES

    const result = await payForJob(id, clientId, paymentAmount);

    res.status(200).json({
      message: "Job payment processed successfully",
      ...result,
    });
  } catch (error) {
    console.error("Pay For Job Controller Error:", error);
    const statusCode = error.message.includes("Insufficient") ? 402 : 400;
    res.status(statusCode).json({
      message: error.message || "Failed to process job payment",
    });
  }
};

/**
 * Expire paid jobs after 7 days
 * This can be called manually or via cron job
 */
export const expirePaidJobsController = async (req, res) => {
  try {
    const result = await expirePaidJobs();

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Expire Paid Jobs Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to expire paid jobs",
    });
  }
};
