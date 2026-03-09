#!/usr/bin/env python3
import sys

filepath = sys.argv[1] if len(sys.argv) > 1 else '/Users/tommie/clawd/dashboard/arbitrage-pharma.html'

with open(filepath, 'r') as f:
    content = f.read()

# Add public link after </nav>
old_text = '</nav>'
new_text = '''</nav>
    <div style="text-align: center; margin: 1rem 2rem; padding: 1rem; background: rgba(72,187,120,0.2); border-radius: 12px;">
        <a href="https://arbitrage-pharma.pages.dev/" target="_blank" style="color: #48BB78; font-weight: 600; text-decoration: none;">🌐 View Public Site →</a>
        <span style="margin: 0 1rem; opacity: 0.5;">|</span>
        <a href="https://github.com/tommieseals" target="_blank" style="color: #fff; font-weight: 500; text-decoration: none; opacity: 0.8;">📂 GitHub</a>
    </div>'''

if old_text in content and 'arbitrage-pharma.pages.dev' not in content:
    content = content.replace(old_text, new_text, 1)
    with open(filepath, 'w') as f:
        f.write(content)
    print('Added public link to Pharma page!')
elif 'arbitrage-pharma.pages.dev' in content:
    print('Link already exists')
else:
    print('Pattern not found')
