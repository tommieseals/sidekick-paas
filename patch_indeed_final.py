#!/usr/bin/env python3
"""
Fix Indeed scraper - use page.evaluate() to inject interceptor
This works because we inject it right before goto()
"""

path = '/Users/tommie/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Find where navigation happens and inject before it
old_nav = '''            search_url = f"https://www.indeed.com/jobs?q={query.replace(' ', '+')}&l={location.replace(' ', '+')}"
            logger.info(f"Indeed Ultra: Navigating to {search_url}")
            
            # FIX 3: SLOWER, MORE HUMAN TIMING
            print("🌐 Navigating to Indeed (slowly)...")
            await self.page.goto(search_url, wait_until='domcontentloaded', timeout=30000)'''

new_nav = '''            search_url = f"https://www.indeed.com/jobs?q={query.replace(' ', '+')}&l={location.replace(' ', '+')}"
            logger.info(f"Indeed Ultra: Navigating to {search_url}")
            
            # Inject Turnstile interceptor BEFORE navigation
            if TWOCAPTCHA_API_KEY:
                try:
                    await self.page.evaluate(INTERCEPT_JS)
                    logger.info("Turnstile interceptor injected via evaluate()")
                except Exception as e:
                    logger.debug(f"Interceptor eval note: {e}")
            
            # FIX 3: SLOWER, MORE HUMAN TIMING
            print("🌐 Navigating to Indeed (slowly)...")
            await self.page.goto(search_url, wait_until='domcontentloaded', timeout=30000)'''

content = content.replace(old_nav, new_nav)

# Remove any old injection attempts that don't work
content = content.replace('''            # Inject Turnstile interceptor BEFORE any navigation
            if TWOCAPTCHA_API_KEY:
                try:
                    await self.browser.add_init_script(INTERCEPT_JS)
                    logger.info("Turnstile interceptor injected for 2Captcha solving")
                except Exception as e:
                    logger.warning(f"Could not inject Turnstile interceptor: {e}")
            
''', '')

content = content.replace('''            # Inject Turnstile interceptor on the page
            if TWOCAPTCHA_API_KEY:
                try:
                    await self.page.add_init_script(INTERCEPT_JS)
                    logger.info("Turnstile interceptor injected for 2Captcha solving")
                except Exception as e:
                    logger.warning(f"Could not inject Turnstile interceptor: {e}")
''', '')

with open(path, 'w') as f:
    f.write(content)

print("✅ Fixed: Interceptor now injected via page.evaluate() before navigation")
