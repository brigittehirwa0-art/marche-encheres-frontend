import { prisma } from '../config/database';
import { Category } from '@prisma/client';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async create(data: { name: string; icon: string }): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }
}
