#!/usr/bin/env python3
"""Check Chrome page status"""
import subprocess

def run_chrome_js(js):
    js_escaped = js.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
    script = f'''
    tell application "Google Chrome"
        tell active tab of window 1
            execute javascript "{js_escaped}"
        end tell
    end tell
    '''
    try:
        result = subprocess.run(['osascript', '-e', script], 
                               capture_output=True, text=True, timeout=15)
        return result.stdout.strip() or "empty"
    except Exception as e:
        return f"Error: {e}"

# Get Chrome page title
title_script = '''
tell application "Google Chrome"
    get title of active tab of window 1
end tell
'''
result = subprocess.run(['osascript', '-e', title_script], capture_output=True, text=True, timeout=10)
print(f"Chrome Title: {result.stdout.strip()}")

# Get URL
url_script = '''
tell application "Google Chrome"
    get URL of active tab of window 1
end tell
'''
result = subprocess.run(['osascript', '-e', url_script], capture_output=True, text=True, timeout=10)
print(f"Chrome URL: {result.stdout.strip()}")

# Check for Easy Apply jobs
jobs = run_chrome_js("""
(function() {
    var jobs = [];
    document.querySelectorAll('.job_seen_beacon').forEach(function(card) {
        if (card.innerText.includes('Easily apply')) {
            var title = card.querySelector('h2 a, .jobTitle a');
            if (title) jobs.push(title.innerText.slice(0,40));
        }
    });
    return jobs.length + ' Easy Apply jobs: ' + jobs.slice(0,3).join(', ');
})();
""")
print(f"Jobs: {jobs}")
