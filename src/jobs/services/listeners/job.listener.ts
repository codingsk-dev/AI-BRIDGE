export class JobListener {
  async onJobCreated(...args: any[]) { return null as any; }
  async onJobUpdated(...args: any[]) { return null as any; }
  async onJobDeleted(...args: any[]) { return null as any; }
  async onJobStarted(...args: any[]) { return null as any; }
  async onJobCompleted(...args: any[]) { return null as any; }
  async onJobFailed(...args: any[]) { return null as any; }
}
export const jobListener = new JobListener();
