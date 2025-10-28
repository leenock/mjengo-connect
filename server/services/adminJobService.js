import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create job as admin (admin can post jobs on behalf of clients or as system)
 */
/**
 * Create job as admin (admin can post jobs on behalf of clients or as system)
 */
/**
 * Create job as admin - Requires clientUserId
 */
export const createAdminJob = async (jobData) => {
  try {
    // Validate required fields
    const requiredFields = [
      'title', 'category', 'jobType', 'location', 'duration', 'salary',
      'Jobdescription', 'SkillsAndrequirements', 'responsibilities',
      'companyName', 'contactPerson', 'phoneNumber', 'email', 'preferredContact',
      'clientUserId' // Now required
    ];

    for (const field of requiredFields) {
      if (!jobData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Verify that the client user exists and is active
    const clientUser = await prisma.client_User.findUnique({
      where: { 
        id: jobData.clientUserId,
        isActive: true 
      },
      select: { id: true, firstName: true, lastName: true, email: true }
    });

    if (!clientUser) {
      throw new Error('Client user not found or inactive');
    }

    // Create the job
    const newJob = await prisma.job.create({
      data: {
        title: jobData.title,
        category: jobData.category,
        jobType: jobData.jobType,
        location: jobData.location,
        duration: jobData.duration,
        salary: jobData.salary,
        Jobdescription: jobData.Jobdescription,
        SkillsAndrequirements: jobData.SkillsAndrequirements,
        responsibilities: jobData.responsibilities,
        benefits: jobData.benefits || '',
        companyName: jobData.companyName,
        contactPerson: jobData.contactPerson,
        phoneNumber: jobData.phoneNumber,
        email: jobData.email,
        preferredContact: jobData.preferredContact,
        isUrgent: jobData.isUrgent || false,
        isPaid: jobData.isPaid || false,
        status: jobData.status || 'ACTIVE',
        timePosted: new Date(),
        postedById: jobData.clientUserId, // Use the provided clientUserId
        clickCount: 0,
      },
      include: {
        postedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            company: true,
          },
        },
      },
    });

    return newJob;
  } catch (error) {
    console.error('Admin Create Job Service Error:', error);
    
    if (error.code === 'P2002') {
      throw new Error('A job with similar details already exists');
    }
    
    if (error.code === 'P2003') {
      throw new Error('Invalid client user ID provided');
    }
    
    throw new Error(`Failed to create job: ${error.message}`);
  }
};

/**
 * Get all jobs with filters (admin version)
 */
export const getAdminJobs = async (filters = {}) => {
  try {
    const {
      status,
      search,
      category,
      jobType,
      isUrgent,
      isPaid,
      page = 1,
      limit = 50
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }
    
    if (jobType) {
      where.jobType = { contains: jobType, mode: 'insensitive' };
    }
    
    if (isUrgent !== undefined) {
      where.isUrgent = isUrgent === 'true';
    }
    
    if (isPaid !== undefined) {
      where.isPaid = isPaid === 'true';
    }

    // Search across multiple fields
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { Jobdescription: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        postedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            company: true,
          },
        },
      },
      orderBy: { timePosted: 'desc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.job.count({ where });

    return {
      jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    };
  } catch (error) {
    console.error('Admin Get Jobs Service Error:', error);
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }
};

/**
 * Get job by ID (admin version) - Fixed to match your schema
 */
export const getAdminJobById = async (jobId) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        postedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            company: true,
          },
        },
        // Only include relations that actually exist in your schema
        // Remove applications since it doesn't exist
        // Add other relations that exist in your schema if needed
      },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  } catch (error) {
    console.error('Admin Get Job Service Error:', error);
    throw new Error(`Failed to fetch job: ${error.message}`);
  }
};

/**
 * Update job (admin version - no ownership check)
 */
export const updateAdminJob = async (jobId, updateData) => {
  try {
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      throw new Error('Job not found');
    }

    // Allowed fields for admin update - match your actual schema
    const allowedFields = [
      'title',
      'category',
      'jobType',
      'location',
      'duration',
      'salary',
      'Jobdescription',
      'SkillsAndrequirements',
      'responsibilities',
      'benefits',
      'companyName',
      'contactPerson',
      'phoneNumber',
      'email',
      'preferredContact',
      'isUrgent',
      'isPaid',
      'status'
    ];

    // Filter update data to only include allowed fields
    const filteredUpdateData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: filteredUpdateData,
      include: {
        postedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            company: true,
          },
        },
      },
    });

    return updatedJob;
  } catch (error) {
    console.error('Admin Update Job Service Error:', error);
    throw new Error(`Failed to update job: ${error.message}`);
  }
};

/**
 * Delete job (admin version - no ownership check)
 */
export const deleteAdminJob = async (jobId) => {
  try {
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      throw new Error('Job not found');
    }

    // Check if there are any related records that need to be deleted first
    // Since we don't know your exact relations, we'll try to delete the job directly
    // Prisma should handle cascading deletes if relations are properly configured
    
    // Delete the job
    await prisma.job.delete({
      where: { id: jobId },
    });

    return { message: 'Job deleted successfully' };
  } catch (error) {
    console.error('Admin Delete Job Service Error:', error);
    
    // If there's a foreign key constraint error, provide more specific message
    if (error.code === 'P2003') {
      throw new Error('Cannot delete job because it has related records. Please remove related records first.');
    }
    
    throw new Error(`Failed to delete job: ${error.message}`);
  }
};

/**
 * Bulk update job statuses
 */
export const bulkUpdateJobStatuses = async (jobIds, status) => {
  try {
    const validStatuses = ['PENDING', 'ACTIVE', 'CLOSED', 'REJECTED', 'EXPIRED'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const result = await prisma.job.updateMany({
      where: {
        id: {
          in: jobIds,
        },
      },
      data: {
        status,
      },
    });

    return {
      message: `Successfully updated ${result.count} jobs to ${status}`,
      updatedCount: result.count,
    };
  } catch (error) {
    console.error('Bulk Update Job Status Service Error:', error);
    throw new Error(`Failed to update job statuses: ${error.message}`);
  }
};

/**
 * Get job statistics for admin dashboard
 */
export const getJobStatistics = async () => {
  try {
    const totalJobs = await prisma.job.count();
    const activeJobs = await prisma.job.count({ where: { status: 'ACTIVE' } });
    const pendingJobs = await prisma.job.count({ where: { status: 'PENDING' } });
    const closedJobs = await prisma.job.count({ where: { status: 'CLOSED' } });
    const rejectedJobs = await prisma.job.count({ where: { status: 'REJECTED' } });
    const expiredJobs = await prisma.job.count({ where: { status: 'EXPIRED' } });
    const urgentJobs = await prisma.job.count({ where: { isUrgent: true } });
    const paidJobs = await prisma.job.count({ where: { isPaid: true } });

    // Jobs by category
    const jobsByCategory = await prisma.job.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Jobs by status
    const jobsByStatus = await prisma.job.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    // Recent jobs (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentJobs = await prisma.job.count({
      where: {
        timePosted: {
          gte: oneWeekAgo,
        },
      },
    });

    return {
      total: totalJobs,
      active: activeJobs,
      pending: pendingJobs,
      closed: closedJobs,
      rejected: rejectedJobs,
      expired: expiredJobs,
      urgent: urgentJobs,
      paid: paidJobs,
      recent: recentJobs,
      byCategory: jobsByCategory,
      byStatus: jobsByStatus,
    };
  } catch (error) {
    console.error('Job Statistics Service Error:', error);
    throw new Error(`Failed to fetch job statistics: ${error.message}`);
  }
};