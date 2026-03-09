#!/usr/bin/env python3
"""Fix ZipRecruiter runner for better submission detection"""
import re

path = '/Users/tommie/project-legion-rusty-fix/Project-Legion/ziprecruiter_runner.py'

with open(path, 'r') as f:
    content = f.read()

# Fix 1: More attempts (already done to 8)
# Fix 2: Better status detection
old_check = "if (text.includes('Application submitted') || text.includes('applied')) return 'SUBMITTED';"
new_check = "if (text.includes('Application submitted') || text.includes('applied') || text.includes('success') || text.includes('received') || text.includes('Thank you')) return 'SUBMITTED';"

content = content.replace(old_check, new_check)

# Fix 3: Add debug logging
old_return = "    return \"UNKNOWN\""
new_return = '''    # Debug: log what we see
    js_debug = 'document.body.innerText.substring(0,500)'
    debug_text = run_js(js_debug)
    log(f"  DEBUG page text: {debug_text[:200]}")
    return "UNKNOWN"'''

content = content.replace(old_return, new_return)

with open(path, 'w') as f:
    f.write(content)

print("✅ ZipRecruiter runner updated")
