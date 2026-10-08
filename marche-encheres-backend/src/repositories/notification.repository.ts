import { prisma } from '../config/database';
import { Notification } from '@prisma/client';

export class NotificationRepository {
  async findByUser(recipientId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    recipientId?: string;
    title: string;
    body: string;
    type: string;
  }): Promise<Notification> {
    return prisma.notification.create({
      data,
    });
  }

  async markAsRead(recipientId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { recipientId },
      data: { read: true },
    });
  }

  async markAsReadById(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
}
