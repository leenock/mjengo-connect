import express from "express"
import {
  createJobController,
  getAllJobsController,
  getJobsByClientController,
  getMyJobsController,
  getJobByIdController,
  updateJobController,
  deleteJobController,
  updateJobStatusController,
  payForJobController,
  expirePaidJobsController,
  expireUnpaidActiveJobsController,
  closeJobController,
  reactivateJobController,
  rerunJobController,
  checkJobPaidPeriodController,
} from "../controllers/jobController.js"
import { validate } from "../middleware/validate.js"
import { authenticateToken } from "../middleware/auth.js"
import { createJobSchema, updateJobSchema, updateJobStatusSchema } from "../utils/validation/jobValidation.js"

//import { adminAuthMiddleware } from "../middleware/adminAuth.js";


const router = express.Router()

// Public routes
router.get("/jobs", getAllJobsController) // Get all jobs (public)
router.get("/jobs/:id", getJobByIdController) // Get job by ID (public)


// Protected routes (require authentication)
router.post("/jobs", authenticateToken, validate(createJobSchema), createJobController) // Create job
router.get("/my-jobs", authenticateToken, getMyJobsController) // Get my jobs
router.get("/client/:clientId/jobs", authenticateToken, getJobsByClientController) // Get jobs by client ID
router.put("/jobs/:id", authenticateToken, validate(updateJobSchema), updateJobController) // Update job
router.delete("/jobs/:id", authenticateToken, deleteJobController) // Delete job
router.patch("/jobs/:id/status", authenticateToken, validate(updateJobStatusSchema), updateJobStatusController) // Update job status
router.post("/jobs/:id/pay", authenticateToken, payForJobController) // Pay for job
router.post("/jobs/expire-paid", expirePaidJobsController) // Expire paid jobs after 7 days (can be called by cron or manually)
router.post("/jobs/expire-unpaid-active", expireUnpaidActiveJobsController) // Expire unpaid active jobs after 7 days (can be called by cron or manually)
router.post("/jobs/:id/close", authenticateToken, closeJobController) // Close job manually
router.post("/jobs/:id/reactivate", authenticateToken, reactivateJobController) // Reactivate closed job (if within paid period)
router.post("/jobs/:id/rerun", authenticateToken, rerunJobController) // Re-run closed job (set to PENDING)
router.get("/jobs/:id/paid-period", authenticateToken, checkJobPaidPeriodController) // Check if job is within paid period

export default router
