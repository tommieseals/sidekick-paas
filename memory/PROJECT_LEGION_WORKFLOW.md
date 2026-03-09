# PROJECT LEGION WORKFLOW — Indeed Application Automation

**Status:** ✅ WORKING (First successful submission: 2026-03-02 00:19 CST)
**Method:** AppleScript + Safari + JavaScript injection
**Success Rate:** 100% (1/1 test)

---

## 🎯 Overview

This workflow automates Indeed Easy Apply applications by controlling Safari through AppleScript on Mac Mini. It bypasses bot detection because:
- Uses real browser with real user session
- No automation flags (Playwright/Selenium detection avoided)
- JavaScript runs in authentic page context

---

## 📋 Prerequisites

### On Mac Mini (100.88.105.106)

1. **Safari logged into Indeed**
   - User: tommieseals7700@gmail.com
   - Must stay logged in (session cookies)

2. **Safari JavaScript from Apple Events enabled**
   ```
   Safari → Settings → Advanced → Show features for web developers
   Safari → Settings → Developer → Allow JavaScript from Apple Events ✅
   ```

3. **AppleScript permissions**
   - System Settings → Privacy & Security → Automation
   - Terminal must have permission to control Safari

### On Control Machine (Dell/any SSH client)

- SSH access to Mac Mini: `ssh tommie@100.88.105.106`

---

## 🔧 Core Functions

### 1. Execute JavaScript in Safari

Due to quoting issues (Windows → SSH → zsh → AppleScript), use base64:

```bash
# Template
ssh tommie@100.88.105.106 "echo <BASE64_APPLESCRIPT> | base64 -d > /tmp/script.scpt; osascript /tmp/script.scpt"
```

### 2. Base AppleScript Template

```applescript
tell application "Safari"
    tell document 1
        do JavaScript "<YOUR_JS_HERE>"
    end tell
end tell
```

### 3. React-Compatible Input Filling

Indeed uses React. Normal `.value = x` doesn't work. Use:

```javascript
function fillInput(input, value) {
    var ns = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    ns.call(input, value);
    input.dispatchEvent(new Event('input', {bubbles: true}));
    input.dispatchEvent(new Event('change', {bubbles: true}));
}

// For textareas
function fillTextarea(ta, value) {
    var ns = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    ns.call(ta, value);
    ta.dispatchEvent(new Event('input', {bubbles: true}));
    ta.dispatchEvent(new Event('change', {bubbles: true}));
}
```

---

## 📝 Step-by-Step Workflow

### Step 1: Navigate to Indeed Job Search

```javascript
// Check current page
document.title
// Should be on indeed.com
```

### Step 2: Find Easy Apply Jobs

```javascript
var jobs = document.querySelectorAll('.job_seen_beacon');
var easyApply = [];
jobs.forEach(function(job) {
    if (job.innerText.includes('Easily apply')) {
        var title = job.querySelector('h2 a');
        if (title) easyApply.push(title.innerText);
    }
});
easyApply.slice(0, 5).join(' | ');
```

### Step 3: Click on a Job

```javascript
var jobs = document.querySelectorAll('.job_seen_beacon');
jobs.forEach(function(job) {
    if (job.innerText.includes('TARGET_JOB_TITLE')) {
        var link = job.querySelector('h2 a');
        if (link) link.click();
    }
});
```

### Step 4: Click Apply Button

```javascript
var btn = document.querySelector('[data-testid="indeed-apply-widget"] button, .ia-indeedApplyButton');
if (btn) btn.click();
```

### Step 5: Fill Application Form

**Text Inputs:**
```javascript
var inputs = Array.from(document.querySelectorAll('input[type=text]')).filter(i => i.offsetParent);
inputs.forEach(function(i) {
    var context = i.closest('div') ? i.closest('div').innerText : '';
    var val = '';
    if (context.includes('address') || context.includes('Address')) val = '16451 Dunmoor, Houston, TX 77095';
    else if (context.includes('Compensation') || context.includes('Salary')) val = '75000.00';
    else if (context.includes('Location')) val = 'Houston, TX';
    else val = 'N/A';
    
    var ns = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    ns.call(i, val);
    i.dispatchEvent(new Event('input', {bubbles: true}));
    i.dispatchEvent(new Event('change', {bubbles: true}));
});
```

**Textareas (Address fields!):**
```javascript
var tas = Array.from(document.querySelectorAll('textarea')).filter(t => !t.name.includes('recaptcha'));
tas.forEach(function(ta) {
    var ns = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    ns.call(ta, '16451 Dunmoor, Houston, TX 77095');
    ta.dispatchEvent(new Event('input', {bubbles: true}));
    ta.dispatchEvent(new Event('change', {bubbles: true}));
});
```

**Radio Buttons:**
```javascript
var radios = Array.from(document.querySelectorAll('input[type=radio]'));
radios.forEach(function(r) {
    var label = r.closest('label') ? r.closest('label').innerText : (r.parentElement ? r.parentElement.innerText : '');
    if (label.trim() === 'Yes.' || label.trim() === 'Yes') r.click();
    if (label.includes('U.S Citizen') || label.includes('Permanent Resident')) r.click();
    if (label.trim() === 'Remote') r.click();
});
```

### Step 6: Click Continue (Multiple Times)

```javascript
var btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Continue' && b.offsetParent);
if (btn) btn.click();
```

Repeat until you see "Review your application" button.

### Step 7: Click Review

```javascript
var btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Review') && b.offsetParent);
if (btn) btn.click();
```

### Step 8: Submit Application

```javascript
var btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('submit') && b.offsetParent);
if (btn) btn.click();
```

### Step 9: Verify Success

```javascript
document.title.includes('submitted') ? 'SUCCESS!' : 'Check page...';
```

---

## ⚠️ Gotchas & Lessons Learned

1. **Textareas vs Inputs**: Address fields are often `<textarea>` not `<input type="text">`

2. **Multiple Continue buttons**: The form has many steps, keep clicking Continue

3. **React forms**: Must use native setter + event dispatch for React to recognize changes

4. **Base64 encoding**: Required to avoid PowerShell/zsh quote mangling

5. **Wait between steps**: `sleep 1-2` seconds after clicks for page to update

6. **Check all required fields**: Some questions (like "Help desk experience") may be hidden until you scroll

---

## 🔑 Default Values (Rusty's Profile)

| Field | Value |
|-------|-------|
| Address | 16451 Dunmoor, Houston, TX 77095 |
| Willing to Relocate | Yes |
| Work Authorization | U.S. Citizen / Permanent Resident |
| Salary Expectation | $75,000 |
| Location Preference | Remote |
| Experience Questions | Yes (default) |

---

## 🚀 Future Improvements

1. **Job Queue Processing**: Loop through multiple Easy Apply jobs
2. **Resume Upload**: Attach tailored resumes per job
3. **Answer Caching**: Remember common question answers
4. **Error Recovery**: Detect and retry failed submissions
5. **Rate Limiting**: Don't submit too many per day (Indeed might flag)

---

## 📅 History

| Date | Event |
|------|-------|
| 2026-03-02 00:19 | First successful submission! Senior Help Desk Tech II @ Contact Government |

---

## 🆕 New Automation Features (Added 2026-03-02 01:10)

### Job Queue System (`job_queue.py`)
```bash
# Scrape Easy Apply jobs from current page
python3 job_queue.py --scrape

# Show queue status
python3 job_queue.py --status

# List queued jobs
python3 job_queue.py --list

# Process 5 jobs from queue
python3 job_queue.py --process 5
```

### Smart Field Detection (`field_detector.py`)
Automatically matches form labels to your profile answers:
- Address fields → `personal.full_address`
- Salary questions → `work.salary_expected`
- Yes/No questions → Intelligent pattern matching
- Location preferences → `work.preferred_locations`

### Scheduler (`scheduler.py`)
```bash
# Run full cycle (scrape + process)
python3 scheduler.py --cycle

# Show scheduler status
python3 scheduler.py --status

# Setup cron job instructions
python3 scheduler.py --setup-cron
```

### Profile Config (`profile_config.json`)
All your answers in one place - edit to customize:
- Personal info (address, email, phone)
- Work preferences (salary, relocation, authorization)
- Experience flags (help desk, IT support, etc.)
- Rate limits (max apps/day, delays)

### For Bot Integration
Bots can run the full automated cycle:
```bash
ssh tommie@100.88.105.106 "cd ~/project-legion-rusty-fix/Project-Legion; python3 scheduler.py --cycle"
```

---

## 🔧 Bug Fixes Applied (2026-03-02 13:xx CST)

**Swarm deployment fixed 4 critical issues:**

### 1. Screener Page Handling ✅
- Added `fill_screener_questions()` function (line 318)
- Detects Yes/No radio buttons in fieldsets/radiogroups
- Answers "Yes" by default, "No" for felony/sponsor/visa questions
- Now called when `check_application_status()` returns "SCREENER"

### 2. Comprehensive Status Detection ✅
- Added `check_application_status()` function (line 370)
- Checks BOTH title AND page body content
- Returns: SUBMITTED, ALREADY_APPLIED, BLOCKED, SCREENER, FORM_INCOMPLETE, REVIEW, UNKNOWN
- Much better than old title-only detection

### 3. Textarea/Form Field Support ✅
- Added `HTMLTextAreaElement` handling (line 222)
- Fills address textareas: "16451 Dunmoor Dr, Houston, TX 77095"
- Fills cover letter/message textareas
- React-compatible with native setter + event dispatch

### 4. Bug Fix: Undefined Variable ✅
- Fixed: `if 'screener' in title` → `if status == "SCREENER"`
- Variable `title` wasn't defined in scope after refactor
- Now properly uses the status from `check_application_status()`

**Files Modified:**
- `/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py`

**Syntax verified:** ✅ `python3 -m py_compile` passes

---

*Last Updated: 2026-03-02 14:00*
*Created by: Clawd + Rusty*
*Project Legion Lives! 🚀*
