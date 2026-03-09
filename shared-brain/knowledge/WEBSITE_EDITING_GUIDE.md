# 🌐 WEBSITE/DASHBOARD EDITING GUIDE

**Last Updated:** 2026-02-28
**Author:** Dell Bot (verified by Rusty)
**Status:** ✅ APPROVED METHODOLOGY

---

## 🎯 THE GOLDEN RULE

> "From now on when I want stuff done on the website, this is how I want it done." — Rusty

This methodology has been tested and proven across ALL 8 dashboard pages. **DO NOT DEVIATE.**

---

## 📍 DASHBOARD LOCATION

**Mac Mini:** `~/clawd/dashboard/`
**Live URL:** http://100.88.105.106:8080/

### File Structure
```
~/clawd/dashboard/
├── index.html           # Home page
├── legion.html          # Legion job system
├── taskbot.html         # TaskBot SaaS
├── pharma.html          # Arbitrage Pharma
├── fort-knox.html       # Backup system
├── brain.html           # Shared Brain hub
├── swarm.html           # Worker swarm
├── fiverr.html          # Fiverr business
├── project-vault.html   # Trading system
├── docs/                # Documentation pages
│   ├── index.html
│   ├── getting-started.html
│   ├── architecture.html
│   ├── api-reference.html
│   ├── skills.html
│   └── troubleshooting.html
├── data/                # JSON data files
│   └── swarm-status.json
└── assets/              # Images, icons
```

---

## 🏗️ PAGE STRUCTURE (TWO SECTIONS)

Every dashboard page has TWO distinct sections:

### 1️⃣ TOP SECTION: React/SVG Tabbed Diagrams

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        /* Diagram styles here */
    </style>
</head>
<body>
    <nav><!-- Navigation --></nav>
    <div id="root"></div>  <!-- React diagrams render here -->
    
    <script type="text/babel">
        // React components for diagrams
        // Tab switching logic
        // SVG with viewBox for responsive scaling
    </script>
```

### 2️⃣ BOTTOM SECTION: Info Cards (Plain HTML/CSS)

```html
    <!-- INFO SECTION (comes AFTER React script) -->
    <style>
        /* Info card styles */
    </style>
    <div class="info-section">
        <!-- Cards grid -->
    </div>
    <script>
        /* API fetching if needed */
    </script>
</body>
</html>
```

---

## 🎨 SVG DIAGRAM METHODOLOGY

### ✅ DO THIS (CORRECT)

```jsx
// Use viewBox for responsive scaling
<svg viewBox="0 0 1200 800" className="diagram-svg">

// Card nodes with gradient top bars
<g transform="translate(100, 100)">
    <rect width="200" height="120" rx="12" fill="white" 
          filter="url(#shadow)"/>
    <rect width="200" height="8" rx="4" 
          fill="url(#blueGradient)"/>
    <circle cx="30" cy="50" r="20" fill="rgba(102,126,234,0.1)"/>
    <text x="30" y="55" textAnchor="middle">🏗️</text>
    <text x="100" y="50" textAnchor="middle" 
          fontWeight="600">Node Title</text>
    <text x="100" y="70" textAnchor="middle" 
          fill="#666" fontSize="12">Description</text>
</g>

// Animated connector lines
<path d="M 200 160 Q 250 160 300 200" 
      stroke="#667eea" strokeWidth="2" 
      strokeDasharray="6,4" fill="none">
    <animate attributeName="stroke-dashoffset" 
             from="20" to="0" dur="1s" 
             repeatCount="indefinite"/>
</path>
```

### ❌ DO NOT DO THIS (WRONG)

```jsx
// ❌ Pixel positioning (breaks on mobile)
<div style="position: absolute; left: 150px; top: 200px">

// ❌ Mermaid.js (too basic looking)
graph TD
    A --> B

// ❌ Fancy CSS borders as shortcut
<div class="fancy-border-diagram">
```

### Tab Navigation Pattern

```jsx
const [activeTab, setActiveTab] = useState(0);

const tabs = [
    { name: '🏗️ Architecture', component: <ArchitectureDiagram /> },
    { name: '🔄 Pipeline', component: <PipelineDiagram /> },
    { name: '⚔️ Departments', component: <DepartmentsDiagram /> },
    { name: '📊 Data Flow', component: <DataFlowDiagram /> }
];

return (
    <div className="diagram-container">
        <div className="tab-bar">
            {tabs.map((tab, i) => (
                <button 
                    key={i}
                    className={`tab ${activeTab === i ? 'active' : ''}`}
                    onClick={() => setActiveTab(i)}
                >
                    {tab.name}
                </button>
            ))}
        </div>
        <div className="diagram-content">
            {tabs[activeTab].component}
        </div>
    </div>
);
```

---

## 📊 INFO CARDS METHODOLOGY

### Card Style Template

```css
.info-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
}

.info-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 16px 16px 0 0;
}

.info-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(102, 126, 234, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}
```

### Responsive Grid

```css
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
}
```

### Status Indicators with Pulse

```css
.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

.status-online {
    background: #48bb78;
    animation: pulse 2s infinite;
}

.status-offline {
    background: #e53e3e;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

---

## 🎨 COLOR PALETTE (USE THESE)

| Color | Hex | Use For |
|-------|-----|---------|
| Blue | `#667eea` | Primary, links, headers |
| Purple | `#764ba2` | Gradients, accents |
| Red/Pink | `#e94560` | Alerts, active states |
| Green | `#48bb78` | Success, online status |
| Orange | `#ed8936` | Warnings |
| Teal | `#38b2ac` | Info, secondary |
| Dark Gray | `#2d3748` | Text |
| Light Gray | `#718096` | Secondary text |

### Gradient Presets

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Success gradient */
background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);

/* Alert gradient */
background: linear-gradient(135deg, #e94560 0%, #c53030 100%);

/* Info gradient */
background: linear-gradient(135deg, #38b2ac 0%, #319795 100%);
```

---

## 📱 NAVIGATION (CRITICAL!)

### Standard Navigation Template

```html
<nav>
    <div class="nav-brand">
        <a href="index.html">🤖 Clawd Dashboard</a>
    </div>
    <button class="hamburger" onclick="toggleNav()">☰</button>
    <div class="nav-links" id="navLinks">
        <a href="index.html" class="nav-link">🏠 Home</a>
        <a href="legion.html" class="nav-link">🏴 Legion</a>
        <a href="taskbot.html" class="nav-link">📋 TaskBot</a>
        <a href="pharma.html" class="nav-link">💊 Pharma</a>
        <a href="fort-knox.html" class="nav-link">🏰 Fort Knox</a>
        <a href="brain.html" class="nav-link">🧠 Brain</a>
        <a href="swarm.html" class="nav-link">🐝 Swarm</a>
        <a href="fiverr.html" class="nav-link">💼 Fiverr</a>
        <a href="project-vault.html" class="nav-link">💰 Vault</a>
        <a href="docs/index.html" class="nav-link">📚 Docs</a>
    </div>
</nav>

<script>
function toggleNav() {
    const nav = document.getElementById('navLinks');
    nav.classList.toggle('active');
}
</script>
```

### ⚠️ HAMBURGER MENU RULES

The hamburger menu MUST have:
1. `id="navLinks"` on the nav-links div
2. `class="nav-link"` on each anchor tag
3. JavaScript function `toggleNav()` that targets by ID

**If hamburger breaks:** Check these three things FIRST.

---

## 🔄 EDITING WORKFLOW

### Step 1: SSH to Mac Mini
```bash
ssh tommie@100.88.105.106
cd ~/clawd/dashboard
```

### Step 2: Edit the file
```bash
# Use nano or vim
nano legion.html

# Or from remote machine
scp local-file.html tommie@100.88.105.106:~/clawd/dashboard/
```

### Step 3: Test locally
Open in browser: `http://100.88.105.106:8080/filename.html`

### Step 4: Test mobile
- Use browser dev tools (F12 → mobile view)
- Or test on actual phone

### Step 5: Verify navigation
- Click hamburger menu
- Check all nav links work
- Test on mobile

---

## ⚠️ CRITICAL RULES

### 1. NEVER TOUCH WORKING DIAGRAMS
When adding info cards below diagrams:
- **APPEND** content below the existing `</script>` tag
- **NEVER** modify the React/SVG diagram code
- Test that tabs still work after changes

### 2. ALWAYS TEST MOBILE
Before declaring "done":
- Open dev tools (F12)
- Click mobile view icon
- Test hamburger menu
- Verify cards stack properly

### 3. USE VIEWBOX, NOT PIXELS
```jsx
// ✅ CORRECT - responsive
<svg viewBox="0 0 1200 800">

// ❌ WRONG - breaks on mobile  
<svg width="1200" height="800">
```

### 4. POST-DEPLOY CHECK
After any dashboard edit, verify:
```bash
# Nav consistency
python3 ~/clawd/scripts/fix-dashboard-nav.py

# Or manual check
curl -s http://100.88.105.106:8080/legion.html | grep -c "nav-link"
# Should return 10 (one per nav item)
```

---

## 🛠️ TROUBLESHOOTING

### Hamburger menu doesn't work
```bash
# Check for id="navLinks"
grep 'id="navLinks"' ~/clawd/dashboard/*.html

# Run fix script
python3 ~/clawd/scripts/fix-dashboard-nav.py
```

### Diagrams not showing
1. Check browser console (F12 → Console)
2. Look for React/Babel errors
3. Verify `<div id="root">` exists
4. Check script type is `text/babel`

### Cards not responsive
```css
/* Ensure grid uses auto-fit */
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
```

### Colors don't match
Use the exact hex codes from the color palette above.

---

## 📋 CHECKLIST BEFORE SHIPPING

- [ ] Diagrams render correctly
- [ ] Tab switching works
- [ ] Info cards display properly
- [ ] Hamburger menu works on mobile
- [ ] All nav links present and working
- [ ] Colors match palette
- [ ] No console errors
- [ ] Tested on mobile view

---

## 🤝 ASKING FOR HELP

If stuck, check:
1. This guide first
2. `~/clawd/dashboard/` for working examples
3. SOUL.md for the original methodology notes

**Working examples to reference:**
- `legion.html` - Best example of full implementation
- `brain.html` - Good card layout example
- `swarm.html` - Good real-time data example

---

*This methodology was developed through trial and error across 8 dashboard pages. It works. Trust it.*
