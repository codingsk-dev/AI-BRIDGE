export class SyncRepository {
  async createSyncJob(...args: any[]) { return null as any; }
  async findByBusinessId(...args: any[]) { return null as any; }
  async findByBusinessIdAndStatus(...args: any[]) { return null as any; }
  async findLatestByBusinessIdAndType(...args: any[]) { return null as any; }
  async startSyncJob(...args: any[]) { return null as any; }
  async completeSyncJob(...args: any[]) { return null as any; }
  async failSyncJob(...args: any[]) { return null as any; }
  async getCountByBusinessId(...args: any[]) { return null as any; }

  async findById(id: string) { return null; }
  async findByUserId(id: string) { return null; }
  async create(data: any) { return data; }
}
export const syncRepository = new SyncRepository();
