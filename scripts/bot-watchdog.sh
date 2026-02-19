#!/bin/bash
# Bot Watchdog - Monitors clawdbot-gateway, alerts, waits 10min, then restarts

TELEGRAM_BOT_TOKEN="8392398778:AAH5lan45kR-VT74d3OiXAAIxlPyR4skGzU"
TELEGRAM_CHAT_ID="939543801"
LOCKFILE="/tmp/bot-watchdog.lock"
LOG_FILE="/tmp/clawdbot.log"

send_telegram() {
    local msg="$1"
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "text=${msg}" \
        -d "parse_mode=Markdown" > /dev/null 2>&1
}

# Check if bot is running
if pgrep -x clawdbot-gateway > /dev/null; then
    # Bot is running, remove lockfile if exists
    rm -f "$LOCKFILE"
    exit 0
fi

# Bot is down - check if we already alerted (lockfile exists)
if [ -f "$LOCKFILE" ]; then
    LOCK_TIME=$(cat "$LOCKFILE")
    CURRENT_TIME=$(date +%s)
    ELAPSED=$((CURRENT_TIME - LOCK_TIME))
    
    if [ $ELAPSED -ge 600 ]; then
        # 10 minutes passed - restart now
        export PATH=/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin
        cd /Users/tommie/clawd
        /usr/bin/nohup /opt/homebrew/bin/clawdbot gateway > /tmp/clawdbot.log 2>&1 &
        sleep 5
        
        if pgrep -x clawdbot-gateway > /dev/null; then
            NEW_PID=$(pgrep -x clawdbot-gateway)
            send_telegram "✅ Bot Auto-Restarted (PID: ${NEW_PID}) - 10 minutes elapsed. Bot is back online."
        else
            send_telegram "❌ Auto-Restart FAILED - Manual intervention needed!"
        fi
        rm -f "$LOCKFILE"
    fi
    # Still waiting, do nothing
    exit 0
fi

# First detection - pull logs and alert
CRASH_LOGS=$(tail -30 "$LOG_FILE" 2>/dev/null | grep -iE "error|fail|crash|reject|exception" | tail -5)

# Create lockfile with timestamp
date +%s > "$LOCKFILE"

# Send alert with crash info
MSG="⚠️ Mac Mini Bot DOWN

🕐 Will auto-restart in 10 minutes

📋 Recent errors:
${CRASH_LOGS:-No error logs found}

Reply if you want me to restart sooner."

send_telegram "$MSG"
