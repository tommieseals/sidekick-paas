#!/usr/bin/env python3
"""Fix the screener detection to use status instead of undefined title"""

file_path = "/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py"

with open(file_path, "r") as f:
    content = f.read()

# Fix the bug: use status instead of title
old = """        # Detect screener pages and fill Yes/No questions
        if 'screener' in title or 'qualification' in title:
            fill_screener_questions()
            time.sleep(0.5)"""

new = """        # Detect screener pages and fill Yes/No questions
        if status == "SCREENER":
            fill_screener_questions()
            time.sleep(0.5)"""

if old in content:
    content = content.replace(old, new)
    with open(file_path, "w") as f:
        f.write(content)
    print("Fixed screener detection to use status variable!")
else:
    print("Pattern not found - may already be fixed")
