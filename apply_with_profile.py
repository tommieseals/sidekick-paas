#!/usr/bin/env python3
"""
Use Chrome with user's actual profile (cookies already saved)
"""
import asyncio
import os
import sys
import random
import httpx

os.environ['TWOCAPTCHA_API_KEY'] = 'b4254a5c82ee4cf2f5d52a8cf47bdcee'
sys.path.insert(0, '/Users/tommie/job-hunter-system')

from playwright.async_api import async_playwright
from loguru import logger
from shared.vault import VAULT

API_KEY = "b4254a5c82ee4cf2f5d52a8cf47bdcee"
RESUME_PATH = "/Users/tommie/job-hunter-system/resumes/Tommie_Seals_Resume.docx"

INTERCEPT_JS = """
window.__turnstileData = null;
window.__turnstileCallback = null;
const i = setInterval(() => {
    if (window.turnstile) {
        clearInterval(i);
        const originalRender = window.turnstile.render;
        window.turnstile.render = function(element, params) {
            window.__turnstileData = {
                sitekey: params.sitekey,
                action: params.action || '',
                cData: params.cData || '',
                chlPageData: params.chlPageData || ''
            };
            window.__turnstileCallback = params.callback;
            return originalRender.call(this, element, params);
        };
    }
}, 50);
"""

async def human_delay(min_s=1, max_s=3):
    await asyncio.sleep(random.uniform(min_s, max_s))

async def solve_turnstile(page):
    """Solve Turnstile"""
    captured = None
    for i in range(15):
        await asyncio.sleep(1)
        try:
            data = await page.evaluate("() => window.__turnstileData")
            if data and data.get('sitekey'):
                captured = data
                break
        except:
            pass
    
    if not captured:
        return False
    
    logger.info(f"Captured sitekey")
    
    task = {
        "clientKey": API_KEY,
        "task": {
            "type": "TurnstileTaskProxyless",
            "websiteURL": page.url,
            "websiteKey": captured['sitekey'],
            "action": captured['action'],
            "data": captured['cData'],
            "pagedata": captured['chlPageData'],
        }
    }
    
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post("https://api.2captcha.com/createTask", json=task)
        result = resp.json()
        if result.get('errorId') != 0:
            return False
        
        task_id = result['taskId']
        
        for i in range(24):
            await asyncio.sleep(5)
            resp = await client.post("https://api.2captcha.com/getTaskResult",
                json={"clientKey": API_KEY, "taskId": task_id})
            result = resp.json()
            
            if result.get('status') == 'ready':
                token = result['solution']['token']
                await page.evaluate(f"window.__turnstileCallback('{token}')")
                await asyncio.sleep(2)
                return True
    return False

async def main():
    print("=" * 60, flush=True)
    print("INDEED APPLICATION - USING CHROME PROFILE", flush=True)
    print("=" * 60, flush=True)
    
    # First, make sure Chrome is closed so we can use the profile
    import subprocess
    subprocess.run(['pkill', '-f', 'Google Chrome'], capture_output=True)
    await asyncio.sleep(2)
    
    async with async_playwright() as p:
        # Use Chrome with persistent profile
        # This uses the actual user profile with saved cookies
        user_data = os.path.expanduser("~/Library/Application Support/Google/Chrome")
        
        context = await p.chromium.launch_persistent_context(
            user_data,
            headless=False,
            channel="chrome",
            viewport={'width': 1280, 'height': 900},
            args=['--profile-directory=Default']
        )
        
        await context.add_init_script(INTERCEPT_JS)
        page = context.pages[0] if context.pages else await context.new_page()
        
        # Go to Indeed - should be logged in from cookies
        print("\nSTEP 1: Check login status", flush=True)
        await page.goto("https://www.indeed.com", wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(3)
        
        # Solve Turnstile if needed
        content = await page.content()
        if 'Verify you are human' in content:
            print("   Solving Turnstile...", flush=True)
            await solve_turnstile(page)
            await page.goto("https://www.indeed.com", wait_until='domcontentloaded')
            await asyncio.sleep(3)
        
        # Check login
        content = await page.content()
        if 'Sign out' in content or 'Profile' in content or 'My jobs' in content:
            print("   LOGGED IN!", flush=True)
        else:
            print("   Not logged in yet", flush=True)
        
        await page.screenshot(path='/tmp/profile_step1.png')
        
        # Search
        print("\nSTEP 2: Search for jobs", flush=True)
        await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote&fromage=3",
                       wait_until='domcontentloaded')
        await asyncio.sleep(3)
        
        content = await page.content()
        if 'Verify you are human' in content:
            await solve_turnstile(page)
            await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote&fromage=3",
                           wait_until='domcontentloaded')
            await asyncio.sleep(3)
        
        print("   Search loaded", flush=True)
        await page.screenshot(path='/tmp/profile_step2.png')
        
        # Find job
        print("\nSTEP 3: Find job", flush=True)
        jobs = await page.query_selector_all('.job_seen_beacon')
        print(f"   Found {len(jobs)} jobs", flush=True)
        
        target = None
        title = ""
        for job in jobs[:10]:
            text = await job.inner_text()
            if 'easily apply' in text.lower():
                elem = await job.query_selector('h2.jobTitle')
                title = await elem.inner_text() if elem else "Job"
                target = job
                print(f"   Selected: {title}", flush=True)
                break
        
        if not target and jobs:
            target = jobs[0]
            elem = await target.query_selector('h2.jobTitle')
            title = await elem.inner_text() if elem else "Job"
        
        if target:
            await target.click()
            await human_delay(3, 4)
        
        # Click Apply
        print("\nSTEP 4: Apply", flush=True)
        apply_btn = await page.query_selector('button:has-text("Apply now")')
        if apply_btn:
            await apply_btn.click()
            print("   Clicked Apply", flush=True)
        
        await human_delay(4, 6)
        
        if len(context.pages) > 1:
            page = context.pages[-1]
        
        await page.screenshot(path='/tmp/profile_step4.png')
        
        # Fill and submit
        print("\nSTEP 5: Fill & Submit", flush=True)
        
        for step in range(12):
            await human_delay(1.5, 2.5)
            
            # Fill fields
            for sel, val in [
                ('input[name*="name" i]', VAULT['name']),
                ('input[name*="email" i]', VAULT['email']),
                ('input[type="email"]', VAULT['email']),
                ('input[name*="phone" i]', VAULT['phone']),
                ('input[type="tel"]', VAULT['phone']),
            ]:
                try:
                    elem = await page.query_selector(sel)
                    if elem and await elem.is_visible():
                        cur = await elem.input_value()
                        if not cur:
                            await elem.fill(val)
                except:
                    pass
            
            # Resume
            try:
                upload = await page.query_selector('input[type="file"]')
                if upload:
                    await upload.set_input_files(RESUME_PATH)
                    print(f"   Resume uploaded", flush=True)
            except:
                pass
            
            # Submit?
            submit = await page.query_selector('button:has-text("Submit")')
            if submit and await submit.is_visible():
                txt = await submit.inner_text()
                print(f"   FOUND SUBMIT: '{txt}'", flush=True)
                await page.screenshot(path='/tmp/profile_before_submit.png')
                await submit.click()
                print("   >>> SUBMITTED! <<<", flush=True)
                break
            
            # Continue?
            cont = await page.query_selector('button:has-text("Continue")')
            if cont and await cont.is_visible():
                print(f"   Step {step+1}: Continue", flush=True)
                await cont.click()
            else:
                await page.screenshot(path=f'/tmp/profile_form_{step}.png')
        
        await human_delay(3, 5)
        await page.screenshot(path='/tmp/profile_final.png')
        
        # Check success
        content = await page.content()
        if any(x in content.lower() for x in ['submitted', 'thank you', 'received', 'successfully']):
            print("\n" + "=" * 60, flush=True)
            print("APPLICATION SUBMITTED!", flush=True)
            print(f"   Job: {title}", flush=True)
            print("=" * 60, flush=True)
        else:
            print("\nCheck screenshots in /tmp/profile_*.png", flush=True)
        
        print("\nBrowser staying open 60s...", flush=True)
        await asyncio.sleep(60)
        await context.close()

if __name__ == "__main__":
    asyncio.run(main())
