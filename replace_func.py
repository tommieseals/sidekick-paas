#!/usr/bin/env python3
import re

# Read the new function
with open('/tmp/improved_fill_form.py', 'r') as f:
    new_func = f.read()

# Read the original file
with open('/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py', 'r') as f:
    content = f.read()

# Find and replace the fill_form_fields function
pattern = r'def fill_form_fields\(\):.*?(?=\ndef [a-z_]+\()'
replacement = new_func + '\n\n'

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Backup original
with open('/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py.bak', 'w') as f:
    f.write(content)

# Write new file
with open('/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py', 'w') as f:
    f.write(new_content)

print('✅ Function replaced successfully!')
print(f'Original: {len(content)} bytes')
print(f'New: {len(new_content)} bytes')
