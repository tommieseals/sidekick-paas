#!/usr/bin/env python3
"""Patch Indeed Ultra Stealth to use 2Captcha Turnstile solver"""

# Read original file
with open('/Users/tommie/job-hunter-system/worker/tools/indeed_ultra_stealth.py', 'r') as f:
    content = f.read()

# Add import at top (env for API key)
import_line = 'from pathlib import Path'
new_imports = '''from pathlib import Path
import os

# 2Captcha API key from env
TWOCAPTCHA_API_KEY = os.environ.get('TWOCAPTCHA_API_KEY', '')'''

content = content.replace(import_line, new_imports)

# Add import for solver after other imports
if 'from turnstile_2captcha_fix import' not in content:
    content = content.replace(
        'from shared.paths import get_chrome_user_data_dir',
        '''from shared.paths import get_chrome_user_data_dir
from worker.tools.turnstile_2captcha_fix import TurnstileSolver, solve_indeed_turnstile'''
    )

# Find the blocked section and add 2Captcha solving
# We need to insert the 2captcha logic after screenshot is taken
old_block = '''                logger.info(f"📸 Screenshot saved: {screenshot_path}")
                
                # Keep browser open for inspection if using real profile
                if self.use_real_profile:
                    print("\\n⚠️  BLOCKED! Browser left open for inspection.")
                    print(f"   Block type: {block_type}")
                    print(f"   Screenshot: {screenshot_path}")
                    input("   Press Enter to close browser...")
                
                return []'''

new_block = '''                logger.info(f"📸 Screenshot saved: {screenshot_path}")
                
                # Try 2Captcha if it's a Cloudflare Turnstile
                if block_type == "Cloudflare turnstile" and TWOCAPTCHA_API_KEY:
                    logger.info("🔓 Attempting 2Captcha Turnstile bypass...")
                    try:
                        solved = await solve_indeed_turnstile(self.page, TWOCAPTCHA_API_KEY)
                        if solved:
                            logger.success("✅ Turnstile bypassed! Continuing...")
                            await self.human_delay(3, 6)
                            # Re-check if still blocked
                            is_blocked, block_type = await self.detect_block()
                            if not is_blocked:
                                print("✅ Successfully bypassed Cloudflare!")
                                # Continue with search - don't return
                            else:
                                logger.warning(f"Still blocked after bypass: {block_type}")
                        else:
                            logger.error("2Captcha failed to solve Turnstile")
                    except Exception as e:
                        logger.error(f"2Captcha error: {e}")
                elif block_type == "Cloudflare turnstile" and not TWOCAPTCHA_API_KEY:
                    logger.warning("⚠️ TWOCAPTCHA_API_KEY not set - cannot bypass Turnstile")
                
                # Re-check if still blocked after potential bypass
                is_blocked, block_type = await self.detect_block()
                if is_blocked:
                    # Keep browser open for inspection if using real profile
                    if self.use_real_profile:
                        print("\\n⚠️  BLOCKED! Browser left open for inspection.")
                        print(f"   Block type: {block_type}")
                        print(f"   Screenshot: {screenshot_path}")
                        input("   Press Enter to close browser...")
                    
                    return []'''

if old_block in content:
    content = content.replace(old_block, new_block)
    print("✅ Patched blocked handler with 2Captcha logic")
else:
    print("⚠️ Could not find exact blocked section - may need manual patch")
    # Try a simpler approach - just add after return []
    if 'solve_indeed_turnstile' not in content:
        print("Adding note about manual integration needed")

# Write patched file
with open('/Users/tommie/job-hunter-system/worker/tools/indeed_ultra_stealth.py', 'w') as f:
    f.write(content)

print("Done! File updated.")
