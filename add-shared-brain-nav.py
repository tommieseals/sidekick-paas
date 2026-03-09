#!/usr/bin/env python3
import os
path = os.path.expanduser("~/clawd/scripts/post-deploy.py")
with open(path) as f:
    lines = f.readlines()

# Find line with fort-knox and insert after
exists = any("/shared-brain.html" in line for line in lines)
if not exists:
    for i, line in enumerate(lines):
        if "/fort-knox.html" in line:
            new_line = '    {"href": "/shared-brain.html", "text": "🧠 Brain", "icon": "🧠"},\n'
            lines.insert(i+1, new_line)
            break
    with open(path, "w") as f:
        f.writelines(lines)
    print("Done - Shared Brain added to nav")
else:
    print("Shared Brain already in nav")
