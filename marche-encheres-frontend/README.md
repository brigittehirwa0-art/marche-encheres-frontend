# Marché aux enchères

Frontend React/TypeScript d’une marketplace française de vente aux enchères.
L’expérience est entièrement fonctionnelle avec des données mockées en mémoire
et une latence réseau simulée, afin de pouvoir remplacer les appels par un
backend réel sans changer les pages.

## Lancer le projet

Depuis la racine du workspace :

```bash
pnpm --filter @workspace/marche-encheres run dev
```

Les contrôles utiles :

```bash
pnpm --filter @workspace/marche-encheres run typecheck
pnpm --filter @workspace/marche-encheres run build
```

## Organisation

- `src/core/` : types partagés, mock API, hooks et primitives globales.
- `src/features/auth/` : connexion, inscription et session.
- `src/features/products/` : catalogue, recherche et produits.
- `src/features/bids/` : lecture et création des offres.
- `src/features/auctions/` : états d’enchère et types de paiement.
- `src/features/users/` : notifications, compte et données utilisateur.
- `src/features/categories/` : catégories du catalogue.
- `src/App.tsx` : composition des routes et du shell global.

## Brancher un vrai backend

Le point de remplacement est `src/core/mock-api.ts`. Les modules
`src/features/*/api/` isolent déjà les signatures utilisées par les hooks et
les pages. Il suffit de remplacer leurs implémentations par des appels HTTP
avec les mêmes types de retour, puis de conserver les clés React Query.

Le moteur d’expiration et de paiement est volontairement commenté dans
`mock-api.ts` : en production, la fin d’enchère et le passage au deuxième
enchérisseur doivent tourner côté serveur via un job planifié, pas dans le
navigateur.

## Parcours de démonstration

- Utiliser `camille@exemple.fr` avec un mot de passe d’au moins 6 caractères
  pour retrouver le compte de démonstration.
- Les pages `/product/:id`, `/sell` et `/account/*` sont protégées selon le
  contexte.
- Une offre doit toujours être strictement supérieure à l’offre actuelle.