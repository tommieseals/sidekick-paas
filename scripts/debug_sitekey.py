#!/usr/bin/env python3
"""Debug sitekey extraction"""
import asyncio
import sys
import re
sys.stdout.reconfigure(line_buffering=True)

from worker.tools.indeed_ultra_stealth import IndeedUltraStealthScraper

async def test():
    stealth = IndeedUltraStealthScraper()
    print("Starting browser...")
    await stealth.setup()
    
    print("Navigating to Indeed search...")
    await stealth.page.goto(
        "https://www.indeed.com/jobs?q=Python+Developer&l=Remote",
        wait_until="domcontentloaded",
        timeout=60000
    )
    
    # Wait for Cloudflare to load
    await asyncio.sleep(5)
    
    print("\n=== FRAME ANALYSIS ===")
    for frame in stealth.page.frames:
        url = frame.url
        print(f"\nFrame URL: {url}")
        
        if "challenges.cloudflare.com" in url:
            print("  ^ This is a Cloudflare frame!")
            
            # Try to extract sitekey
            match = re.search(r'/(0x[A-Za-z0-9_-]+)/?$', url)
            if match:
                print(f"  Sitekey (end match): {match.group(1)}")
            else:
                print("  No sitekey at end of URL")
                
            # Try to find 0x anywhere
            matches = re.findall(r'0x[A-Za-z0-9_-]{10,}', url)
            if matches:
                print(f"  0x tokens found: {matches}")
    
    # Also check page HTML for turnstile div
    print("\n=== LOOKING FOR TURNSTILE DIV ===")
    turnstile_div = await stealth.page.query_selector('[data-sitekey]')
    if turnstile_div:
        sitekey = await turnstile_div.get_attribute('data-sitekey')
        print(f"Found data-sitekey: {sitekey}")
    else:
        print("No element with data-sitekey attribute")
    
    # Check for cf-turnstile class
    cf_turnstile = await stealth.page.query_selector('.cf-turnstile')
    if cf_turnstile:
        sitekey = await cf_turnstile.get_attribute('data-sitekey')
        print(f"Found .cf-turnstile with sitekey: {sitekey}")
    
    await stealth.teardown()

if __name__ == "__main__":
    asyncio.run(test())
