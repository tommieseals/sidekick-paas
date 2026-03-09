#!/bin/bash
# Refresh and wait for Indeed to load

osascript << 'EOF'
tell application "Safari"
    activate
    delay 1
    -- Press Cmd+R to refresh
    tell application "System Events"
        keystroke "r" using command down
    end tell
end tell
EOF

echo "Refreshing Safari..."
sleep 10

# Check page title
osascript << 'EOF'
tell application "Safari"
    return name of front document
end tell
EOF
