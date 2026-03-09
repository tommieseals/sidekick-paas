#!/usr/bin/env python3
"""Test the fixed screener fill function"""
import subprocess
import time

def run_js(js):
    js_escaped = js.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
    script = f'tell application "Safari" to tell document 1 to do JavaScript "{js_escaped}"'
    try:
        result = subprocess.run(['osascript', '-e', script], 
                               capture_output=True, text=True, timeout=15)
        return result.stdout.strip()
    except Exception as e:
        return f"Error: {e}"

print("=== TESTING FIXED SCREENER FILL ===\n")

# 1. Check we're on screener
title = subprocess.run(['osascript', '-e', 'tell application "Safari" to name of document 1'],
                      capture_output=True, text=True).stdout.strip()
print(f"Page: {title}")

if 'screener' not in title.lower() and 'question' not in title.lower():
    print("Not on screener page!")
    exit(1)

# 2. Run the FIXED screener fill logic
print("\nFilling screener questions...")
result = run_js("""
(function() {
    var filled = 0;
    var radios = document.querySelectorAll('input[type="radio"]');
    
    // Group radios by name
    var groups = {};
    radios.forEach(function(r) {
        if (!groups[r.name]) groups[r.name] = [];
        groups[r.name].push(r);
    });
    
    var log = [];
    
    // For each group, find the question context and click Yes or No
    Object.keys(groups).forEach(function(name) {
        var group = groups[name];
        if (group.length < 2) return;
        
        // Already answered?
        if (group.some(function(r) { return r.checked; })) {
            log.push(name.slice(0,10) + ': already checked');
            return;
        }
        
        // Find the question text - look up the DOM tree
        var container = group[0].closest('.ia-Questions-item') || 
                       group[0].closest('[class*="question"]') ||
                       group[0].parentElement?.parentElement?.parentElement?.parentElement;
        var questionText = container ? container.innerText.toLowerCase() : '';
        
        // Decide Yes or No based on question content
        var selectYes = true;
        
        // Select NO for these patterns
        if (questionText.includes('felony') || 
            questionText.includes('convicted') ||
            questionText.includes('criminal') ||
            questionText.includes('sponsor') || 
            questionText.includes('visa') ||
            questionText.includes('require sponsorship')) {
            selectYes = false;
        }
        
        // Find and click the right option
        group.forEach(function(r) {
            var label = r.closest('label');
            var labelText = label ? label.innerText.trim().toLowerCase() : '';
            
            if (selectYes && (labelText === 'yes' || labelText === 'yes.')) {
                r.click();
                filled++;
                log.push(name.slice(0,10) + ': clicked YES');
            } else if (!selectYes && (labelText === 'no' || labelText === 'no.')) {
                r.click();
                filled++;
                log.push(name.slice(0,10) + ': clicked NO');
            }
        });
    });
    
    return 'Filled ' + filled + ' questions. ' + log.join(', ');
})();
""")
print(f"Result: {result}")

# 3. Click Continue
print("\nClicking Continue...")
time.sleep(1)
cont = run_js("""
(function() {
    var btn = Array.from(document.querySelectorAll('button')).find(b => 
        b.innerText.trim() === 'Continue' && b.offsetParent && !b.disabled);
    if (btn) { btn.click(); return 'Clicked Continue'; }
    return 'Continue button not found';
})();
""")
print(f"Continue: {cont}")

time.sleep(3)

# 4. Check new page
new_title = subprocess.run(['osascript', '-e', 'tell application "Safari" to name of document 1'],
                          capture_output=True, text=True).stdout.strip()
print(f"\nNew page: {new_title}")

if 'screener' in new_title.lower() or 'question' in new_title.lower():
    print("⚠️ Still on screener - may have more questions")
elif 'submitted' in new_title.lower():
    print("✅ APPLICATION SUBMITTED!")
elif 'review' in new_title.lower():
    print("📋 On review page - need to click Submit")
else:
    print(f"📄 Moved to: {new_title}")

print("\n=== TEST COMPLETE ===")
