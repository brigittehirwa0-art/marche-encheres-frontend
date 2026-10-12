import { prisma } from '../config/database';
import type { Product, ProductStatus } from '@prisma/client';
import type { SearchFilters } from '../types';

export class ProductRepository {
  async findAll(filters: SearchFilters = {}): Promise<Product[]> {
    const where: any = {
      // Keep finished and unsold auctions visible in the catalogue for reference.
      status: { in: ['active', 'ended', 'unsold'] },
    };

    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
        { city: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    if (filters.category) {
      where.categoryId = filters.category;
    }

    if (filters.condition) {
      where.condition = filters.condition;
    }

    if (filters.maxPrice) {
      where.currentPrice = { lte: filters.maxPrice };
    }

    if (filters.city) {
      where.city = filters.city;
    }

    if (filters.deadline === '24h') {
      where.endsAt = { lte: new Date(Date.now() + 24 * 60 * 60 * 1000) };
    }

    const orderBy: any = {};
    const sort = filters.sort || 'recent';
    
    if (sort === 'ending') {
      orderBy.endsAt = 'asc';
    } else if (sort === 'price-low') {
      orderBy.currentPrice = 'asc';
    } else if (sort === 'price-high') {
      orderBy.currentPrice = 'desc';
    } else {
      orderBy.publishedAt = 'desc';
    }

    return prisma.product.findMany({
      where,
      orderBy,
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
        images: true,
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
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
        images: true,
      },
    });
  }

  async create(data: {
    title: string;
    description: string;
    categoryId: string;
    condition: string;
    startPrice: number;
    city: string;
    endsAt: Date;
    images: string[];
    sellerId: string;
  }): Promise<Product> {
    const { images, ...productData } = data;
    return prisma.product.create({
      data: {
        ...productData,
        currentPrice: data.startPrice,
        images: {
          create: images.map((url) => ({ url })),
        },
      },
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
        images: true,
      },
    });
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
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
        images: true,
      },
    });
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { status },
    });
  }

  async findBySeller(sellerId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { sellerId },
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
        images: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
  }
}
