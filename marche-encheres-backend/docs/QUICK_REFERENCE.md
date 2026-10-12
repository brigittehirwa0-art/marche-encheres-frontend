# 📋 Node.js Express Backend - Quick Reference

> **Copy-paste templates for rapid development**
>
> **Architecture**: Layered Architecture (Routes → Controllers → Services → Repositories → Database)
>
> For large apps (10+ features), consider Modular/Feature-Based architecture (see alternative below)

---

## 🚀 New Feature Scaffold Script

```bash
# Create feature structure
FEATURE="products"  # Change this!

mkdir -p src/{routes,controllers,services,repositories,models,middlewares,utils,types}

# Create files
touch src/routes/${FEATURE}.routes.ts
touch src/controllers/${FEATURE}.controller.ts
touch src/services/${FEATURE}.service.ts
touch src/repositories/${FEATURE}.repository.ts
touch src/models/${FEATURE}.model.ts
touch src/types/${FEATURE}.types.ts
touch src/utils/${FEATURE}.validators.ts
```

---

## 📦 Layer Templates

### Model (MongoDB - Mongoose)

```typescript
// models/Product.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
```

### Model (PostgreSQL - Prisma)

```prisma
// prisma/schema.prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String
  price       Float
  category    String
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Repository (MongoDB)

```typescript
// repositories/product.repository.ts
import { IProduct, Product } from '../models/Product.model';
import { CreateProductDto, UpdateProductDto } from '../types/product.types';

export class ProductRepository {
  async findAll(): Promise<IProduct[]> {
    return Product.find();
  }

  async findById(id: string): Promise<IProduct | null> {
    return Product.findById(id);
  }

  async create(data: CreateProductDto): Promise<IProduct> {
    const product = new Product(data);
    return product.save();
  }

  async update(id: string, data: UpdateProductDto): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }
}
```

### Repository (PostgreSQL)

```typescript
// repositories/product.repository.ts
import { PrismaClient, Product } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from '../types/product.types';

export class ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.product.delete({ where: { id } });
    return true;
  }
}
```

### Service

```typescript
// services/product.service.ts
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto } from '../types/product.types';
import { AppError } from '../utils/errors';

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async findAll() {
    return this.productRepository.findAll();
  }

  async findById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    // Business logic validation
    if (data.price < 0) {
      throw new AppError('Price cannot be negative', 400);
    }

    return this.productRepository.create(data);
  }

  async update(id: string, data: UpdateProductDto) {
    await this.findById(id); // Ensure exists
    return this.productRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id); // Ensure exists
    return this.productRepository.delete(id);
  }
}
```

### Controller

```typescript
// controllers/product.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../types/product.types';

export class ProductController {
  constructor(private productService: ProductService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.findAll();
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await this.productService.findById(id);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productData: CreateProductDto = req.body;
      const product = await this.productService.create(productData);
      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const productData: UpdateProductDto = req.body;
      const product = await this.productService.update(id, productData);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.productService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
```

### Routes

```typescript
// routes/product.routes.ts
import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../repositories/product.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createProductSchema, updateProductSchema } from '../utils/validators';

const router = Router();

// Dependency injection
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Routes
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authMiddleware, validateRequest(createProductSchema), productController.create);
router.put('/:id', authMiddleware, validateRequest(updateProductSchema), productController.update);
router.delete('/:id', authMiddleware, productController.delete);

export default router;
```

### Types

```typescript
// types/product.types.ts
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
```

### Validators

```typescript
// utils/validators.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be positive'),
    category: z.string().min(1, 'Category is required'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    category: z.string().min(1).optional(),
    stock: z.number().int().min(0).optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
```

---

## 🔧 Core Templates

### Error Classes

```typescript
// utils/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}
```

### Error Middleware

```typescript
// middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

### Auth Middleware

```typescript
// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};
```

### Validation Middleware

```typescript
// middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/errors';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      next(new AppError(error.errors[0].message, 400));
    }
  };
};
```

### Route Aggregator

```typescript
// routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import productRoutes from './product.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);

export default router;
```

### App Setup

```typescript
// app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorMiddleware } from './middlewares/error.middleware';
import { rateLimitMiddleware } from './middlewares/rateLimit.middleware';
import routes from './routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimitMiddleware);

// Routes
app.use('/api/v1', routes);

// Error handling (must be last)
app.use(errorMiddleware);

export default app;
```

### Server Entry

```typescript
// server.ts
import app from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

---

## 🏗️ Alternative: Modular/Feature-Based Structure

For **large applications** (10+ features), consider organizing by feature:

```bash
# Modular structure scaffold
FEATURE="products"

mkdir -p src/features/$FEATURE
touch src/features/$FEATURE/${FEATURE}.controller.ts
touch src/features/$FEATURE/${FEATURE}.service.ts
touch src/features/$FEATURE/${FEATURE}.repository.ts
touch src/features/$FEATURE/${FEATURE}.routes.ts
touch src/features/$FEATURE/${FEATURE}.model.ts
touch src/features/$FEATURE/${FEATURE}.types.ts
```

**Structure:**
```
src/
├── features/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.model.ts
│   │   └── auth.types.ts
│   └── products/
│       └── [same structure]
├── shared/
│   ├── middleware/
│   ├── utils/
│   └── config/
└── app.ts
```

**When to use:** Large apps with 10+ features or multiple teams working in parallel.

---

## ✅ Quick Checklist

When creating a new feature (Layered Architecture):

- [ ] Create model in `models/[feature].model.ts`
- [ ] Create repository in `repositories/[feature].repository.ts`
- [ ] Create service in `services/[feature].service.ts`
- [ ] Create controller in `controllers/[feature].controller.ts`
- [ ] Create routes in `routes/[feature].routes.ts`
- [ ] Add types in `types/[feature].types.ts`
- [ ] Add validators in `utils/validators.ts`
- [ ] Register routes in `routes/index.ts`

---

## 💡 Architecture Notes

- **Layered Architecture** (this guide) - Standard for most Express.js projects
- **Modular Architecture** - Consider for large/enterprise apps
- **Start simple** - Begin with layered, migrate to modular only when needed

---

> 💡 **Tip**: Keep this file open while coding for quick copy-paste!
