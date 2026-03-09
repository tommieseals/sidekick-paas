#!/usr/bin/env python3
"""Fix ZipRecruiter to handle screener questions"""

path = '/Users/tommie/project-legion-rusty-fix/Project-Legion/ziprecruiter_runner.py'

with open(path, 'r') as f:
    content = f.read()

# Find the fill_application function and add radio/checkbox handling
old_fill = '''        // Fill inputs
        document.querySelectorAll('input').forEach(function(i) {{'''

new_fill = '''        // Answer Yes to screener questions (radio/checkboxes)
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(function(i) {{
            var label = (i.closest('label') || i.parentElement || {{}}).innerText || '';
            var name = i.name || '';
            // Click Yes options or first option
            if (label.toLowerCase().includes('yes') || i.value.toLowerCase() === 'yes' || i.value === 'true') {{
                if (!i.checked) {{
                    i.click();
                    filled++;
                }}
            }}
        }});
        
        // Select first option in dropdowns
        document.querySelectorAll('select').forEach(function(s) {{
            if (s.options.length > 1 && s.selectedIndex === 0) {{
                s.selectedIndex = 1;
                s.dispatchEvent(new Event('change', {{bubbles: true}}));
                filled++;
            }}
        }});
        
        // Fill inputs
        document.querySelectorAll('input').forEach(function(i) {{'''

content = content.replace(old_fill, new_fill)

with open(path, 'w') as f:
    f.write(content)

print("✅ Added screener question handling (radio, checkbox, select)")
