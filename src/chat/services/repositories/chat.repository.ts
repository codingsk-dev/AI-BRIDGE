export class ChatRepository {
  async findVisitorBySessionId(...args: any[]) { return null as any; }
  async createVisitor(...args: any[]) { return null as any; }
  async createChatSession(...args: any[]) { return null as any; }
  async findBySessionToken(...args: any[]) { return null as any; }
  async findByBusinessId(...args: any[]) { return null as any; }
  async findByVisitorId(...args: any[]) { return null as any; }
  async createMessage(...args: any[]) { return null as any; }
  async getMessageCountByChatSessionId(...args: any[]) { return null as any; }
  async updateMessageCount(...args: any[]) { return null as any; }
  async getMessagesByChatSessionId(...args: any[]) { return null as any; }
  async endChatSession(...args: any[]) { return null as any; }

  async findById(id: string) { return null; }
  async findByUserId(id: string) { return null; }
  async create(data: any) { return data; }
}
export const chatRepository = new ChatRepository();
