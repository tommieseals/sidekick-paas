#!/usr/bin/env python3
"""
PROJECT LEGION - Indeed Safari Handler
Integrates Safari/AppleScript submission method into job-hunter-system.

This module wraps the proven Safari automation from project-legion-rusty-fix
to work with the UnifiedSubmissionRouter.

Key advantages:
- Safari is a real browser with real cookies/session
- AppleScript is macOS native (no automation fingerprints)
- JavaScript runs in authentic page context
- Already logged into Indeed = no OAuth issues
- Bypasses Cloudflare and bot detection
"""

import subprocess
import base64
import json
import time
import os
from datetime import datetime
from typing import Dict, Optional
from loguru import logger

# Path to the profile config from project-legion-rusty-fix
LEGION_DIR = os.path.expanduser("~/project-legion-rusty-fix/Project-Legion")
PROFILE_PATH = os.path.join(LEGION_DIR, 'profile_config.json')


class IndeedSafariHandler:
    """
    Safari-based Indeed application handler.
    Uses AppleScript + JavaScript injection for stealth automation.
    """
    
    def __init__(self, config: dict = None):
        self.config = config or {}
        self.profile = self._load_profile()
        logger.info("IndeedSafariHandler initialized (Safari/AppleScript method)")
    
    def _load_profile(self) -> dict:
        """Load user profile for form filling."""
        try:
            with open(PROFILE_PATH, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Could not load profile: {e}")
            return {}
    
    def _run_safari_js(self, js_code: str) -> Optional[str]:
        """Execute JavaScript in Safari via AppleScript."""
        # Escape for AppleScript
        js_escaped = js_code.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
        
        applescript = f'''tell application "Safari"
    tell document 1
        do JavaScript "{js_escaped}"
    end tell
end tell'''
        
        encoded = base64.b64encode(applescript.encode()).decode()
        cmd = f'echo {encoded} | base64 -d > /tmp/safari_jhs.scpt && osascript /tmp/safari_jhs.scpt'
        
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        if result.returncode != 0:
            logger.debug(f"Safari JS error: {result.stderr}")
            return None
        return result.stdout.strip()
    
    def _navigate_to_url(self, url: str) -> bool:
        """Navigate Safari to the given URL."""
        applescript = f'''tell application "Safari"
    activate
    tell window 1
        set current tab to (make new tab with properties {{URL:"{url}"}})
    end tell
end tell'''
        
        encoded = base64.b64encode(applescript.encode()).decode()
        cmd = f'echo {encoded} | base64 -d > /tmp/safari_nav.scpt && osascript /tmp/safari_nav.scpt'
        
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        time.sleep(4)  # Wait for page load
        return result.returncode == 0
    
    def _click_easy_apply(self) -> bool:
        """Click the Easy Apply button."""
        js = """
        (function() {
            // Try multiple selectors for Indeed's Easy Apply button
            var selectors = [
                'button.ia-IndeedApplyButton',
                'button[data-testid="apply-button"]',
                'button[aria-label*="Apply"]',
                '.ia-IndeedApplyButton',
                'span.indeed-apply-button-label'
            ];
            for (var i = 0; i < selectors.length; i++) {
                var btn = document.querySelector(selectors[i]);
                if (btn) {
                    btn.click();
                    return 'clicked: ' + selectors[i];
                }
            }
            return 'not found';
        })();
        """
        result = self._run_safari_js(js)
        logger.debug(f"Easy Apply click result: {result}")
        return result and 'clicked' in result
    
    def _fill_form_field(self, field_id: str, value: str) -> bool:
        """Fill a form field using React-compatible method."""
        js_value = value.replace("'", "\\'").replace('"', '\\"')
        js = f"""
        (function() {{
            var input = document.querySelector('#{field_id}') || 
                        document.querySelector('[name="{field_id}"]') ||
                        document.querySelector('[data-testid="{field_id}"]');
            if (!input) return 'field not found';
            
            // React-compatible value setting
            var setter = Object.getOwnPropertyDescriptor(
                input.tagName === 'TEXTAREA' ? 
                window.HTMLTextAreaElement.prototype : 
                window.HTMLInputElement.prototype, 'value'
            ).set;
            setter.call(input, '{js_value}');
            input.dispatchEvent(new Event('input', {{ bubbles: true }}));
            input.dispatchEvent(new Event('change', {{ bubbles: true }}));
            return 'filled';
        }})();
        """
        result = self._run_safari_js(js)
        return result == 'filled'
    
    def _fill_empty_fields(self) -> int:
        """Fill all empty required fields with profile data."""
        if not self.profile:
            return 0
        
        p = self.profile.get('personal', {})
        filled = 0
        
        # Common Indeed field mappings
        field_mappings = {
            'input-firstName': p.get('first_name', ''),
            'input-lastName': p.get('last_name', ''),
            'input-email': p.get('email', ''),
            'input-phone': p.get('phone', ''),
            'input-location': p.get('full_address', ''),
        }
        
        for field_id, value in field_mappings.items():
            if value and self._fill_form_field(field_id, value):
                filled += 1
        
        return filled
    
    def _click_continue(self) -> bool:
        """Click Continue/Next button."""
        js = """
        (function() {
            var btns = document.querySelectorAll('button');
            for (var i = 0; i < btns.length; i++) {
                var txt = btns[i].innerText.toLowerCase();
                if (txt.includes('continue') || txt.includes('next') || txt.includes('review')) {
                    btns[i].click();
                    return 'clicked';
                }
            }
            return 'not found';
        })();
        """
        result = self._run_safari_js(js)
        return result == 'clicked'
    
    def _click_submit(self) -> bool:
        """Click the final Submit button."""
        js = """
        (function() {
            var btns = document.querySelectorAll('button');
            for (var i = 0; i < btns.length; i++) {
                var txt = btns[i].innerText.toLowerCase();
                if (txt.includes('submit') && !txt.includes('don')) {
                    btns[i].click();
                    return 'submitted';
                }
            }
            return 'not found';
        })();
        """
        result = self._run_safari_js(js)
        return result == 'submitted'
    
    def _check_success(self) -> bool:
        """Check if application was successful."""
        js = """
        (function() {
            var body = document.body.innerText.toLowerCase();
            if (body.includes('application submitted') || 
                body.includes('successfully applied') ||
                body.includes('your application has been') ||
                body.includes('thank you for applying')) {
                return 'success';
            }
            return 'unknown';
        })();
        """
        result = self._run_safari_js(js)
        return result == 'success'
    
    async def submit(self, job_data: Dict) -> Dict:
        """
        Submit an application via Safari.
        
        Args:
            job_data: Dict containing job_id, url, title, company, etc.
        
        Returns:
            Dict with status, message, screenshots, etc.
        """
        url = job_data.get('url', '')
        title = job_data.get('title', 'Unknown Job')
        company = job_data.get('company', 'Unknown Company')
        job_id = job_data.get('job_id', 'unknown')
        
        logger.info(f"Safari submission starting: {title} @ {company}")
        result = {
            "job_id": job_id,
            "platform": "indeed",
            "method": "safari_applescript",
            "started_at": datetime.now().isoformat(),
            "screenshots": [],
        }
        
        try:
            # Step 1: Navigate to job URL
            logger.info(f"[1/6] Navigating to: {url}")
            if not self._navigate_to_url(url):
                result["status"] = "failed"
                result["message"] = "Failed to navigate to job URL"
                return result
            
            # Step 2: Click Easy Apply
            logger.info("[2/6] Clicking Easy Apply...")
            time.sleep(2)
            if not self._click_easy_apply():
                result["status"] = "failed"
                result["message"] = "Easy Apply button not found"
                return result
            time.sleep(3)
            
            # Step 3: Fill form fields
            logger.info("[3/6] Filling form fields...")
            filled = self._fill_empty_fields()
            logger.info(f"   Filled {filled} fields")
            
            # Step 4: Click through multi-step form
            logger.info("[4/6] Processing form steps...")
            for step in range(5):  # Max 5 steps
                time.sleep(1.5)
                self._fill_empty_fields()
                if not self._click_continue():
                    break
            
            # Step 5: Submit
            logger.info("[5/6] Submitting application...")
            time.sleep(1)
            self._click_submit()
            time.sleep(3)
            
            # Step 6: Verify
            logger.info("[6/6] Verifying submission...")
            if self._check_success():
                result["status"] = "submitted"
                result["message"] = "Application submitted successfully via Safari"
                logger.info(f"✅ SUCCESS: {title} @ {company}")
            else:
                result["status"] = "unknown"
                result["message"] = "Submission completed but could not verify success"
                logger.warning(f"⚠️ UNKNOWN: {title} @ {company}")
            
            result["completed_at"] = datetime.now().isoformat()
            return result
            
        except Exception as e:
            logger.error(f"Safari submission error: {e}")
            result["status"] = "error"
            result["message"] = str(e)
            return result


# For direct testing
if __name__ == "__main__":
    import asyncio
    
    handler = IndeedSafariHandler()
    
    # Test with a sample job
    test_job = {
        "job_id": "test123",
        "url": "https://www.indeed.com/viewjob?jk=abc123",
        "title": "Test Job",
        "company": "Test Company",
    }
    
    result = asyncio.run(handler.submit(test_job))
    print(json.dumps(result, indent=2))
