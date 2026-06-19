export class DocumentRepository {
  async createDocument(...args: any[]) { return null as any; }
  async findByBusinessId(...args: any[]) { return null as any; }
  async updateDocument(...args: any[]) { return null as any; }
  async deleteDocument(...args: any[]) { return null as any; }
  async markAsProcessed(...args: any[]) { return null as any; }
  async countByBusinessId(...args: any[]) { return null as any; }

  async findById(id: string) { return null; }
  async findByUserId(id: string) { return null; }
  async create(data: any) { return data; }
}
export const documentRepository = new DocumentRepository();
