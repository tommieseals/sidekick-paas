#!/bin/bash
# Debug LinkedIn page structure

osascript << 'EOF'
tell application "Safari"
    set jsResult to do JavaScript "
        var results = [];
        
        // Check various selectors
        results.push('job-card-container: ' + document.querySelectorAll('.job-card-container').length);
        results.push('jobs-search-results__list-item: ' + document.querySelectorAll('.jobs-search-results__list-item').length);
        results.push('data-job-id: ' + document.querySelectorAll('[data-job-id]').length);
        results.push('scaffold-layout__list-item: ' + document.querySelectorAll('.scaffold-layout__list-item').length);
        results.push('artdeco-card: ' + document.querySelectorAll('.artdeco-card').length);
        
        // Check for Easy Apply text
        var easyApply = document.body.innerText.match(/Easy Apply/g);
        results.push('Easy Apply mentions: ' + (easyApply ? easyApply.length : 0));
        
        // First job card content
        var firstCard = document.querySelector('.job-card-container, .jobs-search-results__list-item, [data-job-id], .scaffold-layout__list-item');
        if (firstCard) {
            results.push('First card text: ' + firstCard.innerText.substring(0, 100));
        }
        
        results.join('\\n');
    " in document 1
    return jsResult
end tell
EOF
