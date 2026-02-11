# MCP Servers Integration - 2026-02-09 00:44 CST

## Objective
Set up Model Context Protocol (MCP) servers to extend AI agent capabilities with external tools, services, and persistent memory.

## Implementation Complete ✅

### MCP Servers Configured (5 total)

**Active Servers (4):**
1. **filesystem** (14 tools) - File operations in /Users/tommie/clawd and /Users/tommie/dta
2. **brave-search** (2 tools) - Web research via Brave Search API
3. **github** (26 tools) - GitHub operations and code management
4. **memory** (9 tools) - Persistent knowledge base across sessions

**Disabled (1):**
5. **postgres** - Database operations (needs DATABASE_URL)

### Configuration

**Config file:** `/Users/tommie/clawd/config/mcporter.json`
**CLI tool:** mcporter v0.7.3 (installed via npm)

**Testing:**
- ✅ filesystem: Listed files in quant-scraping directory
- ✅ brave-search: Web search functionality verified
- ✅ memory: Created test entity successfully
- ✅ github: Server responding (needs PAT for full access)

### Key Features

**Filesystem MCP:**
- Read/write/edit files
- List directories
- Search files by pattern
- Limited to allowed directories for security

**Brave Search MCP:**
- Web search (max 20 results per query)
- Local business search
- Uses existing Brave API key from Clawdbot config

**Memory MCP:**
- Create/store entities (facts, knowledge)
- Create relations between entities
- Search stored information
- Persistent across sessions

**GitHub MCP:**
- Repository operations
- Issue creation/management
- Pull request workflows
- File operations in repos

### Usage

**Command line:**
```bash
# From ~/clawd directory
mcporter --config config/mcporter.json list
mcporter --config config/mcporter.json call "filesystem.read_text_file(path: \"/path/to/file\")"
```

**Shortcut alias:**
```bash
alias mcp='mcporter --config /Users/tommie/clawd/config/mcporter.json'
```

### Use Cases

1. **Enhanced Research:** Brave search → extract data → store in memory
2. **Automated Documentation:** Read workflow results → generate summaries → write to files
3. **Bot Knowledge Base:** Store coordination rules, facts, relationships for bot team
4. **File Operations:** Programmatic file management for automation
5. **GitHub Integration:** Auto-create issues, PRs, manage repos

### Documentation

**Created:**
- `/Users/tommie/clawd/MCP_SERVERS_SETUP.md` (7.6 KB) - Complete guide with examples
- `/Users/tommie/clawd/test-mcp-integration.sh` - Test script for verification

**Test script results:**
```
✅ filesystem: Listed quant-scraping directory contents
✅ brave-search: Search functionality confirmed
✅ memory: Test entity created successfully
```

## Integration Potential

**With n8n workflows:**
- Use MCP tools in n8n Code nodes
- Automate research → storage → notification pipelines
- Build knowledge graphs for quant strategies

**With Clawdbot:**
- Can be called via exec tool
- Enables persistent memory across bot sessions
- Enhances research and file operation capabilities

**With bot coordination:**
- Shared memory for @tommie77bot, @look_at_deeznutszbot, @Thats_My_Bottom_Bitch_bot
- Store coordination rules and protocols
- Track bot responsibilities and status

## Next Steps

**Optional enhancements:**
1. Add GitHub personal access token for full repo access
2. Set up PostgreSQL MCP server for structured data
3. Add Playwright MCP for browser automation (mentioned in video)
4. Create custom MCP servers for specific needs
5. Integrate into n8n workflows for automation

## Status

✅ 4/5 MCP servers active and tested
✅ Configuration file created
✅ Test script verified functionality
✅ Comprehensive documentation complete
⏳ Ready for integration into workflows

## Implementation Time
**Total:** ~30 minutes (including testing and documentation)

## Notes
- MCP provides "plugin" functionality for AI agents
- Security: Filesystem access limited to allowed directories
- Memory server enables persistent knowledge across sessions
- All servers use stdio protocol (npx-based)
- Config uses existing Brave API key from Clawdbot setup
