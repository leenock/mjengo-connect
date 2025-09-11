import express from "express"
import {
  createAdminUser,
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUserController,
  updateAdminPasswordController,
  deleteAdminUserController,
  updateAdminRoleController,
  toggleAdminStatusController,
  getAdminProfileController,
} from "../controllers/adminController.js"
import { validate } from "../middleware/validate.js"
import { adminAuthMiddleware, superAdminMiddleware } from "../middleware/adminAuth.js"
import { createAdminSchema, updateAdminSchema } from "../utils/validation/adminValidation.js"

const router = express.Router()

// Public routes (no authentication required)
// Note: In production, you might want to protect these routes or have a setup process

// Admin management routes (require authentication)
router.get("/profile", adminAuthMiddleware, getAdminProfileController)
router.get("/getAllAdmins", adminAuthMiddleware, getAllAdminUsers)
router.get("/getAdmin/:id", adminAuthMiddleware, getAdminUserById)

// Super Admin only routes
router.post("/createAdmin", adminAuthMiddleware, superAdminMiddleware, validate(createAdminSchema), createAdminUser)

router.put(
  "/updateAdmin/:id",
  adminAuthMiddleware,
  superAdminMiddleware,
  validate(updateAdminSchema),
  updateAdminUserController,
)

router.post("/updatePassword", adminAuthMiddleware, superAdminMiddleware, updateAdminPasswordController)

router.delete("/deleteAdmin/:id", adminAuthMiddleware, superAdminMiddleware, deleteAdminUserController)

router.put("/updateRole/:adminId", adminAuthMiddleware, superAdminMiddleware, updateAdminRoleController)

router.put("/toggleStatus/:id", adminAuthMiddleware, superAdminMiddleware, toggleAdminStatusController)

export default router
