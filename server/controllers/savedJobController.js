import {
  saveJob,
  removeSavedJob,
  getSavedJobs,
  isJobSaved,
  getSavedJobsCount,
  getRecentlySavedJobs,
} from "../services/savedJobService.js"

/**
 * Save a job for the authenticated fundi user
 */
export const saveJobController = async (req, res) => {
  try {
    const fundiId = req.user?.id

    if (!fundiId) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const { jobId } = req.body

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" })
    }

    const savedJob = await saveJob(fundiId, jobId)

    res.status(201).json({
      message: "Job saved successfully",
      data: savedJob,
    })
  } catch (error) {
    console.error("Save Job Controller Error:", error)

    if (error.message.includes("Job not found")) {
      return res.status(404).json({
        message: "Job not found",
      })
    }

    if (error.message.includes("already saved")) {
      return res.status(409).json({
        message: "Job is already saved",
      })
    }

    if (error.message.includes("inactive job")) {
      return res.status(400).json({
        message: "Cannot save inactive job",
      })
    }

    res.status(500).json({
      message: error.message || "Failed to save job",
    })
  }
}

/**
 * Remove a saved job for the authenticated fundi user
 */
export const removeSavedJobController = async (req, res) => {
  try {
    const fundiId = req.user?.id

    if (!fundiId) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const { jobId } = req.params

    const result = await removeSavedJob(fundiId, jobId)

    res.status(200).json({
      message: result.message,
    })
  } catch (error) {
    console.error("Remove Saved Job Controller Error:", error)

    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: "Saved job not found",
      })
    }

    res.status(500).json({
      message: error.message || "Failed to remove saved job",
    })
  }
}

/**
 * Get all saved jobs for the authenticated fundi user
 */
export const getSavedJobsController = async (req, res) => {
  try {
    const fundiId = req.user?.id

    if (!fundiId) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const { page, limit } = req.query
    const pagination = { page, limit }

    const result = await getSavedJobs(fundiId, pagination)

    res.status(200).json({
      message: "Saved jobs retrieved successfully",
      savedJobs: result.savedJobs,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error("Get Saved Jobs Controller Error:", error)

    res.status(500).json({
      message: error.message || "Failed to fetch saved jobs",
    })
  }
}

/**
 * Check if a job is saved by the authenticated fundi user
 */
export const checkJobSavedController = async (req, res) => {
  try {
    const fundiId = req.user?.id

    if (!fundiId) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const { jobId } = req.params

    const isSaved = await isJobSaved(fundiId, jobId)

    res.status(200).json({
      message: "Job saved status retrieved successfully",
      data: {
        isSaved: isSaved,
      },
    })
  } catch (error) {
    console.error("Check Job Saved Controller Error:", error)

    res.status(500).json({
      message: error.message || "Failed to check if job is saved",
    })
  }
}

/**
 * Get saved jobs count for the authenticated fundi user
 */
export const getSavedJobsCountController = async (req, res) => {
  try {
    const fundiId = req.user?.id

    if (!fundiId) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const count = await getSavedJobsCount(fundiId)

    res.status(200).json({
      message: "Saved jobs count retrieved successfully",
      data: {
        count: count,
      },
    })
  } catch (error) {
    console.error("Get Saved Jobs Count Controller Error:", error)

    res.status(500).json({
      message: error.message || "Failed to get saved jobs count",
    })
  }
}

/**
 * Get recently saved jobs for the authenticated fundi user
 */
export const getRecentlySavedJobsController = async (req, res) => {
  try {
    const fundiId = req.user?.id

    if (!fundiId) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const { limit } = req.query
    const recentlySavedJobs = await getRecentlySavedJobs(fundiId, limit)

    res.status(200).json({
      message: "Recently saved jobs retrieved successfully",
      data: recentlySavedJobs,
    })
  } catch (error) {
    console.error("Get Recently Saved Jobs Controller Error:", error)

    res.status(500).json({
      message: error.message || "Failed to get recently saved jobs",
    })
  }
}
