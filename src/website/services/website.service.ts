import { websiteRepository } from './repositories/website.repository';
import { businessRepository } from '../business/repositories/business.repository';
import { logger } from '../../utils/logger';
import { WebsiteEvent } from './events/website.event';
import { websiteListener } from './listeners/website.listener';
import axios from 'axios';
import cheerio from 'cheerio';
import { config } from '../../config';

// Website service
export class WebsiteService {
  async crawlWebsite(...args: any[]) { return null as any; }
  async setWebsiteUrl(...args: any[]) { return null as any; }
  async getWebsiteByBusinessId(...args: any[]) { return null as any; }
  async updateWebsite(...args: any[]) { return null as any; }
  async deleteWebsite(...args: any[]) { return null as any; }
  async recrawlWebsite(...args: any[]) { return null as any; }
  async getWebsitePages(...args: any[]) { return null as any; }

  // Set website URL for business
  async setWebsiteUrl(businessId: string, url: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    // Check if website already exists for this business
    let website = await websiteRepository.findByBusinessId(businessId);

    if (website) {
      // Update existing website
      website = await websiteRepository.updateWebsite(website.id, { url });
    } else {
      // Create new website
      website = await websiteRepository.createWebsite({
        businessId,
        url
      });
    }

    // Emit website updated event
    const websiteUpdatedEvent = new WebsiteEvent.WebsiteUpdatedEvent(
      website.id,
      businessId,
      { url }
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await websiteListener.onWebsiteUpdated(websiteUpdatedEvent);

    return website;
  }

  // Get website by business ID
  async getWebsiteByBusinessId(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    const website = await websiteRepository.findByBusinessId(businessId);
    if (!website) {
      throw new Error('Website not found for business');
    }
    return website;
  }

  // Update website information
  async updateWebsite(businessId: string, data: {
    title?: string;
    description?: string;
    faviconUrl?: string;
  }) {
    // Get website for business
    const website = await websiteRepository.findByBusinessId(businessId);
    if (!website) {
      throw new Error('Website not found for business');
    }

    // Update website
    const updatedWebsite = await websiteRepository.updateWebsite(website.id, data);

    // Emit website updated event
    const websiteUpdatedEvent = new WebsiteEvent.WebsiteUpdatedEvent(
      updatedWebsite.id,
      businessId,
      data
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await websiteListener.onWebsiteUpdated(websiteUpdatedEvent);

    return updatedWebsite;
  }

  // Delete website
  async deleteWebsite(businessId: string) {
    // Get website for business
    const website = await websiteRepository.findByBusinessId(businessId);
    if (!website) {
      throw new Error('Website not found for business');
    }

    // Delete website
    const deletedWebsite = await websiteRepository.deleteWebsite(website.id);

    // Emit website deleted event
    const websiteDeletedEvent = new WebsiteEvent.WebsiteDeletedEvent(
      website.id
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await websiteListener.onWebsiteDeleted(websiteDeletedEvent);

    return deletedWebsite;
  }

  // Crawl website (simplified version - in production this would be more sophisticated)
  async crawlWebsite(businessId: string) {
    // Get website for business
    const website = await websiteRepository.findByBusinessId(businessId);
    if (!website) {
      throw new Error('Website not found for business');
    }

    // Update crawl status to in_progress
    await websiteRepository.updateCrawlStatus(website.id, 'in_progress');

    try {
      // Emit crawl started event
      const crawlStartedEvent = new WebsiteEvent.WebsiteCrawlStartedEvent(
        website.id,
        businessId
      );
      await websiteListener.onWebsiteCrawlStarted(crawlStartedEvent);

      // Simplified crawling - in reality this would use a proper crawler
      // For now, we'll just fetch the homepage and extract basic info
      const response = await axios.get(website.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'AIBridge Website Crawler 1.0'
        }
      });

      const $ = cheerio.load(response.data);

      // Extract basic information
      const title = $('title').first().text().trim() || undefined;
      const description = $('meta[name="description"]').attr('content') || undefined;
      const faviconUrl = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href') || undefined;

      // Make favicon URL absolute if needed
      let absoluteFaviconUrl = faviconUrl;
      if (faviconUrl && !faviconUrl.startsWith('http')) {
        try {
          const urlObj = new URL(website.url);
          absoluteFaviconUrl = new URL(faviconUrl, urlObj.origin).toString();
        } catch (e) {
          // If URL parsing fails, leave as is
        }
      }

      // Update website with extracted info
      await websiteRepository.updateWebsite(website.id, {
        title,
        description,
        faviconUrl: absoluteFaviconUrl
      });

      // Create homepage page record
      await websiteRepository.createPage({
        websiteId: website.id,
        url: website.url,
        title,
        summary: description
      });

      // Update crawl status to completed
      await websiteRepository.updateCrawlStatus(website.id, 'completed', 1);

      // Emit crawl completed event
      const crawlCompletedEvent = new WebsiteEvent.WebsiteCrawlCompletedEvent(
        website.id,
        businessId,
        1 // pages crawled
      );
      await websiteListener.onWebsiteCrawlCompleted(crawlCompletedEvent);

      return {
        website,
        pagesCrawled: 1
      };
    } catch (error) {
      // Update crawl status to failed
      await websiteRepository.updateCrawlStatus(website.id, 'failed');

      // Emit crawl failed event
      const crawlFailedEvent = new WebsiteEvent.WebsiteCrawlFailedEvent(
        website.id,
        businessId,
        error.message
      );
      await websiteListener.onWebsiteCrawlFailed(crawlFailedEvent);

      throw error;
    }
  }

  // Recrawl website (delete existing pages and recrawl)
  async recrawlWebsite(businessId: string) {
    // Get website for business
    const website = await websiteRepository.findByBusinessId(businessId);
    if (!website) {
      throw new Error('Website not found for business');
    }

    // Delete existing pages
    await websiteRepository.deletePagesByWebsiteId(website.id);

    // Crawl website
    return this.crawlWebsite(businessId);
  }

  // Get website pages
  async getWebsitePages(businessId: string) {
    // Get website for business
    const website = await websiteRepository.findByBusinessId(businessId);
    if (!website) {
      throw new Error('Website not found for business');
    }

    return websiteRepository.getPagesByWebsiteId(website.id);
  }
}

// Export singleton instance
export const websiteService = new WebsiteService();