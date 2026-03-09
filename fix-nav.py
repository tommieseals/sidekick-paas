#!/usr/bin/env python3
import re
import sys

filepath = sys.argv[1] if len(sys.argv) > 1 else "/Users/tommie/clawd/dashboard/index.html"

with open(filepath, "r") as f:
    content = f.read()

# Fix 1: Change absolute paths to relative in nav-links
# Replace href="/xxx.html" with href="xxx.html"
content = re.sub(r'href="/([^"]+\.html)"', r'href="\1"', content)

# Fix 2: Change href="/" to href="index.html"
content = content.replace('href="/" class="nav-link"', 'href="index.html" class="nav-link"')

# Fix 3: Update the mobile nav-links CSS to add z-index and better tap handling
old_css = '''.nav-links.active { display: flex; }
            .nav-link {
                width: 100%;
                text-align: center;
                padding: 12px;
                min-height: 44px;
            }'''

new_css = '''.nav-links.active { 
                display: flex; 
                position: relative;
                z-index: 1000;
                background: rgba(88, 80, 236, 0.95);
                border-radius: 10px;
                padding: 10px;
            }
            .nav-link {
                width: 100%;
                text-align: center;
                padding: 12px;
                min-height: 44px;
                display: block;
                cursor: pointer;
                pointer-events: auto !important;
                -webkit-tap-highlight-color: rgba(255,255,255,0.3);
            }'''

content = content.replace(old_css, new_css)

with open(filepath, "w") as f:
    f.write(content)

print("Done! Navigation fixed.")
print(f"- Changed absolute paths (/xxx.html) to relative (xxx.html)")
print(f"- Added z-index and pointer-events to mobile nav")
