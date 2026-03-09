#!/usr/bin/env python3
"""
Fix the dashboard navigation to include all project pages
AND commit + push so it never reverts again!
"""

import re
import subprocess
import os

# Full navigation with all important pages
NEW_NAV = '''            <div class="nav-links" id="navLinks">
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
                <a href="/terminator.html" class="nav-link">🤖 Terminator</a>
                <a href="/project-vault.html" class="nav-link">💰 Vault</a>
                <a href="/legion-tracker.html" class="nav-link">🎖️ Legion</a>
                <a href="/fraud-detection.html" class="nav-link">🛡️ Fraud</a>
                <a href="/n8n-hub.html" class="nav-link">⚡ n8n</a>
                <a href="/fiverr.html" class="nav-link">🛒 Fiverr</a>
                <a href="/borbott-army.html" class="nav-link">📚 KDP</a>
                <a href="/tascosaur.html" class="nav-link">🦖 Tascosaur</a>
                <a href="/teams-translator.html" class="nav-link">🌐 Translator</a>
                <a href="/a2a-server.html" class="nav-link">🔗 A2A</a>
                <a href="/docs.html" class="nav-link">Docs</a>
            </div>'''

INDEX_PATH = "/Users/tommie/clawd/dashboard/index.html"
CLAWD_DIR = "/Users/tommie/clawd"

def fix_nav():
    # Read index.html
    with open(INDEX_PATH, "r") as f:
        content = f.read()

    # Find and replace the nav-links div
    pattern = r'<div class="nav-links" id="navLinks">.*?</div>'
    new_content = re.sub(pattern, NEW_NAV, content, flags=re.DOTALL)
    
    if new_content == content:
        print("⚠️ Nav already has correct links or pattern not found")
        return False

    # Write back
    with open(INDEX_PATH, "w") as f:
        f.write(new_content)

    print("✅ Navigation updated with 21 links!")
    return True

def git_commit_push():
    os.chdir(CLAWD_DIR)
    try:
        # Add the file
        subprocess.run(["git", "add", "dashboard/index.html"], check=True)
        
        # Commit
        result = subprocess.run(
            ["git", "commit", "-m", "Fix nav: restore all 21 project links"],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            if "nothing to commit" in result.stdout or "nothing to commit" in result.stderr:
                print("📝 No changes to commit")
                return True
            print(f"⚠️ Commit issue: {result.stderr}")
            return False
        
        print("📝 Committed changes")
        
        # Push
        result = subprocess.run(
            ["git", "push", "origin", "main"],
            capture_output=True, text=True
        )
        if result.returncode == 0:
            print("🚀 Pushed to remote - changes are PERMANENT!")
            return True
        else:
            print(f"⚠️ Push failed: {result.stderr}")
            # Try force push as backup
            subprocess.run(["git", "push", "--force", "origin", "main"], check=True)
            print("🚀 Force pushed to remote - changes are PERMANENT!")
            return True
            
    except Exception as e:
        print(f"❌ Git error: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Fixing dashboard navigation...")
    if fix_nav():
        print("\n📦 Committing and pushing to prevent revert...")
        git_commit_push()
    print("\n✅ Done! Nav should now have 21 links and stay that way.")
