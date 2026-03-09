#!/bin/bash
set -e

cd /tmp/security-scan

# Clone all 8 repos
for repo in teams-un-translator investrain-ai tascosaur-nlp credit-risk-api fraud-platform vendor-risk-monitor llm-router auto-healer; do
    echo "Cloning $repo..."
    /opt/homebrew/bin/gh repo clone tommieseals/$repo 2>/dev/null || true
done

echo ""
echo "=========================================="
echo "SECURITY SCAN - 8 TARGET REPOS"
echo "=========================================="
echo ""

echo "=== OpenAI API Keys (sk-...) ==="
grep -rn 'sk-[a-zA-Z0-9]\{20,\}' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' || echo "None found"

echo ""
echo "=== AWS Access Keys ==="
grep -rn 'AKIA[0-9A-Z]\{16\}' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' || echo "None found"

echo ""
echo "=== Generic API Keys (hardcoded) ==="
grep -rniE 'api[_-]?key\s*[:=]\s*["\x27][a-zA-Z0-9_-]{16,}["\x27]' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' | grep -v 'YOUR_' | grep -v 'example' | grep -v 'placeholder' | grep -v 'xxx' || echo "None found"

echo ""
echo "=== Hardcoded Tokens ==="
grep -rniE '(access_token|auth_token|bearer)\s*[:=]\s*["\x27][a-zA-Z0-9_.-]{20,}["\x27]' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' | grep -v 'YOUR_' | grep -v 'example' || echo "None found"

echo ""
echo "=== Hardcoded Passwords ==="
grep -rniE '(password|passwd|pwd|secret)\s*[:=]\s*["\x27][^"\x27]{6,}["\x27]' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' | grep -v 'YOUR_' | grep -v 'example' | grep -v 'placeholder' | grep -v 'xxx' | grep -v '\.env' | grep -v 'os.getenv' | grep -v 'os.environ' | grep -v 'process.env' || echo "None found"

echo ""
echo "=== Private Keys ==="
grep -rn 'BEGIN.*PRIVATE KEY' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' || echo "None found"

echo ""
echo "=== External Connection Strings ==="
grep -rniE '(mongodb|postgres|mysql|redis|amqp)://[^[:space:]]+' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' | grep -v localhost | grep -v '127.0.0.1' | grep -v 'example.com' | grep -v 'YOUR_' | grep -v 'redis:6379' | grep -v 'docker-compose' || echo "None found"

echo ""
echo "=== Webhook URLs ==="
grep -rniE 'https://[a-z]+\.webhook\.' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' || echo "None found"
grep -rniE 'hooks\.(slack|discord)\.com/services' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' || echo ""

echo ""
echo "=== .env files (non-example) ==="
find . -name ".env" -type f 2>/dev/null | grep -v node_modules | grep -v '\.git/' || echo "None found"

echo ""
echo "=== GitHub Tokens ==="
grep -rn 'ghp_[a-zA-Z0-9]\{36\}' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' || echo "None found"
grep -rn 'github_pat_' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' || echo ""

echo ""
echo "=== Stripe Live Keys ==="
grep -rn 'sk_live_[a-zA-Z0-9]\{24,\}' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' || echo "None found"

echo ""
echo "=== Telegram Bot Tokens ==="
grep -rniE '[0-9]{8,10}:[a-zA-Z0-9_-]{35}' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' | grep -v 'YOUR_' || echo "None found"

echo ""
echo "=== Discord Bot Tokens ==="
grep -rniE '[MN][A-Za-z\d]{23,}\.[\w-]{6}\.[\w-]{27}' . 2>/dev/null | grep -v node_modules | grep -v '\.git/' || echo "None found"

echo ""
echo "=========================================="
echo "SCAN COMPLETE"
echo "=========================================="
