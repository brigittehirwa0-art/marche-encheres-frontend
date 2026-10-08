import { CategoryRepository } from '../repositories/category.repository';
import { AppError } from '../utils/errors';

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async findAll() {
    return this.categoryRepository.findAll();
  }

  async findById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async create(data: { name: string; icon: string }) {
    return this.categoryRepository.create(data);
  }
}
