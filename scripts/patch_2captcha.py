#!/usr/bin/env python3
"""Patch indeed_ultra_stealth.py to use 2Captcha for Turnstile"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Add import for captcha solver at the top
if 'from worker.tools.captcha_solver import' not in content:
    # Find the imports section and add our import
    content = content.replace(
        'from shared.paths import',
        'from worker.tools.captcha_solver import TurnstileSolver\nfrom shared.paths import'
    )
    print("Added TurnstileSolver import")

# Replace the solve_turnstile method with 2Captcha version
old_solve = '''    async def solve_turnstile(self) -> bool:
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
            return False'''

new_solve = '''    async def solve_turnstile(self) -> bool:
        """Solve Cloudflare Turnstile using 2Captcha API"""
        try:
            # Extract sitekey from page
            sitekey = None
            
            # Method 1: Look for data-sitekey attribute
            turnstile_div = await self.page.query_selector('[data-sitekey]')
            if turnstile_div:
                sitekey = await turnstile_div.get_attribute('data-sitekey')
            
            # Method 2: Look in iframe URL
            if not sitekey:
                for frame in self.page.frames:
                    if "challenges.cloudflare.com" in frame.url:
                        # Extract sitekey from URL params
                        import re
                        match = re.search(r'sitekey=([^&]+)', frame.url)
                        if match:
                            sitekey = match.group(1)
                        break
            
            # Method 3: Look in script tags
            if not sitekey:
                scripts = await self.page.query_selector_all('script')
                for script in scripts:
                    text = await script.text_content() or ""
                    if 'turnstile' in text.lower() and 'sitekey' in text.lower():
                        import re
                        match = re.search(r"sitekey['\"]?\s*[:=]\s*['\"]([^'\"]+)['\"]", text)
                        if match:
                            sitekey = match.group(1)
                            break
            
            if not sitekey:
                logger.warning("Could not find Turnstile sitekey")
                return False
            
            logger.info(f"Found Turnstile sitekey: {sitekey[:20]}...")
            
            # Solve via 2Captcha
            solver = TurnstileSolver()
            token = await solver.solve(sitekey, self.page.url)
            
            if not token:
                logger.warning("2Captcha failed to solve Turnstile")
                return False
            
            logger.info(f"Got 2Captcha token: {token[:50]}...")
            
            # Inject the token into the page
            # Method 1: Set input value
            await self.page.evaluate(f'''() => {{
                // Find turnstile response input
                const inputs = document.querySelectorAll('input[name*="turnstile"], input[name*="cf-turnstile"]');
                inputs.forEach(input => {{
                    input.value = "{token}";
                }});
                
                // Also try setting on window
                if (window.turnstile) {{
                    window.turnstile.reset();
                }}
                
                // Dispatch event
                const event = new Event('turnstileCallback');
                document.dispatchEvent(event);
            }}''')
            
            # Method 2: Submit the form or reload
            await self.human_delay(1, 2)
            
            # Try clicking any submit/continue button
            submit_btn = await self.page.query_selector('button[type="submit"], input[type="submit"], .submit-btn, [data-action="submit"]')
            if submit_btn:
                await submit_btn.click()
                await self.human_delay(3, 5)
            else:
                # Just reload and hope the cookie is set
                await self.page.reload()
                await self.human_delay(3, 5)
            
            return True
            
        except Exception as e:
            logger.warning(f"2Captcha Turnstile solve failed: {e}")
            return False'''

if old_solve in content:
    content = content.replace(old_solve, new_solve)
    print("Replaced solve_turnstile with 2Captcha version")
elif 'TurnstileSolver()' in content:
    print("Already using 2Captcha solver")
else:
    print("Could not find old solve_turnstile method")

with open(path, 'w') as f:
    f.write(content)

print("Done!")
