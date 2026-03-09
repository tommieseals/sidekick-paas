#!/usr/bin/env python3
"""Simple fix - just add turnstile call after BLOCKED warning"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Simple: find the BLOCKED warning and add turnstile logic after it
old = 'logger.warning(f"❌ Indeed Ultra: BLOCKED ({block_type})")'

new = '''logger.warning(f"❌ Indeed Ultra: BLOCKED ({block_type})")
                
                # Try Turnstile bypass automatically
                if "cloudflare" in block_type.lower() or "captcha" in block_type.lower():
                    logger.info("🔧 Attempting Turnstile bypass...")
                    solved = await self.solve_turnstile()
                    if solved:
                        await self.human_delay(3, 5)
                        is_blocked, _ = await self.detect_block()
                        if not is_blocked:
                            logger.info("✅ Turnstile SOLVED! Continuing...")
                            # Don't return, continue with scraping
                            
                if not is_blocked:
                    # Turnstile was solved, skip the blocked handling below
                    pass
                else:'''

if old in content and 'Attempting Turnstile bypass' not in content:
    content = content.replace(old, new)
    
    # Also need to indent the screenshot block
    # Find "screenshot_path = self.session_dir" and indent it
    content = content.replace(
        '                screenshot_path = self.session_dir',
        '                    screenshot_path = self.session_dir'
    )
    content = content.replace(
        '                await self.page.screenshot',
        '                    await self.page.screenshot'
    )
    content = content.replace(
        '                logger.info(f"📸 Screenshot saved',
        '                    logger.info(f"📸 Screenshot saved'
    )
    content = content.replace(
        '                \n                # Keep browser open',
        '                    \n                    # Keep browser open'
    )
    content = content.replace(
        '                if self.use_real_profile:',
        '                    if self.use_real_profile:'
    )
    content = content.replace(
        '                    print("\\n⚠️  BLOCKED',
        '                        print("\\n⚠️  BLOCKED'
    )
    content = content.replace(
        '                    print(f"   Block type',
        '                        print(f"   Block type'
    )
    content = content.replace(
        '                    print(f"   Screenshot',
        '                        print(f"   Screenshot'
    )
    content = content.replace(
        '                    input("   Press Enter',
        '                        input("   Press Enter'
    )
    content = content.replace(
        '                \n                return []',
        '                    \n                    return []'
    )
    
    with open(path, 'w') as f:
        f.write(content)
    print("✅ Done! Turnstile bypass added")
else:
    if 'Attempting Turnstile bypass' in content:
        print("Already patched!")
    else:
        print("❌ Could not find the target string")
