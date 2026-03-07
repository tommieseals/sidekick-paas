# ============================================
# 🚀 SIDEKICK PAAS - Docker Build
# ============================================

FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
RUN apk add --no-cache python3 make g++
COPY backend/package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS production
WORKDIR /app

# Install Docker CLI and git
RUN apk add --no-cache docker-cli git tini

# Copy backend
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY backend/ ./

# Copy frontend
COPY --from=frontend-builder /app/frontend/dist ./public

# Create data directories
RUN mkdir -p /app/data/repos /app/data/nginx

ENV NODE_ENV=production
ENV PORT=3002
ENV DB_PATH=/app/data/sidekick.db
ENV REPOS_DIR=/app/data/repos
ENV NGINX_CONF_DIR=/app/data/nginx

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3002/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/index.js"]
