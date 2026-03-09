#!/bin/bash
# Simple Safari test
osascript << 'EOF'
tell application "Safari"
    set pageTitle to name of front document
    return pageTitle
end tell
EOF
