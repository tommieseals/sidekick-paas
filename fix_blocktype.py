#!/usr/bin/env python3
"""Fix block type check to match any Cloudflare/CAPTCHA type"""

path = '/Users/tommie/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Fix: Match any Cloudflare or CAPTCHA type
old_check = 'if block_type == "Cloudflare turnstile" and TWOCAPTCHA_API_KEY:'
new_check = 'if block_type in ("Cloudflare turnstile", "Cloudflare challenge", "CAPTCHA") and TWOCAPTCHA_API_KEY:'

content = content.replace(old_check, new_check)

# Also fix the warning about missing key
old_warn = 'elif block_type == "Cloudflare turnstile" and not TWOCAPTCHA_API_KEY:'
new_warn = 'elif block_type in ("Cloudflare turnstile", "Cloudflare challenge", "CAPTCHA") and not TWOCAPTCHA_API_KEY:'

content = content.replace(old_warn, new_warn)

with open(path, 'w') as f:
    f.write(content)

print("✅ Fixed block type check to match: Cloudflare turnstile, Cloudflare challenge, CAPTCHA")
