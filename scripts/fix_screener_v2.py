#!/usr/bin/env python3
"""Fix fill_screener_questions() to use correct Indeed selectors"""

file_path = "/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py"

with open(file_path, "r") as f:
    content = f.read()

# Find and replace the fill_screener_questions function
old_func_start = 'def fill_screener_questions():'
old_func_end = "    return run_js(js)\n\ndef click_continue_or_submit"

# Find the function boundaries
start_idx = content.find(old_func_start)
end_idx = content.find(old_func_end, start_idx)

if start_idx == -1:
    print("Could not find fill_screener_questions function")
    exit(1)

# Extract what comes after the function (click_continue_or_submit and rest)
after_func = content[end_idx + len("    return run_js(js)\n\n"):]
before_func = content[:start_idx]

new_func = '''def fill_screener_questions():
    """Fill Yes/No screening questions on Indeed screener pages - FIXED for Indeed's actual HTML"""
    js = \'\'\'(function() {
        var filled = 0;
        var radios = document.querySelectorAll('input[type="radio"]');
        
        // Group radios by name
        var groups = {};
        radios.forEach(function(r) {
            if (!groups[r.name]) groups[r.name] = [];
            groups[r.name].push(r);
        });
        
        // For each group, find the question context and click Yes or No
        Object.keys(groups).forEach(function(name) {
            var group = groups[name];
            if (group.length < 2) return;
            
            // Already answered?
            if (group.some(function(r) { return r.checked; })) return;
            
            // Find the question text - look up the DOM tree
            var container = group[0].closest('.ia-Questions-item') || 
                           group[0].closest('[class*="question"]') ||
                           group[0].parentElement?.parentElement?.parentElement?.parentElement;
            var questionText = container ? container.innerText.toLowerCase() : '';
            
            // Decide Yes or No based on question content
            var selectYes = true;
            
            // Select NO for these patterns
            if (questionText.includes('felony') || 
                questionText.includes('convicted') ||
                questionText.includes('criminal') ||
                questionText.includes('sponsor') || 
                questionText.includes('visa') ||
                questionText.includes('require sponsorship') ||
                questionText.includes('related to') ||
                questionText.includes('relative')) {
                selectYes = false;
            }
            
            // Find and click the right option
            group.forEach(function(r) {
                var label = r.closest('label');
                var labelText = label ? label.innerText.trim().toLowerCase() : '';
                
                if (selectYes && (labelText === 'yes' || labelText === 'yes.')) {
                    r.click();
                    filled++;
                } else if (!selectYes && (labelText === 'no' || labelText === 'no.')) {
                    r.click();
                    filled++;
                }
            });
        });
        
        return filled;
    })();\'\'\' 
    return run_js(js)

'''

# Reconstruct the file
new_content = before_func + new_func + after_func

with open(file_path, "w") as f:
    f.write(new_content)

print("✅ Fixed fill_screener_questions() with correct Indeed selectors!")
print("   - Now groups radios by 'name' attribute")
print("   - Looks for .ia-Questions-item container")
print("   - Clicks Yes by default, No for felony/sponsor/visa questions")
