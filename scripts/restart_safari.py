#!/usr/bin/env python3
"""Restart Safari and load Indeed job search"""
import subprocess
import time
import os

def run_cmd(cmd):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        return result.stdout.strip() or result.stderr.strip()
    except Exception as e:
        return f"Error: {e}"

def run_osascript(script):
    try:
        result = subprocess.run(['osascript', '-e', script], 
                               capture_output=True, text=True, timeout=10)
        return result.stdout.strip() or result.stderr.strip()
    except Exception as e:
        return f"Error: {e}"

print("=== RESTARTING SAFARI ===")

# 1. Kill Safari
print("Killing Safari...")
run_cmd("pkill -x Safari")
time.sleep(2)

# 2. Open Safari with Indeed URL
print("Opening Safari with Indeed...")
url = "https://www.indeed.com/jobs?q=IT+support&l=Houston%2C+TX&fromage=7"
run_cmd(f"open -a Safari '{url}'")
time.sleep(6)

# 3. Check page title
title = run_osascript('tell application "Safari" to name of document 1')
print(f"Page Title: {title}")

# 4. Check URL
url_check = run_osascript('tell application "Safari" to URL of document 1')
print(f"URL: {url_check}")

# 5. Check for Easy Apply jobs
if 'indeed' in url_check.lower():
    print("\n✅ Indeed loaded. Checking for Easy Apply jobs...")
    time.sleep(3)
    
    # Run JS to count jobs
    js = '''
    (function() {
        var jobs = [];
        document.querySelectorAll('.job_seen_beacon').forEach(function(card) {
            if (card.innerText.includes('Easily apply')) {
                var title = card.querySelector('h2 a, .jobTitle a');
                if (title) jobs.push(title.innerText.slice(0,40));
            }
        });
        return jobs.length;
    })();
    '''
    js_escaped = js.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
    script = f'tell application "Safari" to tell document 1 to do JavaScript "{js_escaped}"'
    job_count = run_osascript(script)
    print(f"Easy Apply jobs found: {job_count}")
    
    if job_count and int(job_count) > 0:
        print("\n✅ Safari ready for Legion!")
    else:
        print("\n⚠️ No Easy Apply jobs found. May need to:")
        print("   - Check if logged into Indeed")
        print("   - Try different search terms")
        print("   - Wait for page to fully load")
else:
    print(f"\n❌ Indeed not loaded properly")
    print("   May need manual login or different approach")

print("\n=== RESTART COMPLETE ===")
