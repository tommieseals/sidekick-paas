#!/usr/bin/env python3
"""Add debug logging to solve_turnstile"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Add debug logging after "sitekey = None"
old = '''            import re
            sitekey = None
            
            # Method 1: Look for data-sitekey attribute'''

new = '''            import re
            sitekey = None
            
            # DEBUG: Log all frames
            logger.info(f"DEBUG: Found {len(self.page.frames)} frames")
            for frame in self.page.frames:
                logger.info(f"DEBUG: Frame URL: {frame.url[:100]}")
            
            # Method 1: Look for data-sitekey attribute'''

if old in content:
    content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)
    print("Added debug logging!")
else:
    print("Could not find insertion point")
