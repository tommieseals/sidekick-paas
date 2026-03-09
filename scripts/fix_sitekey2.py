#!/usr/bin/env python3
"""Fix sitekey extraction regex"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Fix the regex - sitekey is in the middle of URL, not at end
old = "match = re.search(r'/(0x[A-Za-z0-9_-]+)/?$', frame.url)"
new = "match = re.search(r'/(0x[A-Za-z0-9_-]{20,})/', frame.url)"

if old in content:
    content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)
    print("Fixed regex! Sitekey: 0x4AAAAAAADnPIDROrmt1Wwj")
else:
    print("Could not find regex to fix")
