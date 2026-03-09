"""
2Captcha Cloudflare Turnstile Solver - WORKING VERSION
=======================================================

Solves Cloudflare Challenge Pages by:
1. Injecting JS interceptor BEFORE page loads
2. Capturing action, cData, chlPageData from turnstile.render()
3. Using 2Captcha createTask API with full Challenge params
4. Injecting token via callback

TESTED AND WORKING on Indeed.com - March 2026
"""

import asyncio
import json
import httpx
import os
from loguru import logger

# Get API key from environment
API_KEY = os.environ.get('TWOCAPTCHA_API_KEY', '')

# JS to inject BEFORE page loads - intercepts turnstile.render()
INTERCEPT_JS = """
window.__turnstileData = null;
window.__turnstileCallback = null;

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


class TurnstileSolver:
    """Solves Cloudflare Turnstile Challenge Pages via 2Captcha"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or API_KEY
        if not self.api_key:
            raise ValueError("2Captcha API key not set. Set TWOCAPTCHA_API_KEY env var.")
    
    async def inject_interceptor(self, context):
        """Inject JS interceptor into browser context BEFORE any page loads"""
        await context.add_init_script(INTERCEPT_JS)
        logger.info("Turnstile interceptor injected")
    
    async def capture_params(self, page, timeout: int = 20) -> dict:
        """Wait for and capture Turnstile params from page"""
        for i in range(timeout):
            await asyncio.sleep(1)
            try:
                data = await page.evaluate("() => window.__turnstileData")
                if data and data.get('sitekey'):
                    logger.success(f"Captured Turnstile params: sitekey={data['sitekey'][:20]}...")
                    return data
            except:
                pass
        return {}
    
    async def solve(self, page, timeout: int = 120) -> str | None:
        """
        Solve Turnstile challenge.
        Call this AFTER the page shows the Turnstile widget.
        Returns the token if solved, None otherwise.
        """
        # Capture params
        params = await self.capture_params(page)
        
        if not params.get('sitekey'):
            logger.error("Failed to capture Turnstile params")
            return None
        
        # Build 2Captcha request
        task = {
            "clientKey": self.api_key,
            "task": {
                "type": "TurnstileTaskProxyless",
                "websiteURL": page.url,
                "websiteKey": params['sitekey'],
            }
        }
        
        # Add Challenge params (required for Cloudflare Challenge Pages)
        if params.get('action'):
            task['task']['action'] = params['action']
        if params.get('cData'):
            task['task']['data'] = params['cData']
        if params.get('chlPageData'):
            task['task']['pagedata'] = params['chlPageData']
        
        logger.info(f"Submitting to 2Captcha: sitekey={params['sitekey'][:20]}..., action={params.get('action')}")
        
        async with httpx.AsyncClient(timeout=30) as client:
            # Create task
            try:
                resp = await client.post(
                    "https://api.2captcha.com/createTask",
                    json=task
                )
                result = resp.json()
            except Exception as e:
                logger.error(f"2Captcha request failed: {e}")
                return None
            
            if result.get('errorId') != 0:
                logger.error(f"2Captcha error: {result.get('errorCode')} - {result.get('errorDescription')}")
                return None
            
            task_id = result['taskId']
            logger.info(f"2Captcha task created: {task_id}")
            
            # Poll for result
            for i in range(timeout // 5):
                await asyncio.sleep(5)
                
                try:
                    resp = await client.post(
                        "https://api.2captcha.com/getTaskResult",
                        json={"clientKey": self.api_key, "taskId": task_id}
                    )
                    result = resp.json()
                except Exception as e:
                    logger.warning(f"Poll error: {e}")
                    continue
                
                if result.get('status') == 'ready':
                    token = result['solution']['token']
                    logger.success(f"2Captcha solved! Token: {token[:50]}...")
                    return token
                elif result.get('status') == 'processing':
                    logger.debug(f"Waiting for solution... ({(i+1)*5}s)")
                else:
                    error = result.get('errorCode', 'Unknown')
                    logger.error(f"2Captcha error: {error}")
                    return None
        
        logger.error("2Captcha timeout")
        return None
    
    async def inject_token(self, page, token: str) -> bool:
        """Inject solved token into page via callback"""
        try:
            # Use the captured callback
            await page.evaluate(f"""
                () => {{
                    if (window.__turnstileCallback) {{
                        window.__turnstileCallback('{token}');
                        return true;
                    }}
                    // Fallback: try common callback names
                    const callbacks = ['turnstileCallback', 'onTurnstileSuccess', 'cfCallback'];
                    for (const cb of callbacks) {{
                        if (typeof window[cb] === 'function') {{
                            window[cb]('{token}');
                            return true;
                        }}
                    }}
                    // Last resort: set input value
                    const inputs = document.querySelectorAll('input[name="cf-turnstile-response"]');
                    inputs.forEach(input => input.value = '{token}');
                    return inputs.length > 0;
                }}
            """)
            logger.info("Token injected successfully")
            return True
        except Exception as e:
            logger.error(f"Token injection failed: {e}")
            return False


async def solve_indeed_turnstile(page, api_key: str = None) -> bool:
    """
    Drop-in function for Indeed scraper.
    Call when blocked by Turnstile.
    Returns True if solved, False otherwise.
    
    IMPORTANT: The browser context must have had inject_interceptor() called
    BEFORE navigating to the page!
    """
    solver = TurnstileSolver(api_key)
    
    # Solve
    token = await solver.solve(page)
    if not token:
        return False
    
    # Inject token
    await solver.inject_token(page, token)
    
    # Wait for page to process
    await asyncio.sleep(3)
    
    # Check if we passed
    content = await page.content()
    if 'challenges.cloudflare.com' in content or 'Verify you are human' in content:
        logger.warning("Still showing challenge after token injection")
        return False
    
    logger.success("Turnstile bypass successful!")
    return True


# Export for easy import
__all__ = ['TurnstileSolver', 'solve_indeed_turnstile', 'INTERCEPT_JS']
