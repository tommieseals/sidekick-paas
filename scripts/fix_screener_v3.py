#!/usr/bin/env python3
"""Fix fill_screener_questions() with React-compatible events"""

file_path = "/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py"

with open(file_path, "r") as f:
    content = f.read()

# Find and replace the fill_screener_questions function
old_func_start = 'def fill_screener_questions():'
old_func_end = "    return run_js(js)\n\ndef click_continue_or_submit"

start_idx = content.find(old_func_start)
end_idx = content.find(old_func_end, start_idx)

if start_idx == -1:
    print("Could not find fill_screener_questions function")
    exit(1)

after_func = content[end_idx + len("    return run_js(js)\n\n"):]
before_func = content[:start_idx]

new_func = '''def fill_screener_questions():
    """Fill Yes/No screening questions on Indeed - React-compatible with proper events"""
    js = \'\'\'(function() {
        var filled = 0;
        var radios = document.querySelectorAll('input[type="radio"]');
        
        // Group radios by name
        var groups = {};
        radios.forEach(function(r) {
            if (!groups[r.name]) groups[r.name] = [];
            groups[r.name].push(r);
        });
        
        // For each group, click Yes or No
        Object.keys(groups).forEach(function(name) {
            var group = groups[name];
            if (group.length < 2) return;
            
            // Already answered?
            if (group.some(function(r) { return r.checked; })) return;
            
            // Find question context
            var container = group[0].closest('.ia-Questions-item') || 
                           group[0].parentElement?.parentElement?.parentElement?.parentElement;
            var questionText = container ? container.innerText.toLowerCase() : '';
            
            // Default to Yes, but No for specific patterns
            var selectYes = true;
            if (questionText.includes('felony') || 
                questionText.includes('convicted') ||
                questionText.includes('criminal') ||
                questionText.includes('sponsor') || 
                questionText.includes('visa')) {
                selectYes = false;
            }
            
            // Find and click the right option with React-compatible events
            group.forEach(function(r) {
                var label = r.closest('label');
                var labelText = label ? label.innerText.trim() : '';
                
                var shouldClick = (selectYes && labelText === 'Yes') || 
                                 (!selectYes && labelText === 'No');
                
                if (shouldClick) {
                    // Click the radio
                    r.click();
                    
                    // Fire React-compatible events
                    r.dispatchEvent(new Event('change', {bubbles: true}));
                    r.dispatchEvent(new Event('input', {bubbles: true}));
                    
                    // Also click the label for good measure
                    if (label) label.click();
                    
                    filled++;
                }
            });
        });
        
        return filled;
    })();\'\'\' 
    return run_js(js)

'''

new_content = before_func + new_func + after_func

with open(file_path, "w") as f:
    f.write(new_content)

print("✅ Fixed screener with React-compatible events!")
print("   - Compares 'Yes'/'No' (capitalized)")
print("   - Fires change/input events")
print("   - Also clicks label element")
