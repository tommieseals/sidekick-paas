#!/usr/bin/env python3
"""Replace Clawd Dashboard branding with Skynet logo."""

path = '/Users/tommie/clawd/dashboard/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update title
content = content.replace('<title>Clawd Dashboard</title>', '<title>Skynet Dashboard</title>')

# Replace nav-brand text with logo
old_brand = '''<div class="nav-brand">
                <h1>🤖 Clawd Dashboard</h1>'''

new_brand = '''<div class="nav-brand">
                <a href="/"><img src="/skynet_loading.gif" alt="Skynet" style="height: 50px; vertical-align: middle;"></a>'''

if old_brand in content:
    content = content.replace(old_brand, new_brand)
    print('✅ Replaced nav-brand with Skynet logo')
else:
    # Try alternate spacing
    import re
    pattern = r'<div class="nav-brand">\s*<h1>.*?Clawd Dashboard.*?</h1>'
    replacement = '<div class="nav-brand">\n                <a href="/"><img src="/skynet_loading.gif" alt="Skynet" style="height: 50px; vertical-align: middle;"></a>'
    new_content, count = re.subn(pattern, replacement, content, flags=re.DOTALL)
    if count > 0:
        content = new_content
        print(f'✅ Replaced nav-brand with Skynet logo (regex, {count} replacements)')
    else:
        print('⚠️ Could not find nav-brand to replace')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
