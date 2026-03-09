import subprocess
import json
import os

repos = [
    "a2a-agent-server", "agent-swarm", "ai-portfolio", "auto-healer",
    "borbott-army", "clawd-dashboard", "cost-tracker", "credit-risk-api",
    "doc-drift-detector", "fin-filings-rag", "fiverr-automation", "fraud-platform",
    "incident-copilot", "infra-auditor", "infra-scripts", "innobot",
    "investrain-ai", "llm-cost-optimizer", "llm-gateway", "llm-router",
    "log-analyzer-ai", "node-health-monitor", "pr-reviewer-action",
    "prediction-market-bot", "service-watchdog", "sidekick-paas",
    "tascosaur-nlp", "taskbot-power-automate", "team-capacity-planner",
    "teams-un-translator", "trading-vault", "vendor-risk-monitor"
]

issues = []
checked = 0

print("AUDITING REPOS FOR CODE QUALITY ISSUES")
print("=" * 60)

for repo in repos:
    checked += 1
    print(f"[{checked}/{len(repos)}] Checking {repo}...")
    
    # Clone to temp
    clone_cmd = f"ssh tommie@100.88.105.106 'cd /tmp && rm -rf audit-{repo} && /opt/homebrew/bin/gh repo clone tommieseals/{repo} audit-{repo} 2>/dev/null'"
    subprocess.run(clone_cmd, shell=True, capture_output=True, timeout=60)
    
    # Check for issues
    check_cmd = f"""ssh tommie@100.88.105.106 'cd /tmp/audit-{repo} 2>/dev/null && echo "FILES:" && find . -name "*.py" | wc -l && echo "README:" && (test -f README.md && wc -l < README.md || echo "MISSING") && echo "REQS:" && (test -f requirements.txt && echo "OK" || echo "MISSING") && echo "SYNTAX:" && find . -name "*.py" -exec python3 -m py_compile {{}} \\; 2>&1 | head -5'"""
    
    result = subprocess.run(check_cmd, shell=True, capture_output=True, text=True, timeout=60)
    output = result.stdout + result.stderr
    
    # Look for problems
    if "SyntaxError" in output or "MISSING" in output or "Error" in output:
        issues.append({"repo": repo, "output": output[:500]})
        print(f"  -> ISSUES FOUND")

print()
print("=" * 60)
print(f"REPOS WITH ISSUES: {len(issues)}")
print()

for issue in issues:
    print(f"REPO: {issue['repo']}")
    print(issue['output'][:400])
    print("-" * 40)
