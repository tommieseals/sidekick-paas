#!/bin/bash
# Sync local shared-brain to/from Mac Pro
# Usage: sync-shared-brain.sh [push|pull]

LOCAL_PATH="$HOME/clawd/shared-brain"
REMOTE_PATH="administrator@100.101.89.80:~/shared-brain"

ACTION="${1:-pull}"

if [ "$ACTION" = "push" ]; then
    echo "Pushing local shared-brain to Mac Pro..."
    scp -r "$LOCAL_PATH"/* "$REMOTE_PATH"/
    echo "Done!"
elif [ "$ACTION" = "pull" ]; then
    echo "Pulling shared-brain from Mac Pro..."
    mkdir -p "$LOCAL_PATH"
    scp -r "${REMOTE_PATH}"/* "$LOCAL_PATH"/
    echo "Done!"
else
    echo "Usage: $0 [push|pull]"
    exit 1
fi
