#!/usr/bin/env python3
"""Test Quick Apply click and modal"""
import subprocess
import time

def run_js(js):
    # Escape quotes for shell
    js = js.replace('"', '\\"').replace("'", "\\'")
    cmd = f'''osascript -e 'tell application "Safari" to do JavaScript "{js}" in document 1' '''
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout.strip()

print("Step 1: Find Quick Apply jobs")
js = '''
(function() {
    var cards = document.querySelectorAll('article');
    var quickApply = [];
    cards.forEach(function(card, idx) {
        if (card.innerText.includes('Quick apply') && idx < 5) {
            var title = card.querySelector('h2');
            quickApply.push({idx: idx, title: title ? title.innerText : 'Unknown'});
        }
    });
    return JSON.stringify(quickApply);
})()
'''
jobs = run_js(js)
print(f"Found: {jobs}")

print("\\nStep 2: Click first Quick Apply button")
click_js = '''
(function() {
    var cards = document.querySelectorAll('article');
    var first = null;
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].innerText.includes('Quick apply')) {
            first = cards[i];
            break;
        }
    }
    if (!first) return 'No Quick Apply found';
    var btn = first.querySelector('button[class*="quick"], button[aria-label*="apply"], [data-testid*="apply"]');
    if (!btn) btn = first.querySelector('button');
    if (btn) { btn.click(); return 'Clicked: ' + btn.innerText; }
    // Try clicking the card itself
    first.click();
    return 'Clicked card';
})()
'''
result = run_js(click_js)
print(f"Click result: {result}")

print("\\nStep 3: Wait and check modal")
time.sleep(3)

modal_js = '''
(function() {
    var modal = document.querySelector('[role=dialog], .modal, [class*=modal], [class*=drawer], [class*=overlay]');
    if (modal) return 'MODAL: ' + modal.innerText.substring(0, 200);
    var forms = document.querySelectorAll('form');
    if (forms.length > 0) return 'FORM: ' + forms[0].innerText.substring(0, 200);
    return 'Page: ' + document.body.innerText.substring(0, 200);
})()
'''
modal = run_js(modal_js)
print(f"Modal state: {modal}")

print("\\nStep 4: Look for buttons")
btn_js = '''Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent).map(b => b.innerText.trim().substring(0,20)).join(' | ')'''
buttons = run_js(btn_js)
print(f"Buttons: {buttons}")
