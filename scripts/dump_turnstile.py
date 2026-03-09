#!/usr/bin/env python3
"""Dump the Turnstile page HTML to find the sitekey"""
import asyncio
import sys
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
    
    await asyncio.sleep(3)
    
    # Dump HTML
    html = await stealth.page.content()
    with open("/tmp/indeed_page.html", "w") as f:
        f.write(html)
    print(f"Saved HTML ({len(html)} bytes) to /tmp/indeed_page.html")
    
    # Look for sitekey patterns
    import re
    
    # Check for data-sitekey
    matches = re.findall(r'data-sitekey=["\']([^"\']+)["\']', html)
    if matches:
        print(f"Found data-sitekey: {matches}")
    
    # Check for sitekey in scripts
    matches = re.findall(r'sitekey["\']?\s*[:=]\s*["\']([^"\']+)["\']', html, re.IGNORECASE)
    if matches:
        print(f"Found sitekey in scripts: {matches}")
    
    # Check for Cloudflare Turnstile iframe
    matches = re.findall(r'challenges\.cloudflare\.com[^"\']*', html)
    if matches:
        print(f"Found Cloudflare URLs: {matches[:3]}")
    
    # Look for any 0x prefix (common for sitekeys)
    matches = re.findall(r'0x[A-Za-z0-9_-]{20,}', html)
    if matches:
        print(f"Found 0x tokens (possible sitekeys): {matches[:3]}")
    
    # Check frames
    print("\nFrames:")
    for frame in stealth.page.frames:
        print(f"  - {frame.url[:100]}")
    
    await stealth.teardown()

if __name__ == "__main__":
    asyncio.run(test())
