import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../services/payment.service';
import { PaymentRepository } from '../repositories/payment.repository';
import { ProductRepository } from '../repositories/product.repository';
import { BidRepository } from '../repositories/bid.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

const productRepository = new ProductRepository();
const bidRepository = new BidRepository();
const notificationRepository = new NotificationRepository();
const paymentRepository = new PaymentRepository();
const paymentService = new PaymentService(paymentRepository, productRepository, bidRepository, notificationRepository);
const paymentController = new PaymentController(paymentService);

router.get('/', authMiddleware, paymentController.getAll);
router.get('/my-payments', authMiddleware, paymentController.getByUser);
router.post('/:productId/simulate-payment', authMiddleware, paymentController.simulatePayment);
router.post('/:productId/award/:bidId', authMiddleware, paymentController.awardBid);

export default router;
