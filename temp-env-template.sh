#!/bin/bash
# Environment Setup Template
# Copy this to .env and fill in your values

# === API Keys (get from respective providers) ===
export OPENAI_API_KEY="your-openai-key"
export ANTHROPIC_API_KEY="your-anthropic-key"

# === Database ===
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_NAME="myapp"
export DB_USER="${USER}"
export DB_PASS=""

# === Services ===
export REDIS_URL="redis://localhost:6379"
export OLLAMA_HOST="http://localhost:11434"

# === Notifications (optional) ===
export TELEGRAM_BOT_TOKEN=""
export TELEGRAM_CHAT_ID=""

# === Paths ===
export PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export LOG_DIR="${PROJECT_ROOT}/logs"
export DATA_DIR="${PROJECT_ROOT}/data"

echo "Environment loaded from ${BASH_SOURCE[0]}"
