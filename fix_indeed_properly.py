#!/usr/bin/env python3
"""
Properly fix Indeed scraper:
1. Add init script to context
2. Create NEW page (don't reuse existing)
"""

path = '/Users/tommie/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Fix the persistent context section - inject THEN create new page
old_section = '''            # For persistent context, pages might already exist
            self.page = self.browser.pages[0] if self.browser.pages else await self.browser.new_page()'''

new_section = '''            # Inject Turnstile interceptor into context FIRST
            if TWOCAPTCHA_API_KEY:
                try:
                    await self.browser.add_init_script(INTERCEPT_JS)
                    logger.info("Turnstile interceptor added to context")
                except Exception as e:
                    logger.warning(f"Interceptor injection note: {e}")
            
            # Always create NEW page so init_script applies
            # (existing pages from persistent context don't get init scripts)
            self.page = await self.browser.new_page()'''

content = content.replace(old_section, new_section)

# Clean up any duplicate injections we added before
content = content.replace('''            # Inject Turnstile interceptor BEFORE navigation
            if TWOCAPTCHA_API_KEY:
                try:
                    await self.page.evaluate(INTERCEPT_JS)
                    logger.info("Turnstile interceptor injected via evaluate()")
                except Exception as e:
                    logger.debug(f"Interceptor eval note: {e}")
            
''', '')

with open(path, 'w') as f:
    f.write(content)

print("✅ Fixed: Context gets init_script, then NEW page created")
