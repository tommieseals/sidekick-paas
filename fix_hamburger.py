#!/usr/bin/env python3
"""Fix missing hamburger button in nav."""

path = '/Users/tommie/clawd/dashboard/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# The hamburger is missing between nav-brand closing and nav-links
# Current: </a></div>\n...<div class="nav-links"
# Should be: </a></div>\n<button class="hamburger"...>\n<div class="nav-links"

old_pattern = '''</a></div>
                                                                                                                                                                                                            <div class="nav-links" id="navLinks">'''

new_pattern = '''</a>
            </div>
            <button class="hamburger" onclick="toggleNav()">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div class="nav-links" id="navLinks">'''

if old_pattern in content:
    content = content.replace(old_pattern, new_pattern)
    print('✅ Added hamburger button back')
else:
    # Try simpler pattern
    import re
    # Find the closing of nav-brand and add hamburger before nav-links
    pattern = r'(</a>\s*</div>)\s*(<div class="nav-links")'
    replacement = r'''\1
            <button class="hamburger" onclick="toggleNav()">
                <span></span>
                <span></span>
                <span></span>
            </button>
            \2'''
    new_content, count = re.subn(pattern, replacement, content)
    if count > 0:
        content = new_content
        print(f'✅ Added hamburger button (regex, {count} replacements)')
    else:
        print('⚠️ Could not find pattern to fix')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
