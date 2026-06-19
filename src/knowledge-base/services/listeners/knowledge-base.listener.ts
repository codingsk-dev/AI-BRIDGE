export class KnowledgeBaseListener {
  async onKnowledgeBaseCreated(...args: any[]) { return null as any; }
  async onKnowledgeBaseUpdated(...args: any[]) { return null as any; }
  async onKnowledgeBaseDeleted(...args: any[]) { return null as any; }
}
export const knowledgeBaseListener = new KnowledgeBaseListener();
