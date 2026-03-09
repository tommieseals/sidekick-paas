#!/usr/bin/env python3
"""
2Captcha Turnstile Solver v2 - Using new createTask API
"""

import asyncio
import aiohttp
import time
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class TurnstileSolver:
    """Solve Cloudflare Turnstile CAPTCHAs via 2Captcha createTask API"""
    
    API_KEY = "b4254a5c82ee4cf2f5d52a8cf47bdcee"
    CREATE_URL = "https://api.2captcha.com/createTask"
    RESULT_URL = "https://api.2captcha.com/getTaskResult"
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or self.API_KEY
    
    async def solve(self, sitekey: str, pageurl: str, timeout: int = 120) -> Optional[str]:
        """
        Solve a Turnstile CAPTCHA using createTask API.
        
        Args:
            sitekey: The Turnstile sitekey (0x... format)
            pageurl: The full URL of the page with the CAPTCHA
            timeout: Max seconds to wait for solution
            
        Returns:
            The CAPTCHA token to inject, or None if failed
        """
        try:
            async with aiohttp.ClientSession() as session:
                # Step 1: Create task
                create_payload = {
                    "clientKey": self.api_key,
                    "task": {
                        "type": "TurnstileTaskProxyless",
                        "websiteURL": pageurl,
                        "websiteKey": sitekey
                    }
                }
                
                logger.info(f"2Captcha: Submitting Turnstile task for {pageurl[:50]}...")
                logger.info(f"2Captcha: Sitekey: {sitekey}")
                
                async with session.post(self.CREATE_URL, json=create_payload) as resp:
                    result = await resp.json()
                
                if result.get("errorId") != 0:
                    error_code = result.get("errorCode", "UNKNOWN")
                    error_desc = result.get("errorDescription", "")
                    logger.error(f"2Captcha createTask failed: {error_code} - {error_desc}")
                    return None
                
                task_id = result.get("taskId")
                logger.info(f"2Captcha: Task created, ID: {task_id}")
                
                # Step 2: Poll for result
                start_time = time.time()
                poll_payload = {
                    "clientKey": self.api_key,
                    "taskId": task_id
                }
                
                while time.time() - start_time < timeout:
                    await asyncio.sleep(5)  # Wait 5 seconds between polls
                    
                    async with session.post(self.RESULT_URL, json=poll_payload) as resp:
                        result = await resp.json()
                    
                    if result.get("errorId") != 0:
                        error_code = result.get("errorCode", "UNKNOWN")
                        if error_code == "CAPCHA_NOT_READY":
                            logger.debug("2Captcha: Still solving...")
                            continue
                        logger.error(f"2Captcha error: {error_code}")
                        return None
                    
                    status = result.get("status")
                    if status == "ready":
                        token = result.get("solution", {}).get("token")
                        if token:
                            logger.info(f"2Captcha: SOLVED! Token length: {len(token)}")
                            return token
                        else:
                            logger.error("2Captcha: No token in solution")
                            return None
                    elif status == "processing":
                        logger.debug("2Captcha: Still processing...")
                        continue
                
                logger.error("2Captcha: Timeout waiting for solution")
                return None
                
        except Exception as e:
            logger.error(f"2Captcha exception: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    async def get_balance(self) -> float:
        """Check 2Captcha account balance"""
        try:
            async with aiohttp.ClientSession() as session:
                payload = {"clientKey": self.api_key}
                async with session.post("https://api.2captcha.com/getBalance", json=payload) as resp:
                    result = await resp.json()
                    if result.get("errorId") == 0:
                        return float(result.get("balance", 0))
        except Exception as e:
            logger.error(f"Balance check failed: {e}")
        return 0.0


async def test_solver():
    """Test the solver"""
    logging.basicConfig(level=logging.INFO)
    solver = TurnstileSolver()
    balance = await solver.get_balance()
    print(f"2Captcha Balance: ${balance:.2f}")
    print(f"Estimated solves remaining: ~{int(balance / 0.003)}")


if __name__ == "__main__":
    asyncio.run(test_solver())
