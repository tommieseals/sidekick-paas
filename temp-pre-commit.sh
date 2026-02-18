#!/bin/bash
# Pre-commit hook to prevent committing secrets
# Install: cp pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

RED='\033[0;31m'
NC='\033[0m'

echo "Running security checks..."

# Patterns that might indicate secrets
PATTERNS=(
    "api[_-]?key.*=.*['\"][a-zA-Z0-9]"
    "password.*=.*['\"]"
    "secret.*=.*['\"]"
    "token.*=.*['\"][a-zA-Z0-9]"
    "sk-[a-zA-Z0-9]"
    "Bearer [a-zA-Z0-9]"
    "@gmail\.com"
    "@yahoo\.com"
    "@hotmail\.com"
)

FOUND_SECRETS=0

for file in $(git diff --cached --name-only --diff-filter=ACM); do
    for pattern in "${PATTERNS[@]}"; do
        if grep -iE "$pattern" "$file" 2>/dev/null; then
            echo -e "${RED}BLOCKED:${NC} Potential secret in $file (pattern: $pattern)"
            FOUND_SECRETS=1
        fi
    done
done

if [ $FOUND_SECRETS -eq 1 ]; then
    echo ""
    echo -e "${RED}COMMIT BLOCKED:${NC} Potential secrets detected!"
    echo "Please review the files above and:"
    echo "  1. Remove hardcoded secrets"
    echo "  2. Use environment variables instead"
    echo "  3. Add sensitive files to .gitignore"
    echo ""
    echo "To bypass (USE WITH CAUTION): git commit --no-verify"
    exit 1
fi

echo "Security check passed!"
exit 0
