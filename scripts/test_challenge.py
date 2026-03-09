#!/usr/bin/env python3
"""Test with Cloudflare Challenge parameters"""
import asyncio
import aiohttp
import json

API_KEY = "b4254a5c82ee4cf2f5d52a8cf47bdcee"

async def test():
    # For Cloudflare Challenge pages, we may need action parameter
    payload = {
        "clientKey": API_KEY,
        "task": {
            "type": "TurnstileTaskProxyless",
            "websiteURL": "https://www.indeed.com/jobs?q=Python+Developer&l=Remote",
            "websiteKey": "0x4AAAAAAADnPIDROrmt1Wwj",
            "action": "managed"  # Required for challenge pages
        }
    }
    
    print("Test 1: With action=managed")
    print(json.dumps(payload, indent=2))
    
    async with aiohttp.ClientSession() as session:
        async with session.post("https://api.2captcha.com/createTask", json=payload) as resp:
            result = await resp.json()
            print("\nResponse:", json.dumps(result))
    
    # Test 2: Try without action but different URL format
    payload2 = {
        "clientKey": API_KEY,
        "task": {
            "type": "TurnstileTaskProxyless",
            "websiteURL": "https://www.indeed.com/",  # Just base URL
            "websiteKey": "0x4AAAAAAADnPIDROrmt1Wwj"
        }
    }
    
    print("\n\nTest 2: With base URL only")
    async with aiohttp.ClientSession() as session:
        async with session.post("https://api.2captcha.com/createTask", json=payload2) as resp:
            result = await resp.json()
            print("Response:", json.dumps(result))

asyncio.run(test())
