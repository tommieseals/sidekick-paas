#!/usr/bin/env python3
path = '/Users/tommie/clawd/dashboard/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix: button calls toggleNav() but function is toggleMenu()
content = content.replace('onclick="toggleNav()"', 'onclick="toggleMenu()"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed: toggleNav -> toggleMenu')
