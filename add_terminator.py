#!/usr/bin/env python3
path = '/Users/tommie/clawd/scripts/post-deploy.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if already exists
if 'terminator.html' in content:
    print('TerminatorBot already in CANONICAL_NAV_LINKS')
else:
    # Add after Fraud, before Docs
    old = '{"href": "/fraud-detection.html", "text": "🚨 Fraud", "icon": "🚨"},'
    new = '''{"href": "/fraud-detection.html", "text": "🚨 Fraud", "icon": "🚨"},
    {"href": "/terminator.html", "text": "🤖 Terminator", "icon": "🤖"},'''
    
    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Added TerminatorBot to CANONICAL_NAV_LINKS')
