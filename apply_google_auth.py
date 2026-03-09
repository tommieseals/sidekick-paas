#!/usr/bin/env python3
"""
Apply with Google Sign-in
Step 1: Sign into Indeed with Google
Step 2: Apply to a job
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
    """Solve Turnstile using 2Captcha"""
    logger.info("Waiting for Turnstile params...")
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
    print("🔐 INDEED APPLICATION WITH GOOGLE SIGN-IN", flush=True)
    print("=" * 60, flush=True)
    
    async with async_playwright() as p:
        # Launch with persistent profile to save login
        user_data = "/tmp/indeed-profile"
        browser = await p.chromium.launch_persistent_context(
            user_data,
            headless=False,
            channel="chrome",
            viewport={'width': 1280, 'height': 900}
        )
        
        # Add Turnstile interceptor
        await browser.add_init_script(INTERCEPT_JS)
        page = browser.pages[0] if browser.pages else await browser.new_page()
        
        # Check if already logged in
        print("\n🔍 Checking Indeed login status...", flush=True)
        await page.goto("https://www.indeed.com", wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(3)
        
        # Solve Turnstile if needed
        content = await page.content()
        if 'Verify you are human' in content:
            print("   🔓 Solving Turnstile...", flush=True)
            await solve_turnstile(page)
            await page.goto("https://www.indeed.com", wait_until='domcontentloaded')
            await asyncio.sleep(3)
        
        # Check for sign-in link vs profile
        content = await page.content()
        if 'Sign in' in content and 'Profile' not in content:
            print("\n🔐 STEP 1: Google Sign-in Required", flush=True)
            print("   Opening sign-in page...", flush=True)
            
            # Click Sign in
            signin = await page.query_selector('a:has-text("Sign in")')
            if signin:
                await signin.click()
                await human_delay(2, 3)
            else:
                await page.goto("https://secure.indeed.com/auth", wait_until='domcontentloaded')
            
            await asyncio.sleep(2)
            await page.screenshot(path='/tmp/google_step1.png')
            
            # Click "Continue with Google"
            google_btn = await page.query_selector('button:has-text("Continue with Google"), [data-tn-element*="google"]')
            if google_btn:
                print("   📍 Clicking 'Continue with Google'...", flush=True)
                await google_btn.click()
                await asyncio.sleep(3)
            
            # Handle Google popup/redirect
            print("\n" + "=" * 60, flush=True)
            print("⏸️  MANUAL STEP REQUIRED:", flush=True)
            print("   1. Complete Google sign-in in the browser", flush=True)
            print("   2. Authorize Indeed access", flush=True)
            print("   3. Wait for redirect back to Indeed", flush=True)
            print("=" * 60, flush=True)
            print("\n⏳ Waiting 90 seconds for you to sign in...", flush=True)
            
            # Wait for user to complete Google OAuth
            for i in range(18):  # 90 seconds
                await asyncio.sleep(5)
                print(f"   Waiting... {(i+1)*5}s", flush=True)
                
                # Check if we're back on Indeed and logged in
                try:
                    current_url = page.url
                    if 'indeed.com' in current_url and 'auth' not in current_url and 'secure' not in current_url:
                        content = await page.content()
                        if 'Sign out' in content or 'My jobs' in content or 'Profile' in content:
                            print("\n✅ Successfully signed in!", flush=True)
                            break
                except:
                    pass
            
            await page.screenshot(path='/tmp/google_after_signin.png')
        else:
            print("   ✅ Already signed in!", flush=True)
        
        # Now search and apply
        print("\n🔍 STEP 2: Search for jobs", flush=True)
        await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote", wait_until='domcontentloaded')
        await asyncio.sleep(3)
        
        # Solve Turnstile if needed
        content = await page.content()
        if 'Verify you are human' in content:
            print("   🔓 Solving Turnstile...", flush=True)
            await solve_turnstile(page)
            await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote", wait_until='domcontentloaded')
            await asyncio.sleep(3)
        
        await page.screenshot(path='/tmp/google_step2.png')
        print("   ✅ Search loaded", flush=True)
        
        # Find Easy Apply job
        print("\n🎯 STEP 3: Find & click job", flush=True)
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
                print(f"   ✅ {title}", flush=True)
                break
        
        if not target and jobs:
            target = jobs[0]
            elem = await target.query_selector('h2.jobTitle')
            title = await elem.inner_text() if elem else "First job"
            print(f"   Using: {title}", flush=True)
        
        if target:
            await target.click()
            await human_delay(3, 4)
        
        await page.screenshot(path='/tmp/google_step3.png')
        
        # Click Apply
        print("\n📋 STEP 4: Click Apply", flush=True)
        apply_btn = await page.query_selector('button:has-text("Apply now")')
        if apply_btn:
            await apply_btn.click()
            print("   ✅ Clicked Apply", flush=True)
        
        await human_delay(3, 5)
        
        # Handle new tab
        if len(browser.pages) > 1:
            page = browser.pages[-1]
            print("   📑 New tab opened", flush=True)
        
        await page.screenshot(path='/tmp/google_step4.png')
        
        # Fill and submit
        print("\n📝 STEP 5: Fill form & submit", flush=True)
        
        fields = {
            'input[name*="name" i]': VAULT['name'],
            'input[name*="email" i]': VAULT['email'],
            'input[type="email"]': VAULT['email'],
            'input[name*="phone" i]': VAULT['phone'],
            'input[type="tel"]': VAULT['phone'],
        }
        
        # Navigate through form
        for step in range(10):
            await human_delay(1, 2)
            
            # Fill fields
            for sel, val in fields.items():
                try:
                    elem = await page.query_selector(sel)
                    if elem and await elem.is_visible():
                        cur = await elem.input_value()
                        if not cur:
                            await elem.fill(val)
                except:
                    pass
            
            # Upload resume
            try:
                upload = await page.query_selector('input[type="file"]')
                if upload:
                    await upload.set_input_files(RESUME_PATH)
                    print(f"   📄 Resume uploaded", flush=True)
                    await human_delay(2, 3)
            except:
                pass
            
            # Check for Submit
            submit = await page.query_selector('button:has-text("Submit your application"), button:has-text("Submit")')
            if submit and await submit.is_visible():
                text = await submit.inner_text()
                print(f"   🎯 Found: '{text}'", flush=True)
                await page.screenshot(path='/tmp/google_before_submit.png')
                await submit.click()
                print("   🚀 SUBMITTED!", flush=True)
                await human_delay(3, 5)
                break
            
            # Check for Continue
            cont = await page.query_selector('button:has-text("Continue")')
            if cont and await cont.is_visible():
                print(f"   Step {step+1}: Continue", flush=True)
                await cont.click()
                await human_delay(2, 3)
            else:
                await page.screenshot(path=f'/tmp/google_form_{step}.png')
                print(f"   Step {step+1}: Looking for buttons...", flush=True)
        
        await page.screenshot(path='/tmp/google_final.png')
        
        # Check success
        content = await page.content()
        success = ['submitted', 'thank you', 'received', 'application sent', 'successfully applied']
        if any(p in content.lower() for p in success):
            print("\n" + "=" * 60, flush=True)
            print("🎉🎉🎉 APPLICATION SUBMITTED! 🎉🎉🎉", flush=True)
            print(f"   Job: {title}", flush=True)
            print("=" * 60, flush=True)
        else:
            print("\n⚠️ Check screenshots in /tmp/google_*.png", flush=True)
        
        print("\n⏳ Browser staying open 2 minutes...", flush=True)
        await asyncio.sleep(120)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
