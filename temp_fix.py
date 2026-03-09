#!/usr/bin/env python3
path = '/Users/tommie/clawd/dashboard/index.html'
with open(path, 'r') as f:
    content = f.read()

# Add TerminatorBot after Fraud, before Docs
old = '<a href="/fraud-detection.html" class="nav-link">🚨 Fraud</a>\n                <a href="/docs/" class="nav-link">Docs</a>'
new = '<a href="/fraud-detection.html" class="nav-link">🚨 Fraud</a>\n                <a href="/terminator.html" class="nav-link">🤖 Terminator</a>\n                <a href="/docs/" class="nav-link">Docs</a>'

if old in content:
    content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)
    print('Added TerminatorBot to nav links')
else:
    print('Pattern not found - checking alternative...')
    # Try without the newlines being exact
    if 'terminator.html' not in content and 'fraud-detection.html' in content:
        content = content.replace(
            '<a href="/fraud-detection.html" class="nav-link">🚨 Fraud</a>',
            '<a href="/fraud-detection.html" class="nav-link">🚨 Fraud</a>\n                <a href="/terminator.html" class="nav-link">🤖 Terminator</a>'
        )
        with open(path, 'w') as f:
            f.write(content)
        print('Added TerminatorBot after Fraud')
    else:
        print('Could not find insertion point or already exists')
