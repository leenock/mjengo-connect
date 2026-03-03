import express from "express"
import { submitContact, submitLaunchNotify } from "../controllers/contactController.js"

const router = express.Router()

router.post("/", submitContact)
router.post("/notify", submitLaunchNotify)

export default router
