#!/usr/bin/env python3
"""Deep investigation of Indeed Apply interface"""
import subprocess
import time

def run_js(js):
    js_escaped = js.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
    script = f'tell application "Safari" to tell document 1 to do JavaScript "{js_escaped}"'
    try:
        result = subprocess.run(['osascript', '-e', script], 
                               capture_output=True, text=True, timeout=10)
        return result.stdout.strip() or "empty"
    except Exception as e:
        return f"Error: {e}"

def get_title():
    result = subprocess.run(['osascript', '-e', 'tell application "Safari" to name of document 1'],
                           capture_output=True, text=True, timeout=10)
    return result.stdout.strip()

print("=== INVESTIGATING APPLY INTERFACE ===\n")

# 1. Click an Easy Apply job (IT/ Systems Administrator)
print("1. Clicking IT/ Systems Administrator (Easy Apply)...")
click = run_js("""
(function() {
    var cards = document.querySelectorAll('.job_seen_beacon');
    for (var card of cards) {
        if (card.innerText.includes('IT/ Systems Administrator') && 
            card.innerText.toLowerCase().includes('easily apply')) {
            var link = card.querySelector('h2 a, .jobTitle a');
            if (link) { link.click(); return 'Clicked!'; }
        }
    }
    return 'Not found';
})();
""")
print(f"   {click}")
time.sleep(3)

# 2. Check current page/panel state
print("\n2. Current state after click...")
title = get_title()
print(f"   Title: {title}")

# 3. Get ALL visible content about this job
content = run_js("""
(function() {
    // Get the job detail area (right side or modal)
    var detail = document.querySelector('#jobsearch-ViewJobRail') ||
                 document.querySelector('.jobsearch-RightPane') ||
                 document.querySelector('[class*="ViewJob"]');
    if (detail) return 'Detail pane: ' + detail.innerText.slice(0, 300);
    
    // Check body for job-specific content
    var body = document.body.innerText;
    if (body.includes('IT/ Systems Administrator')) {
        var idx = body.indexOf('IT/ Systems Administrator');
        return 'Body has job: ' + body.slice(idx, idx + 300);
    }
    return 'No job detail content found';
})();
""")
print(f"   Content: {content[:300]}...")

# 4. List ALL clickable elements that might be Apply
print("\n3. All Apply-related elements...")
elements = run_js("""
(function() {
    var items = [];
    document.querySelectorAll('*').forEach(function(el) {
        var text = (el.innerText || '').toLowerCase();
        var tag = el.tagName;
        if ((text.includes('apply') || text.includes('submit')) && 
            el.offsetParent && 
            (tag === 'BUTTON' || tag === 'A' || el.getAttribute('role') === 'button')) {
            var classes = el.className || '';
            items.push(tag + ' [' + classes.slice(0,30) + ']: ' + text.slice(0,40));
        }
    });
    return items.slice(0,10).join('\\n');
})();
""")
print(elements)

# 5. Try clicking the "Encouraged to apply" button
print("\n4. Clicking 'Encouraged to apply'...")
click2 = run_js("""
(function() {
    var btns = document.querySelectorAll('button');
    for (var btn of btns) {
        if (btn.innerText.toLowerCase().includes('encouraged to apply') && btn.offsetParent) {
            btn.click();
            return 'Clicked!';
        }
    }
    return 'Button not found';
})();
""")
print(f"   {click2}")
time.sleep(3)

# 6. Check what happened
print("\n5. After clicking Apply...")
title2 = get_title()
print(f"   Title: {title2}")

url = subprocess.run(['osascript', '-e', 'tell application "Safari" to URL of document 1'],
                    capture_output=True, text=True).stdout.strip()
print(f"   URL: {url}")

# Check for modal/form
form = run_js("""
(function() {
    var radios = document.querySelectorAll('input[type="radio"]').length;
    var texts = document.querySelectorAll('input[type="text"]').length;
    var modal = document.querySelector('[role="dialog"], .modal, [class*="Modal"]');
    if (modal) return 'Modal found! Radios: ' + radios + ', Texts: ' + texts;
    return 'No modal. Radios: ' + radios + ', Texts: ' + texts;
})();
""")
print(f"   Form: {form}")

print("\n=== INVESTIGATION COMPLETE ===")
