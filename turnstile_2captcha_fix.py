"""
2Captcha Cloudflare Turnstile Fix for Indeed
============================================

Indeed uses Cloudflare Challenge Pages which require 3 EXTRA parameters
that standard Turnstile solving doesn't send:
- action
- data (cData)
- pagedata

This module extracts those by intercepting turnstile.render() before Cloudflare loads.

Usage:
    from turnstile_2captcha_fix import TurnstileSolver
    
    solver = TurnstileSolver(api_key="YOUR_2CAPTCHA_KEY")
    token = await solver.solve(page)  # Playwright page
"""

import asyncio
import httpx
import json
from loguru import logger


class TurnstileSolver:
    """Solves Cloudflare Turnstile with Challenge Page support"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://2captcha.com"
        
    async def inject_param_interceptor(self, page) -> dict:
        """
        Inject JS BEFORE the page loads to intercept turnstile.render()
        This captures action, cData (data), and pagedata that Cloudflare passes.
        """
        # This script hooks into turnstile before it renders
        interceptor_script = """
        () => {
            window.__turnstileParams = {};
            
            // Hook into turnstile before it loads
            const originalDefineProperty = Object.defineProperty;
            Object.defineProperty = function(obj, prop, descriptor) {
                if (prop === 'turnstile') {
                    const originalGetter = descriptor.get;
                    descriptor.get = function() {
                        const turnstile = originalGetter ? originalGetter.call(this) : undefined;
                        if (turnstile && turnstile.render) {
                            const originalRender = turnstile.render;
                            turnstile.render = function(container, params) {
                                // Capture the params!
                                window.__turnstileParams = {
                                    sitekey: params.sitekey,
                                    action: params.action || '',
                                    cData: params.cData || '',
                                    pagedata: params.chlPageData || '',
                                    callback: params.callback ? params.callback.name || 'callback' : ''
                                };
                                console.log('[Intercepted turnstile.render]', window.__turnstileParams);
                                return originalRender.call(this, container, params);
                            };
                        }
                        return turnstile;
                    };
                }
                return originalDefineProperty.call(this, obj, prop, descriptor);
            };
            
            // Alternative: also check for direct assignments
            let _turnstile;
            Object.defineProperty(window, 'turnstile', {
                get: () => _turnstile,
                set: (val) => {
                    if (val && val.render) {
                        const originalRender = val.render;
                        val.render = function(container, params) {
                            window.__turnstileParams = {
                                sitekey: params.sitekey,
                                action: params.action || '',
                                cData: params.cData || '',
                                pagedata: params.chlPageData || '',
                            };
                            console.log('[Intercepted turnstile.render v2]', window.__turnstileParams);
                            return originalRender.call(this, container, params);
                        };
                    }
                    _turnstile = val;
                },
                configurable: true
            });
        }
        """
        
        # Add init script that runs BEFORE any page scripts
        await page.add_init_script(interceptor_script)
        logger.info("Turnstile param interceptor injected")
        
    async def extract_params_from_page(self, page) -> dict:
        """Extract captured turnstile params after page loads"""
        # Wait for turnstile to render
        await asyncio.sleep(2)
        
        # Try to get intercepted params
        params = await page.evaluate("() => window.__turnstileParams || {}")
        
        if params.get('sitekey'):
            logger.info(f"Captured Turnstile params: sitekey={params['sitekey'][:20]}..., action={params.get('action', 'N/A')}")
            return params
        
        # Fallback: extract from iframe src
        iframe = await page.query_selector('iframe[src*="challenges.cloudflare.com"]')
        if iframe:
            src = await iframe.get_attribute('src')
            logger.info(f"Turnstile iframe found: {src[:80]}...")
            
            # Parse sitekey from URL
            import re
            sitekey_match = re.search(r'sitekey=([^&]+)', src)
            if sitekey_match:
                return {
                    'sitekey': sitekey_match.group(1),
                    'action': '',
                    'cData': '',
                    'pagedata': '',
                }
        
        # Last resort: search page HTML
        html = await page.content()
        import re
        sitekey_match = re.search(r'0x[A-Za-z0-9_-]{20,}', html)
        if sitekey_match:
            return {'sitekey': sitekey_match.group(0), 'action': '', 'cData': '', 'pagedata': ''}
            
        return {}
    
    async def solve(self, page, timeout: int = 120) -> str | None:
        """
        Full solve flow:
        1. Extract params (including action/data/pagedata)
        2. Submit to 2Captcha with Cloudflare Challenge params
        3. Wait for solution
        4. Inject token and submit
        """
        page_url = page.url
        
        # Extract all params
        params = await self.extract_params_from_page(page)
        
        if not params.get('sitekey'):
            logger.error("Could not find Turnstile sitekey on page")
            return None
            
        sitekey = params['sitekey']
        action = params.get('action', '')
        cdata = params.get('cData', '')
        pagedata = params.get('pagedata', '')
        
        logger.info(f"Solving Turnstile: sitekey={sitekey[:20]}...")
        if action:
            logger.info(f"  Action: {action}")
        if cdata:
            logger.info(f"  cData: {cdata[:50]}...")
        if pagedata:
            logger.info(f"  Pagedata: {pagedata[:50]}...")
        
        # Submit to 2Captcha
        submit_data = {
            'key': self.api_key,
            'method': 'turnstile',
            'sitekey': sitekey,
            'pageurl': page_url,
            'json': 1,
        }
        
        # Add Cloudflare Challenge params if present
        if action:
            submit_data['action'] = action
        if cdata:
            submit_data['data'] = cdata
        if pagedata:
            submit_data['pagedata'] = pagedata
            
        async with httpx.AsyncClient() as client:
            # Submit task
            logger.info("Submitting to 2Captcha...")
            resp = await client.post(f"{self.base_url}/in.php", data=submit_data)
            result = resp.json()
            
            if result.get('status') != 1:
                error = result.get('request', 'Unknown error')
                logger.error(f"2Captcha submit failed: {error}")
                return None
                
            task_id = result['request']
            logger.info(f"2Captcha task created: {task_id}")
            
            # Poll for result
            for i in range(timeout // 5):
                await asyncio.sleep(5)
                
                resp = await client.get(
                    f"{self.base_url}/res.php",
                    params={'key': self.api_key, 'action': 'get', 'id': task_id, 'json': 1}
                )
                result = resp.json()
                
                if result.get('status') == 1:
                    token = result['request']
                    logger.success(f"2Captcha solved! Token: {token[:50]}...")
                    return token
                elif result.get('request') == 'CAPCHA_NOT_READY':
                    logger.info(f"Waiting for solution... ({(i+1)*5}s)")
                else:
                    logger.error(f"2Captcha error: {result.get('request')}")
                    return None
                    
        logger.error("2Captcha timeout")
        return None
        
    async def inject_token(self, page, token: str) -> bool:
        """Inject solved token and trigger callback"""
        try:
            # Find the hidden input and set the token
            await page.evaluate(f"""
                () => {{
                    // Set token in input field
                    const inputs = document.querySelectorAll('input[name="cf-turnstile-response"]');
                    inputs.forEach(input => {{
                        input.value = '{token}';
                    }});
                    
                    // Also try common callback names
                    if (typeof window.turnstileCallback === 'function') {{
                        window.turnstileCallback('{token}');
                    }}
                    if (typeof window.onTurnstileSuccess === 'function') {{
                        window.onTurnstileSuccess('{token}');
                    }}
                    
                    // Trigger form submit if present
                    const form = document.querySelector('form');
                    if (form && inputs.length > 0) {{
                        form.submit();
                    }}
                }}
            """)
            logger.info("Token injected successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to inject token: {e}")
            return False


# Integration example
async def solve_indeed_turnstile(page, api_key: str) -> bool:
    """
    Drop-in function for Indeed scraper.
    Call this when blocked by Turnstile.
    Returns True if solved, False otherwise.
    """
    solver = TurnstileSolver(api_key)
    
    token = await solver.solve(page)
    if not token:
        return False
        
    await solver.inject_token(page, token)
    
    # Wait for redirect after solving
    await asyncio.sleep(3)
    
    # Check if we're still blocked
    content = await page.content()
    if 'challenges.cloudflare.com' in content:
        logger.warning("Still blocked after token injection")
        return False
        
    logger.success("Turnstile bypass successful!")
    return True
