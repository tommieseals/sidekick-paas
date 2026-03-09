#!/usr/bin/env python3
"""
LinkedIn Easy Apply via Safari + AppleScript
"""
import subprocess
import time
import json
from datetime import datetime

LOG_FILE = '/Users/tommie/project-legion-rusty-fix/Project-Legion/linkedin_safari.log'

def log(msg):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    line = f'[{timestamp}] {msg}'
    print(line)
    with open(LOG_FILE, 'a') as f:
        f.write(line + '\n')

def run_js(js_code):
    """Run JavaScript in Safari"""
    js_file = '/tmp/linkedin_js.txt'
    with open(js_file, 'w') as f:
        f.write(js_code)
    
    script = f'''
    set jsCode to read POSIX file "{js_file}"
    tell application "Safari" to tell document 1 to do JavaScript jsCode
    '''
    result = subprocess.run(['osascript', '-e', script], capture_output=True, text=True, timeout=15)
    return result.stdout.strip()

def find_easy_apply_jobs():
    """Find Easy Apply jobs on current LinkedIn page"""
    js = '''
    (function() {
        var jobs = [];
        // Find all job cards
        var cards = document.querySelectorAll('.jobs-search-results__list-item, .job-card-container');
        cards.forEach(function(card, idx) {
            var title = card.querySelector('.job-card-list__title, .job-card-container__link');
            var company = card.querySelector('.job-card-container__company-name, .job-card-container__primary-description');
            var easyApply = card.innerText.includes('Easy Apply');
            if (title && easyApply && idx < 10) {
                jobs.push({
                    idx: idx,
                    title: title.innerText.trim().substring(0, 60),
                    company: company ? company.innerText.trim().substring(0, 40) : 'Unknown'
                });
            }
        });
        return JSON.stringify(jobs);
    })()
    '''
    result = run_js(js)
    try:
        return json.loads(result) if result else []
    except:
        return []

def click_job(idx):
    """Click on job card by index"""
    js = f'''
    (function() {{
        var cards = document.querySelectorAll('.jobs-search-results__list-item, .job-card-container');
        if (cards[{idx}]) {{
            cards[{idx}].click();
            return 'clicked';
        }}
        return 'not found';
    }})()
    '''
    return run_js(js)

def click_easy_apply():
    """Click the Easy Apply button"""
    js = '''
    (function() {
        var btn = document.querySelector('.jobs-apply-button, [aria-label*="Easy Apply"], button[data-job-apply]');
        if (btn) { btn.click(); return 'clicked Easy Apply'; }
        return 'no button found';
    })()
    '''
    return run_js(js)

def fill_and_submit():
    """Fill fields and click through the Easy Apply modal"""
    # Fill any empty fields
    fill_js = '''
    (function() {
        var filled = 0;
        // Fill phone if empty
        var phoneInput = document.querySelector('input[name*="phone"], input[autocomplete="tel"]');
        if (phoneInput && !phoneInput.value) {
            phoneInput.value = '8327339818';
            phoneInput.dispatchEvent(new Event('input', {bubbles: true}));
            filled++;
        }
        // Select any dropdowns (first non-empty option)
        document.querySelectorAll('select').forEach(function(s) {
            if (s.selectedIndex <= 0 && s.options.length > 1) {
                s.selectedIndex = 1;
                s.dispatchEvent(new Event('change', {bubbles: true}));
                filled++;
            }
        });
        // Check any required checkboxes
        document.querySelectorAll('input[type="checkbox"][required]').forEach(function(c) {
            if (!c.checked) { c.click(); filled++; }
        });
        return 'filled ' + filled + ' fields';
    })()
    '''
    run_js(fill_js)
    time.sleep(1)
    
    # Click Next/Submit/Continue
    click_js = '''
    (function() {
        var btns = Array.from(document.querySelectorAll('button'));
        var btn = btns.find(function(b) {
            var t = b.innerText.toLowerCase();
            return (t.includes('submit') || t.includes('next') || t.includes('continue') || t.includes('review')) && b.offsetParent;
        });
        if (btn) { btn.click(); return 'clicked: ' + btn.innerText.trim(); }
        return 'no button';
    })()
    '''
    return run_js(click_js)

def check_status():
    """Check if application was submitted"""
    js = '''
    (function() {
        var text = document.body.innerText;
        if (text.includes('Application submitted') || text.includes('application was sent') || text.includes('Applied')) return 'SUBMITTED';
        if (text.includes('already applied')) return 'ALREADY_APPLIED';
        return 'IN_PROGRESS';
    })()
    '''
    return run_js(js)

def apply_to_job(job):
    """Full application flow"""
    log(f"Applying to: {job['title']} @ {job['company']}")
    
    # Click the job card
    click_job(job['idx'])
    time.sleep(2)
    
    # Click Easy Apply
    result = click_easy_apply()
    log(f"  Easy Apply: {result}")
    time.sleep(2)
    
    # Fill and submit up to 5 steps
    for step in range(5):
        status = check_status()
        if status == 'SUBMITTED':
            log(f"  ✅ SUBMITTED!")
            return 'SUBMITTED'
        if status == 'ALREADY_APPLIED':
            log(f"  ⏭️ Already applied")
            return 'SKIPPED'
        
        result = fill_and_submit()
        log(f"  Step {step+1}: {result}")
        time.sleep(2)
    
    status = check_status()
    log(f"  Final status: {status}")
    return status

def run(limit=3):
    """Main runner"""
    log("=" * 60)
    log("🚀 LINKEDIN EASY APPLY RUNNER (Safari)")
    log("=" * 60)
    
    jobs = find_easy_apply_jobs()
    log(f"Found {len(jobs)} Easy Apply jobs")
    
    if not jobs:
        log("No Easy Apply jobs found on current page")
        return
    
    submitted = 0
    for job in jobs[:limit]:
        result = apply_to_job(job)
        if result == 'SUBMITTED':
            submitted += 1
        time.sleep(3)
    
    log("=" * 60)
    log(f"COMPLETE: {submitted}/{min(limit, len(jobs))} submitted")
    log("=" * 60)

if __name__ == '__main__':
    run(limit=3)
