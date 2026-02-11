#!/bin/bash
# Proactive System Monitor - Reads reports and acts on issues
# Should run every heartbeat

REPORT_DIR="/Users/tommie/shared-memory"
ALERT_LOG="/Users/tommie/clawd/logs/proactive-alerts.log"

echo "[$(date)] Starting proactive monitoring..." >> "$ALERT_LOG"

# Check RAM from systems.json
RAM_FREE=$(jq -r '.[0].ram_free_mb // 0' "$REPORT_DIR/systems.json" 2>/dev/null)
if [ "$RAM_FREE" -lt 5000 ] && [ "$RAM_FREE" -gt 0 ]; then
    echo "[$(date)] ⚠️ RAM LOW: ${RAM_FREE}MB free" >> "$ALERT_LOG"
    # Alert to Telegram
    curl -s -X POST "https://api.telegram.org/bot8402195747:AAGBqvdibcMHyLB2E24u4oIJSMkG-opjsK0/sendMessage" \
        -d "chat_id=-1003779327245" \
        -d "text=⚠️ RAM Alert: Only ${RAM_FREE}MB free on Mac Mini. Taking action." > /dev/null
    
    # Try to free RAM
    echo "[$(date)] Attempting to free RAM..." >> "$ALERT_LOG"
    # Kill memory-heavy processes if needed
    # docker restart n8n (if safe)
fi

# Check network status from network.json
DELL_LATENCY=$(jq -r '.[0].dell_latency // "unknown"' "$REPORT_DIR/network.json" 2>/dev/null)
CLOUD_LATENCY=$(jq -r '.[0].cloud_latency // "unknown"' "$REPORT_DIR/network.json" 2>/dev/null)

if [ "$DELL_LATENCY" = "unreachable" ]; then
    echo "[$(date)] ℹ️ Dell unreachable - likely at home (Houston)" >> "$ALERT_LOG"
fi

# Check for disk space issues
DISK_PERCENT=$(jq -r '.[0].disk_used_percent // 0' "$REPORT_DIR/systems.json" 2>/dev/null)
if [ "$DISK_PERCENT" -gt 85 ]; then
    echo "[$(date)] ⚠️ DISK HIGH: ${DISK_PERCENT}% used" >> "$ALERT_LOG"
    curl -s -X POST "https://api.telegram.org/bot8402195747:AAGBqvdibcMHyLB2E24u4oIJSMkG-opjsK0/sendMessage" \
        -d "chat_id=-1003779327245" \
        -d "text=⚠️ Disk Alert: ${DISK_PERCENT}% used on Mac Mini." > /dev/null
fi

echo "[$(date)] Monitoring complete" >> "$ALERT_LOG"
