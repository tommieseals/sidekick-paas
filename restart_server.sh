#!/bin/bash
cd /Users/tommie/clawd/dashboard

# Kill existing server
pkill -f "node server.js" 2>/dev/null || true
sleep 1

# Start new server
nohup node server.js > server.log 2>&1 &
sleep 2

# Verify
pgrep -fl "node server.js"
curl -sk https://localhost:8443/terminator.html | head -3
