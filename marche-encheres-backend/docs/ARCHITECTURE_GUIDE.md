# 🚀 Node.js Express Backend Architecture Guide

> **Production-Ready Backend Architecture with MongoDB & PostgreSQL**
>
> This guide follows **layered architecture** principles with clear separation of concerns, suitable for both MongoDB and PostgreSQL.
>
> 📅 Last Updated: January 2026

---

## 📑 Table of Contents

1. [Quick Start](#-quick-start)
2. [Architecture Philosophy](#-architecture-philosophy)
3. [Project Structure](#-project-structure)
4. [Layered Architecture](#-layered-architecture)
5. [Database Patterns](#-database-patterns)
6. [API Design](#-api-design)
7. [Error Handling](#-error-handling)
8. [Authentication & Authorization](#-authentication--authorization)
9. [Validation](#-validation)
10. [Testing](#-testing)
11. [Best Practices](#-best-practices)
12. [New Feature Checklist](#-new-feature-checklist)

---

## 🏁 Quick Start

### Required Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.23.8",
    "express-validator": "^7.0.1",
    "winston": "^3.11.0",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/express": "^4.17.21",
    "@types/node": "^22.0.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0"
  }
}
```

### Initialize Project

```bash
# Create project
mkdir my-backend && cd my-backend
npm init -y

# Install dependencies
npm install express mongoose pg dotenv cors helmet express-rate-limit bcryptjs jsonwebtoken zod express-validator winston compression

# Install dev dependencies
npm install -D typescript @types/express @types/node @types/bcryptjs @types/jsonwebtoken @types/cors ts-node-dev jest @types/jest eslint prettier

# Initialize TypeScript
npx tsc --init

# Create folder structure (see below)
```

---

## 🎯 Architecture Philosophy

### Architecture Approaches

This guide follows **Layered Architecture**, which is the **recommended standard** for Express.js applications. For very large/enterprise applications, consider **Modular/Feature-Based** architecture (see alternative structure below).

### Core Principles

1. **Layered Architecture** - Clear separation: Routes → Controllers → Services → Repositories → Database
2. **Separation of Concerns** - Each layer has a single responsibility
3. **Dependency Injection** - Services depend on abstractions, not implementations
4. **Error Handling** - Centralized error handling middleware
5. **Type Safety** - TypeScript throughout
6. **Validation** - Input validation at boundaries (routes/controllers)

### When to Use Layered vs Modular

**Layered Architecture (This Guide)** ✅ Recommended for:
- Small to medium-sized applications
- Teams new to Express.js
- Projects requiring clear, explicit boundaries
- Standard REST APIs

**Modular/Feature-Based Architecture** Consider for:
- Large/enterprise applications (10+ features)
- Multiple teams working in parallel
- Microservices preparation
- Complex domain logic

> **Note**: Most Express.js projects use layered architecture. Start with layered, migrate to modular only if you outgrow it.

### Mental Model

```
┌─────────────────────────────────────────┐
│         HTTP Request                     │
│              ↓                           │
│  Routes → Middleware → Controller        │
│              ↓                           │
│         Service Layer                    │
│    (Business Logic & Orchestration)      │
│              ↓                           │
│      Repository Layer                    │
│      (Data Access)                       │
│              ↓                           │
│         Database                         │
│    (MongoDB / PostgreSQL)               │
└─────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── config/                          # 🔧 Configuration
│   ├── database.ts                  # DB connection (MongoDB/PostgreSQL)
│   ├── env.ts                       # Environment variables validation
│   └── logger.ts                    # Winston logger setup
│
├── routes/                          # 🗺️ API Routes
│   ├── index.ts                     # Route aggregator
│   ├── auth.routes.ts
│   ├── users.routes.ts
│   ├── products.routes.ts
│   └── [feature].routes.ts
│
├── controllers/                     # 🎮 Request Handlers
│   ├── auth.controller.ts
│   ├── users.controller.ts
│   ├── products.controller.ts
│   └── [feature].controller.ts
│
├── services/                        # 💼 Business Logic
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── products.service.ts
│   └── [feature].service.ts
│
├── repositories/                    # 📦 Data Access Layer
│   ├── user.repository.ts
│   ├── product.repository.ts
│   └── [feature].repository.ts
│
├── models/                          # 📋 Database Models/Schemas
│   ├── User.model.ts               # Mongoose schema or Prisma model
│   ├── Product.model.ts
│   └── [feature].model.ts
│
├── middlewares/                     # 🛡️ Middleware
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── validation.middleware.ts
│   └── rateLimit.middleware.ts
│
├── utils/                           # 🛠️ Utilities
│   ├── errors.ts                    # Custom error classes
│   ├── validators.ts                # Zod schemas
│   ├── helpers.ts                   # Helper functions
│   └── constants.ts                 # App constants
│
├── types/                           # 📝 TypeScript Types
│   ├── express.d.ts                 # Express type extensions
│   └── [feature].types.ts
│
├── app.ts                           # Express app setup
└── server.ts                        # Server entry point
```

---

## 🏗️ Layered Architecture

### Layer Responsibilities

#### 1. Routes Layer (`routes/`)
- Define API endpoints
- Map routes to controllers
- Apply route-specific middleware

#### 2. Controllers Layer (`controllers/`)
- Handle HTTP request/response
- Extract and validate request data
- Call services
- Format responses

#### 3. Services Layer (`services/`)
- Business logic
- Orchestrate multiple repositories
- Handle transactions
- No HTTP concerns

#### 4. Repositories Layer (`repositories/`)
- Database operations
- Query building
- Data transformation
- Database-agnostic interface

---

## 📦 Database Patterns

### MongoDB Pattern (Mongoose)

#### Model (`models/User.model.ts`)

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
```

#### Repository (`repositories/user.repository.ts`)

```typescript
import { IUser, User } from '../models/User.model';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';

export class UserRepository {
  async findAll(): Promise<IUser[]> {
    return User.find().select('-password');
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-password');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select('+password');
  }

  async create(data: CreateUserDto): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  async update(id: string, data: UpdateUserDto): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true }).select('-password');
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
}
```

### PostgreSQL Pattern (pg/Prisma)

#### Model with Prisma (`prisma/schema.prisma`)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  USER
}
```

#### Repository (`repositories/user.repository.ts`)

```typescript
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserDto): Promise<Omit<User, 'password'>> {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<Omit<User, 'password'>> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.user.delete({ where: { id } });
    return true;
  }
}
```

---

## 🎮 Controllers

### Example Controller (`controllers/users.controller.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';
import { AppError } from '../utils/errors';

export class UserController {
  constructor(private userService: UserService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.findAll();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(id);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const user = await this.userService.create(userData);
      
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userData: UpdateUserDto = req.body;
      const user = await this.userService.update(id, userData);
      
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.userService.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
```

---

## 💼 Services

### Example Service (`services/user.service.ts`)

```typescript
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';
import { AppError } from '../utils/errors';
import bcrypt from 'bcryptjs';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll() {
    return this.userRepository.findAll();
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async update(id: string, data: UpdateUserDto) {
    // Check if user exists
    await this.findById(id);

    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.userRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.userRepository.delete(id);
  }
}
```

---

## 🗺️ Routes

### Example Routes (`routes/users.routes.ts`)

```typescript
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createUserSchema, updateUserSchema } from '../utils/validators';

const router = Router();

// Dependency injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Routes
router.get('/', authMiddleware, userController.getAll);
router.get('/:id', authMiddleware, userController.getById);
router.post('/', validateRequest(createUserSchema), userController.create);
router.put('/:id', authMiddleware, validateRequest(updateUserSchema), userController.update);
router.delete('/:id', authMiddleware, userController.delete);

export default router;
```

---

## 🛡️ Middleware

### Error Middleware (`middlewares/error.middleware.ts`)

```typescript
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

  // Unknown error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

### Auth Middleware (`middlewares/auth.middleware.ts`)

```typescript
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

### Validation Middleware (`middlewares/validation.middleware.ts`)

```typescript
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

---

## 🔧 Utilities

### Custom Errors (`utils/errors.ts`)

```typescript
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

### Validators (`utils/validators.ts`)

```typescript
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name is required'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    name: z.string().min(1).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});
```

---

## 🚀 App Setup (`app.ts`)

```typescript
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

---

## ✅ New Feature Checklist

When adding a new feature:

### 1. Database Layer
- [ ] Create model/schema (`models/[feature].model.ts`)
- [ ] Create repository (`repositories/[feature].repository.ts`)

### 2. Business Logic
- [ ] Create service (`services/[feature].service.ts`)
- [ ] Define DTOs/types (`types/[feature].types.ts`)

### 3. API Layer
- [ ] Create controller (`controllers/[feature].controller.ts`)
- [ ] Create routes (`routes/[feature].routes.ts`)
- [ ] Add validation schemas (`utils/validators.ts`)

### 4. Integration
- [ ] Register routes in `routes/index.ts`
- [ ] Add error handling
- [ ] Add authentication middleware if needed

---

## 🏗️ Alternative: Modular/Feature-Based Architecture

For **large applications**, consider organizing by feature instead of layer:

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
│   ├── products/
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── products.repository.ts
│   │   ├── products.routes.ts
│   │   ├── products.model.ts
│   │   └── products.types.ts
│   └── [other-features]/
├── shared/
│   ├── middleware/
│   ├── utils/
│   └── config/
└── app.ts
```

**Benefits:**
- Features are self-contained and independent
- Easier for multiple developers to work in parallel
- Better code reusability and testability
- Scales better for large applications

**When to migrate:** Consider modular when you have 10+ features or multiple teams.

---

## 🧪 Testing Best Practices

### Testing Strategy

- **Unit Tests** - Test individual functions, services, repositories in isolation
- **Integration Tests** - Test API endpoints end-to-end with Supertest
- **Coverage Target** - Aim for 80%+ code coverage

### Setup

```bash
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

### Unit Testing

**Example Service Test:**

```typescript
// src/services/__tests__/user.service.test.ts
import { UserService } from '../user.service';
import { UserRepository } from '../../repositories/user.repository';
import { AppError } from '../../utils/errors';

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      // ... mock all methods
    } as any;
    userService = new UserService(mockRepository);
  });

  it('should throw error if user not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(userService.findById('123')).rejects.toThrow(AppError);
  });

  it('should return user if found', async () => {
    const mockUser = { id: '123', name: 'Test' };
    mockRepository.findById.mockResolvedValue(mockUser);

    const result = await userService.findById('123');

    expect(result).toEqual(mockUser);
    expect(mockRepository.findById).toHaveBeenCalledWith('123');
  });
});
```

### Integration Testing

**Example API Test:**

```typescript
// src/routes/__tests__/users.routes.test.ts
import request from 'supertest';
import app from '../../app';

describe('GET /api/v1/users', () => {
  it('should return list of users', async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', 'Bearer valid-token')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should return 401 if unauthorized', async () => {
    await request(app)
      .get('/api/v1/users')
      .expect(401);
  });
});
```

### Testing Best Practices

1. **Arrange-Act-Assert Pattern**
2. **Mock External Dependencies** - Database, APIs, file system
3. **Test Edge Cases** - Error scenarios, boundary conditions
4. **Isolate Tests** - Each test should be independent
5. **Use Descriptive Test Names** - "should return user when found"

---

## 📝 Code Quality & Best Practices

### Clean Code Principles

1. **Meaningful Names**
   ```typescript
   // ❌ Bad
   const d = 7;
   function proc(u) { }
   
   // ✅ Good
   const daysInWeek = 7;
   function processUser(user: User) { }
   ```

2. **Small Functions**
   ```typescript
   // ❌ Bad - Does too much
   async function processOrder(order: Order) {
     validate(order);
     calculate(order);
     save(order);
     email(order);
     log(order);
   }
   
   // ✅ Good - Single responsibility
   async function processOrder(order: Order) {
     const validated = validateOrder(order);
     const calculated = calculateOrderTotal(validated);
     await saveOrder(calculated);
     await notifyCustomer(calculated);
   }
   ```

3. **Avoid Magic Numbers**
   ```typescript
   // ❌ Bad
   if (user.age < 18) { }
   
   // ✅ Good
   const MINIMUM_AGE = 18;
   if (user.age < MINIMUM_AGE) { }
   ```

### TypeScript Best Practices

1. **Strict Mode**
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true
     }
   }
   ```

2. **Avoid `any`**
   ```typescript
   // ❌ Bad
   function processData(data: any) { }
   
   // ✅ Good
   function processData(data: UserData) { }
   ```

3. **Use Interfaces for Objects**
   ```typescript
   // ✅ Good
   interface CreateUserDto {
     email: string;
     name: string;
     password: string;
   }
   ```

4. **Explicit Return Types**
   ```typescript
   // ✅ Good - Explicit return type
   async function getUser(id: string): Promise<User | null> {
     // Implementation
   }
   ```

### Error Handling

1. **Custom Error Classes**
   ```typescript
   // ✅ Good - Specific error types
   throw new NotFoundError('User not found');
   throw new ValidationError('Invalid email format');
   ```

2. **Never Swallow Errors**
   ```typescript
   // ❌ Bad
   try {
     await riskyOperation();
   } catch (e) {
     // Silent failure
   }
   
   // ✅ Good
   try {
     await riskyOperation();
   } catch (error) {
     logger.error('Operation failed', { error });
     throw new AppError('Operation failed', 500);
   }
   ```

3. **Centralized Error Handling**
   ```typescript
   // ✅ Good - Use error middleware
   app.use(errorMiddleware);
   ```

### Security Best Practices

1. **Input Validation**
   ```typescript
   // ✅ Good - Validate all inputs
   router.post('/', validateRequest(createUserSchema), controller.create);
   ```

2. **Sanitize Data**
   ```typescript
   // ✅ Good - Sanitize before saving
   const sanitized = sanitizeInput(userInput);
   ```

3. **Rate Limiting**
   ```typescript
   // ✅ Good - Protect endpoints
   app.use(rateLimitMiddleware);
   ```

4. **Helmet for Security Headers**
   ```typescript
   // ✅ Good
   app.use(helmet());
   ```

### Performance Best Practices

1. **Database Indexing**
   ```typescript
   // ✅ Good - Index frequently queried fields
   UserSchema.index({ email: 1 });
   ```

2. **Pagination**
   ```typescript
   // ✅ Good - Always paginate lists
   async function getUsers(page: number, limit: number) {
     return User.find()
       .skip((page - 1) * limit)
       .limit(limit);
   }
   ```

3. **Caching**
   ```typescript
   // ✅ Good - Cache expensive operations
   const cached = await cache.get(key);
   if (cached) return cached;
   ```

### Logging Best Practices

1. **Structured Logging**
   ```typescript
   // ✅ Good - Use structured logs
   logger.info('User created', { userId: user.id, email: user.email });
   logger.error('Failed to create user', { error, input });
   ```

2. **Log Levels**
   ```typescript
   logger.debug('Detailed debug info');
   logger.info('General information');
   logger.warn('Warning message');
   logger.error('Error occurred');
   ```

### Documentation

1. **JSDoc Comments**
   ```typescript
   /**
    * Creates a new user account.
    * 
    * @param data - User creation data
    * @returns Created user (without password)
    * @throws {ValidationError} If input is invalid
    * @throws {AppError} If user already exists
    */
   async function createUser(data: CreateUserDto): Promise<User> {
     // Implementation
   }
   ```

2. **API Documentation**
   ```typescript
   /**
    * @route POST /api/v1/users
    * @desc Create a new user
    * @access Public
    * @body {email, name, password}
    */
   router.post('/', controller.create);
   ```

---

## 🏆 Best Practices Summary

1. **Separation of Concerns** - Each layer has one responsibility
2. **Dependency Injection** - Services depend on repositories, not database directly
3. **Error Handling** - Centralized error middleware
4. **Validation** - Validate at route/controller boundaries
5. **Type Safety** - Use TypeScript throughout
6. **Security** - Helmet, CORS, rate limiting, input validation
7. **Logging** - Structured logging with Winston
8. **Environment Variables** - Validate with Zod
9. **Start Simple** - Begin with layered, migrate to modular only when needed
10. **Write Tests** - Unit tests for logic, integration tests for APIs
11. **Meaningful Names** - Self-documenting code
12. **Small Functions** - Single responsibility
13. **Error Handling** - Never swallow errors, use custom error classes
14. **Performance** - Database indexing, pagination, caching
15. **Documentation** - JSDoc for functions, API docs for routes

---

> 📌 **This guide follows Node.js/Express best practices (2026). Layered architecture is the standard for most projects. Keep it updated as patterns evolve!**
