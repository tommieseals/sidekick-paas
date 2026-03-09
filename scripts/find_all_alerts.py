import subprocess
import json

repos = [
    "a2a-agent-server", "agent-swarm", "ai-portfolio", "arbitrage-pharma",
    "borbott-army", "clawd-dashboard", "fiverr-automation", "fraud-platform",
    "infra-scripts", "innobot", "llm-gateway", "prediction-market-bot",
    "trading-vault", "llm-router", "llm-cost-optimizer", "incident-copilot",
    "service-watchdog", "log-analyzer-ai", "node-health-monitor", "vendor-risk-monitor",
    "kuraray-work", "asset-tracker", "auto-healer", "cost-tracker", "credit-risk-api",
    "doc-drift-detector", "fin-filings-rag", "infra-auditor", "investrain-ai",
    "pr-reviewer-action", "sidekick-paas", "tascosaur-nlp", "taskbot-power-automate",
    "team-capacity-planner", "teams-un-translator", "tommieseals"
]

print("SCANNING ALL 36 REPOS FOR OPEN ALERTS")
print("=" * 60)

all_open = []

for repo in repos:
    cmd = f"ssh tommie@100.88.105.106 /opt/homebrew/bin/gh api /repos/tommieseals/{repo}/secret-scanning/alerts 2>/dev/null"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    try:
        alerts = json.loads(result.stdout)
        if alerts:
            for alert in alerts:
                if alert.get("state") == "open":
                    loc = alert.get("first_location_detected", {})
                    all_open.append({
                        "repo": repo,
                        "number": alert["number"],
                        "type": alert["secret_type"],
                        "file": loc.get("path", "?"),
                        "line": loc.get("start_line", "?"),
                        "secret": alert.get("secret", "")[:40]
                    })
    except:
        pass

print()
for a in all_open:
    print(f"REPO: {a['repo']}")
    print(f"  Type: {a['type']}")
    print(f"  File: {a['file']}:{a['line']}")
    print(f"  Secret: {a['secret']}...")
    print()

print("=" * 60)
print(f"TOTAL OPEN ALERTS: {len(all_open)}")
