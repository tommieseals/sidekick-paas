#!/bin/bash
export PATH="/opt/homebrew/bin:$PATH"
cd /Users/tommie/clawd/dashboard

# Start server
nohup /opt/homebrew/bin/node server.js > server.log 2>&1 &
sleep 2

# Check if running
ps aux | grep "[n]ode server.js"
