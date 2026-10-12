import { prisma } from '../config/database';
import { Bid } from '@prisma/client';

export class BidRepository {
  async findByProduct(productId: string): Promise<Bid[]> {
    return prisma.bid.findMany({
      where: { productId },
      orderBy: { amount: 'desc' },
    });
  }

  async findByUser(bidderId: string): Promise<Bid[]> {
    return prisma.bid.findMany({
      where: { bidderId },
      orderBy: { createdAt: 'desc' },
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
      },
    });
  }

  async create(data: {
    productId: string;
    bidderId: string;
    bidderName: string;
    amount: number;
  }): Promise<Bid> {
    return prisma.bid.create({
      data,
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
      },
    });
  }

  async findHighestBid(productId: string): Promise<Bid | null> {
    return prisma.bid.findFirst({
      where: { productId },
      orderBy: { amount: 'desc' },
    });
  }

  async findById(id: string): Promise<Bid | null> {
    return prisma.bid.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  }
}
