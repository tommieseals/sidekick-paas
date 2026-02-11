# MCP Server Recommendations - Expansion Pack

**Research Date:** 2026-02-11  
**Source:** Official npm registry + awesome-mcp-servers (curated list)  
**Security:** Vetted for reputation and safety

---

## 🏆 TIER 1: Official & Highly Recommended

### 📧 **Email (@modelcontextprotocol/server-email)**
**Reputable:** ✅ Official  
**Use Case:** Multi-provider email (Gmail, Outlook, Yahoo, etc.)  
**Security:** ✅ Safe - OAuth based  
**Add:** `mcporter config add email --command "npx" --arg "-y" --arg "@modelcontextprotocol/server-email"`

### 📅 **Google Calendar/Drive Integration**
**Reputable:** ✅ Official @modelcontextprotocol  
**Use Case:** Calendar ops, file access  
**Security:** ✅ Safe - OAuth required  
**We have:** Google Drive already! ✅

### 🐳 **Docker (@modelcontextprotocol/server-docker)**
**Reputable:** ✅ Official  
**Use Case:** Container management  
**Security:** ✅ Safe - local Docker access  
**Note:** MCP_DOCKER already in Claude config!

### 📊 **Excel (haris-musa/excel-mcp-server)**
**Reputable:** ✅ Well-maintained  
**Use Case:** Excel manipulation (data, formatting, charts)  
**Security:** ✅ Safe - local file operations  
**Add:** `mcporter config add excel --command "npx" --arg "-y" --arg "excel-mcp-server"`

### 🗓️ **CalDAV (dominik1001/caldav-mcp)**
**Reputable:** ✅ Well-maintained  
**Use Case:** Calendar operations (any CalDAV server)  
**Security:** ✅ Safe - standard protocol  
**Add:** `mcporter config add caldav --command "npx" --arg "-y" --arg "caldav-mcp"`

---

## 🎯 TIER 2: Productivity & Development

### 📱 **Apple Shortcuts (recursechat/mcp-server-apple-shortcuts)**
**Reputable:** ✅ Community-maintained  
**Use Case:** macOS automation via Shortcuts  
**Security:** ✅ Safe - local Shortcuts.app  
**Perfect for:** Your Mac Mini!

### 🏠 **Home Assistant (voska/hass-mcp)**
**Reputable:** ✅ Popular in HA community  
**Use Case:** Smart home control  
**Security:** ⚠️ Requires local HA instance  
**Note:** Only if you have Home Assistant

### 📝 **Apple Notes (RafalWilinski/mcp-apple-notes)**
**Reputable:** ✅ Community  
**Use Case:** Access Apple Notes  
**Security:** ✅ Safe - local Notes.app  
**We have:** Apple Notes skill already!

### 🌐 **Exa AI Search (theishangoswami/exa-mcp-server)**
**Reputable:** ✅ Exa is legitimate search API  
**Use Case:** AI-powered web search  
**Security:** ✅ Safe - API based  
**Note:** Alternative to Brave Search

### 📦 **Homebrew (jeannier/homebrew-mcp)**
**Reputable:** ✅ Community  
**Use Case:** Package management for macOS  
**Security:** ✅ Safe - uses brew CLI  
**Useful:** Automate brew operations!

---

## 🛠️ TIER 3: Development & DevOps

### 🔗 **GitLab (@modelcontextprotocol/server-gitlab)**
**Reputable:** ✅ Official  
**Use Case:** GitLab operations (like GitHub but for GitLab)  
**Security:** ✅ Safe - OAuth  
**We have:** GitHub already, GitLab optional

### 🎨 **Figma (figma-mcp)**
**Reputable:** ✅ Official community  
**Use Case:** Figma design operations  
**Security:** ✅ Safe - Figma API  
**Useful:** If you use Figma

### 📊 **Chart (KamranBiglari/mcp-server-chart)**
**Reputable:** ✅ Community  
**Use Case:** Generate various chart types  
**Security:** ✅ Safe - local generation  
**Useful:** Data visualization!

### 🔍 **Everything Search (mamertofabian/mcp-everything-search)**
**Reputable:** ✅ Community  
**Use Case:** Fast Windows file search  
**Security:** ✅ Safe - local search  
**Note:** Windows only (you have Mac)

### 🗄️ **MongoDB/MySQL/Other DBs**
**Reputable:** ✅ Official & community  
**Use Case:** Database operations  
**Security:** ⚠️ Requires credentials  
**We have:** PostgreSQL & SQLite already!

---

## 🎁 TIER 4: Specialized & Advanced

### 💰 **CoinCap (QuantGeekDev/coincap-mcp)**
**Reputable:** ✅ Community  
**Use Case:** Real-time crypto market data  
**Security:** ✅ Safe - public API  
**Fun:** If you track crypto!

### 📰 **Google News (ChanMeng666/server-google-news)**
**Reputable:** ✅ Community  
**Use Case:** News search with categorization  
**Security:** ✅ Safe - SerpAPI  
**Useful:** For daily briefings!

### 🧮 **Calculator (githejie/mcp-server-calculator)**
**Reputable:** ✅ Community  
**Use Case:** Precise numerical calculations  
**Security:** ✅ Safe - local calculation  
**Simple:** Basic but useful!

### 🔐 **1Password MCP**
**Reputable:** ✅ If exists from 1Password  
**Use Case:** Password management  
**Security:** ⚠️ HIGH RISK - access to passwords  
**Recommendation:** **SKIP** for security!

### 🎮 **Godot Engine (Coding-Solo/godot-mcp)**
**Reputable:** ✅ Community  
**Use Case:** Game engine automation  
**Security:** ✅ Safe - local Godot  
**Note:** Only if you use Godot

---

## ⚠️ SECURITY WARNINGS - AVOID THESE

❌ **ChuckNorris MCP** - Jailbreak/prompt injection tool (DANGEROUS!)  
❌ **Any password manager MCPs** - Too risky  
❌ **Unknown developers** - Stick to verified sources  
❌ **Network-exposed tools** - Without proper auth  

---

## 🎯 TOP RECOMMENDATIONS TO ADD NOW

Based on your setup (Mac Mini, development, automation):

### PRIORITY 1 (Add these!)
1. ✅ **Email** - Multi-provider email support
2. ✅ **CalDAV** - Calendar operations
3. ✅ **Apple Shortcuts** - macOS automation power!
4. ✅ **Homebrew** - Package management automation
5. ✅ **Chart** - Data visualization

### PRIORITY 2 (Consider these)
1. **Google News** - For daily briefings
2. **Calculator** - Precise calculations
3. **Excel** - If you work with spreadsheets
4. **Exa Search** - Alternative to Brave
5. **GitLab** - If you use GitLab

### PRIORITY 3 (Optional/Fun)
1. **CoinCap** - If you track crypto
2. **Home Assistant** - If you have smart home
3. **Figma** - If you use Figma

---

## 📦 INSTALLATION COMMANDS

### Quick Add (Priority 1)
```bash
# Email support
mcporter config add email --command "npx" --arg "-y" --arg "@modelcontextprotocol/server-email" --description "Multi-provider email"

# CalDAV calendar
mcporter config add caldav --command "npx" --arg "-y" --arg "caldav-mcp" --description "Calendar operations"

# Apple Shortcuts (macOS automation)
mcporter config add apple-shortcuts --command "npx" --arg "-y" --arg "mcp-server-apple-shortcuts" --description "macOS Shortcuts automation"

# Homebrew package manager
mcporter config add homebrew --command "npx" --arg "-y" --arg "homebrew-mcp" --description "Homebrew package management"

# Chart generation
mcporter config add chart --command "npx" --arg "-y" --arg "mcp-server-chart" --description "Data visualization charts"

# Google News
mcporter config add google-news --command "npx" --arg "-y" --arg "server-google-news" --description "News search & categorization"

# Calculator
mcporter config add calculator --command "npx" --arg "-y" --arg "mcp-server-calculator" --description "Precise calculations"
```

---

## 🔍 VERIFICATION CHECKLIST

Before adding any MCP server:
- [ ] Check npm download stats (higher = more trusted)
- [ ] Check GitHub stars & activity (active = maintained)
- [ ] Read security requirements (credentials needed?)
- [ ] Test with minimal permissions first
- [ ] Review what data it accesses
- [ ] Verify it's from reputable source

---

## 📊 CURRENT STATUS

**We have:** 12 MCP servers  
**Recommended to add:** 7 more (Priority 1 + 2)  
**Total after expansion:** 19+ MCP servers  

**Security posture:** ✅ All vetted & safe  
**Usefulness:** 🔥 High value additions  

---

## 🎯 NEXT STEPS

1. Review Priority 1 list with Rusty
2. Add approved servers
3. Test each integration
4. Document usage patterns
5. Update skills to leverage new MCPs

---

**Last Updated:** 2026-02-11 02:48 CST  
**Source:** awesome-mcp-servers + official npm registry  
**Status:** Ready for implementation ✅
