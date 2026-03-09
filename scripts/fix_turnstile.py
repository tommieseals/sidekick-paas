#!/usr/bin/env python3
"""Fix the turnstile bypass in indeed_ultra_stealth.py"""

path = "/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py"

with open(path, "r") as f:
    lines = f.readlines()

# Find the line with "is_blocked, block_type = await self.detect_block()"
# and insert turnstile handling after the warning

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    new_lines.append(line)
    
    # Look for the warning line about being blocked
    if 'logger.warning(f"❌ Indeed Ultra: BLOCKED ({block_type})")' in line:
        # Insert turnstile bypass code after this line
        indent = "                "
        bypass_code = f'''
{indent}# Try Turnstile bypass
{indent}if "cloudflare" in block_type.lower() or "captcha" in block_type.lower():
{indent}    logger.info("Attempting Turnstile bypass...")
{indent}    solved = await self.solve_turnstile()
{indent}    if solved:
{indent}        await self.human_delay(3, 5)
{indent}        is_blocked, block_type = await self.detect_block()
{indent}        if not is_blocked:
{indent}            logger.info("✅ Turnstile solved!")
{indent}            # Continue with scraping
{indent}            pass
{indent}
{indent}if not is_blocked:
{indent}    pass  # Will skip the screenshot/return below
{indent}else:
'''
        new_lines.append(bypass_code)
        
        # Now we need to indent the next block (screenshot etc) 
        # Actually let's do a simpler approach - just add the call
        
    i += 1

# Actually let me do a simpler replacement
with open(path, "r") as f:
    content = f.read()

old_block = '''            is_blocked, block_type = await self.detect_block()
            if is_blocked:
                logger.warning(f"❌ Indeed Ultra: BLOCKED ({block_type})")
                screenshot_path = self.session_dir / f"blocked_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                await self.page.screenshot(path=str(screenshot_path))
                logger.info(f"📸 Screenshot saved: {screenshot_path}")
                
                # Keep browser open for inspection if using real profile
                if self.use_real_profile:
                    print("\\n⚠️  BLOCKED! Browser left open for inspection.")
                    print(f"   Block type: {block_type}")
                    print(f"   Screenshot: {screenshot_path}")
                    input("   Press Enter to close browser...")
                
                return []'''

new_block = '''            is_blocked, block_type = await self.detect_block()
            if is_blocked:
                logger.warning(f"❌ Indeed Ultra: BLOCKED ({block_type})")
                
                # Try Turnstile bypass
                if "cloudflare" in block_type.lower() or "captcha" in block_type.lower():
                    logger.info("Attempting Turnstile bypass...")
                    solved = await self.solve_turnstile()
                    if solved:
                        await self.human_delay(3, 5)
                        is_blocked, block_type = await self.detect_block()
                        if not is_blocked:
                            logger.info("✅ Turnstile solved!")
                
                # If still blocked, save screenshot and return
                if is_blocked:
                    screenshot_path = self.session_dir / f"blocked_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                    await self.page.screenshot(path=str(screenshot_path))
                    logger.info(f"📸 Screenshot saved: {screenshot_path}")
                    
                    # Keep browser open for inspection if using real profile
                    if self.use_real_profile:
                        print("\\n⚠️  BLOCKED! Browser left open for inspection.")
                        print(f"   Block type: {block_type}")
                        print(f"   Screenshot: {screenshot_path}")
                        input("   Press Enter to close browser...")
                    
                    return []'''

if old_block in content:
    content = content.replace(old_block, new_block)
    with open(path, "w") as f:
        f.write(content)
    print("✅ Turnstile bypass added to block handling!")
else:
    print("❌ Could not find the block to replace")
    print("Looking for pattern...")
    if "is_blocked, block_type = await self.detect_block()" in content:
        print("Found detect_block call")
    if "❌ Indeed Ultra: BLOCKED" in content:
        print("Found BLOCKED warning")
