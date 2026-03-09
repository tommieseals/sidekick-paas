#!/usr/bin/env python3
"""Fix the broken flush=True insertions"""

file_path = "/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py"

with open(file_path, "r") as f:
    content = f.read()

# Remove all the bad flush=True insertions
# Pattern: something, flush=True) should become something)
import re

# Fix cases like: len(jobs, flush=True) -> len(jobs)
content = re.sub(r'(\w+)\(([^)]+), flush=True\)', r'\1(\2)', content)

# Fix cases like: dict.get(status, '❓', flush=True) -> dict.get(status, '❓')
content = re.sub(r"\.get\(([^)]+), flush=True\)", r'.get(\1)', content)

# Remove any remaining , flush=True) patterns
content = content.replace(', flush=True)', ')')

# Remove stray flush=True) that got doubled
content = content.replace('flush=True)', ')')

# Fix double )) that might have been created
content = re.sub(r'\)\)+$', ')', content, flags=re.MULTILINE)

with open(file_path, "w") as f:
    f.write(content)

print("✅ Fixed flush=True bugs")
