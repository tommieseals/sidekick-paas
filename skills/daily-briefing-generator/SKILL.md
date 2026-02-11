---
name: daily-briefing-generator
description: Generate daily briefings with news, calendar, tasks, and priorities
---

# Daily Briefing Generator

Automated daily briefings that compile:
- Calendar events (today + next 48h)
- Task priorities
- News & updates
- Weather
- System status

## Quick Start

```bash
# Generate morning briefing
daily-briefing

# Afternoon update
daily-briefing --afternoon

# Weekly overview
daily-briefing --weekly
```

## Briefing Components

### 1. Calendar Review
- Today's events
- Upcoming meetings (next 48h)
- Conflicts & gaps
- Preparation reminders

### 2. Task Priorities
- Top 3 tasks for today
- Overdue items
- Upcoming deadlines
- Blocked tasks

### 3. News & Updates
- Tech news (AI, development)
- Project updates
- Team notifications
- Industry trends

### 4. Context
- Weather forecast
- System health
- Usage stats
- Notable changes

## Configuration

Edit `~/clawd/config/briefing-config.json`:

```json
{
  "sources": {
    "calendar": true,
    "tasks": true,
    "news": true,
    "weather": true,
    "system": true
  },
  "schedule": "09:00",
  "format": "markdown",
  "delivery": "telegram"
}
```

## Integration

Uses existing tools:
- Apple Calendar (via `apple-reminders` skill)
- Things 3 (via `things-mac` skill)
- Weather (via `weather` skill)
- System status (via shared-memory)

## Automation

Set up daily cron:
```bash
# Add to HEARTBEAT.md for automatic daily briefings
# Or use cron to schedule at specific times
```

## Output Format

**Morning Briefing Example:**

```
📅 **Daily Briefing - Tuesday, Feb 11, 2026**

🗓️ **Today's Calendar:**
• 10:00 AM - Team standup (30 min)
• 2:00 PM - Client review (1 hour)
• 4:00 PM - Code review session

✅ **Top Priorities:**
1. Complete Phase 4 custom skills
2. Review ACIP research findings
3. Test MCP server integrations

📰 **Updates:**
• Claude 4.5 Sonnet updates available
• New MCP servers released
• Security patch recommended

☁️ **Weather:** 45°F, Partly cloudy

💻 **System:** 
• RAM: 8.2GB free (healthy)
• Disk: 21% used
• Ollama: Running (model resident)
```

## Tips

1. **Review at start of day** for planning
2. **Customize sources** for your workflow
3. **Set alerts** for critical items
4. **Archive briefings** for reference

## Advanced

### Custom Sections

Add custom sections:
```bash
daily-briefing --add-section "Project X Updates"
```

### Filter by Priority

```bash
daily-briefing --priority high
```

### Export Formats

```bash
# Markdown (default)
daily-briefing

# Plain text
daily-briefing --format text

# HTML
daily-briefing --format html

# PDF
daily-briefing --format pdf
```

## Troubleshooting

**Missing data:**
- Check skill configurations
- Verify API connections
- Review permissions

**Slow generation:**
- Use Ollama for summaries
- Reduce news sources
- Cache calendar data

**Delivery issues:**
- Check Telegram config
- Verify delivery settings
- Test manual send
