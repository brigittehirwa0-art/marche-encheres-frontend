# Marché Encheres Backend

Backend API for the Marché Encheres auction platform using PostgreSQL.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (running on localhost:5432)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run database migrations:
```bash
npx prisma migrate dev --name init
```

4. Seed the database:
```bash
npm run prisma:seed
```

5. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user

### Products
- `GET /api/v1/products` - List all products (with optional filters)
- `GET /api/v1/products/:id` - Get a single product
- `POST /api/v1/products` - Create a new product (requires auth)
- `PUT /api/v1/products/:id` - Update a product (requires auth)
- `GET /api/v1/products/seller/my-products` - Get current user's products (requires auth)

### Bids
- `GET /api/v1/bids/product/:productId` - Get bids for a product
- `GET /api/v1/bids/my-bids` - Get current user's bids (requires auth)
- `POST /api/v1/bids/product/:productId` - Place a bid (requires auth)

### Categories
- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/:id` - Get a single category
- `POST /api/v1/categories` - Create a category

### Notifications
- `GET /api/v1/notifications` - Get current user's notifications (requires auth)
- `PUT /api/v1/notifications/mark-read` - Mark all notifications as read (requires auth)
- `PUT /api/v1/notifications/:id/mark-read` - Mark a notification as read (requires auth)

### Payments
- `GET /api/v1/payments` - Get all payments (requires auth)
- `GET /api/v1/payments/my-payments` - Get current user's payments (requires auth)
- `POST /api/v1/payments/:productId/simulate-payment` - Simulate payment (requires auth)
- `POST /api/v1/payments/:productId/award/:bidId` - Award a bid (requires auth)

## Architecture

The backend follows a layered architecture:

- **Routes**: Define API endpoints
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Handle database operations
- **Middlewares**: Auth, validation, error handling

## Database Schema

The database includes the following models:
- User
- Category
- Product
- Bid
- Notification
- PaymentWindow

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

## Database Management

Generate Prisma client:
```bash
npm run prisma:generate
```

Run migrations:
```bash
npm run prisma:migrate
```

Open Prisma Studio:
```bash
npm run prisma:studio
```

Seed database:
```bash
npm run prisma:seed
```
