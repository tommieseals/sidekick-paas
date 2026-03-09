#!/bin/bash
osascript << 'EOF'
tell application "Safari"
    activate
    set URL of document 1 to "https://www.linkedin.com/jobs/search/?f_AL=true&f_WT=2&keywords=systems%20administrator"
end tell
EOF
echo "Safari navigating to LinkedIn Easy Apply jobs..."
sleep 8
osascript << 'EOF'
tell application "Safari"
    return name of front document
end tell
EOF
