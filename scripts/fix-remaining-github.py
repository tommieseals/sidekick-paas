#!/usr/bin/env python3
"""Fix remaining portfolio pages that need GitHub links."""

fixes = [
    {
        "file": "/Users/tommie/clawd/dashboard/tascosaur-nlp.html",
        "search": '<div class=nav-brand><h1>🦖 Tascosaur NLP</h1></div>',
        "replace": '<div class=nav-brand><h1>🦖 Tascosaur NLP</h1><a href="https://github.com/tommieseals/tascosaur-nlp" target="_blank" style="background:linear-gradient(90deg,#333,#555);color:white;padding:8px 16px;border-radius:8px;text-decoration:none;font-weight:600;margin-left:10px;">View Code</a></div>'
    },
    {
        "file": "/Users/tommie/clawd/dashboard/investrain-ai.html",
        "search": '<div class=nav-brand><h1>💹 Investrain AI</h1></div>',
        "replace": '<div class=nav-brand><h1>💹 Investrain AI</h1><a href="https://github.com/tommieseals/investrain-ai" target="_blank" style="background:linear-gradient(90deg,#333,#555);color:white;padding:8px 16px;border-radius:8px;text-decoration:none;font-weight:600;margin-left:10px;">View Code</a></div>'
    }
]

for fix in fixes:
    try:
        with open(fix["file"], "r") as f:
            content = f.read()
        
        if "github.com" in content:
            print(f"[OK] {fix['file'].split('/')[-1]}: Already has GitHub link")
            continue
            
        if fix["search"] in content:
            new_content = content.replace(fix["search"], fix["replace"])
            with open(fix["file"], "w") as f:
                f.write(new_content)
            print(f"[FIXED] {fix['file'].split('/')[-1]}")
        else:
            print(f"[WARN] {fix['file'].split('/')[-1]}: Search pattern not found")
    except Exception as e:
        print(f"[ERR] {fix['file'].split('/')[-1]}: {e}")

print("\nDone!")
