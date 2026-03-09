#!/usr/bin/env python3
"""Simple Indeed test - just open and wait"""
import asyncio
from playwright.async_api import async_playwright

async def test():
    print("🚀 Starting browser...")
    
    async with async_playwright() as p:
        # Launch visible Chrome (not using profile to avoid conflicts)
        browser = await p.chromium.launch(
            headless=False,
            channel="chrome",
            args=['--disable-blink-features=AutomationControlled'],
        )
        
        page = await browser.new_page()
        
        print("📍 Navigating to Indeed...")
        await page.goto("https://www.indeed.com/jobs?q=Software+Engineer&l=Remote",
                       wait_until='domcontentloaded', timeout=30000)
        
        print("⏳ Waiting 60s - check the Mac Mini screen!")
        print("   Look for Turnstile checkbox or challenge page")
        
        # Take screenshot
        await page.screenshot(path='/tmp/indeed_visible.png')
        print("📸 Screenshot: /tmp/indeed_visible.png")
        
        # Check for Turnstile iframe
        iframe = await page.query_selector('iframe[src*="challenges.cloudflare.com"]')
        if iframe:
            src = await iframe.get_attribute('src')
            print(f"✅ Found Turnstile iframe!")
            print(f"   URL: {src}")
        
        # Wait for user inspection
        await asyncio.sleep(60)
        
        print("🔚 Closing browser")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test())
