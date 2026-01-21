# 1. Base image
FROM node:20-alpine AS base

# 2. Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 3. Development stage
# Used for local development with hot reloading
FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Development needs access to full source for hot reloading via volumes in compose
CMD ["npm", "run", "dev"]

# 4. Build stage
# Compiles TypeScript to JavaScript
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 5. Production stage
# Minimal image to run the compiled application
FROM base AS production
WORKDIR /app

ENV NODE_ENV production

# Only copy what's necessary to run the app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

EXPOSE 3000

# Run using the production build
CMD ["node", "dist/index.js"]
