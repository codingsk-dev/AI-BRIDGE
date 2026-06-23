import { Request, Response, NextFunction } from 'express';
import { businessRepository } from '../../business/repositories/business.repository';
import { websiteUrlSchema, updateWebsiteSchema } from '../validators/website.validator';
import { websiteService } from '../services/website.service';

async function resolveBusiness(req: Request): Promise<string | { error: string; status: number }> {
  const userId = req.user?.id;
  if (!userId) return { error: 'Unauthorized', status: 401 };

  const businessId = req.body?.businessId || req.query?.businessId;
  if (businessId) {
    const business = await businessRepository.findById(businessId as string);
    if (business && business.userId === userId) {
      return business.id;
    }
  }

  // If no businessId provided, or the business was not found, create a new one.
  const url = typeof req.body?.url === 'string' ? req.body.url : null;
  const derivedName = url ? safeDomainLabel(url) : 'My Business';
  const newBusiness = await businessRepository.createBusiness({
    userId,
    name: derivedName,
    industry: 'OTHER',
    websiteUrl: url ?? undefined,
  });
  return newBusiness.id;
}

function safeDomainLabel(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    // amazon.in → "Amazon", stripe.com → "Stripe"
    const root = host.split('.')[0] || host;
    return root.charAt(0).toUpperCase() + root.slice(1);
  } catch {
    return 'My Business';
  }
}

export class WebsiteController {
  // POST /api/website/url
  async setUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const resolved = await resolveBusiness(req);
      if (typeof resolved !== 'string') {
        return res.status(resolved.status).json({ error: resolved.error });
      }
      const body = websiteUrlSchema.parse(req.body);
      const website = await websiteService.setWebsiteUrl(resolved, body.url);
      // Keep the Business row's `name` in sync with the current URL's
      // domain label. Otherwise the next chat will still see the
      // old "Bombay Shirts" / "Bookzstore" / etc. name even after the
      // user has pasted a different website. Only auto-rename rows
      // that still hold the placeholder or a previous auto-derived
      // name — never clobber something the user typed in by hand.
      const derived = safeDomainLabel(body.url);
      const current = await businessRepository.findById(resolved);
      if (current) {
        const updateData: { name?: string; websiteUrl: string } = { websiteUrl: body.url };
        if (current.name === 'My Business' || current.name === safeDomainLabel(current.websiteUrl ?? '')) {
          updateData.name = derived;
        }
        await businessRepository.updateBusiness(resolved, updateData);
      }
      const updatedBusiness = await businessRepository.findById(resolved);
      return res.status(200).json({ message: 'Website URL set successfully', website, business: updatedBusiness });
    } catch (error) {
      return next(error);
    }
  }

  // GET /api/website
  async getByBusinessId(req: Request, res: Response, next: NextFunction) {
    try {
      const resolved = await resolveBusiness(req);
      if (typeof resolved !== 'string') {
        return res.status(resolved.status).json({ error: resolved.error });
      }
      const website = await websiteService.getWebsiteByBusinessId(resolved);
      return res.status(200).json({ website });
    } catch (error) {
      return next(error);
    }
  }

  // PUT /api/website
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const resolved = await resolveBusiness(req);
      if (typeof resolved !== 'string') {
        return res.status(resolved.status).json({ error: resolved.error });
      }
      const body = updateWebsiteSchema.parse(req.body);
      const website = await websiteService.updateWebsite(resolved, {
        url: body.url,
        title: body.title ?? undefined,
        description: body.description ?? undefined,
        faviconUrl: body.faviconUrl ?? undefined,
      });
      return res.status(200).json({ message: 'Website updated successfully', website });
    } catch (error) {
      return next(error);
    }
  }

  // DELETE /api/website
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const resolved = await resolveBusiness(req);
      if (typeof resolved !== 'string') {
        return res.status(resolved.status).json({ error: resolved.error });
      }
      await websiteService.deleteWebsite(resolved);
      return res.status(200).json({ message: 'Website deleted successfully' });
    } catch (error) {
      return next(error);
    }
  }

  // POST /api/website/crawl
  async crawl(req: Request, res: Response, next: NextFunction) {
    try {
      const resolved = await resolveBusiness(req);
      if (typeof resolved !== 'string') {
        return res.status(resolved.status).json({ error: resolved.error });
      }
      const result = await websiteService.crawlWebsite(resolved);
      return res.status(200).json({
        message: 'Website crawled successfully',
        website: result.website,
        pagesCrawled: result.pagesCrawled,
      });
    } catch (error) {
      return next(error);
    }
  }

  // POST /api/website/recrawl
  async recrawl(req: Request, res: Response, next: NextFunction) {
    try {
      const resolved = await resolveBusiness(req);
      if (typeof resolved !== 'string') {
        return res.status(resolved.status).json({ error: resolved.error });
      }
      const result = await websiteService.recrawlWebsite(resolved);
      return res.status(200).json({
        message: 'Website recrawled successfully',
        website: result.website,
        pagesCrawled: result.pagesCrawled,
      });
    } catch (error) {
      return next(error);
    }
  }

  // GET /api/website/pages
  async getPages(req: Request, res: Response, next: NextFunction) {
    try {
      const resolved = await resolveBusiness(req);
      if (typeof resolved !== 'string') {
        return res.status(resolved.status).json({ error: resolved.error });
      }
      const pages = await websiteService.getWebsitePages(resolved);
      return res.status(200).json({ pages });
    } catch (error) {
      return next(error);
    }
  }
}

export const websiteController = new WebsiteController();
