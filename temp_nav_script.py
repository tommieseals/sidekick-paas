#!/usr/bin/env python3
"""
BULLETPROOF Dashboard Navigation Fixer
Maintains CANONICAL nav links across ALL dashboard HTML files.
Run after any git pull or deploy.

Author: Clawd
Last Updated: 2026-03-04 (Added portfolio projects + resume-bank + teams-translator)
"""
import os
import re
from pathlib import Path
from datetime import datetime

DASHBOARD_DIR = Path.home() / "clawd" / "dashboard"

# ============================================================================
# CANONICAL NAV LINKS - THE SOURCE OF TRUTH
# Update this list when adding new pages. This is the ONLY place to edit.
# Last updated: 2026-03-04 - Added 5 missing pages (investrain, tascosaur, sidekick, resume-bank, teams-translator)
# ============================================================================
CANONICAL_NAV = '''            <div class="nav-links" id="navLinks">
                <a href="/" class="nav-link">Dashboard</a>
                <a href="/infrastructure.html" class="nav-link">Infrastructure</a>
                <a href="/agents.html" class="nav-link">Agents</a>
                <a href="/projects.html" class="nav-link">Projects</a>
                <a href="/apis.html" class="nav-link">APIs</a>
                <a href="/skills.html" class="nav-link">Skills</a>
                <a href="/tools.html" class="nav-link">Tools</a>
                <a href="/achievements.html" class="nav-link">Achievements</a>
                <a href="/swarm-monitor.html" class="nav-link">🐝 Swarm</a>
                <a href="/arbitrage-pharma.html" class="nav-link">💊 Pharma</a>
                <a href="/project-vault.html" class="nav-link">💰 Vault</a>
                <a href="/taskbot.html" class="nav-link">📋 TaskBot</a>
                <a href="/legion.html" class="nav-link">🏴 Legion</a>
                <a href="/resume-bank.html" class="nav-link">📄 Resumes</a>
                <a href="/fiverr.html" class="nav-link">💼 Fiverr</a>
                <a href="/fort-knox.html" class="nav-link">🏰 Fort Knox</a>
                <a href="/shared-brain.html" class="nav-link">🧠 Brain</a>
                <a href="/borbott-army.html" class="nav-link">📚 BorbottArmy</a>
                <a href="/fraud-detection.html" class="nav-link">🚨 Fraud</a>
                <a href="/terminator.html" class="nav-link">🤖 Terminator</a>
                <a href="/n8n-hub.html" class="nav-link">🔄 n8n</a>
                <a href="/a2a-server.html" class="nav-link">🤖 A2A</a>
                <a href="/specialist-swarm.html" class="nav-link">🐝 Specialists</a>
                <a href="/investrain-ai.html" class="nav-link">📈 Investrain</a>
                <a href="/tascosaur-nlp.html" class="nav-link">🦖 Tascosaur</a>
                <a href="/sidekick-paas.html" class="nav-link">🦸 Sidekick</a>
                <a href="/teams-translator.html" class="nav-link">🌐 Translator</a>
                <a href="/docs/" class="nav-link">Docs</a>
            </div>'''

# Pattern to find existing nav-links div (handles multi-line)
NAV_PATTERN = r'<div class="nav-links" id="navLinks">.*?</div>'

# Files to skip (test files, legacy files, etc.)
SKIP_FILES = [
    "test.html", "simple.html", "nocache.html", "debug-legion.html",
    "test-simple.html", "test-api.html", "diagnostics.html",
    "mobile-status.html", "usage.html", "tracker.html",
    "resume1.html", "resume2.html", "temp.html"
]

def fix_nav():
    """Fix navigation in all dashboard HTML files."""
    fixed = 0
    skipped = 0
    no_nav = 0
    
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Fixing dashboard navigation...")
    
    for html_file in DASHBOARD_DIR.glob("*.html"):
        # Skip backup files
        if "backup" in html_file.name or "bak" in html_file.name:
            skipped += 1
            continue
            
        if html_file.name in SKIP_FILES:
            skipped += 1
            continue
        
        try:
            content = html_file.read_text(encoding="utf-8", errors="ignore")
            
            # Check if file has nav-links div
            if "nav-links" in content and 'id="navLinks"' in content:
                # Replace with canonical nav
                new_content = re.sub(NAV_PATTERN, CANONICAL_NAV, content, flags=re.DOTALL)
                
                if new_content != content:
                    html_file.write_text(new_content, encoding="utf-8")
                    print(f"✅ Fixed: {html_file.name}")
                    fixed += 1
            else:
                no_nav += 1
                
        except Exception as e:
            print(f"❌ Error {html_file.name}: {e}")
    
    print(f"\n📊 Summary: {fixed} fixed, {skipped} skipped, {no_nav} without nav")
    return fixed

if __name__ == "__main__":
    fix_nav()
