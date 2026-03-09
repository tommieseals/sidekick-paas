#!/usr/bin/env python3
"""Wait for Cloudflare frame to appear"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Replace the simple sleep with explicit frame wait
old = '''            # Wait for Cloudflare frame to load
            await asyncio.sleep(3)
            
            # DEBUG: Log all frames'''

new = '''            # Wait for Cloudflare frame to appear (up to 10 seconds)
            cf_frame = None
            for _ in range(20):
                await asyncio.sleep(0.5)
                for frame in self.page.frames:
                    if "challenges.cloudflare.com" in frame.url:
                        cf_frame = frame
                        break
                if cf_frame:
                    break
            
            # DEBUG: Log all frames'''

if old in content:
    content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)
    print("Added explicit frame wait!")
else:
    print("Could not find insertion point")
