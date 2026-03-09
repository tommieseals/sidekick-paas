#!/usr/bin/env python3
path = '/Users/tommie/clawd/dashboard/index.html'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Check if already exists
full_content = ''.join(lines)
if 'terminator.html' in full_content:
    print('TerminatorBot link already exists')
    exit()

# Find line with fraud-detection and insert after it
new_line = '                <a href="/terminator.html" class="nav-link">🤖 Terminator</a>\n'

for i, line in enumerate(lines):
    if 'fraud-detection.html' in line:
        lines.insert(i + 1, new_line)
        print(f'Inserting after line {i+1}: {line.strip()}')
        break

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('Done - TerminatorBot added')
