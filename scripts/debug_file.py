#!/usr/bin/env python3
path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'
with open(path, 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'is_blocked, block_type = await self.detect_block()' in line:
        print(f'Found at line {i}')
        for j in range(i-2, i+15):
            if 0 <= j < len(lines):
                print(f'{j}: {repr(lines[j])}')
        break
