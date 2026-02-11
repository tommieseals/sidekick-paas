---
name: code-review-assistant
description: Automated code reviews with quality checks, security scans, and PR automation
---

# Code Review Assistant

Automated code review workflow:
- Quality analysis
- Security scanning
- Best practices checks
- PR automation
- Review comments

## Quick Start

```bash
# Review current changes
code-review

# Review specific PR
code-review --pr 123

# Quick check (local changes only)
code-review --quick

# Full audit (includes security)
code-review --full
```

## Features

### 1. Code Quality Analysis
- Complexity metrics
- Code smells
- Dead code detection
- Performance issues
- Style consistency

### 2. Security Scanning
- Hardcoded secrets
- SQL injection risks
- XSS vulnerabilities
- Dependency issues
- Authentication flaws

### 3. Best Practices
- Framework conventions
- Design patterns
- Error handling
- Testing coverage
- Documentation

### 4. PR Automation
- Automated comments
- Review suggestions
- Approval workflows
- CI/CD integration

## Integration

Uses:
- GitHub skill (for PRs)
- Qwen Coder 32B (for analysis)
- Security scanner (for vulnerabilities)
- Git hooks (for automation)

## Workflows

### Review Local Changes

```bash
# Check uncommitted changes
git diff | code-review --stdin

# Review last commit
git show HEAD | code-review
```

### Review Pull Request

```bash
# From GitHub PR number
code-review --pr 123

# Output includes:
# - Quality score
# - Security issues
# - Improvement suggestions
# - Automated comments
```

### Automated Reviews

Set up git hook:
```bash
# Pre-commit hook
code-review --hook pre-commit --install

# Pre-push hook
code-review --hook pre-push --install
```

## Configuration

Edit `~/clawd/config/code-review-config.json`:

```json
{
  "rules": {
    "complexity": true,
    "security": true,
    "style": true,
    "performance": true
  },
  "thresholds": {
    "complexity": 15,
    "coverage": 80,
    "score": 7.0
  },
  "autoComment": false,
  "autoApprove": false
}
```

## Quality Metrics

**Scoring System (0-10):**
- Code complexity
- Test coverage
- Documentation
- Security
- Best practices

**Thresholds:**
- 8-10: Excellent
- 6-8: Good
- 4-6: Needs work
- 0-4: Major issues

## Security Checks

**Scanned for:**
- Hardcoded credentials
- SQL injection
- XSS vulnerabilities
- Path traversal
- Insecure crypto
- Dependency issues

**Severity Levels:**
- 🚨 CRITICAL - Fix immediately
- ⚠️ HIGH - Fix before merge
- 💡 MEDIUM - Consider fixing
- ℹ️ LOW - Optional improvement

## Examples

### Quick local review
```bash
code-review --quick

# Output:
# ✅ Quality: 8.5/10
# ⚠️ Security: 1 medium issue
# 💡 Suggestions: 3
# 📝 See details: code-review.md
```

### Full PR review
```bash
code-review --pr 456 --full

# Output:
# 📊 Complexity: Low (12 avg)
# 🔒 Security: 0 issues
# ✅ Tests: 87% coverage
# 📚 Docs: Complete
# 💯 Score: 9.2/10 (Excellent)
```

### Automated comment
```bash
code-review --pr 789 --comment

# Posts GitHub comment with:
# - Quality analysis
# - Security findings
# - Suggestions
# - Overall recommendation
```

## Tips

1. **Run locally first** before PR
2. **Fix critical issues** immediately
3. **Use quick mode** for fast checks
4. **Full audit** before release
5. **Automate with hooks** for consistency

## Advanced

### Custom Rules

Add custom checks:
```bash
code-review --rule "no-console-logs" --pattern "console.log"
```

### Team Standards

Enforce team conventions:
```bash
code-review --team-rules ~/team-standards.json
```

### CI/CD Integration

```yaml
# GitHub Actions
- name: Code Review
  run: code-review --pr ${{ github.event.pull_request.number }}
```

## Troubleshooting

**False positives:**
- Adjust thresholds
- Add exceptions
- Review rules

**Slow analysis:**
- Use quick mode
- Cache dependencies
- Limit scope

**GitHub API errors:**
- Check token permissions
- Verify PR access
- Review rate limits
