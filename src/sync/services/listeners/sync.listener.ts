export class SyncListener {
  async onSyncJobCreated(...args: any[]) { return null as any; }
  async onSyncJobStarted(...args: any[]) { return null as any; }
  async onSyncJobCompleted(...args: any[]) { return null as any; }
  async onSyncJobFailed(...args: any[]) { return null as any; }
}
export const syncListener = new SyncListener();
