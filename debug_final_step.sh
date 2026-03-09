#!/bin/bash
# Debug what's on the final step of LinkedIn Easy Apply

osascript << 'EOF'
tell application "Safari"
    set jsResult to do JavaScript "
        // Find all visible buttons
        var btns = Array.from(document.querySelectorAll('button')).filter(function(b) {
            return b.offsetParent !== null;
        });
        
        // Also check for Submit specifically
        var submitBtns = btns.filter(function(b) {
            var t = b.innerText.toLowerCase();
            return t.includes('submit') || t.includes('send') || t.includes('apply');
        });
        
        'ALL BUTTONS (' + btns.length + '):\\n' + 
        btns.map(function(b) { return '  - ' + b.innerText.trim().substring(0,40); }).join('\\n') +
        '\\n\\nSUBMIT BUTTONS (' + submitBtns.length + '):\\n' +
        submitBtns.map(function(b) { return '  - ' + b.innerText.trim(); }).join('\\n');
    " in document 1
    return jsResult
end tell
EOF
