#!/usr/bin/env python3
"""
FULL APPLICATION v2 - Using proven Turnstile capture method
"""
import asyncio
import os
import sys
import random
import json
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
            console.log('[TURNSTILE]', JSON.stringify(params));
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
    """Solve Turnstile using proven method"""
    # Wait for params
    logger.info("Waiting for Turnstile params...")
    captured = None
    for i in range(15):
        await asyncio.sleep(1)
        try:
            data = await page.evaluate("() => window.__turnstileData")
            if data and data.get('sitekey'):
                captured = data
                logger.success(f"Captured params: sitekey={data['sitekey'][:20]}...")
                break
        except:
            pass
    
    if not captured:
        logger.error("Failed to capture params")
        return False
    
    # Submit to 2Captcha
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
    
    logger.info("Submitting to 2Captcha...")
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post("https://api.2captcha.com/createTask", json=task)
        result = resp.json()
        
        if result.get('errorId') != 0:
            logger.error(f"2Captcha error: {result}")
            return False
        
        task_id = result['taskId']
        logger.info(f"Task: {task_id}")
        
        # Poll
        for i in range(24):
            await asyncio.sleep(5)
            resp = await client.post("https://api.2captcha.com/getTaskResult",
                json={"clientKey": API_KEY, "taskId": task_id})
            result = resp.json()
            
            if result.get('status') == 'ready':
                token = result['solution']['token']
                logger.success(f"Solved! Token: {token[:40]}...")
                
                # Inject
                await page.evaluate(f"window.__turnstileCallback('{token}')")
                logger.info("Token injected")
                await asyncio.sleep(2)
                
                # Navigate again
                url = page.url
                await page.goto(url, wait_until='domcontentloaded')
                await asyncio.sleep(3)
                return True
            elif result.get('status') == 'processing':
                logger.info(f"Waiting... ({(i+1)*5}s)")
            else:
                logger.error(f"Error: {result}")
                return False
    
    return False

async def main():
    print("=" * 60, flush=True)
    print("🚀 FULL APPLICATION SUBMISSION v2", flush=True)
    print("=" * 60, flush=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, channel="chrome")
        context = await browser.new_context(viewport={'width': 1280, 'height': 900})
        await context.add_init_script(INTERCEPT_JS)
        page = await context.new_page()
        
        # Search with Easy Apply filter
        print("\n🔍 STEP 1: Search Indeed", flush=True)
        await page.goto("https://www.indeed.com/jobs?q=IT+Support&l=Remote",
                       wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(3)
        
        # Check if blocked
        content = await page.content()
        if 'Verify you are human' in content or 'challenges.cloudflare' in content:
            print("   🔓 Turnstile detected", flush=True)
            if not await solve_turnstile(page):
                print("   ❌ Failed to solve", flush=True)
                await browser.close()
                return
            print("   ✅ Turnstile solved!", flush=True)
        
        await page.screenshot(path='/tmp/v2_step1.png')
        print("   ✅ Search loaded", flush=True)
        
        # Find job with Easy Apply
        print("\n🎯 STEP 2: Find Easy Apply job", flush=True)
        await asyncio.sleep(2)
        
        jobs = await page.query_selector_all('.job_seen_beacon')
        print(f"   Found {len(jobs)} jobs", flush=True)
        
        target = None
        title = ""
        for job in jobs[:10]:
            text = await job.inner_text()
            if 'easily apply' in text.lower() and 'company site' not in text.lower():
                elem = await job.query_selector('h2.jobTitle')
                title = await elem.inner_text() if elem else "Job"
                target = job
                print(f"   ✅ {title}", flush=True)
                break
        
        if not target:
            print("   ⚠️ No Easy Apply, using first job", flush=True)
            target = jobs[0] if jobs else None
            title = "First job"
        
        if not target:
            print("   ❌ No jobs", flush=True)
            await browser.close()
            return
        
        # Click job
        await target.click()
        await human_delay(3, 5)
        await page.screenshot(path='/tmp/v2_step2.png')
        
        # Click Apply
        print("\n📋 STEP 3: Click Apply", flush=True)
        
        # Wait for job details to load
        await asyncio.sleep(2)
        
        # Find Apply button
        apply_btn = await page.query_selector('button:has-text("Apply now")')
        if not apply_btn:
            apply_btn = await page.query_selector('#indeedApplyButton')
        if not apply_btn:
            apply_btn = await page.query_selector('[class*="apply" i] button')
        
        if apply_btn:
            await apply_btn.click()
            print("   ✅ Clicked Apply", flush=True)
        else:
            print("   ⚠️ Apply button not found", flush=True)
            await page.screenshot(path='/tmp/v2_no_apply.png')
        
        await human_delay(3, 5)
        
        # Handle new tab if opened
        if len(context.pages) > 1:
            page = context.pages[-1]
            print("   📑 New tab opened", flush=True)
        
        await page.screenshot(path='/tmp/v2_step3.png')
        
        # Check for Turnstile again
        content = await page.content()
        if 'Verify you are human' in content:
            print("   🔓 Application has Turnstile", flush=True)
            await solve_turnstile(page)
        
        # Fill form
        print("\n📝 STEP 4: Fill form", flush=True)
        
        fields = {
            'input[name*="name" i]': VAULT['name'],
            'input[name*="email" i]': VAULT['email'],
            'input[type="email"]': VAULT['email'],
            'input[name*="phone" i]': VAULT['phone'],
            'input[type="tel"]': VAULT['phone'],
        }
        
        for sel, val in fields.items():
            try:
                elem = await page.query_selector(sel)
                if elem and await elem.is_visible():
                    cur = await elem.input_value()
                    if not cur:
                        await elem.fill(val)
                        print(f"   Filled {sel[:20]}", flush=True)
            except:
                pass
        
        # Upload resume
        try:
            upload = await page.query_selector('input[type="file"]')
            if upload:
                await upload.set_input_files(RESUME_PATH)
                print("   📄 Resume uploaded", flush=True)
        except Exception as e:
            print(f"   Resume: {e}", flush=True)
        
        await page.screenshot(path='/tmp/v2_step4.png')
        
        # Navigate form
        print("\n➡️ STEP 5: Navigate & Submit", flush=True)
        
        for step in range(8):
            await human_delay(1, 2)
            
            # Check for Submit
            submit = await page.query_selector('button:has-text("Submit")')
            if submit and await submit.is_visible():
                print(f"   🎯 SUBMIT button found!", flush=True)
                await page.screenshot(path='/tmp/v2_before_submit.png')
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
                
                # Fill new fields
                for sel, val in fields.items():
                    try:
                        elem = await page.query_selector(sel)
                        if elem and await elem.is_visible():
                            cur = await elem.input_value()
                            if not cur:
                                await elem.fill(val)
                    except:
                        pass
            else:
                print(f"   Step {step+1}: No button found", flush=True)
                break
        
        await page.screenshot(path='/tmp/v2_final.png')
        
        # Check success
        content = await page.content()
        success_phrases = ['submitted', 'thank you', 'received', 'application sent', 'successfully']
        if any(p in content.lower() for p in success_phrases):
            print("\n" + "=" * 60, flush=True)
            print("🎉 APPLICATION SUBMITTED! 🎉", flush=True)
            print(f"   Job: {title}", flush=True)
            print("=" * 60, flush=True)
        else:
            print("\n⚠️ Check /tmp/v2_*.png screenshots", flush=True)
        
        print("\n⏳ Browser open 60s...", flush=True)
        await asyncio.sleep(60)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
