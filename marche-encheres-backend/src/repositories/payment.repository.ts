import { prisma } from '../config/database';
import { PaymentWindow, PaymentStatus } from '@prisma/client';

export class PaymentRepository {
  async findAll(): Promise<PaymentWindow[]> {
    return prisma.paymentWindow.findMany({
      include: {
        product: {
          include: {
            category: true,
            seller: {
              select: {
                id: true,
                name: true,
                avatar: true,
                city: true,
              },
            },
          },
        },
        winner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string): Promise<PaymentWindow[]> {
    return prisma.paymentWindow.findMany({
      where: {
        OR: [
          { winnerId: userId },
          { sellerId: userId },
        ],
      },
      include: {
        product: {
          include: {
            category: true,
            seller: {
              select: {
                id: true,
                name: true,
                avatar: true,
                city: true,
              },
            },
          },
        },
        winner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByProduct(productId: string): Promise<PaymentWindow | null> {
    return prisma.paymentWindow.findFirst({
      where: { productId },
      include: {
        product: true,
        winner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
          },
        },
      },
    });
  }

  async create(data: {
    productId: string;
    sellerId: string;
    winnerId: string;
    amount: number;
    expiresAt: Date;
  }): Promise<PaymentWindow> {
    return prisma.paymentWindow.create({
      data,
      include: {
        product: true,
        winner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<PaymentWindow> {
    return prisma.paymentWindow.update({
      where: { id },
      data: { status },
      include: {
        product: true,
        winner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
          },
        },
      },
    });
  }

  async deleteByProduct(productId: string): Promise<void> {
    await prisma.paymentWindow.deleteMany({
      where: { productId },
    });
  }
}
