#!/usr/bin/env python3
"""
2Captcha Turnstile Solver for Job Hunter System
Solves Cloudflare Turnstile CAPTCHAs using 2Captcha API
"""

import asyncio
import aiohttp
import time
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class TurnstileSolver:
    """Solve Cloudflare Turnstile CAPTCHAs via 2Captcha"""
    
    API_KEY = "b4254a5c82ee4cf2f5d52a8cf47bdcee"
    SUBMIT_URL = "https://2captcha.com/in.php"
    RESULT_URL = "https://2captcha.com/res.php"
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or self.API_KEY
    
    async def solve(self, sitekey: str, pageurl: str, timeout: int = 120) -> Optional[str]:
        """
        Solve a Turnstile CAPTCHA.
        
        Args:
            sitekey: The Turnstile sitekey (from data-sitekey attribute)
            pageurl: The full URL of the page with the CAPTCHA
            timeout: Max seconds to wait for solution
            
        Returns:
            The CAPTCHA token to inject, or None if failed
        """
        try:
            async with aiohttp.ClientSession() as session:
                # Step 1: Submit the CAPTCHA
                submit_data = {
                    "key": self.api_key,
                    "method": "turnstile",
                    "sitekey": sitekey,
                    "pageurl": pageurl,
                    "json": 1
                }
                
                logger.info(f"Submitting Turnstile to 2Captcha: {pageurl}")
                
                async with session.post(self.SUBMIT_URL, data=submit_data) as resp:
                    result = await resp.json()
                    
                if result.get("status") != 1:
                    logger.error(f"2Captcha submit failed: {result}")
                    return None
                
                task_id = result.get("request")
                logger.info(f"2Captcha task ID: {task_id}")
                
                # Step 2: Poll for result
                start_time = time.time()
                while time.time() - start_time < timeout:
                    await asyncio.sleep(5)  # Wait 5 seconds between polls
                    
                    params = {
                        "key": self.api_key,
                        "action": "get",
                        "id": task_id,
                        "json": 1
                    }
                    
                    async with session.get(self.RESULT_URL, params=params) as resp:
                        result = await resp.json()
                    
                    if result.get("status") == 1:
                        token = result.get("request")
                        logger.info(f"2Captcha solved! Token length: {len(token)}")
                        return token
                    elif result.get("request") == "CAPCHA_NOT_READY":
                        logger.debug("CAPTCHA not ready yet, waiting...")
                        continue
                    else:
                        logger.error(f"2Captcha error: {result}")
                        return None
                
                logger.error("2Captcha timeout")
                return None
                
        except Exception as e:
            logger.error(f"2Captcha exception: {e}")
            return None
    
    async def get_balance(self) -> float:
        """Check 2Captcha account balance"""
        try:
            async with aiohttp.ClientSession() as session:
                params = {
                    "key": self.api_key,
                    "action": "getbalance",
                    "json": 1
                }
                async with session.get(self.RESULT_URL, params=params) as resp:
                    result = await resp.json()
                    if result.get("status") == 1:
                        return float(result.get("request", 0))
        except:
            pass
        return 0.0


async def test_solver():
    """Test the solver (just checks balance)"""
    solver = TurnstileSolver()
    balance = await solver.get_balance()
    print(f"2Captcha Balance: ${balance:.2f}")
    print(f"Estimated solves remaining: ~{int(balance / 0.003)}")


if __name__ == "__main__":
    asyncio.run(test_solver())
