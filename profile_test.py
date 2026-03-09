#!/usr/bin/env python3
"""Test with REAL Chrome profile to get Turnstile"""
import asyncio
import os
from playwright.async_api import async_playwright

async def test():
    print("🚀 Starting with REAL Chrome profile...")
    
    # Kill any existing Chrome first
    os.system("pkill -9 'Google Chrome' 2>/dev/null || true")
    await asyncio.sleep(2)
    
    chrome_profile = os.path.expanduser("~/Library/Application Support/Google/Chrome")
    print(f"📁 Profile: {chrome_profile}")
    
    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch_persistent_context(
                user_data_dir=chrome_profile,
                headless=False,
                channel="chrome",
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--disable-webrtc',
                ],
                viewport={'width': 1280, 'height': 800},
            )
            print("✅ Browser launched with profile")
        except Exception as e:
            print(f"❌ Profile launch failed: {e}")
            print("Trying without profile...")
            browser = await p.chromium.launch(headless=False, channel="chrome")
            page = await browser.new_page()
        else:
            page = browser.pages[0] if browser.pages else await browser.new_page()
        
        print("📍 Navigating to Indeed...")
        await page.goto("https://www.indeed.com/jobs?q=Software+Engineer&l=Remote",
                       wait_until='domcontentloaded', timeout=30000)
        
        # Wait for page to settle
        await asyncio.sleep(5)
        
        # Take screenshot
        await page.screenshot(path='/tmp/profile_test.png')
        print("📸 Screenshot: /tmp/profile_test.png")
        
        # Check for Turnstile
        iframe = await page.query_selector('iframe[src*="challenges.cloudflare.com"]')
        if iframe:
            src = await iframe.get_attribute('src')
            print(f"✅ Found Turnstile iframe!")
            print(f"   URL: {src[:150]}...")
            
            # Try to extract params from URL
            import re
            for param in ['sitekey', 'action', 'cData', 'chl']:
                match = re.search(f'{param}=([^&]+)', src)
                if match:
                    print(f"   {param}: {match.group(1)[:50]}...")
        else:
            print("❌ No Turnstile iframe found")
            
        # Check content
        content = await page.content()
        if 'Verify you are human' in content:
            print("✅ Turnstile challenge page detected")
        elif 'Request Blocked' in content:
            print("❌ Hard blocked - no challenge")
        elif 'Additional Verification' in content:
            print("⚠️ Verification required but Turnstile not loaded yet")
        
        print("\n⏳ Waiting 45s - check Mac Mini screen...")
        await asyncio.sleep(45)
        
        # Final screenshot
        await page.screenshot(path='/tmp/profile_test_final.png')
        print("📸 Final screenshot: /tmp/profile_test_final.png")
        
        await browser.close()
        print("🔚 Done")

if __name__ == "__main__":
    asyncio.run(test())
