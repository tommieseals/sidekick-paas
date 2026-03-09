#!/usr/bin/env python3
"""Test with 2Captcha's DEMO sitekey"""
import asyncio
import aiohttp
import json

API_KEY = "b4254a5c82ee4cf2f5d52a8cf47bdcee"

# Use 2Captcha's official demo values
DEMO_SITEKEY = "0x4AAAAAAADnPIDROrmt1Wwj"  # Our sitekey
DEMO_URL = "https://2captcha.com/demo/cloudflare-turnstile"
DEMO_KEY = "0x4AAAAAAABS7vwvV6VFfMcD"  # From their demo page

async def test():
    # Test with their demo first
    payload = {
        "clientKey": API_KEY,
        "task": {
            "type": "TurnstileTaskProxyless",
            "websiteURL": DEMO_URL,
            "websiteKey": DEMO_KEY
        }
    }
    
    print("Testing with 2Captcha DEMO:")
    print(json.dumps(payload, indent=2))
    
    async with aiohttp.ClientSession() as session:
        async with session.post("https://api.2captcha.com/createTask", json=payload) as resp:
            result = await resp.json()
            print("\nResponse:")
            print(json.dumps(result, indent=2))
            
            if result.get("errorId") == 0:
                print("\n✅ API works! Task created.")
                print("Waiting for solution (this takes 15-30 seconds)...")
                
                task_id = result.get("taskId")
                for i in range(12):
                    await asyncio.sleep(5)
                    poll = {"clientKey": API_KEY, "taskId": task_id}
                    async with session.post("https://api.2captcha.com/getTaskResult", json=poll) as r:
                        res = await r.json()
                        status = res.get("status")
                        print(f"  Poll {i+1}: {status}")
                        if status == "ready":
                            token = res.get("solution", {}).get("token", "")
                            print(f"\n✅ SOLVED! Token: {token[:50]}...")
                            return

asyncio.run(test())
