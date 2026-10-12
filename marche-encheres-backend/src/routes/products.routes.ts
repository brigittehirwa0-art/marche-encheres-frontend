import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../repositories/product.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createProductSchema, updateProductSchema, searchFiltersSchema } from '../utils/validators';

const router = Router();

const notificationRepository = new NotificationRepository();
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository, notificationRepository);
const productController = new ProductController(productService);

router.get('/', validateRequest(searchFiltersSchema), productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authMiddleware, validateRequest(createProductSchema), productController.create);
router.put('/:id', authMiddleware, validateRequest(updateProductSchema), productController.update);
router.get('/seller/my-products', authMiddleware, productController.getBySeller);

export default router;
