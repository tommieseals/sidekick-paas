# TaskBot Lead Capture System

## Overview
Lead capture functionality added to TaskBot for capturing demo requests and newsletter signups.

## Files Created

### Components
- `src/components/LeadCaptureForm.tsx` - Main lead capture form with:
  - Company Name, Email (required), Phone, Company Size dropdown, Automation Needs textarea
  - Email validation
  - Honeypot spam protection (hidden field)
  - Success state animation
  - Source tracking

- `src/components/NewsletterModal.tsx` - Newsletter popup modal with:
  - Exit-intent trigger
  - Scroll percentage trigger
  - "Already seen" tracking via localStorage
  - Inline trigger button component

### Pages
- `src/pages/DiscoveryPage.tsx` - Full discovery/demo request page at `/discovery`
  - Hero with lead form
  - Benefits stats
  - Discovery process steps
  - Automation areas showcase

- `src/pages/AdminLeadsPage.tsx` - Admin dashboard at `/admin/leads`
  - View all leads and newsletter subscribers
  - Filter by status (new, contacted, qualified, converted)
  - Search by email/company
  - Update lead status
  - Export to CSV
  - Delete leads

### Utilities
- `src/lib/leads.ts` - Lead management utilities:
  - `saveLead()` - Save new lead
  - `getLeads()` - Retrieve all leads
  - `subscribeNewsletter()` - Add newsletter subscriber
  - `updateLeadStatus()` - Update lead pipeline status
  - `deleteLead()` - Remove lead
  - `downloadLeadsCSV()` - Export leads to CSV
  - `isValidEmail()` - Email validation

### Backend
- `api_server.py` - Python API server (port 8081):
  - `GET /api/leads` - List leads
  - `POST /api/leads` - Create lead
  - `GET /api/newsletter` - List subscribers
  - `POST /api/newsletter` - Add subscriber
  - `GET /api/stats` - Statistics
  - `POST /api/leads/status` - Update status

### Data Storage
- `data/leads.json` - JSON file for persisting leads

## Routes Added
- `/discovery` - Discovery/demo request page
- `/admin/leads` - Admin lead management dashboard

## Features

### Lead Capture Form
- Required: Email, Company Size
- Optional: Company Name, Phone, Automation Needs
- Honeypot field to catch bots
- Client-side email validation
- Animated success state

### Newsletter Modal
- Triggers at 50-70% scroll
- Exit intent detection
- LocalStorage to prevent repeat popups
- Graceful error handling

### Admin Dashboard
- Stats overview (total, by status)
- Filterable/searchable table
- Status management (new → contacted → qualified → converted)
- CSV export for CRM import
- Delete functionality

## Integration Points

### HomePage
- Newsletter modal added (70% scroll trigger)
- Lead capture form section added before final CTA

### Discovery Page
- Full lead capture form in hero
- Newsletter modal at 60% scroll

## Running the System

### Frontend (Vite dev server)
```bash
cd taskbot/power-automate
npm run dev
```

### API Server (optional for persistence)
```bash
cd taskbot
python api_server.py
```

## Data Flow
1. User fills out form
2. Form validates (email format, required fields)
3. Honeypot check (if filled, silently "succeeds" but doesn't save)
4. Lead saved to localStorage
5. If API server running, also POSTed to backend
6. Success animation displayed

## Spam Protection
- Honeypot field (hidden `website` input)
- Required field validation
- Email format validation
- Rate limiting possible via API server
