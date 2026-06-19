import { widgetRepository } from './repositories/widget.repository';
import { businessRepository } from '../business/repositories/business.repository';
import { logger } from '../../utils/logger';
import { WidgetEvent } from './events/widget.event';
import { widgetListener } from './listeners/widget.listener';

// Widget service
export class WidgetService {
  async getWidgetByBusinessId(...args: any[]) { return null as any; }
  async createWidget(...args: any[]) { return null as any; }
  async updateWidget(...args: any[]) { return null as any; }
  async deleteWidget(...args: any[]) { return null as any; }

  // Get widget for business
  async getWidgetByBusinessId(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    let widget = await widgetRepository.findByBusinessId(businessId);

    // If widget doesn't exist, create a default one
    if (!widget) {
      widget = await widgetRepository.createWidget({
        businessId
      });
    }

    return widget;
  }

  // Create widget for business
  async createWidget(businessId: string, data: {
    title?: string;
    theme?: string;
    position?: string;
    isEnabled?: boolean;
    customCss?: string;
  }) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    // Check if widget already exists
    const existing = await widgetRepository.findByBusinessId(businessId);
    if (existing) {
      throw new Error('Widget already exists for this business');
    }

    // Create widget
    const widget = await widgetRepository.createWidget({
      businessId,
      title: data.title,
      theme: data.theme,
      position: data.position,
      isEnabled: data.isEnabled,
      customCss: data.customCss
    });

    // Emit widget created event
    const widgetCreatedEvent = new WidgetEvent.WidgetCreatedEvent(
      widget.id,
      businessId
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await widgetListener.onWidgetCreated(widgetCreatedEvent);

    return widget;
  }

  // Update widget
  async updateWidget(businessId: string, data: {
    title?: string;
    theme?: string;
    position?: string;
    isEnabled?: boolean;
    customCss?: string;
  }) {
    // Get widget for business
    const widget = await widgetRepository.findByBusinessId(businessId);
    if (!widget) {
      throw new Error('Widget not found for business');
    }

    // Update widget
    const updatedWidget = await widgetRepository.updateWidget(widget.id, data);

    // Emit widget updated event
    const widgetUpdatedEvent = new WidgetEvent.WidgetUpdatedEvent(
      widget.id,
      data
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await widgetListener.onWidgetUpdated(widgetUpdatedEvent);

    return updatedWidget;
  }

  // Delete widget
  async deleteWidget(businessId: string) {
    // Get widget for business
    const widget = await widgetRepository.findByBusinessId(businessId);
    if (!widget) {
      throw new Error('Widget not found for business');
    }

    // Delete widget
    const deletedWidget = await widgetRepository.deleteWidget(widget.id);

    // Emit widget deleted event
    const widgetDeletedEvent = new WidgetEvent.WidgetDeletedEvent(
      widget.id
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await widgetListener.onWidgetDeleted(widgetDeletedEvent);

    return deletedWidget;
  }
}

// Export singleton instance
export const widgetService = new WidgetService();