import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

class SavedJobService {
  // Save a job for a fundi user
  static async saveJob(fundiId, jobId) {
    try {
      // Check if job exists
      const jobExists = await prisma.job.findUnique({
        where: { id: jobId },
      })

      if (!jobExists) {
        throw new Error("Job not found")
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
            },
          },
        },
      })

      return savedJob
    } catch (error) {
      throw error
    }
  }

  // Remove a saved job
  static async removeSavedJob(fundiId, jobId) {
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
      throw error
    }
  }

  // Get all saved jobs for a fundi user with pagination
  static async getSavedJobs(fundiId, page = 1, limit = 10) {
    try {
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
              },
            },
          },
          orderBy: {
            savedAt: "desc",
          },
          skip: skip,
          take: limit,
        }),
        prisma.savedJob.count({
          where: { fundiId: fundiId },
        }),
      ])

      const totalPages = Math.ceil(totalCount / limit)

      return {
        savedJobs: savedJobs,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalCount: totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      }
    } catch (error) {
      throw error
    }
  }

  // Check if a job is saved by a fundi user
  static async isJobSaved(fundiId, jobId) {
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
      throw error
    }
  }

  // Get saved jobs count for a fundi user
  static async getSavedJobsCount(fundiId) {
    try {
      const count = await prisma.savedJob.count({
        where: { fundiId: fundiId },
      })

      return count
    } catch (error) {
      throw error
    }
  }

  // Get recently saved jobs (last 7 days)
  static async getRecentlySavedJobs(fundiId, limit = 5) {
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
            },
          },
        },
        orderBy: {
          savedAt: "desc",
        },
        take: limit,
      })

      return recentlySavedJobs
    } catch (error) {
      throw error
    }
  }
}

module.exports = SavedJobService
