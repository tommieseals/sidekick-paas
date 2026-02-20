# ============================================
# 💹 INVESTRAIN AI - Multi-stage Docker Build
# ============================================

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend
RUN apk add --no-cache python3 make g++
COPY backend/package*.json ./
RUN npm ci --only=production

# Stage 3: Production
FROM node:20-alpine AS production

WORKDIR /app
RUN apk add --no-cache tini

# Copy backend
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY backend/ ./

# Copy frontend build
COPY --from=frontend-builder /app/frontend/out ./public

# Create data directory
RUN mkdir -p /app/data

# Environment
ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/app/data/portfolio.db
ENV USE_MOCK_DATA=true
ENV OLLAMA_URL=http://host.docker.internal:11434

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/index.js"]
