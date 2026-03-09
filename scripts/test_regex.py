#!/usr/bin/env python3
import re

# The actual frame URL from Indeed
url = 'https://challenges.cloudflare.com/cdn-cgi/challenge-platform/h/g/turnstile/f/ov2/av0/rch/es6ep/0x4AAAAAAADnPIDROrmt1Wwj'

print(f"URL: {url}")
print(f"URL length: {len(url)}")

# Current regex (requires trailing /)
match = re.search(r'/(0x[A-Za-z0-9_-]{20,})/', url)
print(f"\nPattern 1 (trailing /): {match.group(1) if match else 'NO MATCH'}")

# Without trailing /
match = re.search(r'/(0x[A-Za-z0-9_-]{20,})', url)
if match:
    sitekey = match.group(1)
    print(f"Pattern 2 (no trailing /): {sitekey}")
    print(f"Sitekey length: {len(sitekey)}")
else:
    print("Pattern 2: NO MATCH")

# Let's also test with 2Captcha
print("\n--- Testing with 2Captcha ---")
import asyncio
import aiohttp
import json

API_KEY = "b4254a5c82ee4cf2f5d52a8cf47bdcee"

async def test():
    payload = {
        "clientKey": API_KEY,
        "task": {
            "type": "TurnstileTaskProxyless",
            "websiteURL": "https://www.indeed.com/jobs?q=Python+Developer&l=Remote",
            "websiteKey": "0x4AAAAAAADnPIDROrmt1Wwj"
        }
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post("https://api.2captcha.com/createTask", json=payload) as resp:
            result = await resp.json()
            print(json.dumps(result, indent=2))

asyncio.run(test())
