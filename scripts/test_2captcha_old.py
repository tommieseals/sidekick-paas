#!/usr/bin/env python3
"""Test 2Captcha OLD API format"""
import asyncio
import aiohttp

API_KEY = "b4254a5c82ee4cf2f5d52a8cf47bdcee"
SITEKEY = "0x4AAAAAAADnPIDROrmt1Wwj"
PAGEURL = "https://www.indeed.com/jobs?q=Python+Developer&l=Remote"

async def test():
    # Try old API format
    data = {
        "key": API_KEY,
        "method": "turnstile",
        "sitekey": SITEKEY,
        "pageurl": PAGEURL,
        "json": 1
    }
    
    print("Testing OLD API format (in.php):")
    print(f"sitekey: {SITEKEY}")
    print(f"pageurl: {PAGEURL}")
    
    async with aiohttp.ClientSession() as session:
        async with session.post("https://2captcha.com/in.php", data=data) as resp:
            text = await resp.text()
            print(f"\nResponse: {text}")

asyncio.run(test())
