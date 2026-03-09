#!/usr/bin/env python3
import re

# Read index.html
with open("/Users/tommie/clawd/dashboard/index.html", "r") as f:
    content = f.read()

# Find and replace navigation
old = '''<a href="/arbitrage-pharma.html" class="nav-link">💊 Pharma</a>
                <a href="/docs.html" class="nav-link">Docs</a>'''

new = '''<a href="/arbitrage-pharma.html" class="nav-link">💊 Pharma</a>
                <a href="/terminator.html" class="nav-link">🤖 Terminator</a>
                <a href="/project-vault.html" class="nav-link">💰 Vault</a>
                <a href="/docs.html" class="nav-link">Docs</a>'''

if old in content:
    content = content.replace(old, new)
    with open("/Users/tommie/clawd/dashboard/index.html", "w") as f:
        f.write(content)
    print("✅ Navigation updated!")
else:
    print("⚠️ Pattern not found - nav may already be updated")
