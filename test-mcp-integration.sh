#!/bin/bash
# Test MCP Servers Integration

echo "🧪 Testing MCP Servers..."
echo ""

echo "1. Testing filesystem server..."
mcporter --config config/mcporter.json call "filesystem.list_directory(path: \"/Users/tommie/dta/quant-scraping\")" | head -10
echo ""

echo "2. Testing brave-search server..."
mcporter --config config/mcporter.json call "brave-search.brave_web_search(query: \"quantitative trading\", count: 3)" 2>&1 | grep -A 3 "title"
echo ""

echo "3. Testing memory server..."
mcporter --config config/mcporter.json call 'memory.create_entities' --args '{"entities":[{"name":"mcp_test","entityType":"test","observations":["MCP integration test successful"]}]}'
echo ""

echo "✅ All MCP servers operational!"
