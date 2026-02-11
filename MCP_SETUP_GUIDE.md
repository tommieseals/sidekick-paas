# MCP & Docker Setup Guide
**Last Updated:** 2026-02-09

## 🎯 Overview
Complete working setup with Docker, n8n, and MCP servers integrated with Clawdbot for memory/storage operations.

---

## 📦 What's Running

### Local Services

#### 1. **Docker Desktop** ✅
- **Status:** Running
- **Container:** n8n
- **Port:** 5678
- **Access:** http://localhost:5678
- **Purpose:** Workflow automation platform

**Check status:**
```bash
docker ps | grep n8n
```

**Restart if needed:**
```bash
docker restart n8n
```

#### 2. **MCP Servers** ✅
Managed via mcporter, configured in `/Users/tommie/clawd/config/mcporter.json`

| Server | Status | Transport | Tools | Purpose |
|--------|--------|-----------|-------|---------|
| **memory** | ✅ Healthy | stdio | 9 | Knowledge graph-based persistent memory |
| **filesystem** | ✅ Healthy | stdio | 14 | Secure file operations |
| **brave-search** | ✅ Healthy | stdio | 2 | Web search integration |
| **github** | ✅ Healthy | stdio | 26 | GitHub operations |
| **postgres** | ⚠️ Offline | stdio | - | Database (disabled) |

**Check all servers:**
```bash
mcporter list
```

**Check specific server:**
```bash
mcporter list memory --schema
```

---

## 🔧 MCP Configuration

### mcporter Skill Integration
The mcporter skill is loaded in Clawdbot and provides direct access to all MCP servers.

**Skill location:** `/opt/homebrew/lib/node_modules/clawdbot/skills/mcporter/`

**Verify skill is loaded:**
```bash
clawdbot skills list | grep mcporter
```

### Memory Server (Primary Storage)

The memory MCP server provides a knowledge graph for persistent storage across sessions.

#### Available Tools:
1. `create_entities` - Create new entities with observations
2. `create_relations` - Link entities together
3. `add_observations` - Add notes to existing entities
4. `delete_entities` - Remove entities
5. `delete_observations` - Remove specific notes
6. `delete_relations` - Remove relationships
7. `read_graph` - Read entire knowledge graph
8. `search_nodes` - Search by query
9. `open_nodes` - Get specific entities by name

#### Usage Examples:

**Read all memory:**
```bash
mcporter call memory.read_graph --output json
```

**Search memory:**
```bash
mcporter call 'memory.search_nodes(query: "docker")' --output json
```

**Create new memory entry:**
```bash
mcporter call 'memory.create_entities(entities: [{"name": "my_project", "entityType": "project", "observations": ["Started on 2026-02-09", "Using Docker and MCP"]}])' --output json
```

**Add observations to existing entity:**
```bash
mcporter call 'memory.add_observations(observations: [{"entityName": "my_project", "contents": ["Completed setup phase", "Ready for development"]}])' --output json
```

**Create relationships:**
```bash
mcporter call 'memory.create_relations(relations: [{"from": "my_project", "to": "docker_n8n_setup_2026", "relationType": "depends_on"}])' --output json
```

---

## 🧠 Using MCP Through Clawdbot

Since mcporter is loaded as a Clawdbot skill, you can use it conversationally:

**Examples:**
- "Use mcporter to check what's in my memory"
- "Store this information in MCP memory: [your info]"
- "Search my MCP memory for docker-related items"
- "Show me the knowledge graph"

Clawdbot will automatically invoke the mcporter skill and MCP servers.

---

## 🌐 Hosted Alternatives

### Current Setup
✅ **All services running locally** - No external dependencies (except Brave Search API)

### Recommended Hosted Options (Optional)

#### 1. **Supabase MCP** 
- **What:** Hosted PostgreSQL database with MCP interface
- **Use Case:** Structured data, real-time sync, authentication
- **Deployment:** Cloud-hosted (supabase.com)
- **Integration:** Would replace/complement local postgres MCP server
- **Cost:** Free tier available

#### 2. **AWS Bedrock AgentCore**
- **What:** Enterprise MCP orchestration platform
- **Use Case:** Multi-agent systems, enterprise deployments
- **Deployment:** AWS cloud
- **Integration:** Advanced context management, session memory
- **Cost:** Pay-per-use AWS pricing

#### 3. **Chroma**
- **What:** Vector database with MCP support
- **Use Case:** Semantic search, embeddings, RAG applications
- **Deployment:** Self-hosted or cloud
- **Integration:** Persistent/ephemeral storage for embeddings
- **Cost:** Free (self-hosted), paid (cloud)

### Recommendation
**Current local setup is sufficient for most use cases.** Consider hosted options if you need:
- Cross-device synchronization
- Team collaboration
- Enterprise-grade reliability
- Vector/semantic search capabilities

---

## 🔍 Verification & Testing

### Test n8n Accessibility
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5678
# Expected: 200
```

### Test MCP Memory Operations
```bash
# Read current knowledge graph
mcporter call memory.read_graph --output json | jq '.entities | length'

# Search for entries
mcporter call 'memory.search_nodes(query: "setup")' --output json

# Create test entry
mcporter call 'memory.create_entities(entities: [{"name": "test_entry", "entityType": "test", "observations": ["Test observation"]}])' --output json
```

### Verify Clawdbot Integration
```bash
clawdbot skills list | grep mcporter
# Expected: ✓ ready │ 📦 mcporter │ ...
```

---

## 📝 Quick Reference

### Start/Stop Services

**Docker Desktop:**
```bash
open -a "Docker Desktop"  # Start
# Stop via Docker Desktop app
```

**n8n container:**
```bash
docker start n8n
docker stop n8n
docker restart n8n
```

**Check everything:**
```bash
# Docker
docker ps | grep n8n

# MCP servers
mcporter list

# Clawdbot skills
clawdbot skills list | grep mcporter
```

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| `mcporter.json` | MCP server configurations | `/Users/tommie/clawd/config/mcporter.json` |
| `clawdbot.json` | Clawdbot main config | `/Users/tommie/.clawdbot/clawdbot.json` |

---

## 🚨 Troubleshooting

### n8n not accessible
```bash
docker ps -a | grep n8n  # Check if running
docker logs n8n  # Check logs
docker restart n8n  # Restart
```

### MCP server offline
```bash
mcporter list  # Check status
# Servers start automatically when called (stdio transport)
```

### mcporter skill not working
```bash
clawdbot skills list | grep mcporter  # Verify loaded
which mcporter  # Verify installed
mcporter --version  # Check version
```

---

## 💾 Current Memory Storage

The MCP memory server currently contains:
- Docker/n8n setup information
- Research notes (JPMorgan, Goldman Sachs quant strategies)
- Configuration milestones

**View current memory:**
```bash
mcporter call memory.read_graph --output json | jq '.'
```

---

## 🎓 Learning Resources

- **MCP Official Docs:** https://github.com/modelcontextprotocol/servers
- **mcporter Homepage:** http://mcporter.dev
- **n8n Documentation:** https://docs.n8n.io/
- **Clawdbot Skills:** `/opt/homebrew/lib/node_modules/clawdbot/skills/`

---

## ✅ Setup Complete!

**What's working:**
- ✅ Docker Desktop running
- ✅ n8n container accessible (port 5678)
- ✅ MCP servers configured and operational
- ✅ mcporter skill loaded in Clawdbot
- ✅ Memory/storage operations verified
- ✅ Knowledge graph functional

**Next steps:**
- Use n8n for workflow automation: http://localhost:5678
- Store information in MCP memory via Clawdbot conversations
- Explore other MCP servers (filesystem, github, brave-search)
- Consider hosted alternatives if needed for team collaboration
