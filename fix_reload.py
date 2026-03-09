#!/usr/bin/env python3
"""Add page reload after token injection"""

path = '/Users/tommie/job-hunter-system/worker/tools/turnstile_2captcha_fix.py'

with open(path, 'r') as f:
    content = f.read()

# Find and update the solve_indeed_turnstile function
old_func = '''    # Inject token
    await solver.inject_token(page, token)
    
    # Wait for page to process
    await asyncio.sleep(3)
    
    # Check if we passed
    content = await page.content()
    if 'challenges.cloudflare.com' in content or 'Verify you are human' in content:
        logger.warning("Still showing challenge after token injection")
        return False'''

new_func = '''    # Inject token
    await solver.inject_token(page, token)
    
    # Wait for page to process the callback
    await asyncio.sleep(2)
    
    # Reload the page - this often triggers the redirect after Turnstile solve
    try:
        await page.reload(wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(3)
    except Exception as e:
        logger.debug(f"Reload note: {e}")
    
    # Check if we passed
    content = await page.content()
    if 'challenges.cloudflare.com' in content or 'Verify you are human' in content:
        logger.warning("Still showing challenge after token injection")
        return False'''

content = content.replace(old_func, new_func)

with open(path, 'w') as f:
    f.write(content)

print("✅ Added page reload after token injection")
