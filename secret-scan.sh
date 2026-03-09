#!/bin/bash
cd /tmp/security-scan

echo "=========================================="
echo "SECURITY SCAN - SEARCHING FOR SECRETS"
echo "=========================================="
echo ""

echo "=== OpenAI API Keys (sk-...) ==="
grep -rn "sk-[a-zA-Z0-9]\{20,\}" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"

echo ""
echo "=== AWS Keys ==="
grep -rn "AKIA[0-9A-Z]\{16\}" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"

echo ""
echo "=== Generic API Keys ==="
grep -rniE "(api_key|apikey|api-key)\s*[:=]\s*['\"][a-zA-Z0-9_\-]{16,}['\"]" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"

echo ""
echo "=== Tokens ==="
grep -rniE "(token|bearer|auth)\s*[:=]\s*['\"][a-zA-Z0-9_\-\.]{20,}['\"]" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"

echo ""
echo "=== Passwords ==="
grep -rniE "(password|passwd|pwd)\s*[:=]\s*['\"][^'\"]{4,}['\"]" . 2>/dev/null | grep -v node_modules | grep -v "\.git/" | grep -v "example" | grep -v "placeholder"

echo ""
echo "=== Private Keys ==="
grep -rn "BEGIN.*PRIVATE KEY" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"

echo ""
echo "=== Connection Strings ==="
grep -rniE "(mongodb|postgres|mysql|redis|amqp)://[^[:space:]]+" . 2>/dev/null | grep -v node_modules | grep -v "\.git/" | grep -v "localhost" | grep -v "example.com"

echo ""
echo "=== Webhook URLs ==="
grep -rniE "https://[a-z]+\.webhook\.(site|office|slack)" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"
grep -rniE "hooks\.(slack|discord)\.com" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"

echo ""
echo "=== .env files ==="
find . -name ".env*" -type f 2>/dev/null | grep -v node_modules | grep -v "\.git/"

echo ""
echo "=== GitHub Tokens ==="
grep -rn "ghp_[a-zA-Z0-9]\{36\}" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"
grep -rn "github_pat_[a-zA-Z0-9]\{22\}_[a-zA-Z0-9]\{59\}" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"

echo ""
echo "=== Stripe Keys ==="
grep -rn "sk_live_[a-zA-Z0-9]\{24,\}" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"
grep -rn "pk_live_[a-zA-Z0-9]\{24,\}" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"

echo ""
echo "=== JWT Secrets ==="
grep -rniE "(jwt_secret|secret_key)\s*[:=]\s*['\"][^'\"]{10,}['\"]" . 2>/dev/null | grep -v node_modules | grep -v "\.git/"

echo ""
echo "=========================================="
echo "SCAN COMPLETE"
echo "=========================================="
