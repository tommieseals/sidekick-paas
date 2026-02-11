#!/bin/bash
# Fix Docker Desktop Memory Allocation
# Reduces Docker VM RAM from 8GB to 3GB

echo "Stopping Docker Desktop..."
osascript -e 'quit app "Docker"' 2>/dev/null
pkill -f "docker" 2>/dev/null
sleep 5

echo ""
echo "CRITICAL: Docker Desktop must be configured to use 3GB RAM maximum"
echo ""
echo "MANUAL STEPS REQUIRED:"
echo "1. Open Docker Desktop application"
echo "2. Click Settings (gear icon)"
echo "3. Go to Resources → Advanced"
echo "4. Set Memory to 3.00 GB (currently 8.00 GB)"
echo "5. Click 'Apply & Restart'"
echo ""
echo "Current Mac Mini RAM: 16GB"
echo "Recommended allocation: 3GB (18.75% of total)"
echo "Previous allocation: 8GB (50% of total - TOO HIGH!)"
echo ""
echo "n8n container only uses ~300MB, so 3GB VM is plenty."
echo ""
