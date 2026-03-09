#!/usr/bin/env python3
"""Style hamburger button to match cyberpunk theme."""

path = '/Users/tommie/clawd/dashboard/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the hamburger CSS
old_hamburger_css = '''.hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
            gap: 5px;
            padding: 10px;
        }

        .hamburger span {
            width: 25px;
            height: 3px;
            background: white;
            border-radius: 2px;
        }'''

new_hamburger_css = '''.hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
            gap: 6px;
            padding: 12px;
            background: transparent;
            border: 2px solid rgba(0, 255, 255, 0.5);
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .hamburger:hover {
            border-color: rgba(0, 255, 255, 0.9);
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
        }

        .hamburger span {
            width: 28px;
            height: 3px;
            background: linear-gradient(90deg, #00ffff, #ff0066);
            border-radius: 2px;
            box-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
            transition: all 0.3s ease;
        }
        
        .hamburger:hover span {
            box-shadow: 0 0 12px rgba(0, 255, 255, 0.9);
        }'''

if old_hamburger_css in content:
    content = content.replace(old_hamburger_css, new_hamburger_css)
    print('✅ Updated hamburger CSS with cyberpunk theme')
else:
    # Try to find just the hamburger section and replace
    import re
    pattern = r'\.hamburger \{[^}]+\}\s*\.hamburger span \{[^}]+\}'
    if re.search(pattern, content):
        content = re.sub(pattern, new_hamburger_css, content)
        print('✅ Updated hamburger CSS (regex)')
    else:
        print('⚠️ Could not find hamburger CSS to replace')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
