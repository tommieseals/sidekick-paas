#!/usr/bin/env python3
"""Add flush=True to print statements and reduce timeouts"""

file_path = "/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py"

with open(file_path, "r") as f:
    content = f.read()

# 1. Replace print statements to add flush
import re
# Find print( statements and add flush=True if not already there
def add_flush(match):
    text = match.group(0)
    if 'flush=' in text:
        return text
    # Add flush=True before the closing )
    return text[:-1] + ', flush=True)'

content = re.sub(r'print\([^)]+\)', add_flush, content)

# 2. Reduce osascript timeout from 15 to 8 seconds
content = content.replace('timeout=15', 'timeout=8')
content = content.replace('timeout=10', 'timeout=8')

# 3. Add PYTHONUNBUFFERED equivalent at top
if 'sys.stdout' not in content:
    # Add after imports
    import_section = "import time\n"
    if import_section in content:
        content = content.replace(import_section, import_section + "import sys\nsys.stdout.reconfigure(line_buffering=True)\n")

with open(file_path, "w") as f:
    f.write(content)

print("✅ Fixed output buffering!")
print("   - Added flush=True to prints")
print("   - Reduced osascript timeouts to 8s")
print("   - Added line buffering for stdout")
