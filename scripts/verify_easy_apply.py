#!/usr/bin/env python3
"""Verify which jobs have actual Easy Apply vs external apply"""
import subprocess

def run_js(js):
    js_escaped = js.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
    script = f'tell application "Safari" to tell document 1 to do JavaScript "{js_escaped}"'
    try:
        result = subprocess.run(['osascript', '-e', script], 
                               capture_output=True, text=True, timeout=10)
        return result.stdout.strip() or "empty"
    except Exception as e:
        return f"Error: {e}"

print("=== VERIFYING EASY APPLY JOBS ===\n")

# Check all job cards and their apply type
jobs = run_js("""
(function() {
    var cards = document.querySelectorAll('.job_seen_beacon');
    var result = [];
    cards.forEach(function(card, i) {
        var title = card.querySelector('h2 a, .jobTitle a')?.innerText || 'No title';
        var text = card.innerText.toLowerCase();
        
        var applyType = 'Unknown';
        if (text.includes('easily apply')) applyType = 'EASY APPLY ✅';
        else if (text.includes('encouraged to apply')) applyType = 'Encouraged (external) ❌';
        else if (text.includes('apply on company')) applyType = 'Company site ❌';
        else if (text.includes('apply now')) applyType = 'Apply Now (check)';
        
        if (i < 10) {
            result.push((i+1) + '. ' + title.slice(0,35) + ' - ' + applyType);
        }
    });
    return result.join('\\n');
})();
""")
print("Jobs on page:")
print(jobs)

# Count actual Easy Apply
count = run_js("""
(function() {
    var cards = document.querySelectorAll('.job_seen_beacon');
    var easy = 0;
    cards.forEach(function(card) {
        if (card.innerText.toLowerCase().includes('easily apply')) easy++;
    });
    return easy;
})();
""")
print(f"\nActual Easy Apply jobs: {count}")

print("\n=== VERIFICATION COMPLETE ===")
