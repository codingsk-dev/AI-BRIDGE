export class HealthRepository {
  async storeHealthCheck(...args: any[]) { return null as any; }
  async getHealthCheckHistory(...args: any[]) { return null as any; }
  async getLatestHealthCheck(...args: any[]) { return null as any; }

  async findById(id: string) { return null; }
  async findByUserId(id: string) { return null; }
  async create(data: any) { return data; }
}
export const healthRepository = new HealthRepository();
