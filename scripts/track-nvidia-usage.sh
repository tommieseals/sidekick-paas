#!/bin/bash
# track-nvidia-usage.sh - Track NVIDIA API usage (50 calls/day limit)
# Run on Mac Mini where gateway lives

GATEWAY_DIR="$HOME/dta/gateway"
USAGE_FILE="$GATEWAY_DIR/.nvidia-usage.json"
TODAY=$(date +%Y-%m-%d)

# Initialize if needed
if [ ! -f "$USAGE_FILE" ]; then
  echo '{"date":"'$TODAY'","calls":0}' > "$USAGE_FILE"
fi

# Reset if new day
SAVED_DATE=$(cat "$USAGE_FILE" 2>/dev/null | grep -o '"date":"[^"]*"' | cut -d'"' -f4)
if [ "$SAVED_DATE" != "$TODAY" ]; then
  echo '{"date":"'$TODAY'","calls":0}' > "$USAGE_FILE"
fi

# Get current count
CALLS=$(cat "$USAGE_FILE" | grep -o '"calls":[0-9]*' | cut -d':' -f2)

case "$1" in
  increment)
    NEW_CALLS=$((CALLS + 1))
    echo '{"date":"'$TODAY'","calls":'$NEW_CALLS'}' > "$USAGE_FILE"
    echo "NVIDIA API calls today: $NEW_CALLS/50"
    if [ $NEW_CALLS -ge 45 ]; then
      echo "⚠️ WARNING: Approaching daily limit!"
    fi
    ;;
  status)
    REMAINING=$((50 - CALLS))
    echo "NVIDIA API: $CALLS/50 used ($REMAINING remaining)"
    ;;
  *)
    echo "Usage: $0 {increment|status}"
    ;;
esac
