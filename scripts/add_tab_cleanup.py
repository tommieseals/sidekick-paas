#!/usr/bin/env python3
"""Add tab cleanup function to legion_runner_v4.py"""

file_path = "/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py"

with open(file_path, "r") as f:
    content = f.read()

# Check if already added
if "def close_extra_tabs" in content:
    print("Tab cleanup already exists")
    exit(0)

# Add the function after imports, before other functions
import_end = content.find("\nJOB_SEARCHES")
if import_end == -1:
    import_end = content.find("\ndef ")

cleanup_func = '''

def close_extra_tabs():
    """Close all Safari tabs except the first one to prevent memory bloat"""
    script = """
    tell application "Safari"
        if (count of windows) > 0 then
            tell window 1
                set tabCount to count of tabs
                if tabCount > 1 then
                    repeat with i from tabCount to 2 by -1
                        close tab i
                    end repeat
                end if
            end tell
        end if
    end tell
    """
    try:
        subprocess.run(['osascript', '-e', script], capture_output=True, timeout=10)
    except:
        pass

def restart_safari_clean():
    """Kill Safari and start fresh with one window"""
    try:
        subprocess.run(['pkill', '-9', 'Safari'], capture_output=True)
        time.sleep(2)
        subprocess.run(['open', '-a', 'Safari'], capture_output=True)
        time.sleep(3)
    except:
        pass

'''

content = content[:import_end] + cleanup_func + content[import_end:]

# Now add cleanup call in apply_to_single_job - at the end before return
# Find the function and add cleanup before each return

old_return_submitted = 'return "SUBMITTED", "Success!"'
new_return_submitted = 'close_extra_tabs()\n            return "SUBMITTED", "Success!"'

old_return_already = 'return "ALREADY_APPLIED", "Already applied"'
new_return_already = 'close_extra_tabs()\n            return "ALREADY_APPLIED", "Already applied"'

old_return_timeout = 'return "TIMEOUT", "JS timeout in form"'
new_return_timeout = 'close_extra_tabs()\n            return "TIMEOUT", "JS timeout in form"'

# Replace returns to add cleanup
content = content.replace(old_return_submitted, new_return_submitted, 1)
content = content.replace(old_return_already, new_return_already, 1)
content = content.replace(old_return_timeout, new_return_timeout, 1)

# Also add cleanup at the end of apply_to_single_job (final return)
old_final = 'return "UNKNOWN", f"Status: {final_status}'
new_final = 'close_extra_tabs()\n    return "UNKNOWN", f"Status: {final_status}'
content = content.replace(old_final, new_final, 1)

with open(file_path, "w") as f:
    f.write(content)

print("✅ Added tab cleanup functions!")
print("   - close_extra_tabs(): Closes all but first tab")
print("   - restart_safari_clean(): Full Safari restart")
print("   - Cleanup called after each job attempt")
