import express from "express"
import { adminLoginController, adminLogoutController } from "../controllers/adminController.js"
import { validate } from "../middleware/validate.js"
import { adminLoginSchema } from "../utils/validation/adminValidation.js"
import { authLimiter } from "../middleware/rateLimit.js"
import { optionalAdminAuth } from "../middleware/optionalAuth.js"

const router = express.Router()

// Admin authentication routes
router.post("/login", authLimiter, validate(adminLoginSchema), adminLoginController)
router.post("/logout", optionalAdminAuth, adminLogoutController)

export default router
