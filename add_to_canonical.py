#!/usr/bin/env python3
"""Add BorbottArmy to the canonical nav list in post-deploy.py"""
import re

fpath = '/Users/tommie/clawd/scripts/post-deploy.py'

with open(fpath, 'r') as f:
    content = f.read()

# Check if already there
if 'borbott-army.html' in content:
    print('Already has BorbottArmy in canonical list')
    exit(0)

# Find the Brain entry and add BorbottArmy after it
old = '    {"href": "/shared-brain.html", "text": "🧠 Brain", "icon": "🧠"},'
new = '''    {"href": "/shared-brain.html", "text": "🧠 Brain", "icon": "🧠"},
    {"href": "/borbott-army.html", "text": "📚 BorbottArmy", "icon": "📚"},'''

if old in content:
    content = content.replace(old, new)
    with open(fpath, 'w') as f:
        f.write(content)
    print('✅ Added BorbottArmy to canonical nav list')
else:
    print('ERROR: Could not find Brain entry to insert after')
    exit(1)
