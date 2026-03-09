#!/usr/bin/env python3
"""Add wait for Cloudflare frame to load"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Add wait before checking frames
old = '''            # DEBUG: Log all frames
            logger.info(f"DEBUG: Found {len(self.page.frames)} frames")'''

new = '''            # Wait for Cloudflare frame to load
            await asyncio.sleep(3)
            
            # DEBUG: Log all frames
            logger.info(f"DEBUG: Found {len(self.page.frames)} frames")'''

if old in content:
    content = content.replace(old, new)
    # Also need to import asyncio if not already
    if 'import asyncio' not in content:
        content = 'import asyncio\n' + content
    with open(path, 'w') as f:
        f.write(content)
    print("Added 3s wait for frames!")
else:
    print("Could not find insertion point")
