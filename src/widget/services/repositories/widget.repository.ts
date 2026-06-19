export class WidgetRepository {
  async findByBusinessId(...args: any[]) { return null as any; }
  async createWidget(...args: any[]) { return null as any; }
  async updateWidget(...args: any[]) { return null as any; }
  async deleteWidget(...args: any[]) { return null as any; }

  async findById(id: string) { return null; }
  async findByUserId(id: string) { return null; }
  async create(data: any) { return data; }
}
export const widgetRepository = new WidgetRepository();
