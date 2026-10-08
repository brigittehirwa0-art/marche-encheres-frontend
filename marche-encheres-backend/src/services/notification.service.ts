import { NotificationRepository } from '../repositories/notification.repository';

export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async findByUser(recipientId: string) {
    return this.notificationRepository.findByUser(recipientId);
  }

  async markAsRead(recipientId: string) {
    await this.notificationRepository.markAsRead(recipientId);
  }

  async markAsReadById(id: string) {
    return this.notificationRepository.markAsReadById(id);
  }
}
