# Dashboard Integration Guide

## Adding New Pages to the Hamburger Menu

When you create a new dashboard page at `~/clawd/dashboard/`, you need to add it to the hamburger navigation menu on **ALL** other dashboard pages so users can navigate to it.

### ⚠️ CRITICAL: The Canonical Nav List

There's a **post-deploy.py** script that enforces a canonical nav list across ALL dashboard files. If you just edit HTML files manually, **your changes will be overwritten** the next time this script runs.

**You MUST add your page to the canonical list in:**
```
~/clawd/scripts/post-deploy.py
```

Look for `CANONICAL_NAV_LINKS` and add your entry:
```python
{"href": "/your-page.html", "text": "🆕 YourPage", "icon": "🆕"},
```

Then run:
```bash
python3 ~/clawd/scripts/post-deploy.py
```

This will propagate your link to ALL dashboard files automatically.

### The Problem
Each dashboard page has its own embedded navigation. Creating a new HTML file doesn't automatically add it to other pages' menus. Plus, a post-deploy script enforces a canonical nav list.

### The Solution

#### Step 1: Create Your Page
Put your HTML file in `~/clawd/dashboard/your-page.html`

Make sure it includes the standard nav structure:
```html
<nav class="nav-bar">
    <div class="nav-brand"><h1>📚 Your Title</h1></div>
    <button class="hamburger" onclick="toggleNav()">☰</button>
    <div class="nav-links" id="navLinks">
        <!-- Copy existing nav links from another page -->
        <a href="/" class="nav-link">Dashboard</a>
        <a href="/infrastructure.html" class="nav-link">Infrastructure</a>
        <!-- ... all the other links ... -->
        <a href="/your-page.html" class="nav-link">🆕 Your Page</a>
        <a href="/docs/" class="nav-link">Docs</a>
    </div>
</nav>
```

And include the toggle script:
```html
<script>
function toggleNav() {
    const nav = document.getElementById('navLinks');
    nav.classList.toggle('active');
}
</script>
```

And the mobile CSS:
```css
@media (max-width: 768px) {
    .hamburger { display: block; }
    .nav-links {
        display: none;
        width: 100%;
        flex-direction: column;
    }
    .nav-links.active {
        display: flex;
    }
    .nav-bar { flex-wrap: wrap; }
}
```

#### Step 2: Add Your Link to ALL Other Pages

Use this Python script on Mac Mini:

```python
#!/usr/bin/env python3
"""Add a new nav link to all dashboard pages"""
import os
import re

dashboard_dir = os.path.expanduser('~/clawd/dashboard')

# List of main dashboard pages that have nav menus
files = [
    'index.html', 'infrastructure.html', 'agents.html', 'projects.html', 
    'apis.html', 'skills.html', 'tools.html', 'achievements.html',
    'swarm-monitor.html', 'arbitrage-pharma.html', 'project-vault.html',
    'taskbot.html', 'legion.html', 'fiverr.html', 'fort-knox.html', 
    'shared-brain.html', 'borbott-army.html'
    # Add your new page here too!
]

# Your new link (customize this)
new_link = '<a href="/your-page.html" class="nav-link">🆕 YourPage</a>'
link_id = 'your-page.html'  # For checking if already exists

for fname in files:
    fpath = os.path.join(dashboard_dir, fname)
    if not os.path.exists(fpath):
        print(f'⚠️ {fname} not found')
        continue
    
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if link_id in content:
        print(f'✓ {fname} already has link')
        continue
    
    # Insert before Docs link (last item)
    pattern = r'(<a href="/docs/"[^>]*>Docs</a>)'
    
    if re.search(pattern, content):
        replacement = new_link + '\n                ' + r'\1'
        content = re.sub(pattern, replacement, content)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'✅ {fname} updated')
    else:
        print(f'❌ {fname} - could not find Docs link')

print('\nDone!')
```

Save as `~/clawd/dashboard/add_nav.py`, customize the `new_link` and `link_id`, then run:
```bash
python3 ~/clawd/dashboard/add_nav.py
```

### Current Navigation Order (as of 2026-02-28)

1. Dashboard (/)
2. Infrastructure
3. Agents
4. Projects
5. APIs
6. Skills
7. Tools
8. Achievements
9. 🐝 Swarm
10. 💊 Pharma
11. 💰 Vault
12. 📋 TaskBot
13. 🏴 Legion
14. 💼 Fiverr
15. 🏰 Fort Knox
16. 🧠 Brain
17. 📚 BorbottArmy ← Added 2026-02-28
18. Docs (always last)

### Emoji Conventions

Use emojis in the nav link text for visual distinction:
- Projects/tools: Descriptive emoji (📚, 🏗️, 💊)
- System pages: No emoji (Dashboard, Infrastructure, APIs)
- Special features: Relevant emoji (🐝 Swarm, 🧠 Brain)

### Common Mistakes

1. **NOT updating post-deploy.py** - This is the #1 mistake! Your manual edits WILL be overwritten
2. **Only adding to your new page** - You must add to ALL pages (or use post-deploy.py)
3. **Forgetting mobile CSS** - The hamburger won't work without `.nav-links.active { display: flex; }`
4. **Missing toggleNav()** - The hamburger button needs this JavaScript function
5. **Wrong insertion point** - Insert before Docs, not at random locations

### Quick Checklist

- [ ] Page created with full nav structure
- [ ] toggleNav() script included
- [ ] Mobile CSS rules included
- [ ] Link added to ALL other dashboard pages
- [ ] Tested hamburger menu on mobile viewport
- [ ] Page loads correctly at http://100.88.105.106:8080/your-page.html

---
*Last updated: 2026-02-28 by Peach (main session agent)*
