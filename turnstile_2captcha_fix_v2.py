"""
2Captcha Cloudflare Turnstile Fix for Indeed - v2
==================================================

Indeed's known sitekey: 0x4AAAAAAADnPIDROrmt1Wwj

Cloudflare Challenge Pages require extra params:
- action
- data (cData)  
- pagedata

We extract by:
1. Checking iframe src for sitekey
2. Intercepting turnstile.render() JS call
3. Fallback to known Indeed sitekey
"""

import asyncio
import httpx
import re
from loguru import logger


# Known Indeed Turnstile sitekey (from research)
INDEED_SITEKEY = "0x4AAAAAAADnPIDROrmt1Wwj"


class TurnstileSolver:
    """Solves Cloudflare Turnstile with Challenge Page support"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://2captcha.com"
        
    async def extract_params_from_page(self, page) -> dict:
        """Extract turnstile params from page"""
        params = {}
        
        # Method 1: Check iframe src
        try:
            iframe = await page.query_selector('iframe[src*="challenges.cloudflare.com"]')
            if iframe:
                src = await iframe.get_attribute('src') or ""
                logger.info(f"Found Turnstile iframe: {src[:100]}...")
                
                # Extract from URL params
                sitekey_match = re.search(r'sitekey=([^&]+)', src)
                if sitekey_match:
                    params['sitekey'] = sitekey_match.group(1)
                    
                action_match = re.search(r'action=([^&]+)', src)
                if action_match:
                    params['action'] = action_match.group(1)
        except Exception as e:
            logger.debug(f"Iframe extraction failed: {e}")
        
        # Method 2: Check page HTML for sitekey pattern
        if not params.get('sitekey'):
            try:
                html = await page.content()
                # Cloudflare sitekeys start with 0x4AAA
                sitekey_match = re.search(r'0x4AAA[A-Za-z0-9_-]{15,30}', html)
                if sitekey_match:
                    params['sitekey'] = sitekey_match.group(0)
                    logger.info(f"Found sitekey in HTML: {params['sitekey']}")
            except Exception as e:
                logger.debug(f"HTML extraction failed: {e}")
        
        # Method 3: Try to get intercepted params from our hook
        try:
            intercepted = await page.evaluate("() => window.__turnstileParams || {}")
            if intercepted.get('sitekey'):
                params.update(intercepted)
                logger.info(f"Got intercepted params: {intercepted}")
        except:
            pass
        
        # Method 4: Fallback to known Indeed sitekey
        if not params.get('sitekey') and 'indeed.com' in page.url:
            params['sitekey'] = INDEED_SITEKEY
            logger.info(f"Using known Indeed sitekey: {INDEED_SITEKEY}")
        
        return params
    
    async def solve(self, page, timeout: int = 120) -> str | None:
        """
        Full solve flow:
        1. Extract params (sitekey, action, data, pagedata)
        2. Submit to 2Captcha with Cloudflare params
        3. Wait for solution
        4. Return token
        """
        page_url = page.url
        
        # Wait a moment for Turnstile to fully load
        await asyncio.sleep(3)
        
        # Extract params
        params = await self.extract_params_from_page(page)
        
        if not params.get('sitekey'):
            logger.error("Could not find Turnstile sitekey")
            return None
            
        sitekey = params['sitekey']
        action = params.get('action', '')
        cdata = params.get('cData', '')
        pagedata = params.get('pagedata', '')
        
        logger.info(f"Solving Turnstile:")
        logger.info(f"  Sitekey: {sitekey}")
        logger.info(f"  URL: {page_url}")
        if action:
            logger.info(f"  Action: {action}")
        
        # Build 2Captcha request
        submit_data = {
            'key': self.api_key,
            'method': 'turnstile',
            'sitekey': sitekey,
            'pageurl': page_url,
            'json': 1,
        }
        
        # Add Challenge params if we have them
        if action:
            submit_data['action'] = action
        if cdata:
            submit_data['data'] = cdata
        if pagedata:
            submit_data['pagedata'] = pagedata
            
        async with httpx.AsyncClient(timeout=30) as client:
            # Submit task
            logger.info("Submitting to 2Captcha...")
            try:
                resp = await client.post(f"{self.base_url}/in.php", data=submit_data)
                result = resp.json()
            except Exception as e:
                logger.error(f"2Captcha submit error: {e}")
                return None
            
            if result.get('status') != 1:
                error = result.get('request', 'Unknown error')
                logger.error(f"2Captcha submit failed: {error}")
                
                # If BAD_PARAMETERS, try without the extra params
                if error == 'ERROR_BAD_PARAMETERS' and (action or cdata or pagedata):
                    logger.info("Retrying without extra params...")
                    submit_data = {
                        'key': self.api_key,
                        'method': 'turnstile', 
                        'sitekey': sitekey,
                        'pageurl': page_url,
                        'json': 1,
                    }
                    resp = await client.post(f"{self.base_url}/in.php", data=submit_data)
                    result = resp.json()
                    if result.get('status') != 1:
                        logger.error(f"2Captcha retry failed: {result.get('request')}")
                        return None
                else:
                    return None
                
            task_id = result['request']
            logger.info(f"2Captcha task created: {task_id}")
            
            # Poll for result
            for i in range(timeout // 5):
                await asyncio.sleep(5)
                
                try:
                    resp = await client.get(
                        f"{self.base_url}/res.php",
                        params={'key': self.api_key, 'action': 'get', 'id': task_id, 'json': 1}
                    )
                    result = resp.json()
                except Exception as e:
                    logger.warning(f"Poll error: {e}")
                    continue
                
                if result.get('status') == 1:
                    token = result['request']
                    logger.success(f"✅ 2Captcha solved! Token: {token[:50]}...")
                    return token
                elif result.get('request') == 'CAPCHA_NOT_READY':
                    logger.info(f"Waiting for solution... ({(i+1)*5}s)")
                else:
                    logger.error(f"2Captcha error: {result.get('request')}")
                    return None
                    
        logger.error("2Captcha timeout")
        return None
        
    async def inject_token(self, page, token: str) -> bool:
        """Inject solved token into the page"""
        try:
            # Multiple injection methods for different Turnstile implementations
            await page.evaluate(f"""
                () => {{
                    // Method 1: Set hidden input value
                    const inputs = document.querySelectorAll('input[name="cf-turnstile-response"], input[name="g-recaptcha-response"]');
                    inputs.forEach(input => {{
                        input.value = '{token}';
                    }});
                    
                    // Method 2: Find and fill turnstile response textarea
                    const textareas = document.querySelectorAll('textarea[name="cf-turnstile-response"]');
                    textareas.forEach(ta => {{
                        ta.value = '{token}';
                    }});
                    
                    // Method 3: Try common callback functions
                    const callbacks = ['turnstileCallback', 'onTurnstileSuccess', 'cfCallback', 'callback'];
                    for (const cb of callbacks) {{
                        if (typeof window[cb] === 'function') {{
                            window[cb]('{token}');
                            break;
                        }}
                    }}
                    
                    // Method 4: Dispatch event
                    window.dispatchEvent(new CustomEvent('turnstile-solved', {{ detail: {{ token: '{token}' }} }}));
                }}
            """)
            logger.info("Token injected")
            return True
        except Exception as e:
            logger.error(f"Token injection failed: {e}")
            return False


async def solve_indeed_turnstile(page, api_key: str) -> bool:
    """
    Drop-in function for Indeed scraper.
    Call when blocked by Turnstile.
    Returns True if solved successfully.
    """
    solver = TurnstileSolver(api_key)
    
    token = await solver.solve(page)
    if not token:
        return False
        
    await solver.inject_token(page, token)
    
    # Wait for page to process the token
    await asyncio.sleep(3)
    
    # Try clicking any submit/continue button
    try:
        buttons = await page.query_selector_all('button[type="submit"], input[type="submit"], button:has-text("Continue"), button:has-text("Verify")')
        for btn in buttons:
            if await btn.is_visible():
                await btn.click()
                await asyncio.sleep(2)
                break
    except:
        pass
    
    # Check if we're still blocked
    try:
        content = await page.content()
        if 'challenges.cloudflare.com' in content or 'Verify you are human' in content:
            logger.warning("Still showing challenge after token injection")
            # Try page reload
            await page.reload(wait_until='domcontentloaded')
            await asyncio.sleep(3)
            content = await page.content()
            if 'challenges.cloudflare.com' in content:
                return False
    except:
        pass
        
    logger.success("✅ Turnstile bypass successful!")
    return True
