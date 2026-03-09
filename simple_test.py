#!/usr/bin/env python3
fpath = '/Users/tommie/clawd/dashboard/index.html'

# Read
with open(fpath, 'r') as f:
    content = f.read()
print(f"Before: {len(content)} bytes")
print(f"Has borbott: {'borbott' in content}")

# Do replacement
old = '<a href="/docs/" class="nav-link">Docs</a>'
new = '<a href="/borbott-army.html" class="nav-link">📚 BorbottArmy</a>\n                <a href="/docs/" class="nav-link">Docs</a>'

if old in content:
    content = content.replace(old, new)
    print("Replacement done in memory")
else:
    print("Pattern not found!")
    exit(1)

# Write
with open(fpath, 'w') as f:
    written = f.write(content)
print(f"Wrote {written} bytes")

# Verify by re-reading
with open(fpath, 'r') as f:
    verify = f.read()
print(f"After: {len(verify)} bytes")
print(f"Has borbott: {'borbott' in verify}")

# Also check via shell
import subprocess
result = subprocess.run(['grep', 'borbott', fpath], capture_output=True, text=True)
print(f"grep result: {result.stdout.strip()}")
print(f"grep returncode: {result.returncode}")
