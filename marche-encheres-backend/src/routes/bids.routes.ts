import { Router } from 'express';
import { BidController } from '../controllers/bid.controller';
import { BidService } from '../services/bid.service';
import { BidRepository } from '../repositories/bid.repository';
import { ProductRepository } from '../repositories/product.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { placeBidSchema } from '../utils/validators';

const router = Router();

const productRepository = new ProductRepository();
const notificationRepository = new NotificationRepository();
const bidRepository = new BidRepository();
const bidService = new BidService(bidRepository, productRepository, notificationRepository);
const bidController = new BidController(bidService);

router.get('/product/:productId', bidController.getByProduct);
router.get('/my-bids', authMiddleware, bidController.getByUser);
router.post('/product/:productId', authMiddleware, validateRequest(placeBidSchema), bidController.placeBid);

export default router;
