import express from "express"
import { adminLoginController, adminLogoutController } from "../controllers/adminController.js"
import { validate } from "../middleware/validate.js"
import { adminLoginSchema } from "../utils/validation/adminValidation.js"

const router = express.Router()

// Admin authentication routes
router.post("/login", validate(adminLoginSchema), adminLoginController)
router.post("/logout", adminLogoutController)

export default router
