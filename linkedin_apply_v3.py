#!/usr/bin/env python3
"""
LinkedIn Easy Apply v3 - Better button handling
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
        result = subprocess.run(['osascript', '-e', script], capture_output=True, text=True, timeout=20)
        return result.stdout.strip()
    except Exception as e:
        return f"ERROR: {e}"

def find_jobs():
    js = '''
    (function() {
        var jobs = [];
        var cards = document.querySelectorAll('.job-card-container, [data-job-id]');
        cards.forEach(function(card, idx) {
            var title = card.querySelector('.job-card-list__title, a');
            var company = card.querySelector('.artdeco-entity-lockup__subtitle, .job-card-container__company-name');
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
        return json.loads(result) if result and not result.startswith('ERROR') else []
    except:
        return []

def click_job(idx):
    js = f'''
    (function() {{
        var cards = document.querySelectorAll('.job-card-container, [data-job-id]');
        if (cards[{idx}]) {{ cards[{idx}].click(); return 'clicked'; }}
        return 'not found';
    }})()
    '''
    return run_js(js)

def click_easy_apply():
    js = '''
    (function() {
        var btn = document.querySelector('.jobs-apply-button, button[aria-label*="Easy Apply"]');
        if (btn) { btn.click(); return 'clicked Easy Apply'; }
        // Try by text
        var btns = Array.from(document.querySelectorAll('button'));
        var ea = btns.find(function(b) { return b.innerText.trim() === 'Easy Apply'; });
        if (ea) { ea.click(); return 'clicked by text'; }
        return 'no button';
    })()
    '''
    return run_js(js)

def fill_fields():
    js = '''
    (function() {
        var filled = 0;
        // Phone
        document.querySelectorAll('input[type="tel"], input[name*="phone"]').forEach(function(i) {
            if (!i.value) { 
                var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                setter.call(i, '8327339818');
                i.dispatchEvent(new Event('input', {bubbles: true}));
                i.dispatchEvent(new Event('change', {bubbles: true}));
                filled++; 
            }
        });
        // Text inputs that are empty
        document.querySelectorAll('input[type="text"]').forEach(function(i) {
            var label = (i.closest('label') || i.parentElement || {}).innerText || '';
            if (!i.value && label.toLowerCase().includes('city')) {
                i.value = 'Houston';
                i.dispatchEvent(new Event('input', {bubbles: true}));
                filled++;
            }
        });
        // Dropdowns
        document.querySelectorAll('select').forEach(function(s) {
            if (s.selectedIndex <= 0 && s.options.length > 1) {
                s.selectedIndex = 1;
                s.dispatchEvent(new Event('change', {bubbles: true}));
                filled++;
            }
        });
        // Radio - click first of each group
        var radios = {};
        document.querySelectorAll('input[type="radio"]').forEach(function(r) {
            if (!radios[r.name] && !r.checked) {
                r.click();
                radios[r.name] = true;
                filled++;
            }
        });
        // Checkboxes for terms
        document.querySelectorAll('input[type="checkbox"]').forEach(function(c) {
            if (!c.checked) { c.click(); filled++; }
        });
        return filled;
    })()
    '''
    return run_js(js)

def click_next_or_submit():
    js = '''
    (function() {
        var btns = Array.from(document.querySelectorAll('button')).filter(function(b) {
            return b.offsetParent !== null;
        });
        
        // Priority order for button text
        var priorities = [
            'submit application',
            'submit',
            'review your application', 
            'review',
            'next',
            'continue',
            'done'
        ];
        
        for (var p of priorities) {
            var btn = btns.find(function(b) {
                return b.innerText.trim().toLowerCase() === p || 
                       b.innerText.trim().toLowerCase().includes(p);
            });
            if (btn) {
                btn.click();
                return 'clicked: ' + btn.innerText.trim();
            }
        }
        
        // Also check aria-label
        var ariaBtn = document.querySelector('button[aria-label*="Submit"], button[aria-label*="Review"]');
        if (ariaBtn) {
            ariaBtn.click();
            return 'clicked aria: ' + ariaBtn.getAttribute('aria-label');
        }
        
        return 'no button found';
    })()
    '''
    return run_js(js)

def check_submitted():
    js = '''
    (function() {
        var text = document.body.innerText.toLowerCase();
        if (text.includes('application sent') || text.includes('application submitted') || 
            text.includes('your application was sent') || text.includes('applied ')) {
            return 'SUBMITTED';
        }
        if (text.includes('already applied') || text.includes('you applied')) return 'ALREADY_APPLIED';
        // Check for modal still open
        var modal = document.querySelector('[role="dialog"], .artdeco-modal');
        if (modal && modal.offsetParent) return 'MODAL_OPEN';
        return 'IN_PROGRESS';
    })()
    '''
    return run_js(js)

def dismiss_modal():
    js = '''
    (function() {
        var dismiss = document.querySelector('[aria-label*="Dismiss"], button[aria-label*="Close"]');
        if (dismiss) { dismiss.click(); return 'dismissed'; }
        return 'no dismiss';
    })()
    '''
    return run_js(js)

def apply_to_job(job):
    log(f"Applying: {job['title']} @ {job['company']}")
    
    click_job(job['idx'])
    time.sleep(2)
    
    result = click_easy_apply()
    log(f"  {result}")
    if 'no button' in result:
        return 'NO_APPLY'
    time.sleep(3)
    
    # Click through up to 12 steps
    for step in range(12):
        # Check if already submitted
        status = check_submitted()
        if status == 'SUBMITTED':
            log(f"  ✅ SUBMITTED!")
            time.sleep(1)
            dismiss_modal()
            return 'SUBMITTED'
        if status == 'ALREADY_APPLIED':
            log(f"  ⏭️ Already applied")
            dismiss_modal()
            return 'SKIPPED'
        
        # Fill any fields
        filled = fill_fields()
        if filled and filled != '0':
            log(f"  Filled {filled} fields")
        
        time.sleep(0.5)
        
        # Click next/submit
        result = click_next_or_submit()
        log(f"  Step {step+1}: {result}")
        
        if 'no button found' in result:
            # Might be done or stuck
            break
            
        time.sleep(2)
    
    final = check_submitted()
    log(f"  Final: {final}")
    dismiss_modal()
    return final

def run(limit=5):
    log("=" * 60)
    log("🚀 LINKEDIN EASY APPLY v3")
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
        time.sleep(3)
    
    log("=" * 60)
    log(f"COMPLETE: {submitted}/{min(limit, len(jobs))} submitted")
    log("=" * 60)
    return submitted

if __name__ == '__main__':
    run(limit=5)
