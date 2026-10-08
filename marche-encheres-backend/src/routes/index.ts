import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './products.routes';
import bidRoutes from './bids.routes';
import categoryRoutes from './categories.routes';
import notificationRoutes from './notifications.routes';
import paymentRoutes from './payments.routes';
import uploadRoutes from './uploads.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/bids', bidRoutes);
router.use('/categories', categoryRoutes);
router.use('/notifications', notificationRoutes);
router.use('/payments', paymentRoutes);
router.use('/uploads', uploadRoutes);

export default router;
