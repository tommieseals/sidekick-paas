#!/usr/bin/env python3
import os
import glob

dashboard_dir = '/Users/tommie/clawd/dashboard'

# Find all HTML files with nav menus
html_files = glob.glob(os.path.join(dashboard_dir, '*.html'))

old_text = '<a href="/docs/" class="nav-link">Docs</a>'
new_text = '<a href="/borbott-army.html" class="nav-link">📚 BorbottArmy</a>\n                <a href="/docs/" class="nav-link">Docs</a>'

for fpath in html_files:
    fname = os.path.basename(fpath)
    
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'borbott-army.html' in content:
        print(f'✓ {fname} - already has link')
        continue
    
    if old_text not in content:
        print(f'- {fname} - no nav menu')
        continue
    
    # Do the replacement
    new_content = content.replace(old_text, new_text)
    
    # Verify replacement worked
    if new_content == content:
        print(f'⚠️ {fname} - replace had no effect!')
        continue
    
    # Write it back
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    # Verify write worked
    with open(fpath, 'r', encoding='utf-8') as f:
        verify = f.read()
    
    if 'borbott-army.html' in verify:
        print(f'✅ {fname} - FIXED and VERIFIED')
    else:
        print(f'❌ {fname} - write failed!')

print('\nDone!')
