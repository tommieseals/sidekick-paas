---
name: work-automation-helper
description: Automate work tasks like CR processing, email summaries, and document generation
---

# Work Automation Helper

Automates common work tasks:
- Change Request (CR) processing
- Email summaries
- Document generation
- Status reports

## Change Request Automation

Process CRs automatically from email or text:

```bash
# From clipboard
pbpaste | work-process-cr

# From file
work-process-cr < email.txt

# Direct input
work-process-cr --file cr-email.txt
```

**What it does:**
- Extracts CR details (ID, description, requester, etc.)
- Analyzes impact and complexity
- Generates summary
- Creates action items
- Estimates timeline

## Email Summarization

Summarize long email threads:

```bash
# Summarize from clipboard
pbpaste | work-summarize-email

# From file
work-summarize-email --file thread.txt

# With priority flagging
work-summarize-email --priority high
```

**Features:**
- Key points extraction
- Action items identification
- Priority assessment
- Next steps recommendation

## Document Generation

Generate work documents:

```bash
# Status report
work-generate-doc --type status --project "Project Name"

# Meeting notes
work-generate-doc --type meeting --attendees "Name1, Name2"

# Technical spec
work-generate-doc --type spec --feature "Feature Name"
```

**Document Types:**
- Status reports
- Meeting notes
- Technical specifications
- Project proposals
- Incident reports

## Integration

Uses LLM Gateway for processing:
- Simple docs → Ollama (fast, free)
- Complex analysis → Qwen Coder
- Technical specs → Llama 90B

## Configuration

CR processing config: `~/dta/work-automation/change-requests/`

Templates available:
- Status report template
- Meeting notes template
- Spec template

## Examples

### Process a change request
```bash
# Copy CR email to clipboard, then:
pbpaste | work-process-cr

# Output includes:
# - CR-12345
# - Description: "Update API endpoint"
# - Impact: Medium
# - Timeline: 2-3 days
# - Action items: [list]
```

### Summarize email thread
```bash
# From Gmail export:
work-summarize-email --file long-thread.txt

# Output includes:
# - Key decisions made
# - Action items assigned
# - Next meeting date
# - Priority flags
```

### Generate status report
```bash
work-generate-doc --type status --project "Migration Project"

# Creates structured report with:
# - Progress summary
# - Completed tasks
# - Upcoming milestones
# - Blockers/risks
```

## Tips

1. **Use templates** for consistent formatting
2. **Tag priorities** for follow-up tracking
3. **Archive processed CRs** for reference
4. **Batch similar tasks** to optimize API usage

## Troubleshooting

**Error: "No CR found"**
- Verify email format
- Check CR ID pattern
- Try manual extraction

**Slow processing:**
- Use Ollama for simple tasks
- Check LLM Gateway usage
- Consider batch mode

**Quality issues:**
- Add more context in prompt
- Use higher-quality model (Llama 90B)
- Review and refine output
