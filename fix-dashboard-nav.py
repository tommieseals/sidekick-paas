#!/usr/bin/env python3
"""Fix dashboard navigation - add missing links and fix paths"""
import re

with open('/Users/tommie/clawd/dashboard/index.html', 'r') as f:
    content = f.read()

# New nav links to add before Docs
new_links = '''                <a href="swarm-monitor.html" class="nav-link">🐝 Swarm</a>
                <a href="arbitrage-pharma.html" class="nav-link">💊 Pharma</a>
                <a href="terminator.html" class="nav-link">🤖 Terminator</a>
                <a href="project-vault.html" class="nav-link">💰 Vault</a>
                <a href="legion-tracker.html" class="nav-link">🎖️ Legion</a>
                <a href="fraud-detection.html" class="nav-link">🛡️ Fraud</a>
                <a href="n8n-hub.html" class="nav-link">⚡ n8n</a>
                <a href="fiverr.html" class="nav-link">🛒 Fiverr</a>
                <a href="borbott-army.html" class="nav-link">📚 KDP</a>
                <a href="tascosaur.html" class="nav-link">🦖 Tascosaur</a>
                <a href="teams-translator.html" class="nav-link">🌐 Translator</a>
                <a href="a2a-server.html" class="nav-link">🔗 A2A</a>
'''

# Find the docs link pattern and insert before it
docs_pattern = r'(\s*)<a href="/docs\.html" class="nav-link">Docs</a>'
replacement = new_links + r'\1<a href="docs.html" class="nav-link">Docs</a>'
content = re.sub(docs_pattern, replacement, content)

# Change all absolute paths to relative in nav-links
content = re.sub(r'href="/([^"]+\.html)"', r'href="\1"', content)

# Change href="/" to href="index.html"
content = content.replace('href="/"', 'href="index.html"')

with open('/Users/tommie/clawd/dashboard/index.html', 'w') as f:
    f.write(content)

# Verify
with open('/Users/tommie/clawd/dashboard/index.html', 'r') as f:
    result = f.read()
    
nav_count = result.count('class="nav-link"')
print(f"Done! Nav links in file: {nav_count}")
print("Swarm link present:", "swarm-monitor.html" in result)
print("Paths are relative:", 'href="/' not in result or result.count('href="/') == 0)
