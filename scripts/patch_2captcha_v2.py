#!/usr/bin/env python3
"""Patch indeed_ultra_stealth.py to use 2Captcha for Turnstile"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Add import for captcha solver at the top
if 'from worker.tools.captcha_solver import' not in content:
    content = content.replace(
        'from shared.paths import',
        'from worker.tools.captcha_solver import TurnstileSolver\nfrom shared.paths import'
    )
    print("Added TurnstileSolver import")

# Find and replace the solve_turnstile method
# Look for the method signature
if 'async def solve_turnstile(self) -> bool:' in content:
    # Find start and end of the method
    lines = content.split('\n')
    new_lines = []
    skip_until_next_method = False
    method_indent = None
    
    for i, line in enumerate(lines):
        if 'async def solve_turnstile(self) -> bool:' in line:
            skip_until_next_method = True
            method_indent = len(line) - len(line.lstrip())
            # Insert new method
            new_method = '''    async def solve_turnstile(self) -> bool:
        """Solve Cloudflare Turnstile using 2Captcha API"""
        try:
            import re
            sitekey = None
            
            # Method 1: Look for data-sitekey attribute
            turnstile_div = await self.page.query_selector('[data-sitekey]')
            if turnstile_div:
                sitekey = await turnstile_div.get_attribute('data-sitekey')
            
            # Method 2: Look in iframe URL
            if not sitekey:
                for frame in self.page.frames:
                    if "challenges.cloudflare.com" in frame.url:
                        match = re.search(r'sitekey=([^&]+)', frame.url)
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
            
            logger.info(f"Got 2Captcha token (len={len(token)})")
            
            # Inject the token - set cf-turnstile-response
            js_code = """(token) => {
                const inputs = document.querySelectorAll('input[name*="turnstile"], input[name*="cf-turnstile-response"]');
                inputs.forEach(input => { input.value = token; });
                const hidden = document.querySelector('[name="cf-turnstile-response"]');
                if (hidden) hidden.value = token;
            }"""
            await self.page.evaluate(js_code, token)
            
            # Try clicking submit or just reload
            await self.human_delay(1, 2)
            submit = await self.page.query_selector('button[type="submit"], .btn-primary, [type="submit"]')
            if submit:
                await submit.click()
            else:
                await self.page.reload()
            
            await self.human_delay(3, 5)
            return True
            
        except Exception as e:
            logger.warning(f"2Captcha Turnstile solve failed: {e}")
            return False
'''
            new_lines.append(new_method)
            continue
        
        if skip_until_next_method:
            # Check if this is a new method at same or lower indent level
            stripped = line.lstrip()
            if stripped.startswith('async def ') or stripped.startswith('def '):
                current_indent = len(line) - len(line.lstrip())
                if current_indent <= method_indent:
                    skip_until_next_method = False
                    new_lines.append(line)
            # Skip this line (part of old method)
            continue
        
        new_lines.append(line)
    
    content = '\n'.join(new_lines)
    print("Replaced solve_turnstile with 2Captcha version")

with open(path, 'w') as f:
    f.write(content)

print("Done!")
