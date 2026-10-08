import { PaymentRepository } from '../repositories/payment.repository';
import { ProductRepository } from '../repositories/product.repository';
import { BidRepository } from '../repositories/bid.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { AppError } from '../utils/errors';

export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private productRepository: ProductRepository,
    private bidRepository: BidRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async findAll() {
    return this.paymentRepository.findAll();
  }

  async findByUser(userId: string) {
    return this.paymentRepository.findByUser(userId);
  }

  async simulatePayment(productId: string, userId: string, userName: string) {
    const payment = await this.paymentRepository.findByProduct(productId);
    
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.winnerId !== userId) {
      throw new AppError('Only the winner can pay for this item', 403);
    }

    if (payment.status !== 'pending') {
      throw new AppError('Payment is not pending', 400);
    }

    const updatedPayment = await this.paymentRepository.updateStatus(payment.id, 'paid');
    
    // Update product status
    await this.productRepository.updateStatus(productId, 'sold');

    // Create notifications
    await this.notificationRepository.create({
      recipientId: payment.sellerId,
      title: 'Paiement reçu',
      body: `${userName} a réglé ${updatedPayment.product.title}. Vous pouvez préparer l'expédition.`,
      type: 'sale',
    });

    await this.notificationRepository.create({
      recipientId: userId,
      title: 'Acquisition confirmée',
      body: `Le paiement de ${updatedPayment.product.title} est confirmé.`,
      type: 'sale',
    });

    return updatedPayment;
  }

  async awardBid(productId: string, bidId: string, sellerId: string) {
    const product = await this.productRepository.findById(productId);
    const bid = await this.bidRepository.findById(bidId);

    if (!product || !bid) {
      throw new AppError('Product or bid not found', 404);
    }

    if (product.sellerId !== sellerId) {
      throw new AppError('Only the seller can award a bid', 403);
    }

    if (product.status !== 'active') {
      throw new AppError('Product is not active', 400);
    }

    // Delete any existing payment for this product
    await this.paymentRepository.deleteByProduct(productId);

    // Create payment window
    const payment = await this.paymentRepository.create({
      productId,
      sellerId,
      winnerId: bid.bidderId,
      amount: bid.amount,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Update product status
    await this.productRepository.updateStatus(productId, 'ended');

    // Create notifications
    await this.notificationRepository.create({
      recipientId: bid.bidderId,
      title: 'Votre offre est retenue',
      body: `${product.title} vous est réservé. Réglez votre acquisition sous 24 heures.`,
      type: 'sale',
    });

    await this.notificationRepository.create({
      recipientId: sellerId,
      title: 'Vente en attente de paiement',
      body: `${bid.bidderName} doit régler ${bid.amount} $US pour ${product.title}.`,
      type: 'sale',
    });

    return payment;
  }
}
