#!/bin/bash
# Gateway Crash Monitor
# Monitors for AbortError crashes and sends alerts to Telegram

LOGFILE="/tmp/clawd-recent.log"
STATEFILE="/Users/tommie/.clawdbot/crash-monitor-state.txt"
ALERT_TARGET="@tommie77bot"  # Adjust if needed
CRASH_PATTERN="AbortError: This operation was aborted"

# Initialize state file
if [ ! -f "$STATEFILE" ]; then
    echo "0" > "$STATEFILE"
fi

LAST_CRASH_LINE=$(cat "$STATEFILE")

# Search for new crashes since last check
NEW_CRASHES=$(grep -n "$CRASH_PATTERN" "$LOGFILE" | awk -F: '{print $1}' | while read LINE; do
    if [ "$LINE" -gt "$LAST_CRASH_LINE" ]; then
        echo "$LINE"
    fi
done)

if [ -n "$NEW_CRASHES" ]; then
    LATEST_LINE=$(echo "$NEW_CRASHES" | tail -1)
    echo "$LATEST_LINE" > "$STATEFILE"
    
    # Extract context around the crash
    CRASH_CONTEXT=$(sed -n "$((LATEST_LINE-5)),$((LATEST_LINE+2))p" "$LOGFILE")
    CRASH_TIME=$(echo "$CRASH_CONTEXT" | grep "AbortError" | head -1 | cut -d' ' -f1)
    
    # Send alert
    MESSAGE="🚨 Gateway Crash Detected

Time: $CRASH_TIME
Error: AbortError: This operation was aborted

Context:
\`\`\`
$CRASH_CONTEXT
\`\`\`

PID: $(pgrep -f clawdbot-gateway || echo 'NOT RUNNING')
Uptime: $(ps -p $(pgrep -f clawdbot-gateway) -o etime= 2>/dev/null || echo 'N/A')

This is a known issue related to typing indicator TTL. Monitor your connection."

    echo "$(date): Crash detected at line $LATEST_LINE" >> /tmp/crash-monitor.log
    
    # Send notification via clawdbot message tool
    # Note: This requires the gateway to be running, which it should be after auto-restart
    sleep 8  # Wait for restart
    clawdbot message send --target "$ALERT_TARGET" --message "$MESSAGE" 2>&1 >> /tmp/crash-monitor.log
fi
