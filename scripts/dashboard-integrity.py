#!/usr/bin/env python3
"""
Dashboard Integrity Monitor - NUCLEAR OPTION
============================================
Automatically detects and fixes corrupted nav-links in dashboard HTML files.

Usage:
    python3 dashboard-integrity.py              # Check and fix
    python3 dashboard-integrity.py --init       # Initialize config with current nav
    python3 dashboard-integrity.py --dry-run    # Check only, don't fix
    python3 dashboard-integrity.py --force      # Force restore all nav-links
"""

import os
import re
import sys
import json
import hashlib
import requests
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, Any

# Configuration
DASHBOARD_DIR = Path.home() / "clawd" / "dashboard"
CONFIG_FILE = Path.home() / "clawd" / "scripts" / "dashboard-integrity.json"
TELEGRAM_BOT_TOKEN = "8392398778:AAH5lan45kR-VT74d3OiXAAIxlPyR4skGzU"
TELEGRAM_CHAT_ID = "939543801"

# The CANONICAL nav-links HTML template (source of truth)
CANONICAL_NAV_LINKS = '''<div class="nav-links">
                <a href="/">Dashboard</a>
                <a href="/infrastructure.html">Infrastructure</a>
                <a href="/agents.html">Agents</a>
                <a href="/projects.html">Projects</a>
                <a href="/apis.html">APIs</a>
                <a href="/skills.html">Skills</a>
                <a href="/tools.html">Tools</a>
                <a href="/achievements.html">Achievements</a>
                <a href="/swarm-monitor.html">🐝 Swarm</a>
                <a href="/arbitrage-pharma.html">💊 Pharma</a>
                <a href="/project-vault.html">💰 Vault</a>
                <a href="/taskbot.html">📋 TaskBot</a>
                <a href="/legion.html">🏴 Legion</a>
                <a href="/docs/">Docs</a>
            </div>'''

# Regex to find nav-links div (handles various whitespace and optional id)
NAV_LINKS_PATTERN = re.compile(
    r'<div[^>]*class="nav-links"[^>]*>.*?</div>',
    re.DOTALL | re.IGNORECASE
)

def compute_hash(content: str) -> str:
    """Compute SHA256 hash of content."""
    normalized = re.sub(r'\s+', ' ', content.strip())
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()[:16]

def send_telegram_alert(message: str):
    """Send alert via Telegram."""
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "HTML"
        }
        response = requests.post(url, data=data, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f"⚠️ Telegram alert failed: {e}")
        return False

def load_config() -> dict:
    """Load or initialize config."""
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE) as f:
            return json.load(f)
    return {
        "canonical_hash": compute_hash(CANONICAL_NAV_LINKS),
        "created": datetime.now().isoformat(),
        "fixes_count": 0,
        "last_check": None
    }

def save_config(config: dict):
    """Save config to file."""
    CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)

def extract_nav_links(html_content: str) -> Optional[str]:
    """Extract nav-links div from HTML."""
    match = NAV_LINKS_PATTERN.search(html_content)
    return match.group(0) if match else None

def check_file(filepath: Path, config: Dict[str, Any], dry_run: bool = False, force: bool = False) -> Dict[str, Any]:
    """Check a single HTML file for nav-links integrity."""
    result = {
        "file": filepath.name,
        "status": "ok",
        "action": None,
        "details": None
    }
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        current_nav = extract_nav_links(content)
        
        if current_nav is None:
            result["status"] = "missing"
            result["details"] = "No nav-links found in file"
            return result
        
        current_hash = compute_hash(current_nav)
        expected_hash = config["canonical_hash"]
        
        if current_hash != expected_hash or force:
            result["status"] = "corrupted" if not force else "force_restore"
            result["details"] = f"Hash mismatch: {current_hash} != {expected_hash}"
            
            if not dry_run:
                # Replace nav-links with canonical version
                new_content = NAV_LINKS_PATTERN.sub(CANONICAL_NAV_LINKS, content)
                
                # Backup original
                backup_path = filepath.with_suffix('.html.bak')
                with open(backup_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                # Write fixed content
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                result["action"] = "restored"
                config["fixes_count"] += 1
            else:
                result["action"] = "would_restore"
        
    except Exception as e:
        result["status"] = "error"
        result["details"] = str(e)
    
    return result

def main():
    args = sys.argv[1:]
    dry_run = "--dry-run" in args
    force = "--force" in args
    init = "--init" in args
    
    print("=" * 60)
    print("🔒 DASHBOARD INTEGRITY MONITOR - NUCLEAR OPTION")
    print("=" * 60)
    print(f"📁 Dashboard: {DASHBOARD_DIR}")
    print(f"⚙️  Config: {CONFIG_FILE}")
    print(f"🏃 Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()
    
    config = load_config()
    
    if init:
        print("🔧 Initializing config with canonical nav-links...")
        config["canonical_hash"] = compute_hash(CANONICAL_NAV_LINKS)
        config["created"] = datetime.now().isoformat()
        save_config(config)
        print(f"✅ Config saved. Canonical hash: {config['canonical_hash']}")
        return
    
    print(f"🔑 Canonical hash: {config['canonical_hash']}")
    print()
    
    # Find all HTML files
    html_files = list(DASHBOARD_DIR.glob("*.html"))
    print(f"📄 Found {len(html_files)} HTML files to check")
    print("-" * 60)
    
    fixed_files = []
    errors = []
    
    for filepath in sorted(html_files):
        result = check_file(filepath, config, dry_run, force)
        
        if result["status"] == "ok":
            print(f"✅ {result['file']}")
        elif result["status"] == "missing":
            print(f"⏭️  {result['file']} - No nav-links (skipped)")
        elif result["status"] in ("corrupted", "force_restore"):
            emoji = "🔧" if result["action"] == "restored" else "⚠️"
            print(f"{emoji} {result['file']} - {result['status'].upper()}")
            if result["action"] == "restored":
                fixed_files.append(result['file'])
        elif result["status"] == "error":
            print(f"❌ {result['file']} - ERROR: {result['details']}")
            errors.append(result)
    
    print("-" * 60)
    
    # Update config
    config["last_check"] = datetime.now().isoformat()
    save_config(config)
    
    # Summary
    print()
    print("📊 SUMMARY")
    print(f"   Total files: {len(html_files)}")
    print(f"   Fixed: {len(fixed_files)}")
    print(f"   Errors: {len(errors)}")
    print(f"   Total fixes (all time): {config['fixes_count']}")
    
    # Send Telegram alert if we fixed anything
    if fixed_files and not dry_run:
        alert_msg = (
            f"🔒 <b>Dashboard Integrity Alert</b>\n\n"
            f"🔧 Fixed {len(fixed_files)} corrupted file(s):\n"
            f"{''.join(f'• {f}' + chr(10) for f in fixed_files)}\n"
            f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
            f"📊 Total fixes: {config['fixes_count']}"
        )
        print()
        print("📤 Sending Telegram alert...")
        if send_telegram_alert(alert_msg):
            print("✅ Alert sent!")
        else:
            print("⚠️ Alert failed to send")
    
    if errors:
        print("\n⚠️ Some files had errors. Check manually.")
        sys.exit(1)
    
    print("\n✅ Integrity check complete!")

if __name__ == "__main__":
    main()
