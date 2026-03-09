#!/usr/bin/env python3
"""Add GitHub View Code links to portfolio project pages."""
import re

pages = {
    "tascosaur-nlp": "tommieseals/tascosaur-nlp",
    "investrain-ai": "tommieseals/investrain-ai", 
    "sidekick-paas": "tommieseals/sidekick-paas",
    "teams-translator": "tommieseals/teams-un-translator"
}

for page, repo in pages.items():
    path = f"/Users/tommie/clawd/dashboard/{page}.html"
    try:
        with open(path, "r") as f:
            content = f.read()
        
        # Check if github link already exists
        if "github.com" in content.lower():
            print(f"[OK] {page}: Already has GitHub link")
            continue
            
        # Add GitHub button
        github_btn = f'<a href="https://github.com/{repo}" target="_blank" style="background:linear-gradient(90deg,#333,#555);color:white;padding:8px 16px;border-radius:8px;text-decoration:none;font-weight:600;margin-left:10px;">View Code</a>'
        
        # Find nav-brand pattern and insert
        pattern = r'(<div class="nav-brand"><h1>[^<]+</h1>)(</div>)'
        replacement = f'\\1{github_btn}\\2'
        new_content = re.sub(pattern, replacement, content, count=1)
        
        if new_content != content:
            with open(path, "w") as f:
                f.write(new_content)
            print(f"[FIXED] {page}: Added GitHub link to {repo}")
        else:
            print(f"[WARN] {page}: Pattern not found")
    except Exception as e:
        print(f"[ERR] {page}: Error - {e}")

print("\nGitHub Links Update Complete")
