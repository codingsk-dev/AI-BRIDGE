export class WidgetListener {
  async onWidgetCreated(...args: any[]) { return null as any; }
  async onWidgetUpdated(...args: any[]) { return null as any; }
  async onWidgetDeleted(...args: any[]) { return null as any; }
}
export const widgetListener = new WidgetListener();
