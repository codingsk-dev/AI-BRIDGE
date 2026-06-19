import { jobRepository } from './repositories/job.repository';
import { businessRepository } from '../business/repositories/business.repository';
import { logger } from '../../utils/logger';
import { JobEvent } from './events/job.event';
import { jobListener } from './listeners/job.listener';

// Job service
export class JobService {
  async createJob(...args: any[]) { return null as any; }
  async getJobById(...args: any[]) { return null as any; }
  async getJobsByBusinessId(...args: any[]) { return null as any; }
  async getJobsByType(...args: any[]) { return null as any; }
  async getJobsByStatus(...args: any[]) { return null as any; }
  async getPendingJobs(...args: any[]) { return null as any; }
  async updateJob(...args: any[]) { return null as any; }
  async deleteJob(...args: any[]) { return null as any; }
  async startJob(...args: any[]) { return null as any; }
  async completeJob(...args: any[]) { return null as any; }
  async failJob(...args: any[]) { return null as any; }
  async getJobCount(...args: any[]) { return null as any; }
  async getJobCountByBusinessId(...args: any[]) { return null as any; }
  async getJobCountByType(...args: any[]) { return null as any; }
  async getJobCountByStatus(...args: any[]) { return null as any; }

  // Create job
  async createJob(data: {
    name: string;
    type: string;
    payload?: Record<string, unknown>;
    scheduledAt?: Date;
    businessId?: string;
  }) {
    // If businessId is provided, verify business exists
    if (data.businessId) {
      const business = await businessRepository.findById(data.businessId);
      if (!business) {
        throw new Error('Business not found');
      }
    }

    // Create job
    const job = await jobRepository.createJob(data);

    // Emit job created event
    const jobCreatedEvent = new JobEvent.JobCreatedEvent(
      job.id,
      job.name,
      job.type,
      job.businessId
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await jobListener.onJobCreated(jobCreatedEvent);

    return job;
  }

  // Get job by ID
  async getJobById(id: string) {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  }

  // Get jobs by business ID
  async getJobsByBusinessId(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return jobRepository.findByBusinessId(businessId);
  }

  // Get jobs by type
  async getJobsByType(type: string) {
    return jobRepository.findByType(type);
  }

  // Get jobs by status
  async getJobsByStatus(status: string) {
    return jobRepository.findByStatus(status);
  }

  // Get pending jobs
  async getPendingJobs(limit: number = 10) {
    return jobRepository.findPendingJobs(limit);
  }

  // Update job
  async updateJob(id: string, data: {
    name?: string;
    type?: string;
    payload?: Record<string, unknown>;
    scheduledAt?: Date;
    status?: string;
  }) {
    // Check if job exists
    const existing = await jobRepository.findById(id);
    if (!existing) {
      throw new Error('Job not found');
    }

    // If businessId is being updated, verify business exists
    if (data.businessId) {
      const business = await businessRepository.findById(data.businessId);
      if (!business) {
        throw new Error('Business not found');
      }
    }

    // Update job
    const job = await jobRepository.updateJob(id, data);

    // Emit job updated event
    const jobUpdatedEvent = new JobEvent.JobUpdatedEvent(
      job.id,
      {
        name: data.name,
        type: data.type,
        payload: data.payload,
        scheduledAt: data.scheduledAt,
        status: data.status
      }
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await jobListener.onJobUpdated(jobUpdatedEvent);

    return job;
  }

  // Delete job
  async deleteJob(id: string) {
    // Check if job exists
    const existing = await jobRepository.findById(id);
    if (!existing) {
      throw new Error('Job not found');
    }

    // Delete job
    const job = await jobRepository.deleteJob(id);

    // Emit job deleted event
    const jobDeletedEvent = new JobEvent.JobDeletedEvent(
      job.id
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await jobListener.onJobDeleted(jobDeletedEvent);

    return job;
  }

  // Start job
  async startJob(id: string) {
    // Check if job exists
    const existing = await jobRepository.findById(id);
    if (!existing) {
      throw new Error('Job not found');
    }

    // Start job
    const job = await jobRepository.startJob(id);

    // Emit job started event
    const jobStartedEvent = new JobEvent.JobStartedEvent(
      job.id
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await jobListener.onJobStarted(jobStartedEvent);

    return job;
  }

  // Complete job
  async completeJob(id: string) {
    // Check if job exists
    const existing = await jobRepository.findById(id);
    if (!existing) {
      throw new Error('Job not found');
    }

    // Complete job
    const job = await jobRepository.completeJob(id);

    // Emit job completed event
    const jobCompletedEvent = new JobEvent.JobCompletedEvent(
      job.id
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await jobListener.onJobCompleted(jobCompletedEvent);

    return job;
  }

  // Fail job
  async failJob(id: string, errorMessage: string) {
    // Check if job exists
    const existing = await jobRepository.findById(id);
    if (!existing) {
      throw new Error('Job not found');
    }

    // Fail job
    const job = await jobRepository.failJob(id, errorMessage);

    // Emit job failed event
    const jobFailedEvent = new JobEvent.JobFailedEvent(
      job.id,
      errorMessage
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await jobListener.onJobFailed(jobFailedEvent);

    return job;
  }

  // Get job count
  async getJobCount() {
    return jobRepository.getCount();
  }

  // Get job count by business ID
  async getJobCountByBusinessId(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return jobRepository.getCountByBusinessId(businessId);
  }

  // Get job count by type
  async getJobCountByType(type: string) {
    return jobRepository.getCountByType(type);
  }

  // Get job count by status
  async getJobCountByStatus(status: string) {
    return jobRepository.getCountByStatus(status);
  }
}

// Export singleton instance
export const jobService = new JobService();