export class UserListener {
  async onUserUpdated(...args: any[]) { return null as any; }
  async onUserDeleted(...args: any[]) { return null as any; }
  async onUserVerified(...args: any[]) { return null as any; }
  async onPasswordUpdated(...args: any[]) { return null as any; }
}
export const userListener = new UserListener();
