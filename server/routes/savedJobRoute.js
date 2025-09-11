import express from "express"
import { authenticateFundiToken } from "../middleware/fundiAuth.js"
import { validate } from "../middleware/validate.js"
import { saveJobSchema, paginationSchema, jobIdParamSchema } from "../utils/validation/savedJobValidation.js"
import {
  saveJobController,
  removeSavedJobController,
  getSavedJobsController,
  checkJobSavedController,
  getSavedJobsCountController,
  getRecentlySavedJobsController,
} from "../controllers/savedJobController.js"

const router = express.Router()

// All routes require fundi authentication
router.use(authenticateFundiToken)

// Save a job
router.post("/save", validate(saveJobSchema), saveJobController)

// Remove a saved job
router.delete("/remove/:jobId", validate(jobIdParamSchema, "params"), removeSavedJobController)

// Get all saved jobs (with pagination)
router.get("/", validate(paginationSchema, "query"), getSavedJobsController)

// Check if a job is saved
router.get("/check/:jobId", validate(jobIdParamSchema, "params"), checkJobSavedController)

// Get saved jobs count
router.get("/count", getSavedJobsCountController)

// Get recently saved jobs
router.get("/recent", getRecentlySavedJobsController)

export default router
