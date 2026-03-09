#!/bin/bash
cd /Users/tommie/clawd/dashboard

files="index.html infrastructure.html agents.html projects.html apis.html skills.html tools.html achievements.html swarm-monitor.html arbitrage-pharma.html terminator.html project-vault.html legion-tracker.html fraud-detection.html n8n-hub.html fiverr.html borbott-army.html tascosaur.html teams-translator.html a2a-server.html docs.html"

for f in $files; do
    echo "FILE:$f"
    if [ -f "$f" ]; then
        echo "NAV_LINKS:$(grep -c 'nav-link' "$f")"
        echo "HAMBURGER:$(grep -c 'hamburger' "$f")"
        echo "TOGGLEMENU:$(grep -c 'toggleMenu' "$f")"
        echo "MOBILE_CSS:$(grep -c '@media' "$f")"
        echo "ABS_PATHS:$(grep -oE 'href="/' "$f" | wc -l | tr -d ' ')"
    else
        echo "MISSING"
    fi
done
