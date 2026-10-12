import { BidRepository } from '../repositories/bid.repository';
import { ProductRepository } from '../repositories/product.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { AppError } from '../utils/errors';
import { PlaceBidDto } from '../types';

export class BidService {
  constructor(
    private bidRepository: BidRepository,
    private productRepository: ProductRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async findByProduct(productId: string) {
    return this.bidRepository.findByProduct(productId);
  }

  async findByUser(bidderId: string) {
    return this.bidRepository.findByUser(bidderId);
  }

  async placeBid(productId: string, data: PlaceBidDto, userId: string, userName: string) {
    const product = await this.productRepository.findById(productId);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.status !== 'active') {
      throw new AppError('Auction has ended', 400);
    }

    if (new Date(product.endsAt) <= new Date()) {
      throw new AppError('Auction has ended', 400);
    }

    if (product.sellerId === userId) {
      throw new AppError('You cannot bid on your own product', 400);
    }

    if (data.amount <= product.currentPrice) {
      throw new AppError(`Bid must be higher than current price (${product.currentPrice})`, 400);
    }

    const bid = await this.bidRepository.create({
      productId,
      bidderId: userId,
      bidderName: userName,
      amount: data.amount,
    });

    // Update product current price
    await this.productRepository.update(productId, {
      currentPrice: data.amount,
    });

    // Create notifications
    await this.notificationRepository.create({
      recipientId: userId,
      title: 'Enchère enregistrée',
      body: `Votre offre sur ${product.title} est bien prise en compte.`,
      type: 'bid',
    });

    await this.notificationRepository.create({
      recipientId: product.sellerId,
      title: 'Nouvelle offre reçue',
      body: `${userName} propose ${data.amount} $US sur ${product.title}.`,
      type: 'sale',
    });

    return bid;
  }
}
