#!/usr/bin/env python3
"""
Connect to existing Chrome and apply - NO NEW BROWSER
"""
import asyncio
import random
import sys
sys.path.insert(0, '/Users/tommie/job-hunter-system')
from shared.vault import VAULT

RESUME = "/Users/tommie/job-hunter-system/resumes/Tommie_Seals_Resume.docx"

async def main():
    from playwright.async_api import async_playwright
    
    print("="*60, flush=True)
    print("CONNECTING TO EXISTING CHROME", flush=True)
    print("="*60, flush=True)
    
    async with async_playwright() as p:
        # Connect to existing Chrome via CDP
        print("\n1. Connecting to Chrome...", flush=True)
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        print("   Connected!", flush=True)
        
        # Get existing contexts and pages
        contexts = browser.contexts
        print(f"   Found {len(contexts)} contexts", flush=True)
        
        if not contexts:
            print("   No contexts found!", flush=True)
            return
        
        ctx = contexts[0]
        pages = ctx.pages
        print(f"   Found {len(pages)} tabs", flush=True)
        
        # Find Indeed tab or use first page
        page = None
        for p in pages:
            url = p.url
            print(f"   Tab: {url[:50]}...", flush=True)
            if 'indeed' in url.lower():
                page = p
                print("   Using Indeed tab!", flush=True)
                break
        
        if not page:
            page = pages[0] if pages else await ctx.new_page()
            print("   Using first tab", flush=True)
        
        # Go to Indeed jobs
        print("\n2. Loading Indeed jobs...", flush=True)
        await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote&fromage=3", timeout=30000)
        await asyncio.sleep(4)
        await page.screenshot(path='/tmp/connect1.png')
        
        # Check if logged in
        content = await page.content()
        if 'Sign out' in content or 'Profile' in content:
            print("   LOGGED IN!", flush=True)
        else:
            print("   Not logged in", flush=True)
        
        # Find jobs
        print("\n3. Finding jobs...", flush=True)
        jobs = await page.query_selector_all('.job_seen_beacon')
        print(f"   Found {len(jobs)} jobs", flush=True)
        
        if len(jobs) == 0:
            print("   No jobs found - check screenshot", flush=True)
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
            await jobs[0].click()
            el = await jobs[0].query_selector('h2.jobTitle')
            title = await el.inner_text() if el else "First job"
            print(f"   Using: {title}", flush=True)
        
        await asyncio.sleep(random.uniform(3, 5))
        await page.screenshot(path='/tmp/connect2.png')
        
        # Click Apply
        print("\n4. Clicking Apply...", flush=True)
        btn = await page.query_selector('button:has-text("Apply now")')
        if btn:
            # Use JavaScript click to avoid timeout
            await btn.evaluate("el => el.click()")
            print("   Clicked!", flush=True)
        else:
            print("   No Apply button", flush=True)
        
        await asyncio.sleep(random.uniform(4, 6))
        
        # Check for new tab
        pages = ctx.pages
        if len(pages) > 1:
            for pg in pages:
                if 'indeed' in pg.url and 'apply' in pg.url.lower():
                    page = pg
                    print("   Application tab!", flush=True)
                    break
        
        await page.screenshot(path='/tmp/connect3.png')
        
        # Check if on form or sign-in
        content = await page.content()
        if 'Create an account' in content or 'sign in' in content.lower():
            print("\n*** STILL NEEDS SIGN-IN ***", flush=True)
            print("   The cookies didn't transfer :(", flush=True)
            await page.screenshot(path='/tmp/connect_signin.png')
            return
        
        # Fill form
        print("\n5. Filling form...", flush=True)
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
                await page.screenshot(path='/tmp/connect_before_submit.png')
                await sub.click()
                print("   >>> SUBMITTED! <<<", flush=True)
                break
            
            # Continue?
            cont = await page.query_selector('button:has-text("Continue")')
            if cont and await cont.is_visible():
                print(f"   Step {step+1}", flush=True)
                await cont.click()
            else:
                print(f"   Step {step+1}: No button", flush=True)
                break
        
        await asyncio.sleep(4)
        await page.screenshot(path='/tmp/connect_final.png')
        
        content = await page.content()
        if any(x in content.lower() for x in ['submitted', 'thank you', 'received']):
            print("\n" + "="*60, flush=True)
            print("SUCCESS! APPLICATION SUBMITTED!", flush=True)
            print(f"Job: {title}", flush=True)
            print("="*60, flush=True)
        else:
            print("\nCheck /tmp/connect_*.png", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
