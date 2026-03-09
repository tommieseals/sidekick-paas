#!/usr/bin/env python3
"""Inspect Indeed screener page HTML structure"""
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

print("=== INSPECTING SCREENER PAGE ===\n")

# 1. Get all radio buttons
print("1. All radio buttons on page:")
radios = run_js("""
    (function() {
        var radios = document.querySelectorAll('input[type="radio"]');
        var info = [];
        radios.forEach(function(r, i) {
            var parent = r.parentElement;
            var label = r.closest('label')?.innerText || parent?.innerText || 'no label';
            var name = r.name || 'no name';
            info.push(i + ': name=' + name + ', label=' + label.slice(0,30));
        });
        return info.join('\\n');
    })();
""")
print(radios or "None found")

# 2. Check for divs with question-like content
print("\n2. Question containers (divs with question text):")
questions = run_js("""
    (function() {
        var questions = [];
        // Look for common Indeed question containers
        var containers = document.querySelectorAll('[data-testid], [class*="question"], [class*="Question"]');
        containers.forEach(function(c, i) {
            if (c.innerText && c.innerText.length < 200 && c.innerText.includes('?')) {
                questions.push(i + ': ' + c.innerText.slice(0,80));
            }
        });
        return questions.slice(0,5).join('\\n');
    })();
""")
print(questions or "None found")

# 3. Look for Yes/No text anywhere
print("\n3. Yes/No labels on page:")
yesno = run_js("""
    (function() {
        var items = [];
        document.querySelectorAll('label, span, div').forEach(function(el) {
            var text = el.innerText?.trim();
            if (text === 'Yes' || text === 'No' || text === 'Yes.' || text === 'No.') {
                var tag = el.tagName;
                var parent = el.parentElement?.tagName || 'none';
                items.push(text + ' (' + tag + ' in ' + parent + ')');
            }
        });
        return items.slice(0,10).join('\\n');
    })();
""")
print(yesno or "None found")

# 4. Check the actual input structure
print("\n4. Radio input parent structure:")
structure = run_js("""
    (function() {
        var radio = document.querySelector('input[type="radio"]');
        if (!radio) return 'No radio found';
        
        var path = [];
        var el = radio;
        for (var i = 0; i < 5 && el; i++) {
            var classes = el.className ? '.' + el.className.split(' ')[0] : '';
            path.push(el.tagName + classes);
            el = el.parentElement;
        }
        return path.join(' < ');
    })();
""")
print(structure)

# 5. Check if there's a form
print("\n5. Form structure:")
form = run_js("""
    (function() {
        var form = document.querySelector('form');
        if (!form) return 'No form found';
        var inputs = form.querySelectorAll('input[type="radio"]');
        return 'Form found with ' + inputs.length + ' radio inputs';
    })();
""")
print(form)

# 6. Get full page text to understand questions
print("\n6. Page body text (first 500 chars):")
body = run_js("""
    (function() {
        return document.body.innerText.slice(0, 500);
    })();
""")
print(body)

print("\n=== INSPECTION COMPLETE ===")
