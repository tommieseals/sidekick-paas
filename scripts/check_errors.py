#!/usr/bin/env python3
"""Check for validation errors or missing fields"""
import subprocess

def run_js(js):
    js_escaped = js.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
    script = f'tell application "Safari" to tell document 1 to do JavaScript "{js_escaped}"'
    try:
        result = subprocess.run(['osascript', '-e', script], 
                               capture_output=True, text=True, timeout=15)
        return result.stdout.strip()
    except Exception as e:
        return f"Error: {e}"

print("=== CHECKING FOR ERRORS/MISSING FIELDS ===\n")

# 1. Check for error messages
errors = run_js("""
(function() {
    var errors = [];
    // Common error selectors
    var selectors = '[class*="error"], [class*="Error"], [role="alert"], .ia-Error, [data-testid*="error"]';
    document.querySelectorAll(selectors).forEach(function(el) {
        if (el.innerText && el.offsetParent) {
            errors.push(el.innerText.slice(0, 100));
        }
    });
    return errors.length ? errors.join(' | ') : 'No errors found';
})();
""")
print(f"Errors: {errors}")

# 2. Check for required fields not filled
required = run_js("""
(function() {
    var missing = [];
    document.querySelectorAll('[required], [aria-required="true"]').forEach(function(el) {
        if (!el.value && el.offsetParent) {
            var label = el.closest('div')?.innerText?.slice(0, 50) || el.name || 'unknown';
            missing.push(label);
        }
    });
    return missing.length ? missing.join(' | ') : 'All required fields filled';
})();
""")
print(f"Required: {required}")

# 3. Check Continue button state
btn = run_js("""
(function() {
    var btns = Array.from(document.querySelectorAll('button'));
    var cont = btns.find(b => b.innerText.trim() === 'Continue');
    if (!cont) return 'No Continue button found';
    return 'Continue: disabled=' + cont.disabled + ', visible=' + (cont.offsetParent !== null);
})();
""")
print(f"Button: {btn}")

# 4. Check page body for clues
body = run_js("""
(function() {
    var text = document.body.innerText.toLowerCase();
    if (text.includes('please answer')) return 'Contains: please answer';
    if (text.includes('required')) return 'Contains: required';
    if (text.includes('select an')) return 'Contains: select an';
    return 'No obvious validation text';
})();
""")
print(f"Page clues: {body}")

# 5. Get current URL
url = subprocess.run(['osascript', '-e', 'tell application "Safari" to URL of document 1'],
                    capture_output=True, text=True).stdout.strip()
print(f"\nURL: {url}")

# 6. Count total questions vs answered
counts = run_js("""
(function() {
    var radios = document.querySelectorAll('input[type="radio"]');
    var groups = {};
    radios.forEach(function(r) { if (!groups[r.name]) groups[r.name] = []; groups[r.name].push(r); });
    var total = Object.keys(groups).length;
    var answered = 0;
    Object.values(groups).forEach(function(g) { if (g.some(r => r.checked)) answered++; });
    return 'Questions: ' + answered + '/' + total + ' answered';
})();
""")
print(f"\n{counts}")

print("\n=== CHECK COMPLETE ===")
