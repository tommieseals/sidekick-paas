#!/bin/bash
echo '{"source":{"branch":"main","path":"/"}}' > /tmp/pages.json
/opt/homebrew/bin/gh api repos/tommieseals/taskbot-power-automate/pages -X POST --input /tmp/pages.json
