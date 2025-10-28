import {
  getAdminJobs,
  getAdminJobById,
  updateAdminJob,
  deleteAdminJob,
  bulkUpdateJobStatuses,
  getJobStatistics,
   createAdminJob, 
} from '../services/adminJobService.js';

import { updateAdminJobSchema,createAdminJobSchema  } from '../utils/validation/jobValidation.js';
/**
 * Create job as admin
 */
export const createAdminJobController = async (req, res) => {
  try {
    const jobData = req.body;
    
    // Use req.admin instead of req.user
    const adminUserId = req.admin?.id;
    
    if (!adminUserId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Admin not found in request.',
      });
    }

    // Validate request body
    const { error, value } = createAdminJobSchema.validate(jobData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }

    const newJob = await createAdminJob(value, adminUserId);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: newJob,
    });
  } catch (error) {
    console.error('Admin Create Job Controller Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create job',
    });
  }
};



/**
 * Get all jobs with filters (admin)
 */
export const getAdminJobsController = async (req, res) => {
  try {
    const filters = req.query;
    const result = await getAdminJobs(filters);

    res.status(200).json({
      success: true,
      data: result.jobs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Admin Get Jobs Controller Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch jobs',
    });
  }
};

/**
 * Get job by ID (admin)
 */
export const getAdminJobByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await getAdminJobById(id);

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Admin Get Job Controller Error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Job not found',
    });
  }
};

/**
 * Update job (admin)
 */
export const updateAdminJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate request body
    const { error, value } = updateAdminJobSchema.validate(updateData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }

    const updatedJob = await updateAdminJob(id, value);

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });
  } catch (error) {
    console.error('Admin Update Job Controller Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update job',
    });
  }
};

/**
 * Delete job (admin)
 */
export const deleteAdminJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteAdminJob(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Admin Delete Job Controller Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete job',
    });
  }
};

/**
 * Bulk update job statuses
 */
export const bulkUpdateJobStatusesController = async (req, res) => {
  try {
    const { jobIds, status } = req.body;

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'jobIds array is required',
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'status is required',
      });
    }

    const result = await bulkUpdateJobStatuses(jobIds, status);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        updatedCount: result.updatedCount,
      },
    });
  } catch (error) {
    console.error('Bulk Update Job Status Controller Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update job statuses',
    });
  }
};

/**
 * Get job statistics
 */
export const getJobStatisticsController = async (req, res) => {
  try {
    const statistics = await getJobStatistics();

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error('Job Statistics Controller Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch job statistics',
    });
  }
};