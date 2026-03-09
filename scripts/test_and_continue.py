#!/usr/bin/env python3
"""Test fixed screener fill and continue through the application"""
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

def get_title():
    result = subprocess.run(['osascript', '-e', 'tell application "Safari" to name of document 1'],
                           capture_output=True, text=True, timeout=10)
    return result.stdout.strip()

print("=== TESTING APPLICATION FLOW ===\n")

for step in range(5):
    title = get_title()
    print(f"Step {step+1}: {title[:60]}")
    
    if 'submitted' in title.lower():
        print("\n✅ APPLICATION SUBMITTED!")
        break
    
    # Fill screener questions
    filled = run_js("""
    (function() {
        var filled = 0;
        var radios = document.querySelectorAll('input[type="radio"]');
        var groups = {};
        radios.forEach(function(r) {
            if (!groups[r.name]) groups[r.name] = [];
            groups[r.name].push(r);
        });
        
        Object.keys(groups).forEach(function(name) {
            var group = groups[name];
            if (group.length < 2) return;
            if (group.some(function(r) { return r.checked; })) return;
            
            var container = group[0].closest('.ia-Questions-item') || 
                           group[0].parentElement?.parentElement?.parentElement?.parentElement;
            var questionText = container ? container.innerText.toLowerCase() : '';
            
            var selectYes = true;
            if (questionText.includes('felony') || questionText.includes('sponsor') || 
                questionText.includes('visa') || questionText.includes('convicted')) {
                selectYes = false;
            }
            
            group.forEach(function(r) {
                var label = r.closest('label');
                var labelText = label ? label.innerText.trim() : '';
                var shouldClick = (selectYes && labelText === 'Yes') || 
                                 (!selectYes && labelText === 'No');
                if (shouldClick) {
                    r.click();
                    r.dispatchEvent(new Event('change', {bubbles: true}));
                    if (label) label.click();
                    filled++;
                }
            });
        });
        return filled;
    })();
    """)
    print(f"   Filled: {filled} questions")
    time.sleep(1)
    
    # Fill form fields (text inputs, selects)
    form_filled = run_js("""
    (function() {
        var filled = 0;
        // Text inputs
        document.querySelectorAll('input[type=text], input[type=number]').forEach(function(i) {
            if (i.value || !i.offsetParent) return;
            var ctx = (i.closest('div') || {}).innerText || '';
            ctx = ctx.toLowerCase();
            var val = '';
            if (ctx.includes('year') && ctx.includes('experience')) val = '5';
            else if (ctx.includes('salary') || ctx.includes('pay')) val = '75000';
            else if (ctx.includes('zip')) val = '77095';
            else if (ctx.includes('city')) val = 'Houston';
            if (val) {
                var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                setter.call(i, val);
                i.dispatchEvent(new Event('input', {bubbles: true}));
                i.dispatchEvent(new Event('change', {bubbles: true}));
                filled++;
            }
        });
        return filled;
    })();
    """)
    if form_filled and form_filled != '0':
        print(f"   Form fields: {form_filled}")
    
    time.sleep(0.5)
    
    # Click Continue/Submit/Review
    action = run_js("""
    (function() {
        var btns = Array.from(document.querySelectorAll('button'));
        var btn = btns.find(b => b.innerText.trim() === 'Continue' && b.offsetParent && !b.disabled);
        if (btn) { btn.click(); return 'Continue'; }
        btn = btns.find(b => b.innerText.toLowerCase().includes('submit') && b.offsetParent && !b.disabled);
        if (btn) { btn.click(); return 'Submit'; }
        btn = btns.find(b => b.innerText.toLowerCase().includes('review') && b.offsetParent && !b.disabled);
        if (btn) { btn.click(); return 'Review'; }
        return 'No button';
    })();
    """)
    print(f"   Action: {action}")
    
    time.sleep(3)

print("\n=== TEST COMPLETE ===")
final_title = get_title()
print(f"Final page: {final_title}")
