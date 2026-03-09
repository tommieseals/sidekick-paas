#!/usr/bin/env python3
"""Fix Indeed scraper - inject interceptor on PAGE before navigation"""

path = '/Users/tommie/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Remove the old browser-level injection (doesn't work for existing pages)
old_inject = '''            # Inject Turnstile interceptor BEFORE any navigation
            if TWOCAPTCHA_API_KEY:
                try:
                    await self.browser.add_init_script(INTERCEPT_JS)
                    logger.info("Turnstile interceptor injected for 2Captcha solving")
                except Exception as e:
                    logger.warning(f"Could not inject Turnstile interceptor: {e}")
            
            self.page = self.browser.pages[0] if self.browser.pages else await self.browser.new_page()'''

new_inject = '''            self.page = self.browser.pages[0] if self.browser.pages else await self.browser.new_page()
            
            # Inject Turnstile interceptor on the page
            if TWOCAPTCHA_API_KEY:
                try:
                    await self.page.add_init_script(INTERCEPT_JS)
                    logger.info("Turnstile interceptor injected for 2Captcha solving")
                except Exception as e:
                    logger.warning(f"Could not inject Turnstile interceptor: {e}")'''

content = content.replace(old_inject, new_inject)

# Also need to add it for non-persistent context path
old_context_setup = '''            self.context = await self.browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                locale='en-US',
                timezone_id='America/Chicago',
            )
            self.page = await self.context.new_page()'''

new_context_setup = '''            self.context = await self.browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                locale='en-US',
                timezone_id='America/Chicago',
            )
            
            # Inject Turnstile interceptor on context
            if TWOCAPTCHA_API_KEY:
                try:
                    await self.context.add_init_script(INTERCEPT_JS)
                    logger.info("Turnstile interceptor injected for 2Captcha solving")
                except Exception as e:
                    logger.warning(f"Could not inject interceptor: {e}")
            
            self.page = await self.context.new_page()'''

content = content.replace(old_context_setup, new_context_setup)

with open(path, 'w') as f:
    f.write(content)

print("✅ Fixed interceptor injection on page/context level")
