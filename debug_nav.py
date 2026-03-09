#!/usr/bin/env python3
import os

fpath = '/Users/tommie/clawd/dashboard/index.html'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

old_text = '<a href="/docs/" class="nav-link">Docs</a>'
print(f"File size: {len(content)} bytes")
print(f"old_text in content: {old_text in content}")
print(f"Position of 'docs/': {content.find('docs/')}")

# Show 200 chars around the docs link
pos = content.find('/docs/')
if pos > 0:
    print(f"\nContext around /docs/:")
    print(repr(content[pos-50:pos+150]))
