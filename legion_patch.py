# This script patches legion_runner_v4.py with better status detection

file_path = "/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py"

with open(file_path, "r") as f:
    content = f.read()

# 1. Add check_application_status() function after click_continue_or_submit()
new_function = '''
def check_application_status():
    """Check page for success/failure indicators - checks both title AND body"""
    js = \'\'\'(function() {
        var title = document.title.toLowerCase();
        var body = document.body ? document.body.innerText.toLowerCase() : "";
        
        // Success indicators
        if (title.includes("submitted") || title.includes("application sent") ||
            body.includes("your application has been submitted") ||
            body.includes("application submitted") ||
            body.includes("thank you for applying") ||
            body.includes("application was sent") ||
            body.includes("successfully submitted") ||
            body.includes("we received your application")) {
            return "SUBMITTED";
        }
        
        // Already applied
        if (body.includes("already applied") || body.includes("you have already") ||
            title.includes("already applied")) {
            return "ALREADY_APPLIED";
        }
        
        // Blocked/Error states
        if (body.includes("something went wrong") || body.includes("error occurred") ||
            body.includes("unable to process") || body.includes("captcha") ||
            body.includes("too many requests") || body.includes("please try again later") ||
            body.includes("access denied") || body.includes("blocked")) {
            return "BLOCKED";
        }
        
        // Still on screener questions
        if (title.includes("screener") || title.includes("qualification") ||
            body.includes("answer the following") || body.includes("screening questions")) {
            return "SCREENER";
        }
        
        // Still on form (has continue button and required fields)
        var hasContinue = document.querySelector("button") && 
            Array.from(document.querySelectorAll("button")).some(b => 
                b.innerText.toLowerCase().includes("continue") && b.offsetParent);
        var hasRequired = body.includes("required") || document.querySelector("[required]");
        if (hasContinue && hasRequired) {
            return "FORM_INCOMPLETE";
        }
        
        // Review page
        if (title.includes("review") || body.includes("review your application")) {
            return "REVIEW";
        }
        
        return "UNKNOWN";
    })();\'\'\' 
    return run_js(js)

'''

# Find where to insert (before apply_to_single_job function)
insert_marker = "def apply_to_single_job(job):"
if insert_marker in content and "def check_application_status" not in content:
    content = content.replace(insert_marker, new_function + insert_marker)
    print("Added check_application_status() function")
else:
    if "def check_application_status" in content:
        print("check_application_status already exists")
    else:
        print("Could not find insertion point")

# 2. Update apply_to_single_job to use the new function
old_check_block = '''    # Navigate through form (up to 15 steps)
    for i in range(15):
        title = get_title().lower()
        
        # Check if submitted
        if 'submitted' in title or 'thank' in title:
            return "SUBMITTED", "Success!"
        
        # Check if already applied
        if 'already applied' in title:
            return "ALREADY_APPLIED", "Already applied"'''

new_check_block = '''    # Navigate through form (up to 15 steps)
    for i in range(15):
        # Check status using comprehensive detection
        status = check_application_status()
        
        if status == "SUBMITTED":
            return "SUBMITTED", "Success!"
        elif status == "ALREADY_APPLIED":
            return "ALREADY_APPLIED", "Already applied"
        elif status == "BLOCKED":
            return "BLOCKED", "Blocked or error detected"'''

if old_check_block in content:
    content = content.replace(old_check_block, new_check_block)
    print("Updated form navigation loop")
else:
    print("Could not find exact old check block")

# 3. Update final check at end of apply_to_single_job
old_final = '''    # Final check
    title = get_title().lower()
    if 'submitted' in title:
        return "SUBMITTED", "Late confirm"
    
    return "UNKNOWN", f"Ended on: {get_title()[:30]}"'''

new_final = '''    # Final comprehensive check
    final_status = check_application_status()
    if final_status == "SUBMITTED":
        return "SUBMITTED", "Late confirm"
    elif final_status == "ALREADY_APPLIED":
        return "ALREADY_APPLIED", "Already applied"
    elif final_status == "BLOCKED":
        return "BLOCKED", "Blocked or error"
    elif final_status == "SCREENER":
        return "FAILED", "Stuck on screener questions"
    elif final_status == "FORM_INCOMPLETE":
        return "FAILED", "Form incomplete - required fields"
    elif final_status == "REVIEW":
        return "FAILED", "Stuck on review page"
    
    return "UNKNOWN", f"Status: {final_status}, Title: {get_title()[:30]}"'''

if old_final in content:
    content = content.replace(old_final, new_final)
    print("Updated final status check")
else:
    print("Could not find exact final check block")

# 4. Update log_application icons to include new statuses
old_icons = 'icons = {"SUBMITTED": "✅", "SKIPPED": "⏭️", "ALREADY_APPLIED": "⏭️", "UNKNOWN": "❓", "TIMEOUT": "⏱️", "FAILED": "❌"}'
new_icons = 'icons = {"SUBMITTED": "✅", "SKIPPED": "⏭️", "ALREADY_APPLIED": "⏭️", "UNKNOWN": "❓", "TIMEOUT": "⏱️", "FAILED": "❌", "BLOCKED": "🚫"}'

if old_icons in content:
    content = content.replace(old_icons, new_icons)
    print("Updated status icons")

# Write patched file
with open(file_path, "w") as f:
    f.write(content)

print("\nPatch complete!")
