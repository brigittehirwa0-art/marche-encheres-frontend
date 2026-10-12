import { api } from '@/core/api-client';
import type { Notification } from '@/core/types';

interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

export const usersApi = {
  notifications: async (): Promise<Notification[]> => {
    const response = await api.get<NotificationsResponse>('/notifications');
    return response.data;
  },
  markNotificationsRead: async (): Promise<void> => {
    await api.put('/notifications/mark-read');
  },
};