# Sidekick PaaS - Design Document

## 🎯 Project Overview

**Sidekick** is a simplified Platform-as-a-Service (PaaS) tool that provides "zero-config" deployments. Give it a GitHub repository URL, and it will:

1. Clone the repository
2. Auto-detect the project type (Node.js, Python, Go, static)
3. Generate an optimized Dockerfile
4. Create Nginx reverse proxy configuration
5. Set up SSL certificates (Let's Encrypt)
6. Deploy and monitor the application

Think of it as a self-hosted Heroku/Vercel alternative.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SIDEKICK PAAS ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐       │
│  │   Web UI     │     │   Sidekick API   │     │   Deployment     │       │
│  │              │     │                  │     │   Engine         │       │
│  │  Dashboard   │────▶│  Project Mgmt    │────▶│                  │       │
│  │  Logs View   │     │  Build Pipeline  │     │  Docker Build    │       │
│  │  Deploy Btn  │◀────│  SSL Manager     │◀────│  Nginx Config    │       │
│  └──────────────┘     └──────────────────┘     │  Certbot SSL     │       │
│                               │                 └──────────────────┘       │
│                               │                          │                 │
│                      ┌────────┴────────┐                │                 │
│                      │                 │                │                 │
│                 ┌────▼────┐      ┌─────▼─────┐   ┌─────▼─────┐          │
│                 │ GitHub  │      │  Docker   │   │  Nginx    │          │
│                 │ Clone   │      │  Daemon   │   │  Proxy    │          │
│                 └─────────┘      └───────────┘   └───────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔧 Core Features

### 1. Zero-Config Detection
Automatically detect project type by analyzing:
- `package.json` → Node.js (detect framework: Next.js, Express, React, Vue)
- `requirements.txt` / `pyproject.toml` → Python (Flask, Django, FastAPI)
- `go.mod` → Go
- `Cargo.toml` → Rust
- `index.html` → Static site
- `Dockerfile` → Use existing

### 2. Smart Dockerfile Generation
Generate optimized, multi-stage Dockerfiles based on project type:

```dockerfile
# Example: Auto-generated for Next.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. Nginx Reverse Proxy
Auto-generate nginx config with:
- Reverse proxy to container
- WebSocket support
- Gzip compression
- Security headers
- Rate limiting

### 4. SSL/TLS Certificates
Automatic HTTPS using Let's Encrypt:
- Certbot integration
- Auto-renewal
- HTTP→HTTPS redirect

### 5. Deployment Dashboard
Real-time monitoring:
- Build logs (streaming)
- Container status
- Resource usage
- Quick actions (restart, rollback, delete)

## 📦 Tech Stack

### Backend (Node.js)
- **Express.js** - REST API
- **Dockerode** - Docker API client
- **simple-git** - Git operations
- **Socket.io** - Real-time logs
- **node-cron** - SSL renewal scheduling

### Frontend (React)
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **xterm.js** - Terminal log viewer
- **Framer Motion** - Animations

### Infrastructure
- **Docker** - Container runtime
- **Nginx** - Reverse proxy
- **Certbot** - SSL certificates
- **SQLite** - Project database

## 🎨 UI/UX Design

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🚀 SIDEKICK                                    [+ New Project] [⚙️]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─── PROJECTS ─────────────────────────────────────────────────────┐  │
│  │                                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │ 🟢 my-nextjs-app                          RUNNING           │ │  │
│  │  │    nextjs • https://myapp.example.com                       │ │  │
│  │  │    CPU: 12% | RAM: 256MB | Uptime: 3d 4h                   │ │  │
│  │  │    [Logs] [Restart] [Settings] [Delete]                     │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │ 🟡 api-server                             BUILDING          │ │  │
│  │  │    python • —                                               │ │  │
│  │  │    Building... Step 3/7                                     │ │  │
│  │  │    [View Build Logs]                                        │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │ 🔴 old-project                            STOPPED           │ │  │
│  │  │    static • —                                               │ │  │
│  │  │    Stopped 2 days ago                                       │ │  │
│  │  │    [Start] [Delete]                                         │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                                                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─── DEPLOY NEW PROJECT ───────────────────────────────────────────┐  │
│  │                                                                   │  │
│  │  GitHub URL: [https://github.com/user/repo___________________]   │  │
│  │                                                                   │  │
│  │  Subdomain:  [myapp_____________] .example.com                   │  │
│  │                                                                   │  │
│  │  Branch:     [main▼]   Port: [auto-detect▼]                      │  │
│  │                                                                   │  │
│  │                                    [🚀 Deploy]                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Build Logs Terminal

```
┌─── BUILD LOGS: my-nextjs-app ────────────────────────────────────────┐
│                                                                       │
│  [12:34:01] 📥 Cloning repository...                                 │
│  [12:34:03] ✅ Repository cloned successfully                        │
│  [12:34:03] 🔍 Detecting project type...                             │
│  [12:34:03] ✅ Detected: Next.js (Node.js)                           │
│  [12:34:04] 📝 Generating Dockerfile...                              │
│  [12:34:04] 🐳 Building Docker image...                              │
│  [12:34:05] Step 1/12 : FROM node:20-alpine AS builder               │
│  [12:34:06] ---> abc123def456                                        │
│  [12:34:06] Step 2/12 : WORKDIR /app                                 │
│  [12:34:07] ---> Running in xyz789...                                │
│  [12:34:15] Step 7/12 : RUN npm run build                            │
│  [12:34:45] ✅ Build completed successfully                          │
│  [12:34:46] 🚀 Starting container...                                 │
│  [12:34:47] 🌐 Configuring Nginx proxy...                            │
│  [12:34:48] 🔒 Requesting SSL certificate...                         │
│  [12:34:52] ✅ SSL certificate issued                                │
│  [12:34:52] ════════════════════════════════════════════════════════ │
│  [12:34:52] 🎉 Deployment successful!                                │
│  [12:34:52] 🔗 https://myapp.example.com                             │
│  [12:34:52] ════════════════════════════════════════════════════════ │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
sidekick-paas/
├── DESIGN.md
├── README.md
├── docker-compose.yml
├── Dockerfile
│
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── index.js              # Express server
│   │   ├── routes/
│   │   │   ├── projects.js       # Project CRUD
│   │   │   ├── deploy.js         # Deployment endpoints
│   │   │   └── logs.js           # Log streaming
│   │   ├── services/
│   │   │   ├── git.js            # Git clone/pull
│   │   │   ├── detector.js       # Project type detection
│   │   │   ├── dockerBuilder.js  # Dockerfile generation
│   │   │   ├── docker.js         # Docker operations
│   │   │   ├── nginx.js          # Nginx config
│   │   │   └── ssl.js            # Certbot/SSL
│   │   ├── templates/
│   │   │   ├── dockerfiles/      # Dockerfile templates
│   │   │   └── nginx/            # Nginx templates
│   │   └── db/
│   │       └── sqlite.js
│   └── data/
│       ├── repos/                # Cloned repositories
│       └── nginx/                # Generated configs
│
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── ProjectList.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── DeployForm.jsx
│   │   │   ├── BuildLogs.jsx
│   │   │   └── Terminal.jsx
│   │   └── hooks/
│   │       └── useWebSocket.js
│   └── public/
│
└── docs/
    └── architecture.svg
```

## 🔌 API Endpoints

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get project details |
| POST | `/api/projects` | Create new project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/restart` | Restart container |
| POST | `/api/projects/:id/stop` | Stop container |
| POST | `/api/projects/:id/start` | Start container |

### Deployment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/deploy` | Deploy from GitHub URL |
| GET | `/api/deploy/:id/status` | Get deployment status |
| POST | `/api/deploy/:id/redeploy` | Redeploy project |
| POST | `/api/deploy/:id/rollback` | Rollback to previous |

### Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs/:id` | Get container logs |
| WS | `/ws/logs/:id` | Stream logs real-time |
| WS | `/ws/build/:id` | Stream build logs |

## 🐳 Dockerfile Templates

### Node.js (Next.js)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

### Python (FastAPI)
```dockerfile
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /app .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Static Site
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🌐 Nginx Template

```nginx
server {
    listen 80;
    server_name {{DOMAIN}};
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name {{DOMAIN}};

    ssl_certificate /etc/letsencrypt/live/{{DOMAIN}}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{{DOMAIN}}/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    location / {
        proxy_pass http://{{CONTAINER_IP}}:{{PORT}};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 SSL Certificate Flow

```
1. User deploys project with subdomain
2. Sidekick generates nginx config (HTTP only)
3. Nginx reloads with new config
4. Certbot requests certificate (HTTP-01 challenge)
5. Certificate issued
6. Nginx config updated with SSL
7. Nginx reloads with HTTPS
8. Cron job handles renewal (monthly)
```

## 📊 Success Metrics

- [ ] Deploy any Node.js app in <2 minutes
- [ ] Zero manual configuration required
- [ ] SSL certificates auto-provisioned
- [ ] Real-time build log streaming
- [ ] Container health monitoring
- [ ] One-click rollback capability

---

*Design Document v1.0 - Ready for Implementation*
