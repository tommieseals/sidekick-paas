#!/usr/bin/env python3
"""
REAL Application - Find Indeed Easy Apply job and submit
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

async def solve_if_needed(page):
    """Solve Cloudflare if present"""
    content = await page.content()
    if 'Verify you are human' in content or 'challenges.cloudflare' in content:
        logger.info("🔓 Solving Turnstile...")
        solver = TurnstileSolver()
        
        # Wait for params
        for _ in range(15):
            await asyncio.sleep(1)
            data = await page.evaluate("() => window.__turnstileData")
            if data and data.get('sitekey'):
                break
        
        token = await solver.solve(page)
        if token:
            await solver.inject_token(page, token)
            await asyncio.sleep(2)
            url = page.url
            await page.goto(url, wait_until='domcontentloaded')
            await asyncio.sleep(3)
            return True
        return False
    return True

async def main():
    print("=" * 60, flush=True)
    print("🎯 REAL APPLICATION SUBMISSION", flush=True)
    print("   Finding Indeed Easy Apply job", flush=True)
    print("=" * 60, flush=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, channel="chrome")
        context = await browser.new_context(viewport={'width': 1280, 'height': 900})
        await context.add_init_script(INTERCEPT_JS)
        page = await context.new_page()
        
        # Search for jobs with Easy Apply filter
        # indeedapply=1 filters for Easy Apply jobs
        print("\n🔍 STEP 1: Search for Easy Apply jobs", flush=True)
        url = "https://www.indeed.com/jobs?q=IT+Support&l=Remote&sc=0kf%3Aattr%28DSQF7%29%3B"
        # The sc parameter filters for "Easily apply"
        
        await page.goto(url, wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(3)
        
        # Solve Turnstile
        if not await solve_if_needed(page):
            print("❌ Failed Turnstile", flush=True)
            await browser.close()
            return
        
        print("✅ Search loaded", flush=True)
        await page.screenshot(path='/tmp/easy_step1.png')
        
        # Find Easy Apply job
        print("\n🎯 STEP 2: Find Easy Apply job", flush=True)
        await asyncio.sleep(2)
        
        jobs = await page.query_selector_all('.job_seen_beacon')
        print(f"   Found {len(jobs)} jobs", flush=True)
        
        target_job = None
        target_title = ""
        
        for job in jobs[:15]:
            try:
                # Look for "Easily apply" text
                text = await job.inner_text()
                if 'easily apply' in text.lower():
                    title_elem = await job.query_selector('h2.jobTitle a, h2.jobTitle span')
                    target_title = await title_elem.inner_text() if title_elem else "Job"
                    
                    # Skip jobs that say "company site"
                    if 'company site' in text.lower():
                        continue
                    
                    target_job = job
                    print(f"   ✅ Found: {target_title}", flush=True)
                    break
            except:
                pass
        
        if not target_job:
            print("❌ No Easy Apply jobs found", flush=True)
            # Screenshot what we see
            await page.screenshot(path='/tmp/no_easy_apply.png')
            await browser.close()
            return
        
        # Click the job
        await target_job.click()
        await human_delay(3, 5)
        await page.screenshot(path='/tmp/easy_step2.png')
        
        # Click Apply Now button
        print("\n📋 STEP 3: Click Apply Now", flush=True)
        
        apply_btn = await page.query_selector('#indeedApplyButton, button[id*="indeedApply"], button:has-text("Apply now")')
        if not apply_btn:
            # Try in the job details pane
            apply_btn = await page.query_selector('.jobsearch-IndeedApplyButton, [class*="IndeedApply"]')
        
        if apply_btn:
            await apply_btn.click()
            print("   ✅ Clicked Apply", flush=True)
        else:
            print("   ⚠️ Apply button not found, trying alternative...", flush=True)
            await page.evaluate('''
                () => {
                    const btns = document.querySelectorAll('button');
                    for (const btn of btns) {
                        if (btn.textContent.includes('Apply now')) {
                            btn.click();
                            return true;
                        }
                    }
                }
            ''')
        
        await human_delay(3, 5)
        
        # Check if modal opened or new page
        pages = context.pages
        if len(pages) > 1:
            page = pages[-1]
            print("   📑 Opened application in new tab", flush=True)
        
        # Solve Turnstile if needed
        await solve_if_needed(page)
        await page.screenshot(path='/tmp/easy_step3.png')
        
        # STEP 4: Fill form
        print("\n📝 STEP 4: Fill application form", flush=True)
        
        content = await page.content()
        
        # Check if we're on the Indeed application form
        if 'ia-BasePage' in content or 'indeed-apply' in content.lower() or 'application' in content.lower():
            print("   ✅ On application form", flush=True)
            
            # Fill fields
            fields = [
                ('input[name*="name" i]', VAULT['name']),
                ('input[name*="email" i]', VAULT['email']),
                ('input[type="email"]', VAULT['email']),
                ('input[name*="phone" i]', VAULT['phone']),
                ('input[type="tel"]', VAULT['phone']),
            ]
            
            for selector, value in fields:
                try:
                    elem = await page.query_selector(selector)
                    if elem and await elem.is_visible():
                        current = await elem.input_value()
                        if not current:
                            await elem.fill(value)
                            print(f"      Filled: {selector[:25]}...", flush=True)
                except:
                    pass
            
            # Upload resume
            try:
                upload = await page.query_selector('input[type="file"]')
                if upload:
                    await upload.set_input_files(RESUME_PATH)
                    print(f"      📄 Uploaded resume", flush=True)
                    await human_delay(2, 3)
            except Exception as e:
                print(f"      Resume: {e}", flush=True)
            
            await page.screenshot(path='/tmp/easy_step4.png')
            
            # STEP 5: Navigate and submit
            print("\n🚀 STEP 5: Submit application", flush=True)
            
            max_steps = 10
            for step in range(max_steps):
                await human_delay(1, 2)
                
                # Look for Continue or Submit
                continue_btn = await page.query_selector('button:has-text("Continue"), button:has-text("Next")')
                submit_btn = await page.query_selector('button:has-text("Submit"), button:has-text("Submit application")')
                
                if submit_btn and await submit_btn.is_visible():
                    text = await submit_btn.inner_text()
                    print(f"   🎯 Found SUBMIT button: '{text}'", flush=True)
                    await page.screenshot(path='/tmp/easy_before_submit.png')
                    
                    # SUBMIT!
                    await submit_btn.click()
                    print("   🚀 CLICKED SUBMIT!", flush=True)
                    await human_delay(3, 5)
                    break
                    
                elif continue_btn and await continue_btn.is_visible():
                    text = await continue_btn.inner_text()
                    print(f"   Step {step+1}: Clicked '{text}'", flush=True)
                    await continue_btn.click()
                    await human_delay(2, 4)
                    
                    # Fill any new fields
                    for selector, value in fields:
                        try:
                            elem = await page.query_selector(selector)
                            if elem and await elem.is_visible():
                                current = await elem.input_value()
                                if not current:
                                    await elem.fill(value)
                        except:
                            pass
                else:
                    print(f"   Step {step+1}: No Continue/Submit found", flush=True)
                    await page.screenshot(path=f'/tmp/easy_step5_{step}.png')
                    break
            
            await page.screenshot(path='/tmp/easy_final.png')
            
            # Check result
            content = await page.content()
            if any(x in content.lower() for x in ['submitted', 'received', 'thank you', 'application sent']):
                print("\n" + "=" * 60, flush=True)
                print("🎉🎉🎉 APPLICATION SUBMITTED! 🎉🎉🎉", flush=True)
                print(f"   Job: {target_title}", flush=True)
                print("=" * 60, flush=True)
            else:
                print("\n⚠️ Submission unclear - check screenshots", flush=True)
        else:
            print("   ❌ Not on application form", flush=True)
            await page.screenshot(path='/tmp/easy_not_form.png')
        
        print("\n📸 Screenshots: /tmp/easy_*.png", flush=True)
        print("⏳ Browser open 60s for verification...", flush=True)
        await asyncio.sleep(60)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
