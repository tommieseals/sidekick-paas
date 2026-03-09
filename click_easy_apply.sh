#!/bin/bash
# Click first job and Easy Apply, then show modal buttons

osascript << 'EOF'
tell application "Safari"
    -- Click first job card
    do JavaScript "
        var card = document.querySelector('.job-card-container');
        if (card) card.click();
    " in document 1
    delay 2
    
    -- Click Easy Apply
    do JavaScript "
        var btn = document.querySelector('.jobs-apply-button, [aria-label*=\"Easy Apply\"]');
        if (btn) btn.click();
    " in document 1
    delay 3
    
    -- List buttons in modal
    set jsResult to do JavaScript "
        var modal = document.querySelector('.artdeco-modal, [role=\"dialog\"], .jobs-easy-apply-modal');
        var buttons = modal ? modal.querySelectorAll('button') : document.querySelectorAll('button');
        var visible = Array.from(buttons).filter(function(b) { return b.offsetParent !== null; });
        'Modal found: ' + (modal ? 'yes' : 'no') + '\\n' + visible.map(function(b) { 
            return b.innerText.trim().substring(0,40);
        }).join('\\n');
    " in document 1
    return jsResult
end tell
EOF
