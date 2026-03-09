#!/usr/bin/env python3
"""Fix sitekey extraction to look at iframe URL"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Find and update the sitekey extraction in solve_turnstile
old_extraction = '''            # Method 2: Look in iframe URL
            if not sitekey:
                for frame in self.page.frames:
                    if "challenges.cloudflare.com" in frame.url:
                        match = re.search(r'sitekey=([^&]+)', frame.url)
                        if match:
                            sitekey = match.group(1)
                        break'''

new_extraction = '''            # Method 2: Look in iframe URL (the sitekey is at the end after /0x)
            if not sitekey:
                for frame in self.page.frames:
                    if "challenges.cloudflare.com" in frame.url:
                        # Sitekey is at end of URL like: .../0x4AAAAAAAA...
                        match = re.search(r'/(0x[A-Za-z0-9_-]+)/?$', frame.url)
                        if match:
                            sitekey = match.group(1)
                            break
                        # Also try sitekey param
                        match = re.search(r'sitekey=([^&]+)', frame.url)
                        if match:
                            sitekey = match.group(1)
                            break'''

if old_extraction in content:
    content = content.replace(old_extraction, new_extraction)
    with open(path, 'w') as f:
        f.write(content)
    print("Fixed sitekey extraction!")
else:
    print("Could not find extraction code to fix")
    # Let's see what's there
    if "Method 2: Look in iframe" in content:
        print("Found Method 2 marker")
