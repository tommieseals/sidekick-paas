# TaskBot Production Dockerfile
# Multi-stage build for optimized image size

# ============ Stage 1: Build Dashboard ============
FROM node:20-alpine AS dashboard-builder

WORKDIR /app/dashboard

# Copy dashboard source
COPY dashboard/package*.json ./
RUN npm ci

COPY dashboard/ ./
RUN npm run build

# ============ Stage 2: Python Runtime ============
FROM python:3.11-slim AS runtime

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --gid 1000 taskbot \
    && useradd --uid 1000 --gid taskbot --shell /bin/bash --create-home taskbot

WORKDIR /app

# Copy Python requirements and install dependencies
COPY agent/requirements.txt ./agent/
RUN pip install --no-cache-dir -r agent/requirements.txt

# Copy server requirements if separate
COPY server/requirements.txt ./server/
RUN pip install --no-cache-dir -r server/requirements.txt || true

# Copy application code
COPY agent/ ./agent/
COPY server/ ./server/
COPY cli.py ./

# Copy built dashboard from stage 1
COPY --from=dashboard-builder /app/dashboard/dist ./dashboard/dist

# Create data directories
RUN mkdir -p /app/data /app/logs && chown -R taskbot:taskbot /app

# Switch to non-root user
USER taskbot

# Expose ports
# 8000 - FastAPI server
# 5173 - Dashboard (served by FastAPI in production)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Default command - run the server
CMD ["python", "-m", "uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000"]
