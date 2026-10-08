# Marché Encheres

Application frontend et backend de marketplace française pour la vente aux enchères.

## Structure

- `marche-encheres-frontend/` — interface React, TypeScript et Vite.
- `marche-encheres-backend/` — API Express, PostgreSQL et Prisma.

## Prérequis

- Node.js 18 ou plus
- npm
- PostgreSQL

## Installation

```bash
cd marche-encheres-backend
npm install
cp .env.example .env

cd ../marche-encheres-frontend
npm install
cp .env.example .env
```

## Démarrage

```bash
# Backend
cd marche-encheres-backend
npm run prisma:migrate
npm run prisma:seed
npm run dev

# Frontend, dans un autre terminal
cd marche-encheres-frontend
npm run dev
```

Le frontend est disponible sur `http://localhost:5173` et l'API sur `http://localhost:3001/api/v1`.

## Vérifications

```bash
cd marche-encheres-backend
npm run build

cd ../marche-encheres-frontend
npm run typecheck
npm run build
```

## Configuration

Les fichiers `.env` sont ignorés par Git. Ne pascommiter ni les secrets ni les identifiants de base de données. Utilisez les fichiers `.env.example` comme modèles.
