#!/usr/bin/env python3
"""Fix the turnstile bypass - using line-by-line approach"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    lines = f.readlines()

# Find line 239 (after the warning) and insert bypass code
new_lines = []
i = 0
while i < len(lines):
    new_lines.append(lines[i])
    
    # After the warning line, insert turnstile bypass
    if i == 239 and 'logger.warning' in lines[i] and 'BLOCKED' in lines[i]:
        bypass_code = '''                
                # Try Turnstile bypass
                if "cloudflare" in block_type.lower() or "captcha" in block_type.lower():
                    logger.info("🔧 Attempting Turnstile bypass...")
                    solved = await self.solve_turnstile()
                    if solved:
                        await self.human_delay(3, 5)
                        is_blocked, block_type = await self.detect_block()
                        if not is_blocked:
                            logger.info("✅ Turnstile solved!")
                
                # If still blocked after bypass attempt
                if not is_blocked:
                    pass  # Continue to scraping below
                else:
'''
        new_lines.append(bypass_code)
        
        # Skip to line 251 (return []) and indent the block
        i += 1
        while i < len(lines) and 'return []' not in lines[i]:
            # Add extra indentation
            new_lines.append('    ' + lines[i])
            i += 1
        # Add the return with extra indent
        if i < len(lines):
            new_lines.append('    ' + lines[i])
    
    i += 1

with open(path, 'w') as f:
    f.writelines(new_lines)

print("✅ Turnstile bypass injected at line 239!")
