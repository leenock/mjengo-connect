import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Create a new job posting
 * @param {Object} jobData - Job data from request
 * @param {String} postedById - ID of the client user posting the job
 * @returns {Object} Created job
 */
export const createJob = async (jobData, postedById) => {
  try {
    const job = await prisma.job.create({
      data: {
        title: jobData.title,
        category: jobData.category,
        jobType: jobData.jobType,
        location: jobData.location,
        duration: jobData.duration,
        salary: jobData.salary,
        Jobdescription: jobData.description,
        SkillsAndrequirements: jobData.requirements,
        responsibilities: jobData.responsibilities,
        benefits: jobData.benefits || null,
        companyName: jobData.company,
        contactPerson: jobData.contactPerson,
        phoneNumber: jobData.phone,
        email: jobData.email,
        preferredContact: jobData.preferredContact,
        isUrgent: jobData.isUrgent || false,
        isPaid: jobData.isPaid || false,
        postedById: postedById,
        status: "PENDING",
      },
      include: {
        postedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
          },
        },
      },
    })

    return job
  } catch (error) {
    console.error("Create Job Service Error:", error)
    throw new Error(`Failed to create job: ${error.message}`)
  }
}

/**
 * Get all jobs with optional filtering
 * @param {Object} filters - Optional filters (category, location, jobType, etc.)
 * @param {Object} pagination - Pagination options (page, limit)
 * @returns {Object} Jobs array and metadata
 */
export const getAllJobs = async (filters = {}, pagination = {}) => {
  try {
    const { page = 1, limit = 110 } = pagination
    const skip = (page - 1) * limit

    const where = {}

    // Apply filters
    if (filters.category) where.category = filters.category
    if (filters.location) where.location = { contains: filters.location, mode: "insensitive" }
    if (filters.jobType) where.jobType = filters.jobType
    if (filters.status) where.status = filters.status
    if (filters.isUrgent !== undefined) where.isUrgent = filters.isUrgent

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: Number.parseInt(limit),
        orderBy: { timePosted: "desc" },
        include: {
          postedBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              company: true,
            },
          },
        },
      }),
      prisma.job.count({ where }),
    ])

    return {
      jobs,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + jobs.length < totalCount,
        hasPrev: page > 1,
      },
    }
  } catch (error) {
    console.error("Get All Jobs Service Error:", error)
    throw new Error(`Failed to fetch jobs: ${error.message}`)
  }
}

/**
 * Get jobs by client user ID
 * @param {String} clientId - Client user ID
 * @param {Object} pagination - Pagination options
 * @returns {Object} Jobs array and metadata
 */
export const getJobsByClientId = async (clientId, pagination = {}) => {
  try {
    const { page = 1, limit = 10 } = pagination
    const skip = (page - 1) * limit

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where: { postedById: clientId },
        skip,
        take: Number.parseInt(limit),
        orderBy: { timePosted: "desc" },
        include: {
          postedBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              company: true,
            },
          },
        },
      }),
      prisma.job.count({ where: { postedById: clientId } }),
    ])

    return {
      jobs,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + jobs.length < totalCount,
        hasPrev: page > 1,
      },
    }
  } catch (error) {
    console.error("Get Jobs By Client ID Service Error:", error)
    throw new Error(`Failed to fetch client jobs: ${error.message}`)
  }
}

/**
 * Get job by ID
 * @param {String} jobId - Job ID
 * @returns {Object} Job details
 */
export const getJobById = async (jobId) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        postedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
            location: true,
          },
        },
      },
    })

    if (!job) {
      throw new Error("Job not found")
    }

    // Increment click count
    await prisma.job.update({
      where: { id: jobId },
      data: { clickCount: { increment: 1 } },
    })

    return job
  } catch (error) {
    console.error("Get Job By ID Service Error:", error)
    throw new Error(`Failed to fetch job: ${error.message}`)
  }
}

/**
 * Update job
 * @param {String} jobId - Job ID
 * @param {String} clientId - Client user ID (for authorization)
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated job
 */
export const updateJob = async (jobId, clientId, updateData) => {
  try {
    // First check if job exists and belongs to the client
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!existingJob) {
      throw new Error("Job not found")
    }

    if (existingJob.postedById !== clientId) {
      throw new Error("Unauthorized: You can only update your own jobs")
    }
    

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: updateData.title,
        category: updateData.category,
        jobType: updateData.jobType,
        location: updateData.location,
        duration: updateData.duration,
        salary: updateData.salary,
        Jobdescription: updateData.description,
        SkillsAndrequirements: updateData.requirements,
        responsibilities: updateData.responsibilities,
        benefits: updateData.benefits,
        companyName: updateData.company,
        contactPerson: updateData.contactPerson,
        phoneNumber: updateData.phone,
        email: updateData.email,
        preferredContact: updateData.preferredContact,
        isUrgent: updateData.isUrgent,
     //   status: updateData.status,
      },
      include: {
        postedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
          },
        },
      },
    })

    return updatedJob
  } catch (error) {
    console.error("Update Job Service Error:", error)
    throw new Error(`Failed to update job: ${error.message}`)
  }
}

/**
 * Delete job
 * @param {String} jobId - Job ID
 * @param {String} clientId - Client user ID (for authorization)
 * @returns {Object} Success message
 */
export const deleteJob = async (jobId, clientId) => {
  try {
    // First check if job exists and belongs to the client
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!existingJob) {
      throw new Error("Job not found")
    }

    if (existingJob.postedById !== clientId) {
      throw new Error("Unauthorized: You can only delete your own jobs")
    }

    await prisma.job.delete({
      where: { id: jobId },
    })

    return { message: "Job deleted successfully" }
  } catch (error) {
    console.error("Delete Job Service Error:", error)
    throw new Error(`Failed to delete job: ${error.message}`)
  }
}

/**
 * Update job status
 * @param {String} jobId - Job ID
 * @param {String} clientId - Client user ID (for authorization)
 * @param {String} status - New status
 * @returns {Object} Updated job
 */
export const updateJobStatus = async (jobId, clientId, status) => {
  try {
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!existingJob) {
      throw new Error("Job not found")
    }

    if (existingJob.postedById !== clientId) {
      throw new Error("Unauthorized: You can only update your own jobs")
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status },
      include: {
        postedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
          },
        },
      },
    })

    return updatedJob
  } catch (error) {
    console.error("Update Job Status Service Error:", error)
    throw new Error(`Failed to update job status: ${error.message}`)
  }
}
