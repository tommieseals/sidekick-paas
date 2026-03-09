#!/usr/bin/env python3
"""Patch indeed_ultra_stealth.py to handle Cloudflare Turnstile"""

path = "/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py"

with open(path, "r") as f:
    content = f.read()

# Add turnstile handling method
turnstile_method = '''
    async def solve_turnstile(self) -> bool:
        """Attempt to solve Cloudflare Turnstile checkbox"""
        try:
            # Find the Cloudflare iframe
            turnstile_frame = None
            for frame in self.page.frames:
                if "challenges.cloudflare.com" in frame.url:
                    turnstile_frame = frame
                    break
            
            if not turnstile_frame:
                logger.info("No Turnstile iframe found")
                return False
            
            logger.info("Found Turnstile iframe, attempting to solve...")
            
            # Wait a bit (human-like)
            await self.human_delay(1.0, 2.0)
            
            # Try clicking the checkbox
            checkbox = await turnstile_frame.query_selector('input[type="checkbox"]')
            if checkbox:
                await checkbox.click()
                await self.human_delay(2.0, 4.0)
                return True
            
            # Alternative: click the label/container
            label = await turnstile_frame.query_selector('label')
            if label:
                await label.click()
                await self.human_delay(2.0, 4.0)
                return True
                
            return False
        except Exception as e:
            logger.warning(f"Turnstile solve failed: {e}")
            return False
'''

# Insert after detect_block method
marker = "    async def search(self, query: str, location: str"
if marker in content and "async def solve_turnstile" not in content:
    content = content.replace(marker, turnstile_method + "\n" + marker)
    print("Added solve_turnstile method")

# Now update the search method to try solving turnstile
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
                    input("   Press Enter to close browser...")'''

new_block = '''            is_blocked, block_type = await self.detect_block()
            if is_blocked:
                logger.warning(f"❌ Indeed Ultra: BLOCKED ({block_type})")
                
                # Try to solve Turnstile
                if "turnstile" in block_type.lower() or "cloudflare" in block_type.lower():
                    logger.info("Attempting Turnstile bypass...")
                    solved = await self.solve_turnstile()
                    if solved:
                        await self.human_delay(3.0, 5.0)
                        # Check again
                        is_blocked, block_type = await self.detect_block()
                        if not is_blocked:
                            logger.info("✅ Turnstile solved!")
                
                if is_blocked:
                    screenshot_path = self.session_dir / f"blocked_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                    await self.page.screenshot(path=str(screenshot_path))
                    logger.info(f"📸 Screenshot saved: {screenshot_path}")
                    
                    # Keep browser open for inspection if using real profile
                    if self.use_real_profile:
                        print("\\n⚠️  BLOCKED! Browser left open for inspection.")
                        print(f"   Block type: {block_type}")
                        print(f"   Screenshot: {screenshot_path}")
                        input("   Press Enter to close browser...")'''

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Updated block handling with Turnstile bypass")

with open(path, "w") as f:
    f.write(content)

print("Done!")
