#!/usr/bin/env python3
"""Step through application process with detailed logging"""
import subprocess
import time

def run_js(js):
    js_escaped = js.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
    script = f'tell application "Safari" to tell document 1 to do JavaScript "{js_escaped}"'
    try:
        result = subprocess.run(['osascript', '-e', script], 
                               capture_output=True, text=True, timeout=10)
        return result.stdout.strip() or "empty"
    except subprocess.TimeoutExpired:
        return "TIMEOUT"
    except Exception as e:
        return f"Error: {e}"

def get_title():
    result = subprocess.run(['osascript', '-e', 'tell application "Safari" to name of document 1'],
                           capture_output=True, text=True, timeout=10)
    return result.stdout.strip()

print("=== STEP BY STEP APPLICATION ===\n")

# Step 1: Find an Easy Apply job
print("STEP 1: Finding Easy Apply job...")
jobs = run_js("""
(function() {
    var jobs = [];
    document.querySelectorAll('.job_seen_beacon').forEach(function(card) {
        if (card.innerText.includes('Easily apply')) {
            var title = card.querySelector('h2 a, .jobTitle a');
            var company = card.querySelector('[data-testid="company-name"]');
            if (title) jobs.push({t: title.innerText, c: company?.innerText || 'Unknown'});
        }
    });
    return JSON.stringify(jobs.slice(0,3));
})();
""")
print(f"  Jobs found: {jobs}")

# Step 2: Click first job
print("\nSTEP 2: Clicking first job...")
click_result = run_js("""
(function() {
    var card = Array.from(document.querySelectorAll('.job_seen_beacon')).find(
        c => c.innerText.includes('Easily apply')
    );
    if (!card) return 'No Easy Apply job found';
    var link = card.querySelector('h2 a, .jobTitle a');
    if (link) { link.click(); return 'Clicked: ' + link.innerText.slice(0,40); }
    return 'No link found';
})();
""")
print(f"  Result: {click_result}")
time.sleep(3)

# Step 3: Check page and find Apply button
print("\nSTEP 3: Looking for Apply button...")
title = get_title()
print(f"  Page: {title}")

apply_btn = run_js("""
(function() {
    // Check for various Apply button selectors
    var selectors = [
        '[data-testid="indeed-apply-widget"] button',
        '.ia-indeedApplyButton',
        'button[aria-label*="Apply"]',
        'button.jobsearch-IndeedApplyButton-newDesign'
    ];
    for (var sel of selectors) {
        var btn = document.querySelector(sel);
        if (btn && btn.offsetParent) return 'Found: ' + sel + ' -> ' + btn.innerText;
    }
    // List all visible buttons
    var btns = Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent);
    return 'Not found. Buttons: ' + btns.map(b => b.innerText.slice(0,20)).slice(0,5).join(', ');
})();
""")
print(f"  Apply button: {apply_btn}")

# Step 4: Click Apply
if 'Found' in apply_btn:
    print("\nSTEP 4: Clicking Apply button...")
    click_apply = run_js("""
    (function() {
        var btn = document.querySelector('[data-testid="indeed-apply-widget"] button') ||
                  document.querySelector('.ia-indeedApplyButton') ||
                  document.querySelector('button[aria-label*="Apply"]');
        if (btn) { btn.click(); return 'Clicked Apply'; }
        return 'No Apply button';
    })();
    """)
    print(f"  Result: {click_apply}")
    time.sleep(4)
    
    # Step 5: Check what opened
    print("\nSTEP 5: Checking application form...")
    title = get_title()
    print(f"  Page: {title}")
    
    # Check for form elements
    form_check = run_js("""
    (function() {
        var radios = document.querySelectorAll('input[type="radio"]').length;
        var texts = document.querySelectorAll('input[type="text"]').length;
        var textareas = document.querySelectorAll('textarea').length;
        var btns = Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent).map(b => b.innerText.trim()).slice(0,5);
        return 'Radios: ' + radios + ', Texts: ' + texts + ', Textareas: ' + textareas + ', Buttons: ' + btns.join(', ');
    })();
    """)
    print(f"  Form elements: {form_check}")

print("\n=== STEP BY STEP COMPLETE ===")
