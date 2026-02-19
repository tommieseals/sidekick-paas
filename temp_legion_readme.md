# 🏴 PROJECT LEGION - Autonomous Job Hunting System

A 28-agent autonomous system that discovers jobs, researches companies, tailors resumes, and submits applications 24/7 with zero human intervention.

## Overview

PROJECT LEGION is a fully autonomous job-hunting pipeline that:
- Discovers relevant job postings across 7+ platforms
- Researches companies and extracts key insights
- Tailors resumes for each specific job
- Submits applications automatically
- Tracks status and sends follow-ups

**Built in 2 days. Running 24/7.**

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROJECT LEGION ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        ORCHESTRATION LAYER                           │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │    │
│  │  │   Hub    │  │Scheduler │  │  Worker  │  │ Pipeline │            │    │
│  │  │ Daemon   │  │  Daemon  │  │  Pool    │  │ Manager  │            │    │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │    │
│  └───────┼─────────────┼─────────────┼─────────────┼────────────────────┘    │
│          │             │             │             │                         │
│  ┌───────▼─────────────▼─────────────▼─────────────▼────────────────────┐    │
│  │                         AGENT SWARM (28 AGENTS)                       │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │  │ DISCOVERY AGENTS (7)                                            │ │    │
│  │  │ • LinkedIn Scout      • Indeed Hunter     • Dice Crawler        │ │    │
│  │  │ • ZipRecruiter Bot    • Glassdoor Agent   • CareerBuilder       │ │    │
│  │  │ • USAJobs Scanner                                               │ │    │
│  │  └─────────────────────────────────────────────────────────────────┘ │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │  │ RESEARCH AGENTS (6)                                             │ │    │
│  │  │ • Company Researcher  • Culture Analyzer  • Tech Stack Detector │ │    │
│  │  │ • Salary Estimator    • Growth Analyzer   • News Monitor        │ │    │
│  │  └─────────────────────────────────────────────────────────────────┘ │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │  │ TAILORING AGENTS (6)                                            │ │    │
│  │  │ • Resume Tailor       • Cover Letter Gen  • Skills Matcher      │ │    │
│  │  │ • Keyword Optimizer   • ATS Formatter     • PDF Generator       │ │    │
│  │  └─────────────────────────────────────────────────────────────────┘ │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │  │ SUBMISSION AGENTS (5)                                           │ │    │
│  │  │ • Form Filler         • ATS Submitter     • Email Sender        │ │    │
│  │  │ • Status Tracker      • Follow-up Bot                           │ │    │
│  │  └─────────────────────────────────────────────────────────────────┘ │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │  │ SUPPORT AGENTS (4)                                              │ │    │
│  │  │ • Quality Assurance   • Duplicate Detector • Priority Scorer    │ │    │
│  │  │ • Analytics Reporter                                            │ │    │
│  │  └─────────────────────────────────────────────────────────────────┘ │    │
│  └───────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          DATA LAYER                                   │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │    │
│  │  │   Jobs   │  │Companies │  │ Resumes  │  │ Tracking │            │    │
│  │  │   DB     │  │   Cache  │  │  Store   │  │   Log    │            │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Agent Categories

### Discovery Agents (7)
Scrape job boards and extract relevant postings.

| Agent | Platform | Method | Rate |
|-------|----------|--------|------|
| LinkedIn Scout | LinkedIn | API + Scraping | 50/hour |
| Indeed Hunter | Indeed | Scraping | 100/hour |
| Dice Crawler | Dice | API | 200/hour |
| ZipRecruiter Bot | ZipRecruiter | Scraping | 75/hour |
| Glassdoor Agent | Glassdoor | Scraping | 50/hour |
| CareerBuilder | CareerBuilder | API | 150/hour |
| USAJobs Scanner | USAJobs | Official API | Unlimited |

### Research Agents (6)
Deep-dive into companies for tailored applications.

- **Company Researcher**: Extracts mission, values, recent news
- **Culture Analyzer**: Reviews, employee sentiment
- **Tech Stack Detector**: Technology identification from job descriptions
- **Salary Estimator**: Market rate analysis
- **Growth Analyzer**: Funding rounds, headcount trends
- **News Monitor**: Recent press, product launches

### Tailoring Agents (6)
Customize materials for each application.

- **Resume Tailor**: Adjusts content to match job requirements
- **Cover Letter Gen**: Generates personalized cover letters
- **Skills Matcher**: Maps skills to job requirements
- **Keyword Optimizer**: ATS keyword optimization
- **ATS Formatter**: Ensures ATS-friendly formatting
- **PDF Generator**: Creates polished final documents

### Submission Agents (5)
Handle the actual application process.

- **Form Filler**: Playwright automation for web forms
- **ATS Submitter**: Handles major ATS platforms (Greenhouse, Lever, Workday)
- **Email Sender**: Direct recruiter outreach
- **Status Tracker**: Monitors application status changes
- **Follow-up Bot**: Sends timed follow-up emails (1w, 2w, 3w)

### Support Agents (4)
Quality control and analytics.

- **Quality Assurance**: Validates tailored materials
- **Duplicate Detector**: Prevents re-applying to same jobs
- **Priority Scorer**: Ranks jobs by fit score
- **Analytics Reporter**: Daily/weekly pipeline reports

## Pipeline Flow

```
1. DISCOVER     →  2. QUALIFY      →  3. RESEARCH     →  4. TAILOR
   (7 agents)        (Score & rank)     (6 agents)         (6 agents)
       ↓                  ↓                  ↓                  ↓
   Raw Jobs          Qualified         Company Intel      Custom Resume
   (100s/day)        (20-30/day)                          + Cover Letter
                                                               ↓
5. SUBMIT       ←  6. TRACK        ←  7. FOLLOW-UP
   (5 agents)        (Monitor)          (Automated)
       ↓                  ↓                  ↓
   Applications      Status Updates     Response Rate
   (10-15/day)       (Real-time)        (+30%)
```

## Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Applications/week | 5-10 | 70-100 | **10x** |
| Time spent | 15+ hrs/week | 30 min/week | **30x** |
| Response rate | 5% | 15% | **3x** |
| Interview rate | 2% | 8% | **4x** |

## Tech Stack

- **Orchestration**: Python, asyncio, APScheduler
- **Scraping**: Playwright, BeautifulSoup, Selenium
- **AI**: Local LLMs (resume tailoring), embeddings (job matching)
- **Storage**: SQLite, JSON files
- **Notifications**: Telegram Bot API
- **Scheduling**: Cron, daemon processes

---

*"The job search shouldn't be a job."*
