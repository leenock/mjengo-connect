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
    if (filters.status) {
      where.status = filters.status
    } else {
      // By default, exclude CLOSED and EXPIRED jobs from active listings
      // Only include if explicitly requested via status filter
      where.status = { 
        notIn: ["CLOSED", "EXPIRED"]
      }
    }
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
    
    // Prevent editing paid jobs - they can only be viewed or deleted
    if (existingJob.isPaid) {
      throw new Error("Cannot edit paid jobs. Paid jobs can only be viewed or deleted.")
    }
    
    // If job is ACTIVE and being edited, change status to PENDING for re-approval
    const statusUpdate = existingJob.status === "ACTIVE" ? { status: "PENDING" } : {}

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
        ...statusUpdate, // Include status update if job was ACTIVE
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
 * Check if a job is still within the 7-day paid period
 * @param {Date} paidAt - Payment date
 * @returns {Object} { isWithinPeriod: boolean, remainingDays: number }
 */
export const isJobWithinPaidPeriod = (paidAt) => {
  if (!paidAt) {
    return { isWithinPeriod: false, remainingDays: 0 };
  }

  const now = new Date();
  const paymentDate = new Date(paidAt);
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const timeSincePayment = now.getTime() - paymentDate.getTime();
  const remainingTime = sevenDaysInMs - timeSincePayment;
  const remainingDays = Math.ceil(remainingTime / (24 * 60 * 60 * 1000));

  return {
    isWithinPeriod: remainingTime > 0,
    remainingDays: remainingDays > 0 ? remainingDays : 0,
  };
};

/**
 * Expire jobs that have been paid for more than 7 days
 * Sets status to CLOSED for jobs where paidAt is older than 7 days
 * @returns {Object} Expiration results
 */
export const expirePaidJobs = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find all paid jobs where paidAt is older than 7 days and status is not already CLOSED
    const expiredJobs = await prisma.job.findMany({
      where: {
        isPaid: true,
        status: {
          not: "CLOSED", // Don't update jobs that are already closed
        },
        paidAt: {
          not: null,
          lte: sevenDaysAgo, // Less than or equal to 7 days ago
        },
      },
      select: {
        id: true,
        title: true,
        paidAt: true,
        status: true,
      },
    });

    if (expiredJobs.length === 0) {
      return {
        expired: 0,
        message: "No jobs to expire",
      };
    }

    // Update all expired jobs to set status to CLOSED
    // Keep isPaid = true for historical record
    const updateResult = await prisma.job.updateMany({
      where: {
        id: {
          in: expiredJobs.map((job) => job.id),
        },
      },
      data: {
        status: "CLOSED",
        // Keep isPaid = true and paidAt for historical record
      },
    });

    console.log(`✅ Closed ${updateResult.count} job(s) after 7-day paid period`);

    return {
      expired: updateResult.count,
      jobs: expiredJobs,
      message: `Successfully closed ${updateResult.count} job(s) after 7-day paid period`,
    };
  } catch (error) {
    console.error("Expire Paid Jobs Service Error:", error);
    throw new Error(`Failed to expire paid jobs: ${error.message}`);
  }
}

/**
 * Expire unpaid active jobs that have been active for more than 7 days
 * Changes status to EXPIRED for jobs that are ACTIVE, unpaid, and older than 7 days
 * @returns {Object} Expiration results
 */
export const expireUnpaidActiveJobs = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find all active, unpaid jobs where timePosted is older than 7 days
    const expiredJobs = await prisma.job.findMany({
      where: {
        status: "ACTIVE",
        isPaid: false,
        timePosted: {
          lte: sevenDaysAgo, // Less than or equal to 7 days ago
        },
      },
      select: {
        id: true,
        title: true,
        timePosted: true,
        status: true,
      },
    });

    if (expiredJobs.length === 0) {
      return {
        expired: 0,
        message: "No unpaid active jobs to expire",
      };
    }

    // Update all expired jobs to set status to EXPIRED
    const updateResult = await prisma.job.updateMany({
      where: {
        id: {
          in: expiredJobs.map((job) => job.id),
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    console.log(`✅ Expired ${updateResult.count} unpaid active job(s) after 7 days`);

    return {
      expired: updateResult.count,
      jobs: expiredJobs,
      message: `Successfully expired ${updateResult.count} unpaid active job(s)`,
    };
  } catch (error) {
    console.error("Expire Unpaid Active Jobs Service Error:", error);
    throw new Error(`Failed to expire unpaid active jobs: ${error.message}`);
  }
}

/**
 * Close a job manually (client action)
 * @param {String} jobId - Job ID
 * @param {String} clientId - Client user ID (for authorization)
 * @returns {Object} Updated job
 */
export const closeJob = async (jobId, clientId) => {
  try {
    // Check if job exists and belongs to the client
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      throw new Error("Job not found");
    }

    if (existingJob.postedById !== clientId) {
      throw new Error("Unauthorized: You can only close your own jobs");
    }

    // Check if job is already closed
    if (existingJob.status === "CLOSED") {
      throw new Error("Job is already closed");
    }

    // Update job status to CLOSED
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "CLOSED",
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

    return updatedJob;
  } catch (error) {
    console.error("Close Job Service Error:", error);
    throw new Error(`Failed to close job: ${error.message}`);
  }
}

/**
 * Reactivate a closed job (if still within paid period)
 * @param {String} jobId - Job ID
 * @param {String} clientId - Client user ID (for authorization)
 * @returns {Object} Updated job and remaining days
 */
export const reactivateJob = async (jobId, clientId) => {
  try {
    // Check if job exists and belongs to the client
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      throw new Error("Job not found");
    }

    if (existingJob.postedById !== clientId) {
      throw new Error("Unauthorized: You can only reactivate your own jobs");
    }

    // Check if job is closed
    if (existingJob.status !== "CLOSED") {
      throw new Error("Job is not closed. Only closed jobs can be reactivated.");
    }

    // Check if job is paid
    if (!existingJob.isPaid || !existingJob.paidAt) {
      throw new Error("Job has not been paid for. Please make a payment first.");
    }

    // Check if job is still within the 7-day paid period
    const periodCheck = isJobWithinPaidPeriod(existingJob.paidAt);
    if (!periodCheck.isWithinPeriod) {
      throw new Error("The 7-day paid period has expired. Please re-run the job to make a new payment.");
    }

    // Reactivate the job
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "ACTIVE",
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
      remainingDays: periodCheck.remainingDays,
      message: `Job reactivated successfully. ${periodCheck.remainingDays} day(s) remaining in paid period.`,
    };
  } catch (error) {
    console.error("Reactivate Job Service Error:", error);
    throw new Error(`Failed to reactivate job: ${error.message}`);
  }
}

/**
 * Re-run a closed job
 * If still within paid period: set to ACTIVE (no approval needed)
 * If outside paid period: set to PENDING (requires approval and new payment)
 * @param {String} jobId - Job ID
 * @param {String} clientId - Client user ID (for authorization)
 * @returns {Object} Updated job
 */
export const rerunJob = async (jobId, clientId) => {
  try {
    // Check if job exists and belongs to the client
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      throw new Error("Job not found");
    }

    if (existingJob.postedById !== clientId) {
      throw new Error("Unauthorized: You can only re-run your own jobs");
    }

    // Check if job is closed
    if (existingJob.status !== "CLOSED") {
      throw new Error("Only closed jobs can be re-run.");
    }

    // Check if job is paid and still within the 7-day paid period
    if (existingJob.isPaid && existingJob.paidAt) {
      const periodCheck = isJobWithinPaidPeriod(existingJob.paidAt);
      
      if (periodCheck.isWithinPeriod) {
        // Still within paid period - just reactivate to ACTIVE
        const updatedJob = await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "ACTIVE",
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
          remainingDays: periodCheck.remainingDays,
          message: `Job reactivated successfully. ${periodCheck.remainingDays} day(s) remaining in paid period.`,
        };
      }
    }

    // Outside paid period or not paid - reset to PENDING for approval and new payment
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "PENDING",
        isPaid: false,
        paidAt: null, // Clear payment timestamp for new payment cycle
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
      message: "Job set to PENDING. After admin approval, you will need to make a new payment to activate it.",
    };
  } catch (error) {
    console.error("Re-run Job Service Error:", error);
    throw new Error(`Failed to re-run job: ${error.message}`);
  }
}