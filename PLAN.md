# Phase 1 : API Backend (4-6 semaines)

## 1. Configuration de Base (1 semaine)

- Mise à jour du schéma Prisma pour supporter :

  - Gestion des utilisateurs avec authentification ✅
  - Transactions (achats/ventes/conversions) ✅
  - Portefeuilles par utilisateur ✅
  - Historique des prix ✅
  - Configuration des variables d'environnement :

  ```env
  DATABASE_URL="postgresql://..."
  DEFAULT_CURRENCY="EUR"
  BINANCE_API_KEY="..."
  BINANCE_API_SECRET="..."
  ```

## 2. Endpoints API Transactions (1-2 semaines)

```http
POST /api/transactions/buy
POST /api/transactions/sell
POST /api/transactions/convert
GET /api/transactions/history
GET /api/transactions/stats
```

## 3. Endpoints API Portfolio (1 semaine)

```http
   GET /api/portfolio/summary
   GET /api/portfolio/performance
   GET /api/portfolio/distribution
```

## 4. Services de Calcul (1-2 semaines)

- Calcul des plus-values/moins-values
- Performance par crypto
- Performance globale
- Coût moyen d'acquisition
- ROI par crypto et global

# Phase 2 : Frontend (6-8 semaines)

## 1. Structure de Base (1 semaine)

- Configuration Next.js App Router ✅
- Mise en place de Shadcn UI
- Layout principal
- Navigation

## 2. Authentication (1 semaine)

- Pages de connexion/inscription
- Gestion des sessions
- Protection des routes

## 3. Gestion des Transactions (2 semaines)

- Formulaires d'ajout de transactions
- Historique des transactions
- Filtres et recherche

## 4. Dashboard (2-3 semaines)

- Vue d'ensemble du portfolio
- Graphiques de performance
- Distribution des actifs
- Alertes de prix

## 5. Optimisations (1 semaine)

- Mise en cache
- Loading states
- Error boundaries
- Responsive design
