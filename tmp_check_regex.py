import re

# The regex from post-deploy.py
pattern = r'<div\s+class="nav-links"[^>]*>.*?</div>'

# Test case: nested divs (common in nav structures)
test = '<div class="nav-links"><div class="inner">x</div></div>'

match = re.search(pattern, test, re.DOTALL)
if match:
    print("Matched:", repr(match.group(0)))
    print()
    print("PROBLEM: The regex matched only to the FIRST </div>!")
    print("This means nested divs get CORRUPTED!")
    print()
    print("Original:", test)
    print("Leftover after replacement: </div>")
