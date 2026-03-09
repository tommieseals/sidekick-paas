#!/usr/bin/env python3
"""
Intercept Turnstile params by injecting JS BEFORE page loads.
Then submit to 2Captcha with correct API.
"""
import asyncio, json, httpx, os
from playwright.async_api import async_playwright

API_KEY = "b4254a5c82ee4cf2f5d52a8cf47bdcee"

# JS to inject BEFORE page loads
INTERCEPT_JS = """
window.__turnstileData = null;

const i = setInterval(() => {
    if (window.turnstile) {
        clearInterval(i);
        const originalRender = window.turnstile.render;
        window.turnstile.render = function(element, params) {
            console.log('[TURNSTILE INTERCEPT]', JSON.stringify({
                sitekey: params.sitekey,
                action: params.action,
                cData: params.cData,
                chlPageData: params.chlPageData
            }));
            window.__turnstileData = {
                sitekey: params.sitekey,
                action: params.action || '',
                cData: params.cData || '',
                chlPageData: params.chlPageData || ''
            };
            window.__turnstileCallback = params.callback;
            return originalRender.call(this, element, params);
        };
    }
}, 50);
"""

async def main():
    print("Starting browser...", flush=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, channel="chrome")
        context = await browser.new_context()
        
        # Inject script BEFORE any page navigation
        await context.add_init_script(INTERCEPT_JS)
        print("Interceptor injected", flush=True)
        
        page = await context.new_page()
        
        # Collect console logs
        captured_params = {}
        def on_console(msg):
            if 'TURNSTILE INTERCEPT' in msg.text:
                try:
                    data = msg.text.split('] ', 1)[1]
                    captured_params.update(json.loads(data))
                    print(f"\n🎯 CAPTURED: {captured_params}", flush=True)
                except Exception as e:
                    print(f"Parse error: {e}", flush=True)
        
        page.on('console', on_console)
        
        print("Navigating to Indeed...", flush=True)
        await page.goto("https://www.indeed.com/jobs?q=test&l=Remote",
                       wait_until='domcontentloaded', timeout=30000)
        
        # Wait for Turnstile to load and be intercepted
        print("Waiting for Turnstile intercept (15s)...", flush=True)
        for i in range(15):
            await asyncio.sleep(1)
            
            # Try to get from page
            try:
                data = await page.evaluate("() => window.__turnstileData")
                if data and data.get('sitekey'):
                    captured_params = data
                    print(f"\n🎯 GOT FROM PAGE: {captured_params}", flush=True)
                    break
            except:
                pass
        
        await page.screenshot(path='/tmp/intercept.png')
        print(f"Screenshot: /tmp/intercept.png", flush=True)
        
        if captured_params.get('sitekey'):
            print("\n=== TURNSTILE PARAMS ===", flush=True)
            print(f"  sitekey: {captured_params.get('sitekey')}", flush=True)
            print(f"  action: {captured_params.get('action')}", flush=True)
            print(f"  cData: {captured_params.get('cData')}", flush=True)
            print(f"  chlPageData: {captured_params.get('chlPageData', '')[:50]}...", flush=True)
            
            # Submit to 2Captcha using createTask API
            print("\n🔓 Submitting to 2Captcha...", flush=True)
            
            task = {
                "clientKey": API_KEY,
                "task": {
                    "type": "TurnstileTaskProxyless",
                    "websiteURL": "https://www.indeed.com/jobs",
                    "websiteKey": captured_params['sitekey'],
                }
            }
            
            # Add Challenge params if present
            if captured_params.get('action'):
                task['task']['action'] = captured_params['action']
            if captured_params.get('cData'):
                task['task']['data'] = captured_params['cData']
            if captured_params.get('chlPageData'):
                task['task']['pagedata'] = captured_params['chlPageData']
            
            print(f"Request: {json.dumps(task, indent=2)}", flush=True)
            
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    "https://api.2captcha.com/createTask",
                    json=task
                )
                result = resp.json()
                print(f"Response: {result}", flush=True)
                
                if result.get('errorId') == 0:
                    task_id = result['taskId']
                    print(f"✅ Task created: {task_id}", flush=True)
                    
                    # Poll for result
                    for i in range(24):  # 2 min timeout
                        await asyncio.sleep(5)
                        resp = await client.post(
                            "https://api.2captcha.com/getTaskResult",
                            json={"clientKey": API_KEY, "taskId": task_id}
                        )
                        result = resp.json()
                        
                        if result.get('status') == 'ready':
                            token = result['solution']['token']
                            print(f"\n🎉 SOLVED! Token: {token[:50]}...", flush=True)
                            
                            # Inject token
                            await page.evaluate(f"window.__turnstileCallback('{token}')")
                            print("Token injected via callback", flush=True)
                            await asyncio.sleep(5)
                            await page.screenshot(path='/tmp/solved.png')
                            print("Final screenshot: /tmp/solved.png", flush=True)
                            break
                        elif result.get('status') == 'processing':
                            print(f"  Waiting... ({(i+1)*5}s)", flush=True)
                        else:
                            print(f"Error: {result}", flush=True)
                            break
                else:
                    print(f"❌ Error: {result}", flush=True)
        else:
            print("❌ Failed to capture Turnstile params", flush=True)
        
        await asyncio.sleep(5)
        await browser.close()
        print("Done", flush=True)

asyncio.run(main())
