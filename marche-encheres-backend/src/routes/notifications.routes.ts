import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../services/notification.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.get('/', authMiddleware, notificationController.getByUser);
router.put('/mark-read', authMiddleware, notificationController.markAsRead);
router.put('/:id/mark-read', authMiddleware, notificationController.markAsReadById);

export default router;
