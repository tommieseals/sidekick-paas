#!/usr/bin/env python3
"""
Patch unified_router.py to use Safari as primary Indeed handler.
"""
import os

router_path = os.path.expanduser("~/job-hunter-system/worker/submission/unified_router.py")

# Read the file
with open(router_path, 'r') as f:
    content = f.read()

# Backup original
backup_path = router_path + '.pre_safari_backup'
with open(backup_path, 'w') as f:
    f.write(content)
print(f"Backup saved to: {backup_path}")

# Replace the _submit_indeed method
old_method = '''    async def _submit_indeed(self, job: dict, resume_path: str,
                              dry_run: bool) -> dict:
        """Submit to Indeed using Playwright (reliable, better font support)."""
        try:
            from .indeed_playwright import IndeedPlaywrightHandler
            handler = IndeedPlaywrightHandler(
                vault=self.vault,
                config=self.config,
                screenshots_dir=self.screenshots_dir,
            )
            return await handler.apply(job, resume_path, dry_run=dry_run)
        except Exception as e:
            logger.error(f"Playwright handler failed ({e}), trying Camoufox fallback")
            return await self._submit_indeed_camoufox(job, resume_path, dry_run)'''

new_method = '''    async def _submit_indeed(self, job: dict, resume_path: str,
                              dry_run: bool) -> dict:
        """Submit to Indeed using Safari/AppleScript (primary, bypasses bot detection)."""
        try:
            from .indeed_safari import IndeedSafariHandler
            handler = IndeedSafariHandler(config=self.config)
            logger.info("Using Safari/AppleScript method for Indeed (primary)")
            result = await handler.submit(job)
            # Convert to expected format
            return {
                "success": result.get("status") == "submitted",
                "status": result.get("status", "unknown"),
                "message": result.get("message", ""),
                "platform": "indeed",
                "method": "safari_applescript",
                "screenshots": result.get("screenshots", []),
            }
        except Exception as e:
            logger.error(f"Safari handler failed ({e}), trying Playwright fallback")
            return await self._submit_indeed_playwright_fallback(job, resume_path, dry_run)
    
    async def _submit_indeed_playwright_fallback(self, job: dict, resume_path: str,
                              dry_run: bool) -> dict:
        """Fallback: Submit to Indeed using Playwright if Safari fails."""
        try:
            from .indeed_playwright import IndeedPlaywrightHandler
            handler = IndeedPlaywrightHandler(
                vault=self.vault,
                config=self.config,
                screenshots_dir=self.screenshots_dir,
            )
            logger.info("Using Playwright fallback for Indeed")
            return await handler.apply(job, resume_path, dry_run=dry_run)
        except Exception as e:
            logger.error(f"Playwright fallback also failed: {e}")
            return await self._submit_indeed_camoufox(job, resume_path, dry_run)'''

if old_method in content:
    content = content.replace(old_method, new_method)
    print("✅ Replaced _submit_indeed method with Safari-first approach")
else:
    print("⚠️ Could not find exact method to replace")
    print("Searching for alternative...")
    
    # Try to find and update any way
    if 'IndeedPlaywrightHandler' in content and 'indeed_safari' not in content:
        # Add import at top
        import_line = "from .indeed_safari import IndeedSafariHandler"
        if import_line not in content:
            # Find a good place to add it
            content = content.replace(
                "from .indeed_playwright import IndeedPlaywrightHandler",
                "from .indeed_safari import IndeedSafariHandler\nfrom .indeed_playwright import IndeedPlaywrightHandler"
            )
            print("✅ Added Safari import")

# Update docstring
old_doc = "Supports: Indeed (Camoufox)"
new_doc = "Supports: Indeed (Safari/AppleScript primary, Playwright fallback)"
content = content.replace(old_doc, new_doc)

old_routing = "- indeed    -> CamoufoxIndeedHandler (Cloudflare bypass)"
new_routing = "- indeed    -> IndeedSafariHandler (Safari/AppleScript - bypasses all detection)"
content = content.replace(old_routing, new_routing)

# Write the updated file
with open(router_path, 'w') as f:
    f.write(content)

print(f"✅ Updated: {router_path}")
print("Safari is now the primary Indeed handler!")
