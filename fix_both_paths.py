#!/usr/bin/env python3
"""Fix BOTH code paths in Indeed scraper for Turnstile interception"""

path = '/Users/tommie/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Fix the non-profile path (use_real_profile=False)
old_context = '''            self.context = await self.browser.new_context(
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                viewport={'width': 1920, 'height': 1080},
                locale='en-US',
                timezone_id='America/Chicago',
            )
            
            self.page = await self.context.new_page()'''

new_context = '''            self.context = await self.browser.new_context(
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                viewport={'width': 1920, 'height': 1080},
                locale='en-US',
                timezone_id='America/Chicago',
            )
            
            # Inject Turnstile interceptor into context
            if TWOCAPTCHA_API_KEY:
                try:
                    await self.context.add_init_script(INTERCEPT_JS)
                    logger.info("Turnstile interceptor added to context")
                except Exception as e:
                    logger.warning(f"Interceptor note: {e}")
            
            self.page = await self.context.new_page()'''

content = content.replace(old_context, new_context)

with open(path, 'w') as f:
    f.write(content)

print("✅ Fixed non-profile path with Turnstile interceptor")
