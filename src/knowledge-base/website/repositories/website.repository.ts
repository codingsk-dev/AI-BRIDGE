export class WebsiteRepository {
  async findByBusinessId(...args: any[]) { return null as any; }
  async updateWebsite(...args: any[]) { return null as any; }
  async createWebsite(...args: any[]) { return null as any; }
  async deleteWebsite(...args: any[]) { return null as any; }
  async updateCrawlStatus(...args: any[]) { return null as any; }
  async createPage(...args: any[]) { return null as any; }
  async deletePagesByWebsiteId(...args: any[]) { return null as any; }
  async getPagesByWebsiteId(...args: any[]) { return null as any; }

  async findById(id: string) { return null; }
  async findByUserId(id: string) { return null; }
  async create(data: any) { return data; }
}
export const websiteRepository = new WebsiteRepository();
