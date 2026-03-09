#!/bin/bash
# Bottom Bitch Specialist Spawner (Unix/Mac version)
# Usage: ./spawn-specialist.sh <specialist> <task>
# Example: ./spawn-specialist.sh codegen "Create Python script to parse JSON logs"

set -e

SPECIALIST="$1"
TASK="$2"

if [ -z "$SPECIALIST" ] || [ -z "$TASK" ]; then
    echo "Usage: $0 <specialist> <task>"
    echo ""
    echo "Available specialists:"
    echo "  codegen   - Code generation and implementation"
    echo "  debugger  - Bug hunting and fixes"
    echo "  devops    - Infrastructure and deployment"
    echo "  research  - Information gathering and analysis"
    echo "  vision    - Image/screenshot analysis"
    echo "  writer    - Documentation and content creation"
    echo ""
    echo "Example:"
    echo "  $0 codegen 'Create Python script to parse JSON logs'"
    exit 1
fi

VALID_SPECIALISTS=("codegen" "debugger" "devops" "research" "vision" "writer")
if [[ ! " ${VALID_SPECIALISTS[@]} " =~ " ${SPECIALIST} " ]]; then
    echo "Error: Invalid specialist '${SPECIALIST}'"
    echo "Valid options: ${VALID_SPECIALISTS[@]}"
    exit 1
fi

# Check if we're on the authorized Dell machine
HOSTNAME=$(hostname)
if [[ "$HOSTNAME" != *"dell"* ]] && [[ "$HOSTNAME" != *"DESKTOP"* ]]; then
    echo "Warning: Bottom Bitch swarm should be spawned from Dell (100.119.87.108)"
    echo "Current host: $HOSTNAME"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Generate session label
LABEL="bottombit-${SPECIALIST}-$(date +%s)"

echo "🚢 Spawning Bottom Bitch specialist: ${SPECIALIST}"
echo "📋 Task: ${TASK}"
echo "🏷️  Label: ${LABEL}"
echo ""

# Spawn via sessions command
# Note: This assumes Clawdbot CLI is available
# Adjust path if needed based on installation

SPAWN_TASK="You are ${SPECIALIST} specialist in Bottom Bitch's swarm. Your task: ${TASK}

IMPORTANT:
1. Read ~/clawd/agents-bottombit/${SPECIALIST}/SOUL.md first
2. Read ~/clawd/agents-bottombit/${SPECIALIST}/AGENTS.md 
3. Complete the assigned task
4. Report results when done
5. You are ephemeral - no heartbeats, no side quests

Your session: agent:bottombit:${SPECIALIST}:${LABEL}
Parent: Bottom Bitch (Dell agent)
Access: Restricted to tool use, NO external messaging"

# Use sessions_spawn if available, otherwise provide manual instructions
if command -v sessions_spawn &> /dev/null; then
    sessions_spawn --label="${LABEL}" --task="${SPAWN_TASK}"
else
    echo "❌ sessions_spawn command not found"
    echo ""
    echo "Manual spawn instructions:"
    echo "Run this in Telegram or Clawdbot:"
    echo ""
    echo "/spawn ${LABEL}"
    echo ""
    echo "Task:"
    echo "${SPAWN_TASK}"
fi

echo ""
echo "✅ Spawn request sent"
echo "📊 Monitor: http://100.88.105.106:8080/swarm-monitor.html"
echo "🔍 Check status: sessions_list | grep ${LABEL}"
