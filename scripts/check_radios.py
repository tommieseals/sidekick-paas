#!/usr/bin/env python3
"""Check radio button state and debug clicking"""
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

print("=== CHECKING RADIO STATE ===\n")

# 1. Check which radios are checked
checked = run_js("""
(function() {
    var radios = document.querySelectorAll('input[type="radio"]');
    var info = [];
    radios.forEach(function(r, i) {
        var label = r.closest('label')?.innerText?.trim() || 'no label';
        info.push(i + ': ' + (r.checked ? 'CHECKED' : 'unchecked') + ' - ' + label);
    });
    return info.join('\\n');
})();
""")
print("Radio states:")
print(checked)

# 2. Check label text more precisely
print("\n\nLabel details:")
labels = run_js("""
(function() {
    var radios = document.querySelectorAll('input[type="radio"]');
    var info = [];
    radios.forEach(function(r, i) {
        var label = r.closest('label');
        if (label) {
            var text = label.innerText;
            var trimmed = text.trim();
            info.push(i + ': [' + JSON.stringify(trimmed) + '] len=' + trimmed.length);
        }
    });
    return info.join('\\n');
})();
""")
print(labels)

# 3. Try clicking the first Yes radio directly
print("\n\nTrying direct click on first Yes radio...")
click = run_js("""
(function() {
    var radios = document.querySelectorAll('input[type="radio"]');
    var firstYes = null;
    radios.forEach(function(r) {
        var label = r.closest('label')?.innerText?.trim();
        if (label === 'Yes' && !firstYes) firstYes = r;
    });
    if (firstYes) {
        firstYes.click();
        return 'Clicked! checked=' + firstYes.checked;
    }
    return 'No Yes radio found';
})();
""")
print(click)

# 4. Check state after click
print("\nState after click:")
after = run_js("""
(function() {
    var radios = document.querySelectorAll('input[type="radio"]');
    var checked = [];
    radios.forEach(function(r, i) {
        if (r.checked) {
            var label = r.closest('label')?.innerText?.trim() || 'no label';
            checked.push(i + ': ' + label);
        }
    });
    return checked.length ? checked.join(', ') : 'None checked';
})();
""")
print(after)
