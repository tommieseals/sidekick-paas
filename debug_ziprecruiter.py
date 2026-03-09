#!/usr/bin/env python3
"""Debug ZipRecruiter modal state"""
import subprocess
import time
import json

def run_js(js):
    cmd = f'''osascript -e 'tell application "Safari" to do JavaScript "{js}" in document 1' '''
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout.strip()

# Check current page
print("Current page:", run_js("document.title"))

# Look for modal/dialog
modal_check = '''
(function() {
    var modal = document.querySelector('[role="dialog"], .modal, [class*="modal"], [class*="drawer"]');
    if (modal) return "MODAL FOUND: " + modal.className;
    
    // Check for application form indicators
    var form = document.querySelector('form');
    if (form && form.innerText.includes('Resume')) return "FORM: has resume field";
    if (form && form.innerText.includes('Continue')) return "FORM: has continue";
    
    return "NO MODAL - on search page";
})()
'''
print("Modal state:", run_js(modal_check.replace("\n", " ")))

# Count all buttons
buttons = '''
(function() {
    var btns = Array.from(document.querySelectorAll('button'));
    var visible = btns.filter(b => b.offsetParent);
    return visible.map(b => b.innerText.trim().substring(0,30)).join(" | ");
})()
'''
print("Visible buttons:", run_js(buttons.replace("\n", " ")))
