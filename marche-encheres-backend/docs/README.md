# 📚 Node.js Express Backend Architecture Documentation

> Layered architecture for scalable Node.js/Express backends

---

## 📖 Main Guide

| Document | Description |
|----------|-------------|
| [🏛 ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md) | **Complete architecture guide** - Layered architecture, MongoDB/PostgreSQL patterns, API design |

---

## 🎯 Architecture Overview

This architecture follows **layered architecture** principles with clear separation of concerns.

### Key Principles

- ✅ **Layered Architecture** - Routes → Controllers → Services → Repositories → Database
- ✅ **Separation of Concerns** - Each layer has single responsibility
- ✅ **Dependency Injection** - Services depend on abstractions
- ✅ **Type Safety** - TypeScript throughout
- ✅ **Database Agnostic** - Works with both MongoDB and PostgreSQL

### Folder Structure

```
src/
├── routes/          # API route definitions
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Data access layer
├── models/          # Database models/schemas
├── middlewares/     # Auth, validation, error handling
└── utils/           # Helpers, errors, validators
```

---

## 🚀 Quick Start

1. Read [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md) overview
2. Choose database: MongoDB (Mongoose) or PostgreSQL (Prisma/pg)
3. Follow the "New Feature Checklist" when adding features

---

## ✅ New Feature Workflow

```
1. Create model → models/[feature].model.ts
2. Create repository → repositories/[feature].repository.ts
3. Create service → services/[feature].service.ts
4. Create controller → controllers/[feature].controller.ts
5. Create routes → routes/[feature].routes.ts
6. Add validation → utils/validators.ts
7. Register routes → routes/index.ts
```

---

## 💡 Key Concepts

- **Routes** - Define endpoints, map to controllers
- **Controllers** - Handle HTTP, call services
- **Services** - Business logic, orchestration
- **Repositories** - Database operations
- **Middleware** - Auth, validation, error handling

---

## 🗄️ Database Choice

**MongoDB** - Flexible schemas, document-based, good for content/catalogs
**PostgreSQL** - Relational, ACID transactions, good for transactional data

Both patterns are documented in the guide!

---

> 📌 Keep this documentation updated as patterns evolve!
