#!/usr/bin/env python3
"""Test 2Captcha API directly"""
import asyncio
import aiohttp
import json

API_KEY = "b4254a5c82ee4cf2f5d52a8cf47bdcee"
SITEKEY = "0x4AAAAAAADnPIDROrmt1Wwj"
PAGEURL = "https://www.indeed.com/jobs?q=Python+Developer&l=Remote"

async def test():
    payload = {
        "clientKey": API_KEY,
        "task": {
            "type": "TurnstileTaskProxyless",
            "websiteURL": PAGEURL,
            "websiteKey": SITEKEY
        }
    }
    
    print("Sending to 2Captcha:")
    print(json.dumps(payload, indent=2))
    
    async with aiohttp.ClientSession() as session:
        async with session.post("https://api.2captcha.com/createTask", json=payload) as resp:
            result = await resp.json()
            print("\nResponse:")
            print(json.dumps(result, indent=2))

asyncio.run(test())
