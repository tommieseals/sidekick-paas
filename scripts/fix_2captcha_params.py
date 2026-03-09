#!/usr/bin/env python3
"""Update solve_turnstile to extract and use extra params for Challenge Pages"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# New solve_turnstile that injects interceptor and extracts params
new_solve = '''    async def solve_turnstile(self) -> bool:
        """Solve Cloudflare Challenge Page Turnstile using 2Captcha with full params"""
        try:
            import re
            import json
            
            # Inject interceptor script to capture turnstile.render params
            interceptor_js = """
            window.__turnstileParams = null;
            const checkInterval = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(checkInterval);
                    const origRender = window.turnstile.render;
                    window.turnstile.render = function(c, opts) {
                        window.__turnstileParams = {
                            sitekey: opts.sitekey,
                            action: opts.action || null,
                            cData: opts.cData || null,
                            chlPageData: opts.chlPageData || null
                        };
                        console.log('Captured:', JSON.stringify(window.__turnstileParams));
                        window.__tsCallback = opts.callback;
                        return 'intercepted';
                    };
                }
            }, 50);
            setTimeout(() => clearInterval(checkInterval), 15000);
            """
            
            # First try to get params from already-loaded page
            params = await self.page.evaluate("window.__turnstileParams")
            
            if not params:
                # Reload with interceptor
                logger.info("Reloading page with Turnstile interceptor...")
                await self.page.evaluate(interceptor_js)
                await self.page.reload(wait_until="domcontentloaded")
                await asyncio.sleep(5)
                params = await self.page.evaluate("window.__turnstileParams")
            
            # Fallback: extract sitekey from iframe URL
            sitekey = None
            if params and params.get("sitekey"):
                sitekey = params["sitekey"]
                logger.info(f"Got sitekey from interceptor: {sitekey}")
            else:
                # Extract from iframe URL
                for frame in self.page.frames:
                    if "challenges.cloudflare.com" in frame.url:
                        match = re.search(r"/(0x[A-Za-z0-9_-]{20,})", frame.url)
                        if match:
                            sitekey = match.group(1)
                            logger.info(f"Got sitekey from iframe: {sitekey}")
                            break
            
            if not sitekey:
                logger.warning("Could not find Turnstile sitekey")
                return False
            
            # Build 2Captcha request with all params
            task_params = {
                "type": "TurnstileTaskProxyless",
                "websiteURL": self.page.url,
                "websiteKey": sitekey
            }
            
            # Add Challenge Page params if available
            if params:
                if params.get("action"):
                    task_params["action"] = params["action"]
                if params.get("cData"):
                    task_params["data"] = params["cData"]
                if params.get("chlPageData"):
                    task_params["pagedata"] = params["chlPageData"]
                logger.info(f"Using Challenge Page params: action={params.get('action')}")
            
            # Submit to 2Captcha
            solver = TurnstileSolver()
            logger.info(f"Submitting to 2Captcha with params: {list(task_params.keys())}")
            
            token = await solver.solve_with_params(task_params)
            
            if not token:
                logger.warning("2Captcha failed to solve Turnstile")
                return False
            
            logger.info(f"Got 2Captcha token (len={len(token)})")
            
            # Inject token and trigger callback
            js_inject = f"""
            (function() {{
                // Set token in hidden inputs
                document.querySelectorAll('input[name*="turnstile"], input[name*="cf-turnstile-response"]')
                    .forEach(el => el.value = "{token}");
                
                // Try callback
                if (window.__tsCallback) {{
                    window.__tsCallback("{token}");
                }}
                
                // Also try global turnstile callback
                if (window.turnstile && window.turnstile.getResponse) {{
                    // Already have token, try submitting form
                    const form = document.querySelector('form');
                    if (form) form.submit();
                }}
            }})();
            """
            await self.page.evaluate(js_inject)
            await self.human_delay(2, 4)
            
            # Check if we passed
            await self.page.reload(wait_until="domcontentloaded")
            await self.human_delay(2, 3)
            
            return True
            
        except Exception as e:
            logger.warning(f"2Captcha Turnstile solve failed: {e}")
            import traceback
            traceback.print_exc()
            return False
'''

# Find and replace the solve_turnstile method
import re
pattern = r'(    async def solve_turnstile\(self\) -> bool:.*?)(\n    async def |\n    def |\nclass |\Z)'
match = re.search(pattern, content, re.DOTALL)

if match:
    old_method = match.group(1)
    content = content.replace(old_method, new_solve)
    with open(path, 'w') as f:
        f.write(content)
    print("✅ Updated solve_turnstile with Challenge Page params extraction!")
else:
    print("❌ Could not find solve_turnstile method")
