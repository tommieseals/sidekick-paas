#!/bin/bash
# Debug what buttons are in the LinkedIn Easy Apply modal

osascript << 'EOF'
tell application "Safari"
    set jsResult to do JavaScript "
        var buttons = Array.from(document.querySelectorAll('button'));
        var visible = buttons.filter(function(b) { return b.offsetParent !== null; });
        visible.map(function(b) { 
            return b.innerText.trim().substring(0,30) + ' | aria: ' + (b.getAttribute('aria-label') || 'none');
        }).slice(0,15).join('\\n');
    " in document 1
    return jsResult
end tell
EOF
