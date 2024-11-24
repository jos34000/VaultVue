# Crypto Price Tracker API

Une API REST construite avec Next.js pour suivre les prix des cryptomonnaies en temps réel via l'API Binance.

## Fonctionnalités Principales

- ✨ Récupération des prix en temps réel via l'API Binance
- 📊 Historique des prix (plus haut/plus bas) par date
- 💱 Conversion automatique entre devises (EUR, USDT, USDC)
- 🔄 Mise à jour automatique des taux de change
- 📝 Journalisation des erreurs
- 🔐 Authentification des utilisateurs
- 💼 Gestion de portefeuille
- 📈 Suivi des transactions
- ⚡ Alertes de prix personnalisées
- 📊 Statistiques journalières et mensuelles

## Points d'API

### GET /api/data/lowerPrice

Récupère le prix le plus bas d'une crypto pour une date donnée.

```http
GET /api/data/lowerPrice?crypto=BTC&date=DD/MM/YYYY
```

### GET /api/data/higherPrice

Récupère le prix le plus haut d'une crypto pour une date donnée.

```http
GET /api/data/higherPrice?crypto=BTC&date=DD/MM/YYYY
```

### ET PLUS A VENIR ...

## Installation

```bash
npm install
npm run dev
```

## Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="postgresql://..."
DEFAULT_CURRENCY="EUR"
```

## Technologies Utilisées

- Next.js 15.0
- TypeScript
- Prisma ORM
- PostgreSQL
- API Binance
- Docker

## Structure du Projet

```
crypto-tracking/
├── lib/
│   ├── hooks/          # Hooks personnalisés et utilitaires
│   ├── middlewares/    # Middleware API et services
│   └── types/         # Types TypeScript
├── pages/
│   └─- api/           # Points d'API REST
└── prisma/
    ├── schema/        # Schéma de base de données
    │   └── schema.prisma
    └── bdd.db
```

## Docker

Deux options s'offrent à vous :

### 1. Utiliser l'image officielle

```bash
docker pull jos34000/crypto-tracking:latest
docker run -p 3000:3000 jos34000/crypto-tracking
```

### 2. Construction de votre propre image :

```bash
docker build -t crypto-tracking .
```

Exécution du conteneur :

```bash
docker run -p 3000:3000 crypto-tracking
```

## Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Licence

MIT

## Contact

Jocelyn Sainson - [@JocelynSainson](https://x.com/jocelynsainson)

Lien du projet: [https://github.com/jos34000/crypto-tracking](https://github.com/jos34000/crypto-tracking)
