# MCP Servers Setup - Complete Guide

**Setup Date:** 2026-02-09 00:44 CST  
**Status:** ✅ Configured and operational

---

## 🎯 What is MCP?

**Model Context Protocol (MCP)** enables AI agents to:
- Access external tools and services
- Interact with filesystems, databases, APIs
- Maintain persistent memory across sessions
- Automate complex workflows

Think of it as "plugins for AI agents" - extending capabilities beyond basic chat.

---

## 📦 Configured MCP Servers

### 1. **filesystem** (14 tools)
**Purpose:** File operations in allowed directories  
**Access:** `/Users/tommie/clawd`, `/Users/tommie/dta`

**Key tools:**
- `read_text_file` - Read file contents
- `write_file` - Write/create files
- `edit_file` - Modify existing files
- `list_directory` - Browse directories
- `search_files` - Find files by pattern
- `get_file_info` - File metadata

**Example:**
```bash
mcporter call "filesystem.read_text_file(path: \"/Users/tommie/clawd/MEMORY.md\")"
```

### 2. **brave-search** (2 tools)
**Purpose:** Web research via Brave Search API  
**API Key:** Configured (BSAIuo5ck...)

**Tools:**
- `brave_web_search` - General web search (max 20 results)
- `brave_local_search` - Local business/places search

**Example:**
```bash
mcporter call "brave-search.brave_web_search(query: \"quantitative trading strategies 2026\", count: 10)"
```

### 3. **github** (26 tools)
**Purpose:** GitHub operations and code management  
**Status:** Configured (needs personal access token for full functionality)

**Key tools:**
- `create_repository` - Create new repos
- `create_issue` - File issues
- `create_pull_request` - Submit PRs
- `search_repositories` - Find repos
- `get_file_contents` - Read files from repos

**Setup:**
```bash
# Add GitHub token to config:
# Edit /Users/tommie/clawd/config/mcporter.json
# Set GITHUB_PERSONAL_ACCESS_TOKEN
```

### 4. **memory** (9 tools)
**Purpose:** Persistent memory across AI sessions  
**Status:** ✅ Working

**Key tools:**
- `create_entities` - Store facts/knowledge
- `create_relations` - Link entities
- `search_entities` - Retrieve information
- `delete_entity` - Remove outdated info

**Example:**
```bash
mcporter call 'memory.create_entities' --args '{"entities":[{"name":"quant_scraper","entityType":"project","observations":["Scrapes Barclays, JPMorgan, Goldman Sachs 3x daily"]}]}'
```

### 5. **postgres** (disabled)
**Purpose:** PostgreSQL database operations  
**Status:** Offline (no DATABASE_URL configured)

**To enable:** Add DATABASE_URL to config

---

## 🚀 Using MCP Servers

### Command Line (mcporter CLI)

**Basic usage:**
```bash
# List all servers
mcporter --config ~/clawd/config/mcporter.json list

# List tools for a server
mcporter --config ~/clawd/config/mcporter.json list filesystem --schema

# Call a tool
mcporter --config ~/clawd/config/mcporter.json call "filesystem.read_text_file(path: \"/Users/tommie/clawd/MEMORY.md\")"

# With JSON args
mcporter --config ~/clawd/config/mcporter.json call memory.create_entities --args '{"entities":[...]}'
```

**Shortcut (from ~/clawd directory):**
```bash
alias mcp='mcporter --config config/mcporter.json'
mcp list
mcp call "brave-search.brave_web_search(query: \"AI news\")"
```

### Integration with Clawdbot

MCP servers can be integrated into Clawdbot workflows for:
1. **Research automation** - Brave search → summarize → store in memory
2. **File operations** - Read/write/edit files programmatically
3. **Knowledge base** - Persistent memory for bot coordination
4. **GitHub automation** - Auto-create issues, PRs, repos

---

## 📁 Configuration File

**Location:** `/Users/tommie/clawd/config/mcporter.json`

**Structure:**
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name", ...],
      "env": {
        "API_KEY": "value"
      },
      "description": "What it does"
    }
  }
}
```

---

## 🔧 Common Operations

### Research & Save
```bash
# 1. Search for information
mcp call "brave-search.brave_web_search(query: \"JPMorgan quantitative strategies\")"

# 2. Save to memory
mcp call 'memory.create_entities' --args '{"entities":[{"name":"jpmorgan_qis","entityType":"research","observations":["Found new QIS insights..."]}]}'
```

### File Operations
```bash
# Read a file
mcp call "filesystem.read_text_file(path: \"/Users/tommie/dta/quant-scraping/history.json\")"

# List directory
mcp call "filesystem.list_directory(path: \"/Users/tommie/dta/quant-scraping\")"

# Search files
mcp call "filesystem.search_files(path: \"/Users/tommie/clawd\", pattern: \"*.md\")"
```

### Knowledge Management
```bash
# Create entity
mcp call 'memory.create_entities' --args '{"entities":[{"name":"barclays_qps","entityType":"strategy","observations":["Duration Times Spread (DTS) is key metric"]}]}'

# Search memory
mcp call 'memory.search_entities' --args '{"query":"quantitative"}'

# Create relation
mcp call 'memory.create_relations' --args '{"relations":[{"from":"barclays_qps","to":"quant_scraper","relationType":"tracked_by"}]}'
```

---

## 🎨 Use Cases for Your Setup

### 1. Enhanced Quant Research
```bash
# Search for latest quant strategies
mcp call "brave-search.brave_web_search(query: \"goldman sachs systematic trading 2026\")"

# Store findings
mcp call 'memory.create_entities' --args '{"entities":[{"name":"gs_sts_2026","entityType":"research","observations":["New STS indices launched"]}]}'
```

### 2. Automated Documentation
```bash
# Read workflow results
mcp call "filesystem.read_text_file(path: \"/Users/tommie/dta/quant-scraping/history.json\")"

# Write summary
mcp call 'filesystem.write_file' --args '{"path":"/Users/tommie/dta/summaries/weekly-summary.md","content":"# Week Summary..."}'
```

### 3. Bot Coordination Knowledge Base
```bash
# Store bot coordination rules
mcp call 'memory.create_entities' --args '{"entities":[{"name":"bot_protocol","entityType":"rule","observations":["@tommie77bot handles infrastructure","@look_at_deeznutszbot coordinates"]}]}'

# Query when needed
mcp call 'memory.search_entities' --args '{"query":"bot coordination"}'
```

---

## 🔐 Security Notes

**Filesystem access:**
- Limited to `/Users/tommie/clawd` and `/Users/tommie/dta`
- Cannot access system files or other user directories

**API Keys:**
- Stored in config file (not version controlled)
- Brave Search API: Pre-configured
- GitHub: Needs your personal token

**Best practices:**
- Don't commit config file with secrets to git
- Review MCP tool calls before running
- Test with dry-run when possible

---

## 📊 Status Summary

| Server | Status | Tools | Use Case |
|--------|--------|-------|----------|
| filesystem | ✅ Active | 14 | File operations |
| brave-search | ✅ Active | 2 | Web research |
| github | ✅ Active | 26 | Code management |
| memory | ✅ Active | 9 | Knowledge base |
| postgres | ⏸️ Disabled | - | Database (future) |

---

## 🚀 Next Steps

**Immediate:**
1. ✅ Servers configured and tested
2. ✅ Basic operations verified
3. Create GitHub personal access token (optional)
4. Integrate with n8n workflows

**Future enhancements:**
1. Add Playwright MCP for browser automation
2. Set up PostgreSQL for structured data
3. Create custom MCP servers for specific needs
4. Build automation workflows combining multiple MCP servers

---

## 📚 Resources

- **mcporter docs:** http://mcporter.dev
- **MCP protocol:** https://modelcontextprotocol.io
- **Official servers:** https://github.com/modelcontextprotocol/servers
- **Config file:** `/Users/tommie/clawd/config/mcporter.json`

---

**Setup complete! MCP servers ready to supercharge your AI agents.** 🤖✨
