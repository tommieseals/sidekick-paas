#!/usr/bin/env python3
"""Check for Indeed right pane job details"""
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

print("=== CHECKING RIGHT PANE ===\n")

# First click a job card
print("1. Clicking first Easy Apply job...")
click = run_js("""
(function() {
    var card = Array.from(document.querySelectorAll('.job_seen_beacon')).find(
        c => c.innerText.includes('Easily apply')
    );
    if (!card) return 'No job found';
    var link = card.querySelector('h2 a, .jobTitle a');
    if (link) { link.click(); return 'Clicked: ' + link.innerText; }
    return 'No link';
})();
""")
print(f"   {click}")

time.sleep(3)

# Check for right pane
print("\n2. Checking for right pane...")
right_pane = run_js("""
(function() {
    // Indeed uses a split view - job details appear on the right
    var rightPane = document.querySelector('.jobsearch-RightPane, #jobsearch-ViewJobRail, [class*="RightPane"]');
    if (rightPane) {
        return 'Found right pane! Text: ' + rightPane.innerText.slice(0, 200);
    }
    // Check all major divs
    var divs = document.querySelectorAll('div');
    var largeDiv = null;
    divs.forEach(d => {
        if (d.innerText && d.innerText.length > 500 && d.className.includes('job')) {
            largeDiv = d;
        }
    });
    if (largeDiv) return 'Large job div: ' + largeDiv.className + ' - ' + largeDiv.innerText.slice(0,100);
    return 'No right pane found';
})();
""")
print(f"   {right_pane}")

# Look for Apply button more broadly
print("\n3. All buttons with 'apply' text...")
btns = run_js("""
(function() {
    var btns = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
    var result = [];
    btns.forEach(b => {
        var text = (b.innerText || '').toLowerCase();
        if (text.includes('apply') && b.offsetParent) {
            result.push(b.tagName + '.' + (b.className || '').split(' ')[0] + ': ' + text.slice(0,30));
        }
    });
    return result.join('\\n');
})();
""")
print(f"   {btns}")

print("\n=== CHECK COMPLETE ===")
