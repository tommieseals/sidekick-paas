#!/usr/bin/env python3
"""Patch shared/paths.py to use separate automation profile"""
import re

path = "/Users/administrator/job-hunter-system/shared/paths.py"

with open(path, "r") as f:
    content = f.read()

# Simple replacement - change the macOS path
old = '~/Library/Application Support/Google/Chrome'
new = '~/job-hunter-system/data/chrome-automation'

if old in content:
    content = content.replace(old, new)
    with open(path, "w") as f:
        f.write(content)
    print("✅ Patched! Now using separate automation profile")
else:
    print("Already patched or path not found")

# Verify
with open(path, "r") as f:
    for line in f:
        if 'chrome-automation' in line or 'get_chrome_user_data_dir' in line:
            print(line.rstrip())
