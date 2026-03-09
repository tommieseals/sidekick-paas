import subprocess
import sys

repos = [
    "taskbot-power-automate", "cost-tracker", "llm-router", "llm-cost-optimizer",
    "doc-drift-detector", "asset-tracker", "service-watchdog", "auto-healer",
    "infra-auditor", "pr-reviewer-action", "log-analyzer-ai", "node-health-monitor"
]

print("DEEP AUDIT - CHECKING REPO QUALITY")
print("=" * 60)

issues = []

for repo in repos:
    print(f"\nChecking {repo}...")
    
    # Clone
    cmd = f"ssh tommie@100.88.105.106 'cd /tmp && rm -rf deep-{repo} && /opt/homebrew/bin/gh repo clone tommieseals/{repo} deep-{repo} 2>/dev/null'"
    subprocess.run(cmd, shell=True, capture_output=True, timeout=60)
    
    # Check README
    cmd = f"ssh tommie@100.88.105.106 'test -f /tmp/deep-{repo}/README.md && wc -l < /tmp/deep-{repo}/README.md || echo 0'"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
    readme_lines = result.stdout.strip().replace("'", "").replace('"', '')
    
    # Check file count
    cmd = f"ssh tommie@100.88.105.106 'find /tmp/deep-{repo} -type f -not -path \"*/.git/*\" | wc -l'"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
    file_count = result.stdout.strip().replace("'", "").replace('"', '')
    
    # Check for requirements.txt or package.json
    cmd = f"ssh tommie@100.88.105.106 'test -f /tmp/deep-{repo}/requirements.txt && echo PY || (test -f /tmp/deep-{repo}/package.json && echo JS || echo NONE)'"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
    deps = result.stdout.strip()
    
    print(f"  README: {readme_lines} lines | Files: {file_count} | Deps: {deps}")
    
    # Flag issues
    try:
        rl = int(readme_lines) if readme_lines.isdigit() else 0
        fc = int(file_count) if file_count.isdigit() else 0
    except:
        rl, fc = 0, 0
    
    if rl == 0:
        issues.append(f"{repo}: NO README")
    elif rl < 20:
        issues.append(f"{repo}: README too short ({rl} lines)")
    if deps == "NONE":
        issues.append(f"{repo}: No requirements.txt or package.json")
    if fc < 5:
        issues.append(f"{repo}: Very few files ({fc})")

print("\n" + "=" * 60)
print(f"ISSUES FOUND: {len(issues)}")
for issue in issues:
    print(f"  - {issue}")
