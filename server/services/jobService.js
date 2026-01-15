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

/**
 * Pay for a job posting (deduct from wallet and mark job as paid)
 * @param {String} jobId - Job ID
 * @param {String} clientId - Client user ID (for authorization)
 * @param {Number} amount - Payment amount (default: 300 KES)
 * @returns {Object} Updated job and payment details
 */
export const payForJob = async (jobId, clientId, amount = 300) => {
  try {
    // Check if job exists and belongs to the client
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      throw new Error("Job not found");
    }

    if (existingJob.postedById !== clientId) {
      throw new Error("Unauthorized: You can only pay for your own jobs");
    }

    // Check if job is already paid
    if (existingJob.isPaid) {
      throw new Error("Job has already been paid for");
    }

    // Import wallet service
    const { withdrawFromWallet, getWalletBalance } = await import("./clientAddFunds.js");

    // Check wallet balance
    const walletData = await getWalletBalance(clientId);
    if (walletData.balance < amount) {
      throw new Error(`Insufficient balance. You have Ksh ${walletData.balance.toFixed(2)}, but need Ksh ${amount.toFixed(2)}`);
    }

    // Withdraw from wallet
    const reference = `JOB_PAYMENT_${jobId}_${Date.now()}`;
    const withdrawalResult = await withdrawFromWallet(clientId, amount, reference);

    // Create payment log
    const paymentLog = await prisma.clientPaymentLog.create({
      data: {
        clientId: clientId,
        jobId: jobId,
        phone: existingJob.phoneNumber,
        amount: Math.round(amount * 100), // Convert to cents
        receipt: reference,
        status: "SUCCESS",
        paymentProvider: "WALLET",
        kopokopoReference: reference,
        rawPayload: {
          jobId: jobId,
          jobTitle: existingJob.title,
          amount: amount,
          paymentMethod: "WALLET",
        },
      },
    });

    // Update job to mark as paid and set payment timestamp
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        isPaid: true,
        paidAt: new Date(), // Set payment timestamp for expiration tracking
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
    });

    return {
      job: updatedJob,
      payment: {
        amount: amount,
        reference: reference,
        paymentLogId: paymentLog.id,
        walletBalance: withdrawalResult.wallet.balance,
      },
    };
  } catch (error) {
    console.error("Pay For Job Service Error:", error);
    throw new Error(`Failed to process job payment: ${error.message}`);
  }
}

/**
 * Expire jobs that have been paid for more than 7 days
 * Sets isPaid to false for jobs where paidAt is older than 7 days
 * @returns {Object} Expiration results
 */
export const expirePaidJobs = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find all paid jobs where paidAt is older than 7 days
    const expiredJobs = await prisma.job.findMany({
      where: {
        isPaid: true,
        paidAt: {
          not: null,
          lte: sevenDaysAgo, // Less than or equal to 7 days ago
        },
      },
      select: {
        id: true,
        title: true,
        paidAt: true,
      },
    });

    if (expiredJobs.length === 0) {
      return {
        expired: 0,
        message: "No jobs to expire",
      };
    }

    // Update all expired jobs to set isPaid to false
    const updateResult = await prisma.job.updateMany({
      where: {
        id: {
          in: expiredJobs.map((job) => job.id),
        },
      },
      data: {
        isPaid: false,
        // Optionally clear paidAt or keep it for historical record
        // paidAt: null, // Uncomment if you want to clear the timestamp
      },
    });

    console.log(`✅ Expired ${updateResult.count} job(s) after 7 days`);

    return {
      expired: updateResult.count,
      jobs: expiredJobs,
      message: `Successfully expired ${updateResult.count} job(s)`,
    };
  } catch (error) {
    console.error("Expire Paid Jobs Service Error:", error);
    throw new Error(`Failed to expire paid jobs: ${error.message}`);
  }
}