#!/usr/bin/env python3
"""Simplify solve_turnstile to use pre-captured params"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# New simplified solve_turnstile
new_solve = '''    async def solve_turnstile(self) -> bool:
        """Solve Cloudflare Turnstile using intercepted params + 2Captcha"""
        try:
            import re
            
            # Wait for Turnstile to be intercepted
            await asyncio.sleep(2)
            
            # Get captured params from interceptor
            params = await self.page.evaluate("window.__turnstileParams")
            logger.info(f"Intercepted params: {params}")
            
            # Get sitekey - from params or iframe
            sitekey = None
            if params and params.get("sitekey"):
                sitekey = params["sitekey"]
            else:
                # Fallback: extract from iframe URL
                for frame in self.page.frames:
                    if "challenges.cloudflare.com" in frame.url:
                        match = re.search(r"/(0x[A-Za-z0-9_-]{20,})", frame.url)
                        if match:
                            sitekey = match.group(1)
                            break
            
            if not sitekey:
                logger.warning("Could not find Turnstile sitekey")
                return False
            
            logger.info(f"Sitekey: {sitekey}")
            
            # Build task params
            task_params = {
                "type": "TurnstileTaskProxyless",
                "websiteURL": self.page.url,
                "websiteKey": sitekey
            }
            
            # Add Challenge Page params if captured
            if params:
                if params.get("action"):
                    task_params["action"] = params["action"]
                    logger.info(f"  action: {params['action']}")
                if params.get("cData"):
                    task_params["data"] = params["cData"]
                    logger.info(f"  cData: {params['cData'][:30] if params['cData'] else None}...")
                if params.get("chlPageData"):
                    task_params["pagedata"] = params["chlPageData"]
                    logger.info(f"  chlPageData: {params['chlPageData'][:30] if params['chlPageData'] else None}...")
            
            # Submit to 2Captcha
            logger.info(f"Submitting to 2Captcha with: {list(task_params.keys())}")
            solver = TurnstileSolver()
            token = await solver.solve_with_params(task_params)
            
            if not token:
                logger.warning("2Captcha failed")
                return False
            
            logger.info(f"Got token: {token[:50]}...")
            
            # Inject token via callback
            callback_js = f"""
            (function() {{
                if (window.__tsCallback) {{
                    window.__tsCallback("{token}");
                    return "callback";
                }}
                // Fallback: set input value
                document.querySelectorAll('[name*="turnstile"]').forEach(e => e.value = "{token}");
                return "input";
            }})();
            """
            result = await self.page.evaluate(callback_js)
            logger.info(f"Token injection method: {result}")
            
            await asyncio.sleep(3)
            return True
            
        except Exception as e:
            logger.warning(f"solve_turnstile failed: {e}")
            import traceback
            traceback.print_exc()
            return False
'''

# Replace solve_turnstile method
import re
pattern = r'(    async def solve_turnstile\(self\) -> bool:.*?)(\n    async def |\n    def |\nclass |\Z)'
match = re.search(pattern, content, re.DOTALL)

if match:
    old_method = match.group(1)
    content = content.replace(old_method, new_solve)
    with open(path, 'w') as f:
        f.write(content)
    print("✅ Simplified solve_turnstile!")
else:
    print("❌ Could not find method")
