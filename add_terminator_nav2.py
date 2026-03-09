#!/usr/bin/env python3
import sys

filepath = '/Users/tommie/clawd/dashboard/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if already exists
if 'terminator.html' in content:
    print('TerminatorBot already in nav!')
    sys.exit(0)

# Find and replace the fraud-detection line - simpler pattern
old = '<a href="/fraud-detection.html" class="nav-link">'
if old in content:
    # Find position and add after the closing </a>
    pos = content.find(old)
    end_pos = content.find('</a>', pos) + 4
    
    # Insert TerminatorBot link
    insert = '\n                <a href="/terminator.html" class="nav-link">🤖 TerminatorBot</a>'
    content = content[:end_pos] + insert + content[end_pos:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: Added TerminatorBot to nav!')
else:
    print('ERROR: Pattern not found')
    # Debug: show what we have
    import re
    matches = re.findall(r'fraud[^"]*html', content)
    print(f'Found: {matches}')
    sys.exit(1)
