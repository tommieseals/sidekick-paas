#!/usr/bin/env python3
"""Debug Safari and test screener filling"""
import subprocess
import time

def run_osascript(script):
    """Run AppleScript and return output"""
    try:
        result = subprocess.run(['osascript', '-e', script], 
                               capture_output=True, text=True, timeout=10)
        return result.stdout.strip() or result.stderr.strip()
    except Exception as e:
        return f"Error: {e}"

def run_js(js):
    """Run JavaScript in Safari"""
    js_escaped = js.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
    script = f'tell application "Safari" to tell document 1 to do JavaScript "{js_escaped}"'
    return run_osascript(script)

print("=== SAFARI DEBUG ===")

# 1. Get current page title
title = run_osascript('tell application "Safari" to name of document 1')
print(f"Page Title: {title}")

# 2. Get current URL
url = run_osascript('tell application "Safari" to URL of document 1')
print(f"URL: {url}")

# 3. Check if on screener page
if 'screener' in title.lower() or 'qualification' in title.lower():
    print("\n⚠️ ON SCREENER PAGE - Testing fix...")
    
    # 4. Count radio button groups
    radio_count = run_js("""
        (function() {
            var groups = document.querySelectorAll('fieldset, [role="radiogroup"]');
            var count = 0;
            groups.forEach(function(g) {
                if (g.querySelectorAll('input[type="radio"]').length >= 2) count++;
            });
            return count;
        })();
    """)
    print(f"Radio button groups found: {radio_count}")
    
    # 5. Get all question labels
    questions = run_js("""
        (function() {
            var questions = [];
            document.querySelectorAll('fieldset, [role="radiogroup"]').forEach(function(g) {
                var label = g.querySelector('legend, label, span');
                if (label) questions.push(label.innerText.slice(0,60));
            });
            return questions.join(' | ');
        })();
    """)
    print(f"Questions: {questions}")
    
    # 6. Try to fill screener questions
    print("\nAttempting to fill screener questions...")
    filled = run_js("""
        (function() {
            var filled = 0;
            document.querySelectorAll('fieldset, [role="radiogroup"]').forEach(function(group) {
                var label = group.innerText.toLowerCase();
                var radios = group.querySelectorAll('input[type="radio"]');
                if (radios.length < 2) return;
                
                var selectYes = true;
                if (label.includes('felony') || label.includes('convicted') ||
                    label.includes('sponsor') || label.includes('visa')) {
                    selectYes = false;
                }
                
                radios.forEach(function(r) {
                    var rLabel = (r.closest('label')?.innerText || r.parentElement?.innerText || '').toLowerCase().trim();
                    if (selectYes && (rLabel === 'yes' || rLabel === 'yes.')) {
                        r.click(); filled++;
                    } else if (!selectYes && (rLabel === 'no' || rLabel === 'no.')) {
                        r.click(); filled++;
                    }
                });
            });
            return filled;
        })();
    """)
    print(f"Filled {filled} radio buttons")
    
    # 7. Look for Continue button
    continue_btn = run_js("""
        (function() {
            var btns = Array.from(document.querySelectorAll('button'));
            var cont = btns.find(b => b.innerText.trim() === 'Continue' && b.offsetParent && !b.disabled);
            if (cont) return 'Found: ' + cont.innerText;
            return 'Not found. Buttons: ' + btns.filter(b => b.offsetParent).map(b => b.innerText.trim()).slice(0,5).join(', ');
        })();
    """)
    print(f"Continue button: {continue_btn}")
    
else:
    print("\nNot on screener page. Current page analysis:")
    
    # Check for Easy Apply jobs
    jobs = run_js("""
        (function() {
            var jobs = [];
            document.querySelectorAll('.job_seen_beacon').forEach(function(card) {
                if (card.innerText.includes('Easily apply')) {
                    var title = card.querySelector('h2 a, .jobTitle a');
                    if (title) jobs.push(title.innerText.slice(0,40));
                }
            });
            return jobs.length + ' jobs: ' + jobs.slice(0,3).join(', ');
        })();
    """)
    print(f"Easy Apply jobs: {jobs}")

print("\n=== DEBUG COMPLETE ===")
