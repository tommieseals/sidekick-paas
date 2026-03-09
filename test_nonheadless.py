#!/usr/bin/env python3
"""
Test Indeed with REAL Chrome profile (non-headless)
Must be run with GUI access on Mac Mini
"""
import asyncio
import os
import sys

os.environ['TWOCAPTCHA_API_KEY'] = 'b4254a5c82ee4cf2f5d52a8cf47bdcee'
sys.path.insert(0, '/Users/tommie/job-hunter-system')

from playwright.async_api import async_playwright
from loguru import logger
import re

# Indeed's Turnstile sitekey
INDEED_SITEKEY = "0x4AAAAAAADnPIDROrmt1Wwj"

async def intercept_turnstile_params():
    """
    Run Chrome non-headless and intercept Turnstile params.
    This script will:
    1. Open Indeed in real Chrome
    2. Wait for Turnstile to load
    3. Extract action/data/pagedata params
    4. Print them for use with 2Captcha
    """
    
    async with async_playwright() as p:
        # Use real Chrome profile (non-headless)
        chrome_profile = os.path.expanduser("~/Library/Application Support/Google/Chrome")
        
        logger.info(f"Launching Chrome with profile: {chrome_profile}")
        
        # Inject our interceptor before any page loads
        init_script = """
        window.__turnstileParams = {};
        
        // Intercept turnstile.render
        const originalDefineProperty = Object.defineProperty;
        let intercepted = false;
        
        Object.defineProperty = function(obj, prop, desc) {
            const result = originalDefineProperty.call(this, obj, prop, desc);
            
            // Watch for turnstile being defined
            if (prop === 'turnstile' && !intercepted) {
                intercepted = true;
                const originalGetter = desc.get;
                if (originalGetter) {
                    Object.defineProperty(obj, prop, {
                        get: function() {
                            const turnstile = originalGetter.call(this);
                            if (turnstile && turnstile.render && !turnstile._hooked) {
                                const origRender = turnstile.render;
                                turnstile.render = function(el, params) {
                                    console.log('[INTERCEPTED TURNSTILE PARAMS]', JSON.stringify(params));
                                    window.__turnstileParams = {
                                        sitekey: params.sitekey,
                                        action: params.action || '',
                                        cData: params.cData || '',
                                        pagedata: params.chlPageData || ''
                                    };
                                    return origRender.call(this, el, params);
                                };
                                turnstile._hooked = true;
                            }
                            return turnstile;
                        },
                        configurable: true
                    });
                }
            }
            return result;
        };
        """
        
        try:
            browser = await p.chromium.launch_persistent_context(
                user_data_dir=chrome_profile,
                headless=False,
                channel="chrome",
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--disable-webrtc',
                ],
                viewport={'width': 1280, 'height': 800},
            )
        except Exception as e:
            logger.error(f"Failed to launch with profile: {e}")
            logger.info("Trying without persistent context...")
            browser = await p.chromium.launch(headless=False, channel="chrome")
            page = await browser.new_page()
        else:
            page = browser.pages[0] if browser.pages else await browser.new_page()
        
        # Add init script
        await page.add_init_script(init_script)
        
        # Listen for console messages
        params_captured = {}
        def handle_console(msg):
            if 'INTERCEPTED TURNSTILE PARAMS' in msg.text:
                logger.success(f"CAPTURED: {msg.text}")
                try:
                    import json
                    data = msg.text.split('] ', 1)[1]
                    params_captured.update(json.loads(data))
                except:
                    pass
        
        page.on('console', handle_console)
        
        logger.info("Navigating to Indeed...")
        await page.goto("https://www.indeed.com/jobs?q=Software+Engineer&l=Remote", 
                       wait_until='domcontentloaded', timeout=30000)
        
        # Wait for Turnstile to appear and be intercepted
        logger.info("Waiting for Turnstile to load (30s)...")
        for i in range(30):
            await asyncio.sleep(1)
            
            # Check if params captured via console
            if params_captured:
                logger.success(f"\n🎉 CAPTURED TURNSTILE PARAMS:")
                for k, v in params_captured.items():
                    logger.info(f"  {k}: {v[:50] if v else 'N/A'}...")
                break
            
            # Try to get from page
            try:
                params = await page.evaluate("() => window.__turnstileParams || {}")
                if params.get('sitekey'):
                    params_captured = params
                    logger.success(f"\n🎉 CAPTURED TURNSTILE PARAMS:")
                    for k, v in params_captured.items():
                        logger.info(f"  {k}: {v[:50] if len(str(v)) > 50 else v}")
                    break
            except:
                pass
            
            # Also check iframe
            try:
                iframe = await page.query_selector('iframe[src*="challenges.cloudflare.com"]')
                if iframe:
                    src = await iframe.get_attribute('src')
                    logger.info(f"Found Turnstile iframe: {src[:100]}...")
            except:
                pass
        
        # Take screenshot
        await page.screenshot(path='/tmp/indeed_turnstile_capture.png')
        logger.info("Screenshot saved to /tmp/indeed_turnstile_capture.png")
        
        # If we captured params, test 2Captcha
        if params_captured.get('action') or params_captured.get('cData') or params_captured.get('pagedata'):
            logger.info("\n🔓 Testing 2Captcha with captured params...")
            import httpx
            async with httpx.AsyncClient() as client:
                data = {
                    'key': os.environ['TWOCAPTCHA_API_KEY'],
                    'method': 'turnstile',
                    'sitekey': params_captured.get('sitekey', INDEED_SITEKEY),
                    'pageurl': 'https://www.indeed.com/jobs',
                    'json': 1,
                }
                if params_captured.get('action'):
                    data['action'] = params_captured['action']
                if params_captured.get('cData'):
                    data['data'] = params_captured['cData']
                if params_captured.get('pagedata'):
                    data['pagedata'] = params_captured['pagedata']
                
                logger.info(f"Submitting: {data}")
                resp = await client.post('https://2captcha.com/in.php', data=data)
                result = resp.json()
                logger.info(f"2Captcha response: {result}")
        
        logger.info("\nKeeping browser open for 30s for inspection...")
        await asyncio.sleep(30)
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(intercept_turnstile_params())
