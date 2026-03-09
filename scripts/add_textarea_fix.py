#!/usr/bin/env python3
"""Add textarea handling to legion_runner_v4.py"""

file_path = "/Users/tommie/project-legion-rusty-fix/Project-Legion/legion_runner_v4.py"

with open(file_path, "r") as f:
    content = f.read()

if "HTMLTextAreaElement" in content:
    print("Already has textarea handling")
    exit(0)

# Add textarea handling right before "def fill_screener_questions"
textarea_code = '''
    # Textareas (address, cover letter, etc.)
    js_textareas = \'\'\'(function() {
        var filled = 0;
        document.querySelectorAll('textarea').forEach(function(ta) {
            if (ta.value || !ta.offsetParent) return;
            var ctx = (ta.closest('div') || {}).innerText || '';
            ctx = ctx.toLowerCase();
            var val = '';
            if (ctx.includes('address')) val = '16451 Dunmoor Dr, Houston, TX 77095';
            else if (ctx.includes('cover') || ctx.includes('letter')) val = 'I am excited about this opportunity.';
            else if (ctx.includes('message') || ctx.includes('note')) val = 'Available to start immediately.';
            if (val) {
                var ns = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                ns.call(ta, val);
                ta.dispatchEvent(new Event('input', {bubbles: true}));
                ta.dispatchEvent(new Event('change', {bubbles: true}));
                filled++;
            }
        });
        return filled;
    })();\'\'\' 
    run_js(js_textareas)

'''

# Insert before fill_screener_questions
marker = "\ndef fill_screener_questions():"
if marker in content:
    content = content.replace(marker, textarea_code + marker)
    with open(file_path, "w") as f:
        f.write(content)
    print("Added textarea handling!")
else:
    print("Could not find insertion point")
