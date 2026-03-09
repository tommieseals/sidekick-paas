#!/usr/bin/env python3
"""Patch Indeed scraper to use working Turnstile solver"""

path = '/Users/tommie/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# 1. Fix imports
old_import = 'from worker.tools.turnstile_2captcha_fix import TurnstileSolver, solve_indeed_turnstile'
new_import = 'from worker.tools.turnstile_2captcha_fix import TurnstileSolver, solve_indeed_turnstile, INTERCEPT_JS'

content = content.replace(old_import, new_import)

# 2. Add interceptor injection in setup() after browser launches
# Find where browser is created and add interceptor
old_setup = '''            self.page = self.browser.pages[0] if self.browser.pages else await self.browser.new_page()'''

new_setup = '''            # Inject Turnstile interceptor BEFORE any navigation
            if TWOCAPTCHA_API_KEY:
                try:
                    await self.browser.add_init_script(INTERCEPT_JS)
                    logger.info("Turnstile interceptor injected for 2Captcha solving")
                except Exception as e:
                    logger.warning(f"Could not inject Turnstile interceptor: {e}")
            
            self.page = self.browser.pages[0] if self.browser.pages else await self.browser.new_page()'''

content = content.replace(old_setup, new_setup)

with open(path, 'w') as f:
    f.write(content)

print("✅ Patched Indeed scraper with Turnstile interceptor injection")
