#!/usr/bin/env python3
"""
Direct Indeed sign-in then apply
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
    
    logger.info(f"Captured sitekey: {captured['sitekey'][:20]}...")
    
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
        logger.info(f"Task: {task_id}")
        
        for i in range(24):
            await asyncio.sleep(5)
            resp = await client.post("https://api.2captcha.com/getTaskResult",
                json={"clientKey": API_KEY, "taskId": task_id})
            result = resp.json()
            
            if result.get('status') == 'ready':
                token = result['solution']['token']
                logger.success(f"Solved!")
                await page.evaluate(f"window.__turnstileCallback('{token}')")
                await asyncio.sleep(2)
                return True
            logger.info(f"Waiting... ({(i+1)*5}s)")
    return False

async def main():
    print("=" * 60, flush=True)
    print("🔐 INDEED: GOOGLE SIGN-IN → APPLY", flush=True)
    print("=" * 60, flush=True)
    
    async with async_playwright() as p:
        # Persistent profile
        user_data = "/tmp/indeed-profile"
        browser = await p.chromium.launch_persistent_context(
            user_data,
            headless=False,
            channel="chrome",
            viewport={'width': 1280, 'height': 900}
        )
        
        await browser.add_init_script(INTERCEPT_JS)
        page = browser.pages[0] if browser.pages else await browser.new_page()
        
        # Go directly to Indeed login page
        print("\n🔐 STEP 1: Open Indeed sign-in", flush=True)
        await page.goto("https://secure.indeed.com/auth", wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(3)
        
        await page.screenshot(path='/tmp/login_step1.png')
        
        # Check for Turnstile
        content = await page.content()
        if 'Verify you are human' in content or 'challenges.cloudflare' in content:
            print("   🔓 Solving Turnstile...", flush=True)
            if await solve_turnstile(page):
                await page.goto("https://secure.indeed.com/auth", wait_until='domcontentloaded')
                await asyncio.sleep(3)
        
        await page.screenshot(path='/tmp/login_step2.png')
        
        # Click Google sign-in
        print("\n   Looking for Google button...", flush=True)
        
        # Try multiple selectors
        google_selectors = [
            'button:has-text("Continue with Google")',
            '[data-tn-element*="google"]',
            'button[aria-label*="Google"]',
            '.google-sign-in',
            'button:has-text("Google")',
        ]
        
        clicked = False
        for sel in google_selectors:
            try:
                btn = await page.query_selector(sel)
                if btn and await btn.is_visible():
                    await btn.click()
                    clicked = True
                    print(f"   ✅ Clicked Google button", flush=True)
                    break
            except:
                pass
        
        if not clicked:
            # Try finding by text
            await page.evaluate('''
                () => {
                    const btns = document.querySelectorAll('button, a');
                    for (const btn of btns) {
                        if (btn.textContent.toLowerCase().includes('google')) {
                            btn.click();
                            return true;
                        }
                    }
                    return false;
                }
            ''')
            print("   ✅ Clicked Google (JS)", flush=True)
        
        await asyncio.sleep(3)
        await page.screenshot(path='/tmp/login_step3.png')
        
        # Wait for Google OAuth
        print("\n" + "=" * 60, flush=True)
        print("⏸️  COMPLETE GOOGLE SIGN-IN IN THE BROWSER!", flush=True)
        print("   1. Select your Google account", flush=True)
        print("   2. Enter password if asked", flush=True)
        print("   3. Allow Indeed access", flush=True)
        print("=" * 60, flush=True)
        print("\n⏳ Waiting 2 minutes for sign-in...", flush=True)
        
        signed_in = False
        for i in range(24):  # 2 minutes
            await asyncio.sleep(5)
            print(f"   {(i+1)*5}s...", flush=True)
            
            try:
                # Check if redirected back to Indeed
                current_url = page.url
                content = await page.content()
                
                # Check if on Indeed (not auth page) and signed in
                if 'indeed.com' in current_url and 'secure.indeed.com/auth' not in current_url:
                    if any(x in content for x in ['Sign out', 'My jobs', 'Your Profile', 'Saved']):
                        print("\n✅ SIGNED IN SUCCESSFULLY!", flush=True)
                        signed_in = True
                        break
            except:
                pass
        
        if not signed_in:
            print("\n⚠️ Sign-in not detected, continuing anyway...", flush=True)
        
        await page.screenshot(path='/tmp/login_complete.png')
        
        # Now search and apply
        print("\n🔍 STEP 2: Search for jobs", flush=True)
        await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote&fromage=3", wait_until='domcontentloaded')
        await asyncio.sleep(3)
        
        content = await page.content()
        if 'Verify you are human' in content:
            print("   🔓 Solving Turnstile...", flush=True)
            await solve_turnstile(page)
            await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote&fromage=3", wait_until='domcontentloaded')
            await asyncio.sleep(3)
        
        await page.screenshot(path='/tmp/search.png')
        print("   ✅ Search loaded", flush=True)
        
        # Find job
        print("\n🎯 STEP 3: Find job with Easy Apply", flush=True)
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
            title = await elem.inner_text() if elem else "Job"
        
        if target:
            await target.click()
            await human_delay(3, 4)
        
        await page.screenshot(path='/tmp/job_selected.png')
        
        # Click Apply
        print("\n📋 STEP 4: Click Apply", flush=True)
        apply_btn = await page.query_selector('button:has-text("Apply now"), #indeedApplyButton')
        if apply_btn:
            await apply_btn.click()
            print("   ✅ Clicked Apply", flush=True)
        
        await human_delay(4, 6)
        
        # Handle new tab
        if len(browser.pages) > 1:
            page = browser.pages[-1]
            print("   📑 Application tab opened", flush=True)
        
        await page.screenshot(path='/tmp/apply_form.png')
        
        # Fill and submit
        print("\n📝 STEP 5: Fill & Submit", flush=True)
        
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
                    print(f"   📄 Resume uploaded", flush=True)
            except:
                pass
            
            # Submit?
            submit = await page.query_selector('button:has-text("Submit")')
            if submit and await submit.is_visible():
                txt = await submit.inner_text()
                print(f"   🎯 SUBMIT: '{txt}'", flush=True)
                await page.screenshot(path='/tmp/before_submit.png')
                await submit.click()
                print("   🚀 SUBMITTED!", flush=True)
                break
            
            # Continue?
            cont = await page.query_selector('button:has-text("Continue")')
            if cont and await cont.is_visible():
                print(f"   Step {step+1}: Continue", flush=True)
                await cont.click()
            else:
                await page.screenshot(path=f'/tmp/form_step_{step}.png')
        
        await human_delay(3, 5)
        await page.screenshot(path='/tmp/final.png')
        
        # Check success
        content = await page.content()
        if any(x in content.lower() for x in ['submitted', 'thank you', 'received', 'successfully']):
            print("\n" + "=" * 60, flush=True)
            print("🎉🎉🎉 APPLICATION SUBMITTED! 🎉🎉🎉", flush=True)
            print(f"   Job: {title}", flush=True)
            print("=" * 60, flush=True)
        else:
            print("\n⚠️ Check /tmp/*.png screenshots", flush=True)
        
        print("\n⏳ Browser open 2 min to verify...", flush=True)
        await asyncio.sleep(120)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
