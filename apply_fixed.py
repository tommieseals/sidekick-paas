#!/usr/bin/env python3
"""
Fixed apply - better Turnstile handling
"""
import asyncio
import os
import sys
import random
import httpx

sys.path.insert(0, '/Users/tommie/job-hunter-system')
from shared.vault import VAULT

API_KEY = "b4254a5c82ee4cf2f5d52a8cf47bdcee"
RESUME = "/Users/tommie/job-hunter-system/resumes/Tommie_Seals_Resume.docx"

INTERCEPT = """
window.__td = null; window.__tc = null;
setInterval(() => {
    if (window.turnstile && !window.__hooked) {
        window.__hooked = true;
        const orig = window.turnstile.render;
        window.turnstile.render = function(el, p) {
            console.log('TURNSTILE CAPTURED', p.sitekey);
            window.__td = {sk: p.sitekey, a: p.action||'', c: p.cData||'', pg: p.chlPageData||''};
            window.__tc = p.callback;
            return orig.call(this, el, p);
        };
    }
}, 50);
"""

async def solve_turnstile(page):
    """Solve Turnstile challenge"""
    print("   Waiting for Turnstile params...", flush=True)
    
    # Wait for turnstile data
    for i in range(20):
        await asyncio.sleep(1)
        d = await page.evaluate("() => window.__td")
        if d and d.get('sk'):
            print(f"   Got params!", flush=True)
            break
    else:
        print("   No params captured", flush=True)
        return False
    
    print(f"   Submitting to 2Captcha...", flush=True)
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post("https://api.2captcha.com/createTask", json={
            "clientKey": API_KEY,
            "task": {
                "type": "TurnstileTaskProxyless",
                "websiteURL": page.url,
                "websiteKey": d['sk'],
                "action": d['a'],
                "data": d['c'],
                "pagedata": d['pg']
            }
        })
        result = r.json()
        if result.get('errorId') != 0:
            print(f"   Error: {result}", flush=True)
            return False
        
        tid = result['taskId']
        print(f"   Task: {tid}", flush=True)
        
        for i in range(30):
            await asyncio.sleep(5)
            r = await c.post("https://api.2captcha.com/getTaskResult",
                json={"clientKey": API_KEY, "taskId": tid})
            res = r.json()
            if res.get('status') == 'ready':
                token = res['solution']['token']
                print(f"   Solved!", flush=True)
                await page.evaluate(f"window.__tc('{token}')")
                await asyncio.sleep(3)
                return True
            print(f"   Waiting... ({(i+1)*5}s)", flush=True)
    return False

async def main():
    from playwright.async_api import async_playwright
    
    print("="*60, flush=True)
    print("INDEED APPLICATION - FIXED TURNSTILE HANDLING", flush=True)
    print("="*60, flush=True)
    
    async with async_playwright() as p:
        ctx = await p.chromium.launch_persistent_context(
            "/tmp/indeed-session-v2",
            headless=False, channel="chrome",
            viewport={'width': 1280, 'height': 900}
        )
        await ctx.add_init_script(INTERCEPT)
        page = ctx.pages[0] if ctx.pages else await ctx.new_page()
        
        # Load Indeed
        print("\n1. Loading Indeed...", flush=True)
        await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote", timeout=30000)
        await asyncio.sleep(5)
        
        # Check for Cloudflare
        content = await page.content()
        await page.screenshot(path='/tmp/fix1.png')
        
        if 'Verification' in content or 'Verify you are human' in content or 'cloudflare' in content.lower():
            print("   Cloudflare detected!", flush=True)
            if await solve_turnstile(page):
                # Reload after solving
                await asyncio.sleep(2)
                await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote", timeout=30000)
                await asyncio.sleep(5)
        
        # Check if actually loaded
        content = await page.content()
        await page.screenshot(path='/tmp/fix2.png')
        
        if 'Verification' in content:
            print("   Still blocked, trying again...", flush=True)
            await solve_turnstile(page)
            await asyncio.sleep(2)
            await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote", timeout=30000)
            await asyncio.sleep(5)
        
        content = await page.content()
        await page.screenshot(path='/tmp/fix3.png')
        
        # Check login status
        if 'Sign in' in content and 'Sign out' not in content:
            print("   Not logged in", flush=True)
        else:
            print("   Logged in!", flush=True)
        
        # Find jobs
        print("\n2. Finding jobs...", flush=True)
        jobs = await page.query_selector_all('.job_seen_beacon')
        print(f"   Found {len(jobs)} jobs", flush=True)
        
        if len(jobs) == 0:
            print("   No jobs - page might not have loaded correctly", flush=True)
            await page.screenshot(path='/tmp/fix_no_jobs.png')
            print("   Check /tmp/fix_*.png", flush=True)
            await asyncio.sleep(60)
            await ctx.close()
            return
        
        title = ""
        for j in jobs[:10]:
            t = await j.inner_text()
            if 'easily apply' in t.lower():
                el = await j.query_selector('h2.jobTitle')
                title = await el.inner_text() if el else "Job"
                await j.click()
                print(f"   Selected: {title}", flush=True)
                break
        else:
            # Just use first job
            await jobs[0].click()
            el = await jobs[0].query_selector('h2.jobTitle')
            title = await el.inner_text() if el else "First job"
            print(f"   Using: {title}", flush=True)
        
        await asyncio.sleep(random.uniform(3, 5))
        await page.screenshot(path='/tmp/fix4.png')
        
        # Click Apply
        print("\n3. Clicking Apply...", flush=True)
        btn = await page.query_selector('button:has-text("Apply now")')
        if btn:
            await btn.click()
            print("   Clicked!", flush=True)
        else:
            print("   No Apply button found", flush=True)
        
        await asyncio.sleep(random.uniform(4, 6))
        
        if len(ctx.pages) > 1:
            page = ctx.pages[-1]
            print("   Application tab opened", flush=True)
        
        await page.screenshot(path='/tmp/fix5.png')
        
        # Check for Cloudflare again
        content = await page.content()
        if 'Verification' in content or 'Verify you are human' in content:
            print("   Cloudflare on apply page!", flush=True)
            await solve_turnstile(page)
            await asyncio.sleep(3)
        
        # Check for sign-in
        content = await page.content()
        if 'Create an account' in content or 'Ready to take the next step' in content:
            print("\n*** SIGN-IN REQUIRED ***", flush=True)
            print("   Waiting 90s for manual sign-in...", flush=True)
            await asyncio.sleep(90)
        
        # Fill form
        print("\n4. Filling form...", flush=True)
        for step in range(15):
            await asyncio.sleep(random.uniform(1.5, 2.5))
            
            for sel, val in [
                ('input[name*="name" i]', VAULT['name']),
                ('input[name*="email" i]', VAULT['email']),
                ('input[type="email"]', VAULT['email']),
                ('input[name*="phone" i]', VAULT['phone']),
                ('input[type="tel"]', VAULT['phone']),
            ]:
                try:
                    el = await page.query_selector(sel)
                    if el and await el.is_visible():
                        cur = await el.input_value()
                        if not cur: await el.fill(val)
                except: pass
            
            try:
                up = await page.query_selector('input[type="file"]')
                if up: 
                    await up.set_input_files(RESUME)
                    print(f"   Resume uploaded", flush=True)
            except: pass
            
            # Submit?
            sub = await page.query_selector('button:has-text("Submit")')
            if sub and await sub.is_visible():
                txt = await sub.inner_text()
                print(f"   SUBMIT: '{txt}'", flush=True)
                await page.screenshot(path='/tmp/fix_before_submit.png')
                await sub.click()
                print("   >>> SUBMITTED! <<<", flush=True)
                break
            
            # Continue?
            cont = await page.query_selector('button:has-text("Continue")')
            if cont and await cont.is_visible():
                print(f"   Step {step+1}: Continue", flush=True)
                await cont.click()
            else:
                await page.screenshot(path=f'/tmp/fix_step{step}.png')
                print(f"   Step {step+1}: No button", flush=True)
                break
        
        await asyncio.sleep(4)
        await page.screenshot(path='/tmp/fix_final.png')
        
        content = await page.content()
        if any(x in content.lower() for x in ['submitted', 'thank you', 'received', 'application sent']):
            print("\n" + "="*60, flush=True)
            print("SUCCESS! APPLICATION SUBMITTED!", flush=True)
            print(f"Job: {title}", flush=True)
            print("="*60, flush=True)
        else:
            print("\nCheck /tmp/fix_*.png", flush=True)
        
        print("\nBrowser open 60s...", flush=True)
        await asyncio.sleep(60)
        await ctx.close()

if __name__ == "__main__":
    asyncio.run(main())
