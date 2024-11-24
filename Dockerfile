FROM --platform=linux/amd64 node:21-alpine
WORKDIR /api

# Installation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copie des fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installation des dépendances avec pnpm
RUN pnpm install --frozen-lockfile

# Copie du reste des fichiers
COPY . .

EXPOSE 3000

CMD [ "pnpm", "run", "dev"]