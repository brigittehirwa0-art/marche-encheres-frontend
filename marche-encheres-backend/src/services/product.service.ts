import { ProductRepository } from '../repositories/product.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { AppError } from '../utils/errors';
import { CreateProductDto, UpdateProductDto, SearchFilters } from '../types';

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async findAll(filters: SearchFilters = {}) {
    return this.productRepository.findAll(filters);
  }

  async findById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async create(data: CreateProductDto, sellerId: string) {
    const product = await this.productRepository.create({
      ...data,
      endsAt: new Date(data.endsAt),
      sellerId,
    });

    // A notification failure must not turn a successfully saved listing into a 500.
    try {
      await this.notificationRepository.create({
        title: 'Nouvelle annonce publiée',
        body: `${product.title} est maintenant disponible aux enchères.`,
        type: 'system',
      });
    } catch (error) {
      console.error('Annonce créée, mais la notification n’a pas pu être enregistrée.', error);
    }

    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    await this.findById(id);
    return this.productRepository.update(id, data);
  }

  async findBySeller(sellerId: string) {
    return this.productRepository.findBySeller(sellerId);
  }

  async updateStatus(id: string, status: 'active' | 'ended' | 'unsold' | 'sold') {
    return this.productRepository.updateStatus(id, status);
  }
}
