import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Save a job for a fundi user
 * @param {String} fundiId - Fundi user ID
 * @param {String} jobId - Job ID to save
 * @returns {Object} Saved job with job details
 */
export const saveJob = async (fundiId, jobId) => {
  try {
    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, status: true, title: true },
    })

    if (!job) {
      throw new Error("Job not found")
    }

    if (job.status !== "ACTIVE") {
      throw new Error("Cannot save inactive job")
    }

    // Check if job is already saved
    const existingSavedJob = await prisma.savedJob.findUnique({
      where: {
        fundiId_jobId: {
          fundiId: fundiId,
          jobId: jobId,
        },
      },
    })

    if (existingSavedJob) {
      throw new Error("Job is already saved")
    }

    // Save the job
    const savedJob = await prisma.savedJob.create({
      data: {
        fundiId: fundiId,
        jobId: jobId,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyName: true,
            location: true,
            salary: true,
            duration: true,
            timePosted: true,
            status: true,
            category: true,
            jobType: true,
            isUrgent: true,
          },
        },
      },
    })

    return savedJob
  } catch (error) {
    console.error("Save Job Service Error:", error)
    throw new Error(`Failed to save job: ${error.message}`)
  }
}

/**
 * Remove a saved job
 * @param {String} fundiId - Fundi user ID
 * @param {String} jobId - Job ID to remove
 * @returns {Object} Success message
 */
export const removeSavedJob = async (fundiId, jobId) => {
  try {
    const savedJob = await prisma.savedJob.findUnique({
      where: {
        fundiId_jobId: {
          fundiId: fundiId,
          jobId: jobId,
        },
      },
    })

    if (!savedJob) {
      throw new Error("Saved job not found")
    }

    await prisma.savedJob.delete({
      where: {
        fundiId_jobId: {
          fundiId: fundiId,
          jobId: jobId,
        },
      },
    })

    return { message: "Job removed from saved list successfully" }
  } catch (error) {
    console.error("Remove Saved Job Service Error:", error)
    throw new Error(`Failed to remove saved job: ${error.message}`)
  }
}

/**
 * Get all saved jobs for a fundi user with pagination
 * @param {String} fundiId - Fundi user ID
 * @param {Object} pagination - Pagination options (page, limit)
 * @returns {Object} Saved jobs array and metadata
 */
export const getSavedJobs = async (fundiId, pagination = {}) => {
  try {
    const { page = 1, limit = 10 } = pagination
    const skip = (page - 1) * limit

    const [savedJobs, totalCount] = await Promise.all([
      prisma.savedJob.findMany({
        where: { fundiId: fundiId },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              companyName: true,
              location: true,
              salary: true,
              duration: true,
              timePosted: true,
              status: true,
              Jobdescription: true,
              category: true,
              jobType: true,
              clickCount: true,
              isUrgent: true,
              phoneNumber: true,
              email: true,
            },
          },
        },
        orderBy: {
          savedAt: "desc",
        },
        skip: skip,
        take: Number.parseInt(limit),
      }),
      prisma.savedJob.count({
        where: { fundiId: fundiId },
      }),
    ])

    return {
      savedJobs,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + savedJobs.length < totalCount,
        hasPrev: page > 1,
      },
    }
  } catch (error) {
    console.error("Get Saved Jobs Service Error:", error)
    throw new Error(`Failed to fetch saved jobs: ${error.message}`)
  }
}

/**
 * Check if a job is saved by a fundi user
 * @param {String} fundiId - Fundi user ID
 * @param {String} jobId - Job ID to check
 * @returns {Boolean} Whether the job is saved
 */
export const isJobSaved = async (fundiId, jobId) => {
  try {
    const savedJob = await prisma.savedJob.findUnique({
      where: {
        fundiId_jobId: {
          fundiId: fundiId,
          jobId: jobId,
        },
      },
    })

    return !!savedJob
  } catch (error) {
    console.error("Check Job Saved Service Error:", error)
    throw new Error(`Failed to check if job is saved: ${error.message}`)
  }
}

/**
 * Get saved jobs count for a fundi user
 * @param {String} fundiId - Fundi user ID
 * @returns {Number} Count of saved jobs
 */
export const getSavedJobsCount = async (fundiId) => {
  try {
    const count = await prisma.savedJob.count({
      where: { fundiId: fundiId },
    })

    return count
  } catch (error) {
    console.error("Get Saved Jobs Count Service Error:", error)
    throw new Error(`Failed to get saved jobs count: ${error.message}`)
  }
}

/**
 * Get recently saved jobs (last 7 days)
 * @param {String} fundiId - Fundi user ID
 * @param {Number} limit - Number of jobs to return
 * @returns {Array} Recently saved jobs
 */
export const getRecentlySavedJobs = async (fundiId, limit = 5) => {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentlySavedJobs = await prisma.savedJob.findMany({
      where: {
        fundiId: fundiId,
        savedAt: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyName: true,
            location: true,
            salary: true,
            timePosted: true,
            status: true,
            category: true,
            isUrgent: true,
          },
        },
      },
      orderBy: {
        savedAt: "desc",
      },
      take: Number.parseInt(limit),
    })

    return recentlySavedJobs
  } catch (error) {
    console.error("Get Recently Saved Jobs Service Error:", error)
    throw new Error(`Failed to get recently saved jobs: ${error.message}`)
  }
}
