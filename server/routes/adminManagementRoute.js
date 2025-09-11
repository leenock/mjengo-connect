import express from "express"
import {
  getAdminDashboardStats,
  getRecentActivities,
  getSystemHealth,
  bulkUpdateAdminStatus,
} from "../controllers/adminManagementController.js"
import { adminAuthMiddleware, superAdminMiddleware } from "../middleware/adminAuth.js"

const router = express.Router()

// Dashboard and statistics routes
router.get("/dashboard/stats", adminAuthMiddleware, getAdminDashboardStats)
router.get("/activities", adminAuthMiddleware, getRecentActivities)
router.get("/system/health", adminAuthMiddleware, getSystemHealth)

// Bulk operations (Super Admin only)
router.put("/bulk/status", adminAuthMiddleware, superAdminMiddleware, bulkUpdateAdminStatus)

export default router
