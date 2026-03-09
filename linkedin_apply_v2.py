#!/usr/bin/env python3
"""
LinkedIn Easy Apply v2 - Fixed for current LinkedIn UI
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
    js_file = '/tmp/linkedin_js.txt'
    with open(js_file, 'w') as f:
        f.write(js_code)
    script = f'''
    set jsCode to read POSIX file "{js_file}"
    tell application "Safari" to tell document 1 to do JavaScript jsCode
    '''
    try:
        result = subprocess.run(['osascript', '-e', script], capture_output=True, text=True, timeout=15)
        return result.stdout.strip()
    except:
        return ""

def find_jobs():
    """Find jobs with Easy Apply"""
    js = '''
    (function() {
        var jobs = [];
        var cards = document.querySelectorAll('.job-card-container, [data-job-id]');
        cards.forEach(function(card, idx) {
            var title = card.querySelector('.job-card-list__title, a[class*="job-card"]');
            var company = card.querySelector('.job-card-container__company-name, .artdeco-entity-lockup__subtitle');
            if (title && idx < 10) {
                jobs.push({
                    idx: idx,
                    title: title.innerText.trim().substring(0, 50),
                    company: company ? company.innerText.trim().substring(0, 30) : 'Unknown'
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
    js = f'''
    (function() {{
        var cards = document.querySelectorAll('.job-card-container, [data-job-id]');
        if (cards[{idx}]) {{
            cards[{idx}].click();
            return 'clicked job ' + {idx};
        }}
        return 'not found';
    }})()
    '''
    return run_js(js)

def click_apply():
    """Click the Apply or Easy Apply button in the job details panel"""
    js = '''
    (function() {
        // Look for Apply button in job details
        var btns = Array.from(document.querySelectorAll('button'));
        var applyBtn = btns.find(function(b) {
            var t = b.innerText.trim().toLowerCase();
            return (t === 'apply' || t === 'easy apply' || t.includes('easy apply')) && b.offsetParent;
        });
        if (applyBtn) {
            applyBtn.click();
            return 'clicked: ' + applyBtn.innerText.trim();
        }
        // Also try aria-label
        var ariaBtn = document.querySelector('[aria-label*="Easy Apply"], [aria-label*="Apply to"]');
        if (ariaBtn) {
            ariaBtn.click();
            return 'clicked aria: ' + ariaBtn.getAttribute('aria-label');
        }
        return 'no apply button';
    })()
    '''
    return run_js(js)

def fill_form_and_next():
    """Fill any form fields and click next/submit"""
    # Fill fields
    fill_js = '''
    (function() {
        var filled = 0;
        // Phone
        document.querySelectorAll('input[type="tel"], input[name*="phone"]').forEach(function(i) {
            if (!i.value) { i.value = '8327339818'; i.dispatchEvent(new Event('input', {bubbles: true})); filled++; }
        });
        // Dropdowns - select first valid option
        document.querySelectorAll('select').forEach(function(s) {
            if (s.selectedIndex <= 0 && s.options.length > 1) {
                s.selectedIndex = 1;
                s.dispatchEvent(new Event('change', {bubbles: true}));
                filled++;
            }
        });
        // Radio buttons - click Yes or first option
        var radios = {};
        document.querySelectorAll('input[type="radio"]').forEach(function(r) {
            if (!radios[r.name]) {
                r.click();
                radios[r.name] = true;
                filled++;
            }
        });
        return 'filled ' + filled;
    })()
    '''
    run_js(fill_js)
    time.sleep(0.5)
    
    # Click next/submit/review
    click_js = '''
    (function() {
        var btns = Array.from(document.querySelectorAll('button, [type="submit"]'));
        var priorities = ['submit application', 'submit', 'review', 'next', 'continue'];
        for (var p of priorities) {
            var btn = btns.find(function(b) {
                return b.innerText.trim().toLowerCase().includes(p) && b.offsetParent;
            });
            if (btn) {
                btn.click();
                return 'clicked: ' + btn.innerText.trim();
            }
        }
        return 'no next button';
    })()
    '''
    return run_js(click_js)

def check_submitted():
    js = '''
    (function() {
        var text = document.body.innerText.toLowerCase();
        if (text.includes('application sent') || text.includes('application submitted') || text.includes('applied ')) return 'SUBMITTED';
        if (text.includes('already applied')) return 'ALREADY_APPLIED';
        if (text.includes('dismiss')) return 'MODAL_OPEN';
        return 'IN_PROGRESS';
    })()
    '''
    return run_js(js)

def dismiss_modal():
    js = '''
    (function() {
        var dismiss = document.querySelector('[aria-label*="Dismiss"], [aria-label*="Close"]');
        if (dismiss) { dismiss.click(); return 'dismissed'; }
        return 'no dismiss';
    })()
    '''
    return run_js(js)

def apply_to_job(job):
    log(f"Applying: {job['title']} @ {job['company']}")
    
    # Click job card
    click_job(job['idx'])
    time.sleep(2)
    
    # Click Apply
    result = click_apply()
    log(f"  Apply click: {result}")
    if 'no apply' in result:
        return 'NO_APPLY_BUTTON'
    time.sleep(2)
    
    # Fill and submit up to 6 steps
    for step in range(6):
        status = check_submitted()
        if status == 'SUBMITTED':
            log(f"  ✅ SUBMITTED!")
            dismiss_modal()
            return 'SUBMITTED'
        if status == 'ALREADY_APPLIED':
            log(f"  ⏭️ Already applied")
            dismiss_modal()
            return 'SKIPPED'
        
        result = fill_form_and_next()
        log(f"  Step {step+1}: {result}")
        time.sleep(2)
    
    final = check_submitted()
    log(f"  Final: {final}")
    dismiss_modal()
    return final

def run(limit=5):
    log("=" * 60)
    log("🚀 LINKEDIN EASY APPLY v2")
    log("=" * 60)
    
    jobs = find_jobs()
    log(f"Found {len(jobs)} jobs")
    
    if not jobs:
        log("No jobs found")
        return 0
    
    submitted = 0
    for job in jobs[:limit]:
        result = apply_to_job(job)
        if result == 'SUBMITTED':
            submitted += 1
        time.sleep(2)
    
    log("=" * 60)
    log(f"COMPLETE: {submitted}/{min(limit, len(jobs))} submitted")
    log("=" * 60)
    return submitted

if __name__ == '__main__':
    run(limit=5)
