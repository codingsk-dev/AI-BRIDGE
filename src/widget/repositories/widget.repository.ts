import { prisma } from '../../lib/prisma';
import { Widget } from '@prisma/client';

// Widget repository
export class WidgetRepository {
  async findByBusinessId(...args: any[]) { return null as any; }
  async createWidget(...args: any[]) { return null as any; }
  async updateWidget(...args: any[]) { return null as any; }
  async deleteWidget(...args: any[]) { return null as any; }

  // Find widget by ID
  async findById(id: string): Promise<Widget | null> {
    return prisma.widget.findUnique({
      where: { id }
    });
  }

  // Find widget by business ID
  async findByBusinessId(businessId: string): Promise<Widget | null> {
    return prisma.widget.findUnique({
      where: { businessId }
    });
  }

  // Create widget
  async createWidget(data: {
    businessId: string;
    title?: string;
    theme?: string;
    position?: string;
    isEnabled?: boolean;
    customCss?: string;
  }): Promise<Widget> {
    return prisma.widget.create({
      data: {
        businessId: data.businessId,
        title: data.title || 'AI Assistant',
        theme: data.theme || 'LIGHT',
        position: data.position || 'BOTTOM_RIGHT',
        isEnabled: data.isEnabled ?? true,
        customCss: data.customCss
      }
    });
  }

  // Update widget
  async updateWidget(id: string, data: Partial<Omit<Widget, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>>): Promise<Widget> {
    return prisma.widget.update({
      where: { id },
      data
    });
  }

  // Delete widget (soft delete)
  async deleteWidget(id: string): Promise<Widget> {
    return prisma.widget.update({
      where: { id },
      data: {  }
    });
  }
}

// Export singleton instance
export const widgetRepository = new WidgetRepository();