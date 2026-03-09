#!/usr/bin/env python3
"""Fix using line number"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    lines = f.readlines()

# Check if already patched
content = ''.join(lines)
if 'Attempting Turnstile bypass' in content:
    print("Already patched!")
    exit(0)

# Find line with BLOCKED warning
target_line = None
for i, line in enumerate(lines):
    if 'BLOCKED' in line and 'logger.warning' in line:
        target_line = i
        print(f"Found BLOCKED warning at line {i}")
        break

if target_line is None:
    print("Could not find BLOCKED warning")
    exit(1)

# Insert bypass code after the warning
bypass_lines = [
    '                \n',
    '                # Try Turnstile bypass automatically\n',
    '                if "cloudflare" in block_type.lower() or "captcha" in block_type.lower():\n',
    '                    logger.info("Attempting Turnstile bypass...")\n',
    '                    solved = await self.solve_turnstile()\n',
    '                    if solved:\n',
    '                        await self.human_delay(3, 5)\n',
    '                        is_blocked, _ = await self.detect_block()\n',
    '                        if not is_blocked:\n',
    '                            logger.info("Turnstile SOLVED!")\n',
    '                \n',
    '                # If still blocked, handle it\n',
    '                if is_blocked:\n',
]

# Build new content
new_lines = lines[:target_line+1]  # Up to and including BLOCKED warning
new_lines.extend(bypass_lines)

# Add indented version of remaining blocked handling (screenshot, etc)
# Skip empty line after warning, then indent the rest until return []
i = target_line + 1
while i < len(lines) and 'return []' not in lines[i]:
    if lines[i].strip():  # Skip empty lines
        new_lines.append('    ' + lines[i])
    else:
        new_lines.append(lines[i])
    i += 1

# Add the return [] with indent
if i < len(lines):
    new_lines.append('    ' + lines[i])
    i += 1

# Add rest of file
new_lines.extend(lines[i:])

with open(path, 'w') as f:
    f.writelines(new_lines)

print("Patched successfully!")
