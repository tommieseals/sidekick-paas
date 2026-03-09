#!/usr/bin/env python3
path = '/Users/tommie/clawd/dashboard/index.html'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find line with fraud-detection and insert after it
new_line = '                <a href="/terminator.html" class="nav-link">🤖 Terminator</a>\n'
inserted = False

for i, line in enumerate(lines):
    if 'fraud-detection.html' in line and 'terminator' not in ''.join(lines):
        lines.insert(i + 1, new_line)
        inserted = True
        break

if inserted:
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f'Inserted TerminatorBot link after line {i+1}')
else:
    print('Already exists or fraud line not found')
