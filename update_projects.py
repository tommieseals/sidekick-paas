#!/usr/bin/env python3
import re

filepath = '/Users/tommie/clawd/dashboard/projects.html'
with open(filepath, 'r') as f:
    content = f.read()

# Add to nav - after terminator
old_nav = '<a href="/terminator.html" class="nav-link">🤖 Terminator</a>'
new_nav = '''<a href="/terminator.html" class="nav-link">🤖 Terminator</a>
                <a href="/resume-bank.html" class="nav-link">📄 Resume Bank</a>
                <a href="/specialist-swarm.html" class="nav-link">🚢 Specialists</a>'''
content = content.replace(old_nav, new_nav)

# Add project cards - after borbott-army (using regex for flexibility)
old_card = r'(<a href="/borbott-army\.html" class="other-card">\s*<span>📚</span>\s*BorbottArmy\s*</a>)'
new_card = '''<a href="/borbott-army.html" class="other-card">
                    <span>📚</span> BorbottArmy
                </a>
                <a href="/resume-bank.html" class="other-card">
                    <span>📄</span> Resume Bank
                </a>
                <a href="/specialist-swarm.html" class="other-card">
                    <span>🚢</span> Specialists
                </a>'''
content = re.sub(old_card, new_card, content)

with open(filepath, 'w') as f:
    f.write(content)
print('Updated projects.html with new pages')
