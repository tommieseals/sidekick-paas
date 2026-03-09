#!/usr/bin/env python3
"""Test sitekey extraction from Indeed Turnstile page"""
import asyncio
import re
import sys
sys.path.insert(0, '/Users/tommie/job-hunter-system')

from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("Navigating to Indeed...")
        await page.goto("https://www.indeed.com/jobs?q=Software+Engineer&l=Remote", 
                       wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(2)
        
        # Get page content
        html = await page.content()
        
        # Look for Turnstile iframe
        iframe = await page.query_selector('iframe[src*="challenges.cloudflare.com"]')
        if iframe:
            src = await iframe.get_attribute('src')
            print(f"\n✅ Found Turnstile iframe!")
            print(f"   src: {src[:200]}...")
            
            # Extract sitekey from src
            sitekey_match = re.search(r'sitekey=([^&]+)', src)
            if sitekey_match:
                print(f"   sitekey: {sitekey_match.group(1)}")
        
        # Also check for sitekey in page content
        print("\nSearching page HTML for sitekeys...")
        sitekey_patterns = [
            r'sitekey["\s:=]+([0-9A-Za-z_-]{40,})',
            r'data-sitekey="([^"]+)"',
            r'"sitekey":"([^"]+)"',
            r'0x[A-Fa-f0-9]{20,}',
        ]
        
        for pattern in sitekey_patterns:
            matches = re.findall(pattern, html)
            if matches:
                print(f"  Pattern {pattern[:30]}...: {matches[:3]}")
        
        # Save HTML for inspection
        with open('/tmp/indeed_page.html', 'w') as f:
            f.write(html)
        print("\nSaved full HTML to /tmp/indeed_page.html")
        
        # Screenshot
        await page.screenshot(path='/tmp/indeed_sitekey_test.png')
        print("Screenshot saved to /tmp/indeed_sitekey_test.png")
        
        await browser.close()

asyncio.run(test())
