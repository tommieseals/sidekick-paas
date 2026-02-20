# Tascosaur NLP - Design Document

## 🎯 Project Overview

**Tascosaur** is an intent-based task management system where tasks are created through natural language, not forms. Users type commands like "Create a high-priority bug ticket for the login page" and the system parses it into structured task data.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TASCOSAUR NLP ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│  │   Frontend   │     │   NLP Engine     │     │   Data Store     │   │
│  │              │     │                  │     │                  │   │
│  │  React +     │────▶│  Intent Parser   │────▶│   SQLite/        │   │
│  │  Kanban UI   │     │  Entity Extract  │     │   PostgreSQL     │   │
│  │              │◀────│  LLM Fallback    │◀────│                  │   │
│  └──────────────┘     └──────────────────┘     └──────────────────┘   │
│         │                     │                         │             │
│         │              ┌──────┴──────┐                  │             │
│         │              │             │                  │             │
│         │         ┌────▼────┐  ┌─────▼─────┐           │             │
│         │         │ Regex   │  │  Ollama   │           │             │
│         │         │ Parser  │  │  LLM      │           │             │
│         │         │ (Fast)  │  │ (Complex) │           │             │
│         │         └─────────┘  └───────────┘           │             │
│         │                                               │             │
│         └───────────────────────────────────────────────┘             │
│                          WebSocket (Real-time)                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## 🧠 NLP Pipeline

### Stage 1: Intent Classification
Detect what the user wants to do:
- `CREATE` - New task
- `UPDATE` - Modify existing
- `DELETE` - Remove task
- `QUERY` - Search/filter
- `MOVE` - Change status

### Stage 2: Entity Extraction
Extract structured data from natural language:

| Entity | Examples | Extraction Method |
|--------|----------|-------------------|
| Priority | "high-priority", "urgent", "P1" | Keyword matching |
| Tags | "bug", "feature", "frontend" | Keyword + context |
| Title | Main subject of sentence | NLP chunking |
| Assignee | "@john", "assign to Sarah" | Pattern matching |
| Due Date | "by Friday", "next week" | Date parser (chrono) |
| Status | "in progress", "done", "blocked" | Keyword matching |

### Stage 3: LLM Fallback
For complex or ambiguous inputs, route to local Ollama (qwen2.5:3b) for enhanced understanding.

## 📦 Tech Stack

### Backend (Node.js/Express)
- **Express.js** - REST API
- **Compromise.js** - Lightweight NLP
- **Chrono-node** - Natural date parsing
- **Socket.io** - Real-time updates
- **SQLite** - Local database (portable)
- **Ollama API** - LLM fallback

### Frontend (React + Vite)
- **React 18** - UI framework
- **react-beautiful-dnd** - Drag & drop Kanban
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Cyberpunk Theme** - "Wow" factor

## 🎨 UI/UX Design

### Cyberpunk Kanban Board
```
┌─────────────────────────────────────────────────────────────────┐
│  🦖 TASCOSAUR                              [===== Command Bar =====] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─── BACKLOG ───┐  ┌── IN PROGRESS ──┐  ┌──── DONE ────┐     │
│  │               │  │                 │  │              │     │
│  │ ┌───────────┐ │  │ ┌─────────────┐ │  │ ┌──────────┐ │     │
│  │ │ 🔴 HIGH   │ │  │ │ 🟡 MEDIUM  │ │  │ │ ✅ Fixed │ │     │
│  │ │ Login bug │ │  │ │ API refac  │ │  │ │ UI theme │ │     │
│  │ │ @john     │ │  │ │ @sarah     │ │  │ │ @tom     │ │     │
│  │ └───────────┘ │  │ └─────────────┘ │  │ └──────────┘ │     │
│  │               │  │                 │  │              │     │
│  │ ┌───────────┐ │  │                 │  │              │     │
│  │ │ 🟢 LOW    │ │  │                 │  │              │     │
│  │ │ Docs upd  │ │  │                 │  │              │     │
│  │ └───────────┘ │  │                 │  │              │     │
│  └───────────────┘  └─────────────────┘  └──────────────┘     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ > Create a high-priority bug ticket for the login page_     ││
│  └─────────────────────────────────────────────────────────────┘│
│  [Terminal-style command input with autocomplete]               │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Features ("Wow" Factor)
1. **Neon glow effects** on cards and borders
2. **Terminal-style command input** with blinking cursor
3. **Real-time parsing preview** showing extracted entities
4. **Animated card transitions** when dragging
5. **Live typing indicator** while LLM processes

## 📁 File Structure

```
tascosaur-nlp/
├── DESIGN.md
├── README.md
├── docker-compose.yml
├── Dockerfile
│
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── index.js          # Express server
│   │   ├── routes/
│   │   │   └── tasks.js      # Task CRUD API
│   │   ├── nlp/
│   │   │   ├── parser.js     # Main NLP engine
│   │   │   ├── intents.js    # Intent classification
│   │   │   ├── entities.js   # Entity extraction
│   │   │   └── llm.js        # Ollama fallback
│   │   ├── db/
│   │   │   └── sqlite.js     # Database layer
│   │   └── websocket.js      # Real-time updates
│   └── tests/
│       └── nlp.test.js
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── CommandBar.jsx
│   │   │   └── ParsePreview.jsx
│   │   ├── hooks/
│   │   │   └── useNLP.js
│   │   └── styles/
│   │       └── cyberpunk.css
│   └── public/
│
└── docs/
    └── architecture.svg
```

## 🔌 API Endpoints

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/parse` | Parse natural language → JSON |
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/move` | Move to column |

### WebSocket Events
| Event | Direction | Payload |
|-------|-----------|---------|
| `task:created` | Server → Client | Task object |
| `task:updated` | Server → Client | Task object |
| `task:deleted` | Server → Client | Task ID |
| `parse:preview` | Server → Client | Parsed entities |

## 🧪 Example NLP Transformations

### Input → Output Examples

```javascript
// Input: "Create a high-priority bug ticket for the login page"
{
  "intent": "CREATE",
  "task": {
    "title": "Login page bug",
    "priority": "high",
    "tags": ["bug"],
    "status": "backlog"
  }
}

// Input: "Move the API refactor to done"
{
  "intent": "MOVE",
  "target": "API refactor",
  "destination": "done"
}

// Input: "Assign the docs update to @sarah by next Friday"
{
  "intent": "UPDATE",
  "target": "docs update",
  "updates": {
    "assignee": "sarah",
    "dueDate": "2026-02-27"
  }
}

// Input: "Show me all high priority bugs"
{
  "intent": "QUERY",
  "filters": {
    "priority": "high",
    "tags": ["bug"]
  }
}
```

## 🐳 Docker Configuration

### Multi-stage Build
- Stage 1: Build frontend (Node + Vite)
- Stage 2: Build backend (Node)
- Stage 3: Production (Node Alpine)

### docker-compose.yml Services
1. `app` - Main application
2. `ollama` - Local LLM (optional, for enhanced NLP)

## 🚀 Deployment Strategy

1. **Local Dev**: `npm run dev` (hot reload)
2. **Docker**: `docker-compose up`
3. **Production**: Deploy to any VPS with Docker

## 📊 Success Metrics

- [ ] Parse 90%+ of common task commands correctly
- [ ] Sub-100ms response for regex parsing
- [ ] Clean, responsive Kanban UI
- [ ] Real-time sync across clients
- [ ] Fully containerized and portable

---

*Design Document v1.0 - Ready for Implementation*
