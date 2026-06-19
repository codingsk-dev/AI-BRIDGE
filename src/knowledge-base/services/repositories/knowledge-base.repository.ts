export class KnowledgeBaseRepository {
  async findByBusinessId(...args: any[]) { return null as any; }
  async createKnowledgeBase(...args: any[]) { return null as any; }
  async updateKnowledgeBase(...args: any[]) { return null as any; }
  async deleteKnowledgeBase(...args: any[]) { return null as any; }
  async incrementDocumentCount(...args: any[]) { return null as any; }
  async decrementDocumentCount(...args: any[]) { return null as any; }
  async incrementPageCount(...args: any[]) { return null as any; }
  async decrementPageCount(...args: any[]) { return null as any; }
  async setReady(...args: any[]) { return null as any; }

  async findById(id: string) { return null; }
  async findByUserId(id: string) { return null; }
  async create(data: any) { return data; }
}
export const knowledgeBaseRepository = new KnowledgeBaseRepository();
