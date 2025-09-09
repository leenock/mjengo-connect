import SavedJobService from "../services/savedJobService"
import { createSystemLog } from "../services/systemLogService"

class SavedJobController {
  // Save a job
  static async saveJob(req, res) {
    try {
      const fundiId = req.user.id // From authentication middleware
      const { jobId } = req.body

      const savedJob = await SavedJobService.saveJob(fundiId, jobId)

      // Log the action
      await createSystemLog({
        level: "INFO",
        category: "USER_ACTIVITY",
        message: `Fundi saved a job`,
        details: `Fundi ID: ${fundiId}, Job ID: ${jobId}`,
        fundiId: fundiId,
        source: "Saved Job Service",
      })

      res.status(201).json({
        success: true,
        message: "Job saved successfully",
        data: savedJob,
      })
    } catch (error) {
      console.error("Error saving job:", error)

      // Log the error
      await createSystemLog({
        level: "ERROR",
        category: "USER_ACTIVITY",
        message: `Failed to save job`,
        details: `Error: ${error.message}, Fundi ID: ${req.user?.id}`,
        fundiId: req.user?.id,
        source: "Saved Job Service",
      })

      if (error.message === "Job not found") {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        })
      }

      if (error.message === "Job is already saved") {
        return res.status(409).json({
          success: false,
          message: "Job is already saved",
        })
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  }

  // Remove a saved job
  static async removeSavedJob(req, res) {
    try {
      const fundiId = req.user.id
      const { jobId } = req.params

      const result = await SavedJobService.removeSavedJob(fundiId, jobId)

      // Log the action
      await createSystemLog({
        level: "INFO",
        category: "USER_ACTIVITY",
        message: `Fundi removed a saved job`,
        details: `Fundi ID: ${fundiId}, Job ID: ${jobId}`,
        fundiId: fundiId,
        source: "Saved Job Service",
      })

      res.status(200).json({
        success: true,
        message: result.message,
      })
    } catch (error) {
      console.error("Error removing saved job:", error)

      // Log the error
      await createSystemLog({
        level: "ERROR",
        category: "USER_ACTIVITY",
        message: `Failed to remove saved job`,
        details: `Error: ${error.message}, Fundi ID: ${req.user?.id}`,
        fundiId: req.user?.id,
        source: "Saved Job Service",
      })

      if (error.message === "Saved job not found") {
        return res.status(404).json({
          success: false,
          message: "Saved job not found",
        })
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  }

  // Get all saved jobs for a fundi user
  static async getSavedJobs(req, res) {
    try {
      const fundiId = req.user.id
      const page = Number.parseInt(req.query.page) || 1
      const limit = Number.parseInt(req.query.limit) || 10

      const result = await SavedJobService.getSavedJobs(fundiId, page, limit)

      res.status(200).json({
        success: true,
        message: "Saved jobs retrieved successfully",
        data: result.savedJobs,
        pagination: result.pagination,
      })
    } catch (error) {
      console.error("Error getting saved jobs:", error)

      // Log the error
      await createSystemLog({
        level: "ERROR",
        category: "USER_ACTIVITY",
        message: `Failed to get saved jobs`,
        details: `Error: ${error.message}, Fundi ID: ${req.user?.id}`,
        fundiId: req.user?.id,
        source: "Saved Job Service",
      })

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  }

  // Check if a job is saved
  static async checkJobSaved(req, res) {
    try {
      const fundiId = req.user.id
      const { jobId } = req.params

      const isSaved = await SavedJobService.isJobSaved(fundiId, jobId)

      res.status(200).json({
        success: true,
        data: {
          isSaved: isSaved,
        },
      })
    } catch (error) {
      console.error("Error checking if job is saved:", error)

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  }

  // Get saved jobs count
  static async getSavedJobsCount(req, res) {
    try {
      const fundiId = req.user.id

      const count = await SavedJobService.getSavedJobsCount(fundiId)

      res.status(200).json({
        success: true,
        data: {
          count: count,
        },
      })
    } catch (error) {
      console.error("Error getting saved jobs count:", error)

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  }

  // Get recently saved jobs
  static async getRecentlySavedJobs(req, res) {
    try {
      const fundiId = req.user.id
      const limit = Number.parseInt(req.query.limit) || 5

      const recentlySavedJobs = await SavedJobService.getRecentlySavedJobs(fundiId, limit)

      res.status(200).json({
        success: true,
        message: "Recently saved jobs retrieved successfully",
        data: recentlySavedJobs,
      })
    } catch (error) {
      console.error("Error getting recently saved jobs:", error)

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  }
}

module.exports = SavedJobController
