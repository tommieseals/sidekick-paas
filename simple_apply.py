#!/usr/bin/env python3
"""
Simple apply - fresh browser, use 2captcha for Turnstile
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
            window.__td = {sk: p.sitekey, a: p.action||'', c: p.cData||'', pg: p.chlPageData||''};
            window.__tc = p.callback;
            return orig.call(this, el, p);
        };
    }
}, 50);
"""

async def solve(page):
    for _ in range(15):
        await asyncio.sleep(1)
        d = await page.evaluate("() => window.__td")
        if d and d.get('sk'): break
    else:
        return False
    
    print(f"   Solving...", flush=True)
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post("https://api.2captcha.com/createTask", json={
            "clientKey": API_KEY,
            "task": {"type": "TurnstileTaskProxyless", "websiteURL": page.url,
                     "websiteKey": d['sk'], "action": d['a'], "data": d['c'], "pagedata": d['pg']}
        })
        tid = r.json().get('taskId')
        if not tid: return False
        
        for _ in range(24):
            await asyncio.sleep(5)
            r = await c.post("https://api.2captcha.com/getTaskResult", 
                json={"clientKey": API_KEY, "taskId": tid})
            res = r.json()
            if res.get('status') == 'ready':
                await page.evaluate(f"window.__tc('{res['solution']['token']}')")
                print(f"   Solved!", flush=True)
                return True
    return False

async def main():
    from playwright.async_api import async_playwright
    
    print("="*50, flush=True)
    print("INDEED APPLY - SIMPLE", flush=True)
    print("="*50, flush=True)
    
    async with async_playwright() as p:
        # Fresh persistent context (saves cookies)
        ctx = await p.chromium.launch_persistent_context(
            "/tmp/indeed-session",
            headless=False, channel="chrome",
            viewport={'width': 1280, 'height': 900}
        )
        await ctx.add_init_script(INTERCEPT)
        page = ctx.pages[0] if ctx.pages else await ctx.new_page()
        
        # Go to Indeed
        print("\n1. Loading Indeed...", flush=True)
        await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote&fromage=3", timeout=30000)
        await asyncio.sleep(3)
        
        if 'Verify you are human' in await page.content():
            print("   Turnstile detected", flush=True)
            if await solve(page):
                await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote&fromage=3")
                await asyncio.sleep(3)
        
        await page.screenshot(path='/tmp/simple1.png')
        print("   Loaded!", flush=True)
        
        # Find job
        print("\n2. Finding job...", flush=True)
        jobs = await page.query_selector_all('.job_seen_beacon')
        print(f"   {len(jobs)} jobs", flush=True)
        
        title = ""
        for j in jobs[:10]:
            t = await j.inner_text()
            if 'easily apply' in t.lower():
                el = await j.query_selector('h2.jobTitle')
                title = await el.inner_text() if el else "Job"
                await j.click()
                print(f"   Selected: {title}", flush=True)
                break
        
        await asyncio.sleep(random.uniform(3, 5))
        await page.screenshot(path='/tmp/simple2.png')
        
        # Apply
        print("\n3. Clicking Apply...", flush=True)
        btn = await page.query_selector('button:has-text("Apply now")')
        if btn:
            await btn.click()
            print("   Clicked!", flush=True)
        
        await asyncio.sleep(random.uniform(4, 6))
        if len(ctx.pages) > 1:
            page = ctx.pages[-1]
            print("   New tab", flush=True)
        
        await page.screenshot(path='/tmp/simple3.png')
        
        # Check if sign-in needed
        content = await page.content()
        if 'Create an account' in content or 'Ready to take the next step' in content:
            print("\n*** SIGN-IN PAGE ***", flush=True)
            print("Need to sign in first.", flush=True)
            print("Waiting 60s for manual sign-in...", flush=True)
            await asyncio.sleep(60)
            content = await page.content()
        
        # Fill form
        print("\n4. Filling form...", flush=True)
        for step in range(15):
            await asyncio.sleep(random.uniform(1, 2))
            
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
                if up: await up.set_input_files(RESUME)
            except: pass
            
            # Submit?
            sub = await page.query_selector('button:has-text("Submit")')
            if sub and await sub.is_visible():
                print(f"   SUBMIT FOUND!", flush=True)
                await page.screenshot(path='/tmp/simple_before_submit.png')
                await sub.click()
                print("   >>> SUBMITTED! <<<", flush=True)
                break
            
            # Continue?
            cont = await page.query_selector('button:has-text("Continue")')
            if cont and await cont.is_visible():
                print(f"   Step {step+1}", flush=True)
                await cont.click()
            else:
                break
        
        await asyncio.sleep(3)
        await page.screenshot(path='/tmp/simple_final.png')
        
        content = await page.content()
        if any(x in content.lower() for x in ['submitted', 'thank you', 'received']):
            print("\n" + "="*50, flush=True)
            print("SUCCESS! APPLICATION SUBMITTED!", flush=True)
            print(f"Job: {title}", flush=True)
            print("="*50, flush=True)
        else:
            print("\nCheck /tmp/simple_*.png", flush=True)
        
        print("\nBrowser open 90s...", flush=True)
        await asyncio.sleep(90)
        await ctx.close()

if __name__ == "__main__":
    asyncio.run(main())
