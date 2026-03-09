#!/usr/bin/env python3
import re

content = open("/Users/tommie/clawd/dashboard/index.html").read()

# Find the nav-links div and show full content
pattern = re.compile(r'<div[^>]*class="nav-links"[^>]*>.*?</div>', re.DOTALL)
m = pattern.search(content)

if m:
    print("=== FOUND NAV-LINKS DIV ===")
    print(m.group(0))
    print("\n=== END ===")
else:
    print("NOT FOUND")
