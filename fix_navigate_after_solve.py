#!/usr/bin/env python3
"""After solving, navigate to the original URL (not reload)"""

path = '/Users/tommie/job-hunter-system/worker/tools/turnstile_2captcha_fix.py'

with open(path, 'r') as f:
    content = f.read()

# Update solve_indeed_turnstile to re-navigate instead of reload
old_section = '''    # Inject token
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
        return False
    
    logger.success("Turnstile bypass successful!")
    return True'''

new_section = '''    # Inject token
    await solver.inject_token(page, token)
    
    # Wait for page to process the callback
    await asyncio.sleep(2)
    
    # Save original URL
    original_url = page.url
    
    # Navigate to the original URL again (cf_clearance cookie should now be set)
    try:
        await page.goto(original_url, wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(3)
    except Exception as e:
        logger.warning(f"Navigation after solve: {e}")
    
    # Check if we passed by looking for job results or lack of challenge
    content = await page.content()
    
    # Success indicators
    if 'job_seen_beacon' in content or 'jobsearch-ResultsList' in content:
        logger.success("Job results found - bypass successful!")
        return True
    
    # Still blocked?
    if 'challenges.cloudflare.com' in content or 'Verify you are human' in content:
        logger.warning("Still showing challenge after solve")
        # Try one more reload
        try:
            await page.reload(wait_until='domcontentloaded', timeout=30000)
            await asyncio.sleep(2)
            content = await page.content()
            if 'job_seen_beacon' in content:
                logger.success("Job results found after extra reload!")
                return True
        except:
            pass
        return False
    
    # Page loaded but unclear if blocked
    if 'Request Blocked' in content or 'blocked' in content.lower():
        logger.warning("Page shows blocked message")
        return False
    
    logger.success("Turnstile bypass successful!")
    return True'''

content = content.replace(old_section, new_section)

with open(path, 'w') as f:
    f.write(content)

print("✅ Updated to navigate to original URL after solve")
