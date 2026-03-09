#!/usr/bin/env python3
"""Make detect_block smarter - don't trigger on random 'blocked' text"""

path = '/Users/tommie/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

old_detect = '''    async def detect_block(self) -> tuple[bool, str]:
        """Check if we're blocked (Cloudflare, captcha, etc.)"""
        try:
            content = await self.page.content()
            
            # Check for various block messages
            if 'Verify you are human' in content:
                return True, "Cloudflare challenge"
            if 'blocked' in content.lower():
                return True, "Generic block"
            if 'captcha' in content.lower():
                return True, "CAPTCHA"
            if 'incompatible browser' in content.lower():
                return True, "Browser incompatibility"
            
            # Check for Cloudflare iframe
            turnstile = await self.page.query_selector('iframe[src*="challenges.cloudflare.com"]')
            if turnstile:
                return True, "Cloudflare turnstile"
            
            return False, "Clean"'''

new_detect = '''    async def detect_block(self) -> tuple[bool, str]:
        """Check if we're blocked (Cloudflare, captcha, etc.)"""
        try:
            content = await self.page.content()
            
            # SUCCESS indicators - if we see job results, we're NOT blocked
            if 'job_seen_beacon' in content or 'jobsearch-ResultsList' in content:
                return False, "Clean - job results found"
            
            # Check for Cloudflare challenge page
            if 'Verify you are human' in content:
                return True, "Cloudflare challenge"
            if 'Additional Verification Required' in content:
                return True, "CAPTCHA"
            
            # Check for specific block messages (not just 'blocked' anywhere)
            if 'Request Blocked' in content:
                return True, "Request blocked"
            if 'You have been blocked' in content:
                return True, "Generic block"
            if 'Access Denied' in content:
                return True, "Access denied"
                
            # Check for Cloudflare iframe
            turnstile = await self.page.query_selector('iframe[src*="challenges.cloudflare.com"]')
            if turnstile:
                return True, "Cloudflare turnstile"
            
            # Check for incompatible browser message
            if 'incompatible browser' in content.lower():
                return True, "Browser incompatibility"
            
            return False, "Clean"'''

content = content.replace(old_detect, new_detect)

with open(path, 'w') as f:
    f.write(content)

print("✅ Fixed detect_block to be smarter about block detection")
