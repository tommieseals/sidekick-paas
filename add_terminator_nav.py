#!/usr/bin/env python3
import sys

filepath = '/Users/tommie/clawd/dashboard/index.html'

with open(filepath, 'r') as f:
    content = f.read()

# Check if already exists
if 'terminator.html' in content:
    print('TerminatorBot already in nav!')
    sys.exit(0)

# Add after fraud-detection
old = '<a href="/fraud-detection.html" class="nav-link">🚨 Fraud</a>'
new = old + '\n                <a href="/terminator.html" class="nav-link">🤖 TerminatorBot</a>'

if old in content:
    content = content.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(content)
    print('SUCCESS: Added TerminatorBot to nav!')
else:
    print('ERROR: Pattern not found')
    sys.exit(1)
