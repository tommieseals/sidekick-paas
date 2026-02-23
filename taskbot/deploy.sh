#!/bin/bash
# TaskBot Deployment Script
# Usage: ./deploy.sh [local|docker|production]

set -e

MODE="${1:-local}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 TaskBot Deployment - Mode: $MODE"
echo "=================================="

case $MODE in
    local)
        echo "📦 Installing dependencies..."
        
        # Python dependencies
        cd "$SCRIPT_DIR/agent"
        pip install -r requirements.txt
        
        cd "$SCRIPT_DIR/server"
        pip install -r requirements.txt 2>/dev/null || echo "No server requirements"
        
        # Dashboard dependencies
        cd "$SCRIPT_DIR/dashboard"
        npm install
        
        echo ""
        echo "✅ Dependencies installed!"
        echo ""
        echo "To run locally:"
        echo "  Terminal 1: cd server && uvicorn main:app --reload --port 8000"
        echo "  Terminal 2: cd dashboard && npm run dev"
        echo ""
        echo "Dashboard: http://localhost:5173"
        echo "API: http://localhost:8000"
        ;;
        
    docker)
        echo "🐳 Building Docker image..."
        cd "$SCRIPT_DIR"
        
        docker build -t taskbot:latest .
        
        echo ""
        echo "✅ Docker image built!"
        echo ""
        echo "To run:"
        echo "  docker run -p 8000:8000 --env-file .env taskbot:latest"
        echo ""
        echo "Or with docker-compose:"
        echo "  docker-compose -f docker-compose.prod.yml up -d"
        ;;
        
    production)
        echo "🏭 Production deployment..."
        cd "$SCRIPT_DIR"
        
        # Check for required files
        if [ ! -f ".env" ]; then
            echo "❌ Error: .env file not found!"
            echo "Copy .env.example to .env and fill in your API keys."
            exit 1
        fi
        
        # Build and start
        docker-compose -f docker-compose.prod.yml build
        docker-compose -f docker-compose.prod.yml up -d
        
        echo ""
        echo "✅ TaskBot is running!"
        echo ""
        echo "Dashboard: http://localhost:8000"
        echo ""
        echo "Check logs: docker-compose -f docker-compose.prod.yml logs -f"
        echo "Stop: docker-compose -f docker-compose.prod.yml down"
        ;;
        
    *)
        echo "Usage: $0 [local|docker|production]"
        echo ""
        echo "Modes:"
        echo "  local      - Install dependencies for local development"
        echo "  docker     - Build Docker image"
        echo "  production - Deploy with docker-compose"
        exit 1
        ;;
esac
