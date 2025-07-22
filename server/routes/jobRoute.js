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
} from "../controllers/jobController.js"
import { validate } from "../middleware/validate.js"
import { authenticateToken } from "../middleware/auth.js"
import { createJobSchema, updateJobSchema, updateJobStatusSchema } from "../utils/validation/jobValidation.js"

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

export default router
