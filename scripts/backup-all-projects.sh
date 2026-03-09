#!/bin/bash
# Backup All Critical Projects
# Creates dated backups of important project folders
#
# Created: 2026-02-28
# Last Updated: 2026-02-28

set -e

# Configuration
BACKUP_ROOT="/c/Users/tommi/clawd/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP"

# Mac Mini SSH
MAC_MINI="tommie@100.88.105.106"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║           Project Backup Script                          ║${NC}"
echo -e "${CYAN}║           Backup: $TIMESTAMP                     ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Define critical projects
declare -A PROJECTS=(
    # Windows Dell projects
    ["taskbot"]="/c/Users/tommi/clawd/taskbot"
    ["clawd-config"]="/c/Users/tommi/clawd"
    
    # Note: Mac Mini projects backed up separately below
)

# Function to backup a local project
backup_local() {
    local name=$1
    local path=$2
    
    if [ -d "$path" ]; then
        echo -e "${YELLOW}📦 Backing up: $name${NC}"
        
        # Create archive excluding node_modules and large files
        tar -czf "$BACKUP_DIR/${name}.tar.gz" \
            --exclude='node_modules' \
            --exclude='.git' \
            --exclude='*.log' \
            --exclude='__pycache__' \
            -C "$(dirname "$path")" "$(basename "$path")" 2>/dev/null
        
        size=$(du -h "$BACKUP_DIR/${name}.tar.gz" | cut -f1)
        echo -e "${GREEN}   ✅ Created: ${name}.tar.gz ($size)${NC}"
    else
        echo -e "${RED}   ❌ Not found: $path${NC}"
    fi
}

# Function to backup Mac Mini project
backup_mac_mini() {
    local name=$1
    local remote_path=$2
    
    echo -e "${YELLOW}📦 Backing up from Mac Mini: $name${NC}"
    
    # Create temp archive on Mac and copy
    ssh $MAC_MINI "tar -czf /tmp/${name}.tar.gz \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='*.log' \
        -C $(dirname $remote_path) $(basename $remote_path) 2>/dev/null" 2>/dev/null
    
    scp "$MAC_MINI:/tmp/${name}.tar.gz" "$BACKUP_DIR/" 2>/dev/null
    ssh $MAC_MINI "rm /tmp/${name}.tar.gz" 2>/dev/null
    
    if [ -f "$BACKUP_DIR/${name}.tar.gz" ]; then
        size=$(du -h "$BACKUP_DIR/${name}.tar.gz" | cut -f1)
        echo -e "${GREEN}   ✅ Created: ${name}.tar.gz ($size)${NC}"
    else
        echo -e "${RED}   ❌ Failed to backup $name${NC}"
    fi
}

echo -e "${CYAN}📂 Backup directory: $BACKUP_DIR${NC}"
echo ""

# Backup Windows projects
echo -e "${YELLOW}═══ Windows Dell Projects ═══${NC}"
backup_local "taskbot" "/c/Users/tommi/clawd/taskbot"
backup_local "scripts" "/c/Users/tommi/clawd/scripts"
backup_local "memory" "/c/Users/tommi/clawd/memory"

echo ""

# Backup Mac Mini projects
echo -e "${YELLOW}═══ Mac Mini Projects ═══${NC}"
backup_mac_mini "dashboard" "/Users/tommie/clawd/dashboard"
backup_mac_mini "memory-mac" "/Users/tommie/clawd/memory"

echo ""

# Create manifest
echo -e "${YELLOW}📝 Creating backup manifest...${NC}"
cat > "$BACKUP_DIR/MANIFEST.txt" << EOF
Backup Manifest
===============
Created: $(date)
Backup ID: $TIMESTAMP

Projects Backed Up:
-------------------
EOF

for archive in "$BACKUP_DIR"/*.tar.gz; do
    if [ -f "$archive" ]; then
        name=$(basename "$archive")
        size=$(du -h "$archive" | cut -f1)
        echo "  $name - $size" >> "$BACKUP_DIR/MANIFEST.txt"
    fi
done

cat >> "$BACKUP_DIR/MANIFEST.txt" << EOF

Restore Instructions:
---------------------
To restore a project:
  tar -xzf <project>.tar.gz -C /target/directory/

Primary Source of Truth:
------------------------
  Dashboard: Mac Mini /Users/tommie/clawd/dashboard/
  TaskBot: Windows Dell C:\\Users\\tommi\\clawd\\taskbot\\

EOF

echo -e "${GREEN}✅ Manifest created${NC}"

# Summary
echo ""
echo -e "${CYAN}══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Backup Complete!${NC}"
echo ""
echo -e "📂 Location: ${YELLOW}$BACKUP_DIR${NC}"
echo -e "📋 Contents:"
ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null | awk '{print "   " $9 " (" $5 ")"}'
echo ""

# Cleanup old backups (keep last 7)
OLD_COUNT=$(ls -d "$BACKUP_ROOT"/*/ 2>/dev/null | wc -l)
if [ "$OLD_COUNT" -gt 7 ]; then
    echo -e "${YELLOW}🧹 Cleaning up old backups (keeping last 7)...${NC}"
    ls -dt "$BACKUP_ROOT"/*/ | tail -n +8 | xargs rm -rf
    echo -e "${GREEN}   ✅ Cleanup complete${NC}"
fi

echo ""
echo -e "${CYAN}Done! Your projects are safely backed up.${NC}"
