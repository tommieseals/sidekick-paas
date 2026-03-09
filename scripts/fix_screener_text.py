#!/usr/bin/env python3
"""Add text input handling to fill_screener_questions()"""

file_path = "/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py"

with open(file_path, "r") as f:
    content = f.read()

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
    """Fill screening questions - BOTH radio buttons AND text fields"""
    js = \'\'\'(function() {
        var filled = 0;
        
        // 1. Handle radio buttons (Yes/No questions)
        var radios = document.querySelectorAll('input[type="radio"]');
        var groups = {};
        radios.forEach(function(r) {
            if (!groups[r.name]) groups[r.name] = [];
            groups[r.name].push(r);
        });
        
        Object.keys(groups).forEach(function(name) {
            var group = groups[name];
            if (group.length < 2) return;
            if (group.some(function(r) { return r.checked; })) return;
            
            var container = group[0].closest('.ia-Questions-item') || 
                           group[0].parentElement?.parentElement?.parentElement?.parentElement;
            var questionText = container ? container.innerText.toLowerCase() : '';
            
            var selectYes = true;
            if (questionText.includes('felony') || questionText.includes('sponsor') || 
                questionText.includes('visa') || questionText.includes('convicted') ||
                questionText.includes('criminal') || questionText.includes('related to') ||
                questionText.includes('relative')) {
                selectYes = false;
            }
            
            group.forEach(function(r) {
                var label = r.closest('label');
                var labelText = label ? label.innerText.trim() : '';
                var shouldClick = (selectYes && labelText === 'Yes') || 
                                 (!selectYes && labelText === 'No');
                if (shouldClick) {
                    r.click();
                    r.dispatchEvent(new Event('change', {bubbles: true}));
                    if (label) label.click();
                    filled++;
                }
            });
        });
        
        // 2. Handle text inputs (conditional/follow-up questions)
        document.querySelectorAll('input[type="text"], textarea').forEach(function(input) {
            if (input.value || !input.offsetParent) return;
            
            var container = input.closest('.ia-Questions-item') || input.closest('div');
            var questionText = container ? container.innerText.toLowerCase() : '';
            var placeholder = (input.placeholder || '').toLowerCase();
            
            var value = '';
            
            // Referral/relative name questions
            if (questionText.includes('person\\'s name') || questionText.includes('relative') ||
                questionText.includes('referral') || questionText.includes('who referred')) {
                value = 'N/A - No referral';
            }
            // Outside employment questions
            else if (questionText.includes('outside employment') || questionText.includes('other job') ||
                     questionText.includes('second job') || questionText.includes('additional employment')) {
                value = 'N/A - No outside employment';
            }
            // Detail/explanation questions
            else if (questionText.includes('provide detail') || questionText.includes('please explain') ||
                     questionText.includes('describe')) {
                value = 'N/A';
            }
            // Address questions
            else if (questionText.includes('address') || placeholder.includes('address')) {
                value = '16451 Dunmoor Dr, Houston, TX 77095';
            }
            // Generic catch-all for required text fields
            else if (input.hasAttribute('required') || input.getAttribute('aria-required') === 'true') {
                value = 'N/A';
            }
            
            if (value) {
                // React-compatible filling
                var proto = input.tagName === 'TEXTAREA' ? 
                           window.HTMLTextAreaElement.prototype : 
                           window.HTMLInputElement.prototype;
                var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
                setter.call(input, value);
                input.dispatchEvent(new Event('input', {bubbles: true}));
                input.dispatchEvent(new Event('change', {bubbles: true}));
                filled++;
            }
        });
        
        return filled;
    })();\'\'\' 
    return run_js(js)

'''

new_content = before_func + new_func + after_func

with open(file_path, "w") as f:
    f.write(new_content)

print("✅ Fixed screener to handle BOTH radios AND text inputs!")
print("   - Fills Yes/No radio buttons")
print("   - Fills text inputs with appropriate responses:")
print("     - Referral names: 'N/A - No referral'")
print("     - Outside employment: 'N/A - No outside employment'")
print("     - Other required fields: 'N/A'")
