#!/usr/bin/env python3
"""Fix Indeed scraper timeout - use domcontentloaded instead of networkidle"""

path = '/Users/tommie/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Change networkidle to domcontentloaded (faster, won't hang on blocked pages)
content = content.replace("wait_until='networkidle'", "wait_until='domcontentloaded'")

# Also reduce the timeout to 30s
content = content.replace("timeout=90000", "timeout=30000")

with open(path, 'w') as f:
    f.write(content)

print("✅ Fixed: networkidle → domcontentloaded, timeout 90s → 30s")
