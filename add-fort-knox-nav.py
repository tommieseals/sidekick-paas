#!/usr/bin/env python3
import os
path = os.path.expanduser("~/clawd/scripts/post-deploy.py")
with open(path) as f:
    lines = f.readlines()

# Find line with fiverr and insert after
fiverr_exists = any("/fort-knox.html" in line for line in lines)
if not fiverr_exists:
    for i, line in enumerate(lines):
        if "/fiverr.html" in line:
            fort_knox_line = '    {"href": "/fort-knox.html", "text": "🏰 Fort Knox", "icon": "🏰"},\n'
            lines.insert(i+1, fort_knox_line)
            break
    with open(path, "w") as f:
        f.writelines(lines)
    print("Done - Fort Knox added to nav")
else:
    print("Fort Knox already in nav")
