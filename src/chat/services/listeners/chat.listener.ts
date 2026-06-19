export class ChatListener {
  async onChatSessionCreated(...args: any[]) { return null as any; }
  async onMessageCreated(...args: any[]) { return null as any; }
  async onChatSessionEnded(...args: any[]) { return null as any; }
}
export const chatListener = new ChatListener();
