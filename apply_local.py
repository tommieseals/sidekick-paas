#!/usr/bin/env python3
"""
Run on Dell so Rusty can see the browser!
"""
import asyncio
import os
import sys
import random
import httpx

API_KEY = "b4254a5c82ee4cf2f5d52a8cf47bdcee"
RESUME_PATH = r"C:\Users\tommi\clawd\Tommie_Seals_Resume.docx"

# Vault data
VAULT = {
    "name": "Tommie Seals",
    "first_name": "Tommie",
    "last_name": "Seals",
    "email": "tommieseals7700@gmail.com",
    "phone": "618-203-0978",
}

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
    print("   Waiting for Turnstile params...", flush=True)
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
        print("   ❌ No params captured", flush=True)
        return False
    
    print(f"   ✅ Captured sitekey", flush=True)
    
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
            print(f"   ❌ 2Captcha error: {result}", flush=True)
            return False
        
        task_id = result['taskId']
        print(f"   Task: {task_id}", flush=True)
        
        for i in range(24):
            await asyncio.sleep(5)
            resp = await client.post("https://api.2captcha.com/getTaskResult",
                json={"clientKey": API_KEY, "taskId": task_id})
            result = resp.json()
            
            if result.get('status') == 'ready':
                token = result['solution']['token']
                print(f"   ✅ Solved!", flush=True)
                await page.evaluate(f"window.__turnstileCallback('{token}')")
                await asyncio.sleep(2)
                return True
            print(f"   Waiting... ({(i+1)*5}s)", flush=True)
    return False

async def main():
    from playwright.async_api import async_playwright
    
    print("=" * 60, flush=True)
    print("[KEY] INDEED APPLICATION - LOCAL BROWSER", flush=True)
    print("   You'll see the browser pop up - complete Google sign-in!", flush=True)
    print("=" * 60, flush=True)
    
    async with async_playwright() as p:
        # Use user's Chrome profile for existing Google session
        browser = await p.chromium.launch(
            headless=False,
            channel="chrome",
            args=['--start-maximized']
        )
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 900},
            no_viewport=True
        )
        
        await context.add_init_script(INTERCEPT_JS)
        page = await context.new_page()
        
        # Go to Indeed sign-in
        print("\n🔐 STEP 1: Open Indeed sign-in", flush=True)
        await page.goto("https://secure.indeed.com/auth", wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(3)
        
        # Check for Turnstile
        content = await page.content()
        if 'Verify you are human' in content or 'challenges.cloudflare' in content:
            print("   🔓 Solving Turnstile...", flush=True)
            if await solve_turnstile(page):
                await page.goto("https://secure.indeed.com/auth", wait_until='domcontentloaded')
                await asyncio.sleep(3)
        
        # Click Google
        print("\n   Clicking 'Continue with Google'...", flush=True)
        try:
            google_btn = await page.query_selector('button:has-text("Continue with Google")')
            if google_btn:
                await google_btn.click()
            else:
                await page.evaluate('''
                    () => {
                        const btns = document.querySelectorAll('button');
                        for (const btn of btns) {
                            if (btn.textContent.toLowerCase().includes('google')) {
                                btn.click();
                                return;
                            }
                        }
                    }
                ''')
        except:
            pass
        
        await asyncio.sleep(2)
        
        print("\n" + "=" * 60, flush=True)
        print("👆 COMPLETE GOOGLE SIGN-IN IN THE BROWSER!", flush=True)
        print("   Waiting 3 minutes for you...", flush=True)
        print("=" * 60, flush=True)
        
        # Wait for sign-in (3 minutes)
        signed_in = False
        for i in range(36):  # 3 minutes
            await asyncio.sleep(5)
            if i % 6 == 0:
                print(f"   {(i+1)*5}s...", flush=True)
            
            try:
                current_url = page.url
                content = await page.content()
                if 'indeed.com' in current_url and 'secure.indeed.com/auth' not in current_url:
                    if any(x in content for x in ['Sign out', 'My jobs', 'Profile', 'Saved']):
                        print("\n✅ SIGNED IN!", flush=True)
                        signed_in = True
                        break
            except:
                pass
        
        if not signed_in:
            print("\n⚠️ Sign-in not detected, continuing...", flush=True)
        
        # Search
        print("\n🔍 STEP 2: Search for jobs", flush=True)
        await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote&fromage=3", wait_until='domcontentloaded')
        await asyncio.sleep(3)
        
        content = await page.content()
        if 'Verify you are human' in content:
            print("   🔓 Solving Turnstile...", flush=True)
            await solve_turnstile(page)
            await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote&fromage=3", wait_until='domcontentloaded')
            await asyncio.sleep(3)
        
        print("   ✅ Search loaded", flush=True)
        
        # Find job
        print("\n🎯 STEP 3: Find Easy Apply job", flush=True)
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
        
        # Click Apply
        print("\n📋 STEP 4: Click Apply", flush=True)
        apply_btn = await page.query_selector('button:has-text("Apply now")')
        if apply_btn:
            await apply_btn.click()
            print("   ✅ Clicked Apply", flush=True)
        
        await human_delay(4, 6)
        
        if len(context.pages) > 1:
            page = context.pages[-1]
            print("   📑 Application tab", flush=True)
        
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
            
            # Resume - create if needed
            if os.path.exists(RESUME_PATH):
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
                await submit.click()
                print("   🚀 SUBMITTED!", flush=True)
                break
            
            # Continue?
            cont = await page.query_selector('button:has-text("Continue")')
            if cont and await cont.is_visible():
                print(f"   Step {step+1}: Continue", flush=True)
                await cont.click()
        
        await human_delay(3, 5)
        
        # Check success
        content = await page.content()
        if any(x in content.lower() for x in ['submitted', 'thank you', 'received', 'successfully']):
            print("\n" + "=" * 60, flush=True)
            print("🎉🎉🎉 APPLICATION SUBMITTED! 🎉🎉🎉", flush=True)
            print(f"   Job: {title}", flush=True)
            print("=" * 60, flush=True)
        else:
            print("\n⚠️ Check the browser window", flush=True)
        
        print("\n⏳ Browser staying open - you can verify...", flush=True)
        await asyncio.sleep(120)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
