# Dashboard File Structure

## Location
```
/Users/tommie/clawd/dashboard/
```

## Key Files

```
dashboard/
├── index.html              # Main dashboard home
├── server.js               # Node.js server (HTTPS)
├── package.json            # Node dependencies
│
├── # Core Pages
├── infrastructure.html     # Infrastructure status
├── agents.html             # Agent management
├── apis.html               # API integrations
├── projects.html           # Project list
├── legion.html             # Project Legion status
│
├── # Project Pages
├── arbitrage-pharma.html   # Pharma arbitrage
├── taskbot.html            # TaskBot
├── terminator.html         # TerminatorBot
├── project-vault.html      # Trading vault
├── swarm-monitor.html      # Specialist swarm
│
├── # Utility Pages
├── diagnostics.html        # System diagnostics
├── memory.html             # Memory viewer
├── sessions.html           # Session manager
├── tools.html              # Tools dashboard
│
├── # Data Files
├── status.json             # Status data
├── skills-data.json        # Skills data
│
├── # Subdirectories
├── api/                    # API endpoints
├── data/                   # Data files
├── infra-sections/         # Infrastructure sections
└── ssl/                    # SSL certificates
```

## Total Files
- 50+ HTML pages
- Multiple JSON data files
- Node.js server with HTTPS support

## Server Options

**Option 1: Python (Simple)**
```bash
cd /Users/tommie/clawd/dashboard
python3 -m http.server 8080
```

**Option 2: Node.js (HTTPS)**
```bash
cd /Users/tommie/clawd/dashboard
node server.js
# Runs on port 8443 with SSL
```
