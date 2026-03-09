#!/usr/bin/env python3
"""Test stealth browser with separate profile"""
import asyncio
import sys
sys.stdout.reconfigure(line_buffering=True)

from worker.tools.indeed_ultra_stealth import IndeedUltraStealthScraper

async def test():
    stealth = IndeedUltraStealthScraper()
    print("Starting with SEPARATE automation profile...")
    await stealth.setup()
    print("Browser started! Navigating to Indeed...")
    await stealth.page.goto("https://www.indeed.com", wait_until="domcontentloaded", timeout=30000)
    print("Current URL:", stealth.page.url)
    await asyncio.sleep(3)
    await stealth.teardown()
    print("Done!")

if __name__ == "__main__":
    asyncio.run(test())
