# n8n Workflow Automation Setup
Started: 2026-02-08 14:22 CST

## Current Status

### Installation
✅ **Already running via Docker**
- Container: `n8n` (n8nio/n8n)
- Port: http://localhost:5678
- Status: Up 12 hours
- Data volume: `/var/lib/docker/volumes/n8n_data/_data`

### Access
- **Local:** http://localhost:5678
- **Tailscale:** http://100.82.234.66:5678 (from other devices)

---

## Planned Workflows

### 1. DTA Video Processing Pipeline
**Trigger:** New file in `~/dta/inbox/videos.txt`
**Actions:**
1. Detect new YouTube URLs
2. Run `transcribe-video.sh` for each
3. Run `summarize-transcript.sh` after transcription
4. Extract action items
5. Notify via Telegram if high-priority items found

**Benefits:**
- Fully automated video processing
- Real-time notifications for important insights
- No manual intervention needed

---

### 2. Admin Report Aggregator
**Trigger:** Schedule (weekly, Sunday 8 PM)
**Actions:**
1. Read all admin reports from past week
2. Aggregate key metrics:
   - Security issues found
   - Network latency trends
   - System resource usage
   - DTA recommendations
3. Generate weekly summary using Ollama
4. Send to Telegram

**Benefits:**
- Weekly overview at a glance
- Trend analysis over time
- Proactive issue identification

---

### 3. High-Priority Alert Monitor
**Trigger:** Schedule (every 30 minutes)
**Actions:**
1. Check `~/shared-memory/tickets.json` for new ALERT tickets
2. Check DTA summaries for critical action items
3. If found, send Telegram notification with details

**Benefits:**
- Real-time awareness of critical issues
- Don't miss important recommendations
- Actionable notifications

---

### 4. Token Usage Dashboard
**Trigger:** Schedule (daily, 9 PM)
**Actions:**
1. Parse `~/clawd/logs/token-usage.log`
2. Calculate daily/weekly totals
3. Compare to previous period
4. Generate trend graph
5. Send summary if significant changes

**Benefits:**
- Monitor AI cost trends
- Catch token usage spikes
- Optimize high-usage scripts

---

## Integration Points

### Ollama Integration
n8n can call local Ollama for:
- Text summarization
- Decision making
- Data analysis
- Report generation

**Endpoints:**
- Local: http://localhost:11434
- Cloud: http://100.107.231.87:11434

### File System Access
Docker volume mounts needed for:
- `/Users/tommie/dta/` - Video transcripts, summaries
- `/Users/tommie/clawd/` - Admin reports, logs
- `/Users/tommie/shared-memory/` - Admin AI data

### External Services
- **Telegram Bot** - For notifications
- **Tailscale** - For remote access
- **Ollama** - For AI processing

---

## Setup Steps

1. ✅ Verify n8n running
2. ✅ Configure file system access (Docker mounts added)
3. ✅ Set up Telegram bot token
4. ✅ Create first workflow (DTA Video Pipeline)
5. [ ] Test workflow in n8n UI
6. [ ] Enable additional workflows
7. [ ] Monitor and refine

---

## Completed

### Docker Configuration
✅ Restarted n8n with workspace volume mounts:
- `/workspace/clawd` → `~/clawd` (read-only)
- `/workspace/dta` → `~/dta` (read-only)
- `/workspace/shared-memory` → `~/shared-memory` (read-only)
- `/workspace/scripts` → `~/scripts` (read-only)

### Workflow Created
✅ **DTA Video Processor** (`~/dta/n8n-workflows/dta-video-processor.json`)
- Checks for new videos in inbox
- Transcribes with Whisper
- Summarizes with Ollama
- Notifies via Telegram

### Documentation
✅ Created `~/dta/n8n-workflows/README.md` with:
- Setup instructions
- Workflow descriptions
- Integration guides
- Troubleshooting

---

## Next Actions

1. **Import workflow in n8n UI:**
   - Open http://localhost:5678
   - Go to Workflows → Import from File
   - Upload `dta-video-processor.json`
   
2. **Configure Telegram credentials:**
   - Settings → Credentials → Add Telegram
   - Use token: `8402195747:AAFXOIHybqra0LAAqZc_8WDqg3GeKwVkjBw`

3. **Test workflow:**
   - Open workflow in n8n
   - Click "Test workflow"
   - Verify each node output

4. **Create additional workflows:**
   - Admin Report Aggregator
   - Alert Monitor
   - Token Usage Dashboard

---

**Status:** 🟢 Ready for Testing - Import workflow and test in n8n UI
