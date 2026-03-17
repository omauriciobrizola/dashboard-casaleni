# Build multi-stage para o Dashboard Casa Lení
# Estágio 1: Instalar TODAS as dependências (inclui devDeps para build)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Estágio 2: Build da aplicação
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Precisamos do .env para o prisma generate ler DATABASE_URL via dotenv
# Mas NÃO queremos expor no runner — será passado via env_file no compose
ENV DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder"

RUN npx prisma generate && npm run build

# Estágio 3: Imagem final otimizada
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários do build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar o schema do Prisma (necessário para o client em runtime)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
