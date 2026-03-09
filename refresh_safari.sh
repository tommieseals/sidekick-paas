#!/bin/bash
# Refresh Safari to clear any bot block
osascript << 'EOF'
tell application "Safari"
    activate
    delay 1
    set URL of document 1 to "https://www.ziprecruiter.com/jobs-search?search=systems+administrator&location=Houston%2C+TX"
end tell
EOF
echo "Safari refreshed to ZipRecruiter"
