#!/usr/bin/env python3
"""Fix the turnstile bypass in indeed_ultra_stealth.py"""

path = "/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py"

with open(path, "r") as f:
    content = f.read()

old_block = '''            # Check if blocked
            is_blocked, block_type = await self.detect_block()
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

new_block = '''            # Check if blocked
            is_blocked, block_type = await self.detect_block()
            if is_blocked:
                logger.warning(f"❌ Indeed Ultra: BLOCKED ({block_type})")
                
                # Try Turnstile bypass
                if "cloudflare" in block_type.lower() or "captcha" in block_type.lower():
                    logger.info("🔧 Attempting Turnstile bypass...")
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
    print("✅ Turnstile bypass code added!")
else:
    print("❌ Block not found - checking what's there...")
    # Show what we're looking for
    if "# Check if blocked" in content:
        print("Found '# Check if blocked' comment")
    if "is_blocked, block_type = await self.detect_block()" in content:
        print("Found detect_block call")
