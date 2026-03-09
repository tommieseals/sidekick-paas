#!/usr/bin/env python3
"""Fill the missing text fields RIGHT NOW"""
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

print("=== FILLING TEXT FIELDS NOW ===\n")

# 1. Check current state
errors = run_js("""
(function() {
    var missing = [];
    document.querySelectorAll('input[type="text"], textarea').forEach(function(el) {
        if (!el.value && el.offsetParent) {
            var ctx = el.closest('div')?.innerText?.slice(0, 60) || 'unknown';
            missing.push(ctx);
        }
    });
    return missing.length ? missing.join(' | ') : 'All filled';
})();
""")
print(f"Empty text fields: {errors}")

# 2. Fill text fields
filled = run_js("""
(function() {
    var filled = 0;
    document.querySelectorAll('input[type="text"], textarea').forEach(function(input) {
        if (input.value || !input.offsetParent) return;
        
        var container = input.closest('.ia-Questions-item') || input.closest('div');
        var questionText = container ? container.innerText.toLowerCase() : '';
        
        var value = '';
        if (questionText.includes('person') || questionText.includes('name') || 
            questionText.includes('relative') || questionText.includes('referral')) {
            value = 'N/A - No referral';
        } else if (questionText.includes('employment') || questionText.includes('detail')) {
            value = 'N/A - No outside employment';
        } else {
            value = 'N/A';
        }
        
        // React-compatible fill
        var proto = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
        setter.call(input, value);
        input.dispatchEvent(new Event('input', {bubbles: true}));
        input.dispatchEvent(new Event('change', {bubbles: true}));
        input.dispatchEvent(new Event('blur', {bubbles: true}));
        filled++;
    });
    return filled;
})();
""")
print(f"Filled: {filled} text fields")

time.sleep(1)

# 3. Check required fields again
errors = run_js("""
(function() {
    var missing = [];
    document.querySelectorAll('[required], [aria-required="true"]').forEach(function(el) {
        if (!el.value && el.offsetParent) {
            missing.push(el.tagName + ': ' + el.name);
        }
    });
    return missing.length ? missing.join(' | ') : 'All required filled!';
})();
""")
print(f"Required fields: {errors}")

# 4. Click Continue
print("\nClicking Continue...")
result = run_js("""
(function() {
    var btn = Array.from(document.querySelectorAll('button')).find(
        b => b.innerText.trim() === 'Continue' && b.offsetParent && !b.disabled
    );
    if (btn) { btn.click(); return 'Clicked'; }
    return 'Not found';
})();
""")
print(f"Continue: {result}")

time.sleep(3)

# 5. Check new page
title = subprocess.run(['osascript', '-e', 'tell application "Safari" to name of document 1'],
                      capture_output=True, text=True).stdout.strip()
print(f"\nNew page: {title}")

if 'screener' in title.lower():
    print("⚠️ Still on screener - checking for more questions...")
elif 'submitted' in title.lower():
    print("✅ SUBMITTED!")
elif 'review' in title.lower():
    print("📋 On review page")
else:
    print("📄 Moved forward!")
