#!/bin/bash
cd /Users/tommie/clawd/dashboard

# Backup first
cp index.html index.html.before-terminator

# Use sed to add TerminatorBot after fraud-detection
sed -i '' 's|<a href="/fraud-detection.html" class="nav-link">🚨 Fraud</a>|<a href="/fraud-detection.html" class="nav-link">🚨 Fraud</a>\
                <a href="/terminator.html" class="nav-link">🤖 TerminatorBot</a>|' index.html

# Verify
if grep -q terminator.html index.html; then
    echo "SUCCESS: TerminatorBot added to nav!"
    grep terminator.html index.html
else
    echo "FAILED: sed did not work"
fi
