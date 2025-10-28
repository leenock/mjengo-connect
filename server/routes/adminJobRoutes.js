import express from "express";
import {
  getAdminJobsController,
  getAdminJobByIdController,
  updateAdminJobController,
  deleteAdminJobController,
  bulkUpdateJobStatusesController,
  getJobStatisticsController,
  createAdminJobController,
} from "../controllers/adminJobController.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.js";

const router = express.Router();

// Apply admin authentication to all routes
router.use(adminAuthMiddleware);

// POST /api/admin/jobs - Create new job as admin
router.post("/jobs", createAdminJobController);

// GET /api/admin/jobs - Get all jobs with filters
router.get("/jobs", getAdminJobsController);

// GET /api/admin/jobs/statistics - Get job statistics
router.get("/jobs/statistics", getJobStatisticsController);

// GET /api/admin/jobs/:id - Get job by ID
router.get("/jobs/:id", getAdminJobByIdController);

// PUT /api/admin/jobs/:id - Update job
router.put("/jobs/:id", updateAdminJobController);

// DELETE /api/admin/jobs/:id - Delete job
router.delete("/jobs/:id", deleteAdminJobController);

// POST /api/admin/jobs/bulk-status - Bulk update job statuses
router.post("/jobs/bulk-status", bulkUpdateJobStatusesController);

export default router;
