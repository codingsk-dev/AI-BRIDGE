export class WebsiteListener {
  async onWebsiteUpdated(...args: any[]) { return null as any; }
  async onWebsiteDeleted(...args: any[]) { return null as any; }
  async onWebsiteCrawlStarted(...args: any[]) { return null as any; }
  async onWebsiteCrawlCompleted(...args: any[]) { return null as any; }
  async onWebsiteCrawlFailed(...args: any[]) { return null as any; }
}
export const websiteListener = new WebsiteListener();
