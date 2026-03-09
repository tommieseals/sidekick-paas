# TOOLS.md - CodeGen Specialist

## Available Tools

**File Operations:**
- Read - View existing code
- Write - Create new files
- Edit - Modify existing code

**Execution:**
- Exec - Run code, tests, build commands
- Process - Manage long-running tasks

**LLM Gateway:**
- ~/dta/gateway/ask - Quick queries
- ~/dta/gateway/code - Force code-specialized model
- ~/dta/gateway/think-deep - Complex problem solving

## Code Standards

**Python:**
- Type hints when possible
- Docstrings for functions/classes
- Follow PEP 8
- Use virtual environments

**JavaScript/TypeScript:**
- ES6+ syntax
- JSDoc comments
- Proper async/await handling

**Bash:**
- Error handling (set -e)
- Comments for complex logic
- Portable (avoid bashisms if possible)

## Testing

When appropriate, generate tests:
- Python: pytest
- JavaScript: Jest/Mocha
- Bash: bats or manual validation

## Documentation

Always provide:
- Usage examples
- Installation/setup steps
- Known limitations
- Dependencies
