#!/usr/bin/env python3
import asyncio, sys, os
sys.stdout = sys.stderr  # Unbuffered
from playwright.async_api import async_playwright

async def main():
    print("Starting...", flush=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=False, channel="chrome")
        pg = await b.new_page()
        print("Going to Indeed...", flush=True)
        await pg.goto("https://www.indeed.com/jobs?q=test&l=Remote", wait_until='domcontentloaded', timeout=30000)
        await asyncio.sleep(3)
        await pg.screenshot(path='/tmp/quick.png')
        print("Screenshot saved", flush=True)
        
        # Check for turnstile
        iframe = await pg.query_selector('iframe[src*="challenges.cloudflare"]')
        if iframe:
            src = await iframe.get_attribute('src')
            print(f"TURNSTILE FOUND: {src}", flush=True)
        
        content = await pg.content()
        if 'Verify you are human' in content:
            print("CAPTCHA PAGE DETECTED", flush=True)
        elif 'Request Blocked' in content:
            print("HARD BLOCKED", flush=True)
        
        print("Waiting 30s...", flush=True)
        await asyncio.sleep(30)
        await b.close()
        print("Done", flush=True)

asyncio.run(main())
