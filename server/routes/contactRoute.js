import express from "express"
import { submitContact, submitLaunchNotify } from "../controllers/contactController.js"
import { contactLimiter } from "../middleware/rateLimit.js"

const router = express.Router()

router.post("/", contactLimiter, submitContact)
router.post("/notify", contactLimiter, submitLaunchNotify)

export default router
