#!/usr/bin/env python3
"""Check for Indeed sidebar/panel job details"""
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

print("=== CHECKING INDEED LAYOUT ===\n")

# Check for sidebar/panel
sidebar = run_js("""
(function() {
    // Common Indeed job detail panel selectors
    var selectors = [
        '.jobsearch-ViewJob',
        '.jobsearch-JobInfoHeader',
        '#jobDescriptionText',
        '.jobsearch-JobComponent',
        '[class*="jobDetail"]',
        '[class*="JobDetail"]',
        '#vjs-container',
        '.vjs-highlight'
    ];
    for (var sel of selectors) {
        var el = document.querySelector(sel);
        if (el && el.offsetParent) {
            return 'Found panel: ' + sel + ' - Text: ' + el.innerText.slice(0,100);
        }
    }
    return 'No job detail panel found';
})();
""")
print(f"Sidebar check: {sidebar}")

# Check for Apply button anywhere on page
apply = run_js("""
(function() {
    var btns = Array.from(document.querySelectorAll('button, a'));
    var applyBtns = btns.filter(b => {
        var text = (b.innerText || b.textContent || '').toLowerCase();
        return text.includes('apply') && b.offsetParent;
    });
    return applyBtns.map(b => b.tagName + ': ' + (b.innerText || '').slice(0,30)).join(' | ');
})();
""")
print(f"Apply buttons: {apply}")

# Get full page structure
structure = run_js("""
(function() {
    var main = document.querySelector('main, #main, #content, .content');
    if (!main) main = document.body;
    var divs = main.querySelectorAll('div[class]');
    var classes = new Set();
    divs.forEach(d => {
        d.className.split(' ').forEach(c => {
            if (c && (c.includes('job') || c.includes('Job') || c.includes('apply') || c.includes('Apply'))) {
                classes.add(c);
            }
        });
    });
    return Array.from(classes).slice(0,20).join(', ');
})();
""")
print(f"Job-related classes: {structure}")

print("\n=== CHECK COMPLETE ===")
