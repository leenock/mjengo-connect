import express from "express"
import {
  getAdminDashboardStats,
  getRecentActivities,
  getSystemHealth,
  bulkUpdateAdminStatus,
  getFundiSubscriptionsForAdmin,
  getJobsTrackingForAdmin,
} from "../controllers/adminManagementController.js"
import { adminAuthMiddleware, superAdminMiddleware } from "../middleware/adminAuth.js"

const router = express.Router()

// Dashboard and statistics routes
router.get("/dashboard/stats", adminAuthMiddleware, getAdminDashboardStats)
router.get("/activities", adminAuthMiddleware, getRecentActivities)
router.get("/system/health", adminAuthMiddleware, getSystemHealth)

// Bulk operations (Super Admin only)
router.put("/bulk/status", adminAuthMiddleware, superAdminMiddleware, bulkUpdateAdminStatus)

// Subscription tracking: fundis with plan start/end and days remaining
router.get("/subscriptions/fundis", adminAuthMiddleware, getFundiSubscriptionsForAdmin)

// Job tracking: posted date, expires on, days remaining
router.get("/jobs/tracking", adminAuthMiddleware, getJobsTrackingForAdmin)

export default router
