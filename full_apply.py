#!/usr/bin/env python3
"""
FULL END-TO-END: Search → Find Job → Apply → Submit
Actually submit a real application to prove the pipeline works
"""
import asyncio
import os
import sys
import random

os.environ['TWOCAPTCHA_API_KEY'] = 'b4254a5c82ee4cf2f5d52a8cf47bdcee'
sys.path.insert(0, '/Users/tommie/job-hunter-system')

from playwright.async_api import async_playwright
from loguru import logger
from worker.tools.turnstile_2captcha_fix import INTERCEPT_JS, TurnstileSolver
from shared.vault import VAULT

RESUME_PATH = "/Users/tommie/job-hunter-system/resumes/Tommie_Seals_Resume.docx"

async def human_delay(min_s=1, max_s=3):
    await asyncio.sleep(random.uniform(min_s, max_s))

async def human_type(page, selector, text):
    """Type like a human"""
    await page.click(selector)
    await human_delay(0.3, 0.7)
    for char in text:
        await page.keyboard.type(char, delay=random.randint(30, 100))
        if random.random() < 0.05:
            await asyncio.sleep(random.uniform(0.2, 0.5))

async def solve_turnstile(page):
    """Solve Cloudflare Turnstile if present"""
    solver = TurnstileSolver()
    
    # Check for Turnstile
    content = await page.content()
    if 'Verify you are human' not in content and 'challenges.cloudflare' not in content:
        return True  # No challenge
    
    logger.info("🔓 Turnstile detected, solving...")
    
    # Capture params
    for i in range(15):
        await asyncio.sleep(1)
        try:
            data = await page.evaluate("() => window.__turnstileData")
            if data and data.get('sitekey'):
                break
        except:
            pass
    else:
        logger.error("Failed to capture Turnstile params")
        return False
    
    # Solve
    token = await solver.solve(page)
    if not token:
        return False
    
    # Inject
    await solver.inject_token(page, token)
    await asyncio.sleep(2)
    
    # Navigate again
    url = page.url
    await page.goto(url, wait_until='domcontentloaded')
    await asyncio.sleep(3)
    
    return True

async def fill_application_form(page):
    """Fill out the Indeed application form"""
    logger.info("📝 Filling application form...")
    
    # Common field mappings
    field_values = {
        'input[name*="name" i]': VAULT['name'],
        'input[name*="firstName" i]': VAULT['first_name'],
        'input[name*="lastName" i]': VAULT['last_name'],
        'input[name*="email" i]': VAULT['email'],
        'input[name*="phone" i]': VAULT['phone'],
        'input[type="email"]': VAULT['email'],
        'input[type="tel"]': VAULT['phone'],
    }
    
    for selector, value in field_values.items():
        try:
            field = await page.query_selector(selector)
            if field and await field.is_visible():
                current = await field.input_value()
                if not current:
                    await human_type(page, selector, value)
                    logger.info(f"  Filled: {selector[:30]}...")
        except:
            pass
    
    # Upload resume
    try:
        upload = await page.query_selector('input[type="file"]')
        if upload:
            await upload.set_input_files(RESUME_PATH)
            logger.info(f"  📄 Uploaded resume: {RESUME_PATH}")
            await human_delay(2, 4)
    except Exception as e:
        logger.warning(f"  Resume upload: {e}")
    
    return True

async def main():
    print("=" * 60, flush=True)
    print("🚀 FULL APPLICATION PIPELINE", flush=True)
    print("   Search → Apply → Submit", flush=True)
    print("=" * 60, flush=True)
    
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=False, channel="chrome")
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 800}
        )
        
        # Inject Turnstile interceptor
        await context.add_init_script(INTERCEPT_JS)
        page = await context.new_page()
        
        # STEP 1: Search Indeed
        print("\n📡 STEP 1: Search Indeed", flush=True)
        search_url = "https://www.indeed.com/jobs?q=Cloud+Architect&l=Remote&sort=date"
        await page.goto(search_url, wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(3)
        
        # Solve Turnstile if needed
        if not await solve_turnstile(page):
            print("❌ Failed to bypass Cloudflare", flush=True)
            await browser.close()
            return
        
        print("✅ Search results loaded", flush=True)
        await page.screenshot(path='/tmp/step1_search.png')
        
        # STEP 2: Find "Easy Apply" job
        print("\n🎯 STEP 2: Find Easy Apply job", flush=True)
        await asyncio.sleep(2)
        
        # Look for job cards with Easy Apply
        jobs = await page.query_selector_all('.job_seen_beacon')
        print(f"   Found {len(jobs)} job cards", flush=True)
        
        target_job = None
        for job in jobs[:10]:
            try:
                # Check for "Easily apply" badge
                easy_apply = await job.query_selector('[class*="easily"]')
                if easy_apply:
                    title_elem = await job.query_selector('h2.jobTitle')
                    title = await title_elem.inner_text() if title_elem else "Unknown"
                    target_job = job
                    print(f"   ✅ Found Easy Apply: {title}", flush=True)
                    break
            except:
                pass
        
        if not target_job:
            print("   ⚠️ No Easy Apply jobs found, trying first job", flush=True)
            target_job = jobs[0] if jobs else None
        
        if not target_job:
            print("❌ No jobs found", flush=True)
            await browser.close()
            return
        
        # Click the job to see details
        await target_job.click()
        await human_delay(2, 4)
        await page.screenshot(path='/tmp/step2_job_selected.png')
        
        # STEP 3: Click Apply
        print("\n📋 STEP 3: Click Apply button", flush=True)
        
        apply_selectors = [
            'button:has-text("Apply now")',
            'button:has-text("Apply")',
            'a:has-text("Apply now")',
            '[class*="apply" i] button',
            '#applyButtonLinkContainer button',
        ]
        
        apply_clicked = False
        for selector in apply_selectors:
            try:
                btn = await page.query_selector(selector)
                if btn and await btn.is_visible():
                    await btn.click()
                    apply_clicked = True
                    print(f"   ✅ Clicked: {selector[:30]}", flush=True)
                    break
            except:
                pass
        
        if not apply_clicked:
            print("   ⚠️ Trying JavaScript click...", flush=True)
            try:
                await page.evaluate('''
                    () => {
                        const btn = document.querySelector('[class*="apply"] button') ||
                                   document.querySelector('button[id*="apply"]');
                        if (btn) btn.click();
                    }
                ''')
                apply_clicked = True
            except:
                pass
        
        await human_delay(3, 5)
        await page.screenshot(path='/tmp/step3_apply_clicked.png')
        
        # Check if new tab opened
        pages = context.pages
        if len(pages) > 1:
            page = pages[-1]  # Switch to new tab
            print("   📑 Switched to application tab", flush=True)
        
        # Solve Turnstile on application page if needed
        await solve_turnstile(page)
        
        # STEP 4: Fill application form
        print("\n📝 STEP 4: Fill application form", flush=True)
        await asyncio.sleep(2)
        await fill_application_form(page)
        await page.screenshot(path='/tmp/step4_form_filled.png')
        
        # STEP 5: Navigate through form pages
        print("\n➡️ STEP 5: Navigate form pages", flush=True)
        
        for step in range(5):
            # Look for Continue/Next button
            continue_selectors = [
                'button:has-text("Continue")',
                'button:has-text("Next")',
                'button[type="submit"]',
                '[class*="continue" i] button',
            ]
            
            clicked = False
            for selector in continue_selectors:
                try:
                    btn = await page.query_selector(selector)
                    if btn and await btn.is_visible():
                        btn_text = await btn.inner_text()
                        await btn.click()
                        print(f"   ✅ Step {step+1}: Clicked '{btn_text}'", flush=True)
                        clicked = True
                        await human_delay(2, 4)
                        
                        # Fill any new fields
                        await fill_application_form(page)
                        break
                except:
                    pass
            
            if not clicked:
                break
            
            await page.screenshot(path=f'/tmp/step5_{step+1}.png')
        
        # STEP 6: Submit application
        print("\n🚀 STEP 6: Submit application", flush=True)
        
        submit_selectors = [
            'button:has-text("Submit")',
            'button:has-text("Submit application")',
            'button:has-text("Apply")',
            'button[type="submit"]:has-text("Submit")',
        ]
        
        submitted = False
        for selector in submit_selectors:
            try:
                btn = await page.query_selector(selector)
                if btn and await btn.is_visible():
                    btn_text = await btn.inner_text()
                    print(f"   🎯 Found submit button: '{btn_text}'", flush=True)
                    
                    # Take screenshot before submit
                    await page.screenshot(path='/tmp/step6_before_submit.png')
                    
                    # SUBMIT!
                    await btn.click()
                    submitted = True
                    print(f"   ✅ CLICKED SUBMIT!", flush=True)
                    break
            except:
                pass
        
        await human_delay(3, 5)
        await page.screenshot(path='/tmp/step6_after_submit.png')
        
        # Check for success
        content = await page.content()
        if 'application' in content.lower() and ('submitted' in content.lower() or 'received' in content.lower() or 'thank' in content.lower()):
            print("\n" + "=" * 60, flush=True)
            print("🎉🎉🎉 APPLICATION SUBMITTED SUCCESSFULLY! 🎉🎉🎉", flush=True)
            print("=" * 60, flush=True)
        else:
            print("\n⚠️ Submission status unclear - check screenshots", flush=True)
        
        # Final screenshot
        await page.screenshot(path='/tmp/final_result.png')
        print("\n📸 Screenshots saved to /tmp/step*.png", flush=True)
        
        # Keep browser open for verification
        print("\n⏳ Browser staying open for 30s for verification...", flush=True)
        await asyncio.sleep(30)
        
        await browser.close()
        print("Done!", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
