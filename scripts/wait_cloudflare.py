#!/usr/bin/env python3
"""Navigate to Indeed and wait for Cloudflare to clear"""
import subprocess
import time

def set_url(url):
    script = f'tell application "Safari" to set URL of document 1 to "{url}"'
    subprocess.run(['osascript', '-e', script], capture_output=True, timeout=10)

def get_title():
    result = subprocess.run(['osascript', '-e', 'tell application "Safari" to name of document 1'], 
                           capture_output=True, text=True, timeout=10)
    return result.stdout.strip()

print("Navigating to Indeed...")
set_url("https://www.indeed.com/jobs?q=help+desk&l=Houston")

print("Waiting for Cloudflare (checking every 5 seconds)...")
for i in range(12):  # Wait up to 60 seconds
    time.sleep(5)
    title = get_title()
    print(f"  {(i+1)*5}s: {title[:50]}")
    
    if 'indeed' in title.lower() and 'moment' not in title.lower():
        print("\n✅ CLOUDFLARE CLEARED!")
        break
else:
    print("\n❌ Cloudflare did not clear in 60 seconds")
    
print(f"\nFinal title: {get_title()}")
