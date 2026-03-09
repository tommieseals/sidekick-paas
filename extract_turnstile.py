#!/usr/bin/env python3
"""Extract Turnstile params from Indeed"""
import asyncio, sys, re
from playwright.async_api import async_playwright

async def main():
    print("Starting...", flush=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=False, channel="chrome")
        pg = await b.new_page()
        
        print("Going to Indeed...", flush=True)
        await pg.goto("https://www.indeed.com/jobs?q=test&l=Remote", 
                     wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(5)
        
        # Get all iframes
        frames = pg.frames
        print(f"Found {len(frames)} frames", flush=True)
        
        for frame in frames:
            url = frame.url
            if 'cloudflare' in url or 'turnstile' in url:
                print(f"\n=== CLOUDFLARE FRAME ===", flush=True)
                print(f"URL: {url}", flush=True)
                
                # Extract params
                for param in ['sitekey', 'action', 'cData', 'chlPageData', 'cRay']:
                    match = re.search(f'{param}=([^&]+)', url)
                    if match:
                        print(f"  {param}: {match.group(1)}", flush=True)
        
        # Also check iframe elements
        iframes = await pg.query_selector_all('iframe')
        print(f"\n{len(iframes)} iframe elements found", flush=True)
        for i, iframe in enumerate(iframes):
            src = await iframe.get_attribute('src')
            if src:
                print(f"  iframe {i}: {src[:100]}...", flush=True)
        
        # Check HTML for sitekey
        html = await pg.content()
        sitekeys = re.findall(r'0x4AAA[A-Za-z0-9_-]{15,30}', html)
        if sitekeys:
            print(f"\nSitekeys in HTML: {sitekeys}", flush=True)
        
        await pg.screenshot(path='/tmp/extract.png')
        print("\nScreenshot: /tmp/extract.png", flush=True)
        
        await asyncio.sleep(10)
        await b.close()
        print("Done", flush=True)

asyncio.run(main())
