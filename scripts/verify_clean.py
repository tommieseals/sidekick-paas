#!/usr/bin/env python3
import subprocess
import os

REPOS = ["clawd-dashboard", "trading-vault", "sidekick-paas", "investrain-ai"]
SECRETS = [
    "8392398778",
    "8402195747", 
    "jQN/kqK",
    "sk-or-v1",
    "AIzaSy"
]

print("VERIFICATION SCAN - Fresh clones from GitHub")
print("=" * 60)

for repo in REPOS:
    print(f"\n=== {repo} ===")
    
    # Clone fresh
    os.system(f"cd /tmp && rm -rf verify-{repo} && /opt/homebrew/bin/gh repo clone tommieseals/{repo} verify-{repo} 2>/dev/null")
    
    found = False
    for secret in SECRETS:
        # Check current files
        result = subprocess.run(
            f"grep -r '{secret}' /tmp/verify-{repo} --include='*.md' --include='*.py' --include='*.sh' --include='*.txt' 2>/dev/null | head -3",
            shell=True, capture_output=True, text=True
        )
        if result.stdout.strip():
            print(f"  CURRENT FILES - Found '{secret}':")
            print(f"    {result.stdout.strip()[:200]}")
            found = True
        
        # Check git history
        result = subprocess.run(
            f"cd /tmp/verify-{repo} && git log --all -S '{secret}' --oneline 2>/dev/null | head -3",
            shell=True, capture_output=True, text=True
        )
        if result.stdout.strip():
            print(f"  GIT HISTORY - Found '{secret}':")
            print(f"    {result.stdout.strip()}")
            found = True
    
    if not found:
        print("  ✅ CLEAN - No secrets found")

print("\n" + "=" * 60)
print("VERIFICATION COMPLETE")
