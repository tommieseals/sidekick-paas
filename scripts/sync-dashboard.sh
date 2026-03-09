#!/bin/bash
# Dashboard Sync Script
# Syncs between Mac Mini (PRIMARY) and Windows Dell (SECONDARY)
# 
# IMPORTANT: Mac Mini is the PRIMARY source of truth
# Windows Dell only has a partial copy
#
# Created: 2026-02-28
# Last Updated: 2026-02-28

set -e

# Configuration
MAC_MINI="tommie@100.88.105.106"
MAC_DASHBOARD="/Users/tommie/clawd/dashboard"
WINDOWS_DASHBOARD="/c/Users/tommi/clawd/dashboard"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║           Dashboard Synchronization Script               ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to show usage
usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  status     Check sync status between machines"
    echo "  pull       Pull from Mac Mini (PRIMARY) to Windows Dell"
    echo "  push       Push specific files from Windows to Mac Mini"
    echo "  full-sync  Complete bidirectional sync (careful!)"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 pull"
    exit 1
}

# Check status function
check_status() {
    echo -e "${YELLOW}📊 Checking sync status...${NC}"
    echo ""
    
    echo -e "${CYAN}Mac Mini files (PRIMARY):${NC}"
    ssh $MAC_MINI "find $MAC_DASHBOARD -maxdepth 1 -type f -name '*.html' | wc -l" 2>/dev/null
    ssh $MAC_MINI "ls -la $MAC_DASHBOARD/infra-sections/ 2>/dev/null | wc -l"
    
    echo ""
    echo -e "${CYAN}Windows Dell files (SECONDARY):${NC}"
    ls "$WINDOWS_DASHBOARD"/*.html 2>/dev/null | wc -l
    ls "$WINDOWS_DASHBOARD/infra-sections/"* 2>/dev/null | wc -l
    
    echo ""
    echo -e "${YELLOW}📁 Missing on Windows Dell:${NC}"
    echo "  - 01-network.html"
    echo "  - 02-gateway.html"
    echo "  - 03-vault.html"
    echo "  - 04-legion.html"
    echo "  - server.js"
    echo "  - Many other HTML pages"
    
    echo ""
    echo -e "${YELLOW}📁 Missing on Mac Mini:${NC}"
    echo "  - 10-mcp.html (Windows has this)"
}

# Pull from Mac Mini
pull_from_mac() {
    echo -e "${GREEN}⬇️  Pulling from Mac Mini to Windows Dell...${NC}"
    echo ""
    
    # Create backup first
    BACKUP_DIR="$WINDOWS_DASHBOARD.backup-$(date +%Y%m%d-%H%M%S)"
    echo -e "${YELLOW}Creating backup at: $BACKUP_DIR${NC}"
    cp -r "$WINDOWS_DASHBOARD" "$BACKUP_DIR"
    
    # Sync from Mac Mini
    echo -e "${CYAN}Syncing from Mac Mini...${NC}"
    rsync -avz --progress \
        --exclude='node_modules/' \
        --exclude='*.log' \
        --exclude='.DS_Store' \
        "$MAC_MINI:$MAC_DASHBOARD/" "$WINDOWS_DASHBOARD/"
    
    echo ""
    echo -e "${GREEN}✅ Pull complete!${NC}"
}

# Push specific files to Mac Mini
push_to_mac() {
    echo -e "${YELLOW}⬆️  Pushing specific files to Mac Mini...${NC}"
    echo ""
    
    # Only push 10-mcp.html (the one Mac Mini is missing)
    if [ -f "$WINDOWS_DASHBOARD/infra-sections/10-mcp.html" ]; then
        echo "Pushing 10-mcp.html to Mac Mini..."
        scp "$WINDOWS_DASHBOARD/infra-sections/10-mcp.html" \
            "$MAC_MINI:$MAC_DASHBOARD/infra-sections/"
        echo -e "${GREEN}✅ Pushed 10-mcp.html${NC}"
    else
        echo -e "${RED}❌ 10-mcp.html not found${NC}"
    fi
}

# Full bidirectional sync
full_sync() {
    echo -e "${RED}⚠️  FULL SYNC MODE - This will synchronize in both directions${NC}"
    echo ""
    read -p "Are you sure? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo "Aborted."
        exit 1
    fi
    
    # First, push Windows-only files to Mac
    push_to_mac
    
    # Then pull everything from Mac
    pull_from_mac
    
    echo ""
    echo -e "${GREEN}✅ Full sync complete!${NC}"
}

# Main script
case "${1:-status}" in
    status)
        check_status
        ;;
    pull)
        pull_from_mac
        ;;
    push)
        push_to_mac
        ;;
    full-sync)
        full_sync
        ;;
    *)
        usage
        ;;
esac

echo ""
echo -e "${CYAN}Done! Mac Mini is the PRIMARY source of truth.${NC}"
