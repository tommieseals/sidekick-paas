#!/bin/bash
# PROJECT LEGION - Indeed Job Application Automation

# Profile info
ADDRESS="16451 Dunmoor Houston TX 77095"
SALARY="75000"
APPLICATIONS=0

# Search queries
SEARCHES=(
    "IT+Support+Remote"
    "Systems+Administrator+Houston"
    "Technical+Support+Specialist"
)

# Function to open Safari to a search
open_search() {
    local query=$1
    osascript -e "tell application \"Safari\" to activate" \
              -e "tell application \"Safari\" to if (count of windows) = 0 then make new document" \
              -e "tell application \"Safari\" to set URL of front document to \"https://www.indeed.com/jobs?q=${query}&fromage=3\""
    sleep 5
}

# Function to get page source
get_page_source() {
    osascript -e 'tell application "Safari" to do JavaScript "document.body.innerHTML" in front document'
}

# Function to click Easy Apply button
click_easy_apply() {
    osascript -e 'tell application "Safari" to do JavaScript "
        var btns = document.querySelectorAll(\"button, a\");
        for (var b of btns) {
            if (b.innerText && b.innerText.toLowerCase().includes(\"easy apply\")) {
                b.click();
                \"clicked\";
                break;
            }
        }
    " in front document'
}

# Function to fill form field
fill_field() {
    local selector=$1
    local value=$2
    osascript -e "tell application \"Safari\" to do JavaScript \"
        var el = document.querySelector('${selector}');
        if (el) { el.value = '${value}'; el.dispatchEvent(new Event('input', {bubbles:true})); }
    \" in front document"
}

# Main automation loop
echo "=== PROJECT LEGION - Indeed Job Applications ==="
echo "Starting job searches..."

for search in "${SEARCHES[@]}"; do
    echo ""
    echo ">>> Searching: $search"
    open_search "$search"
    
    # Get job count
    job_count=$(osascript -e 'tell application "Safari" to do JavaScript "document.querySelectorAll(\".job_seen_beacon, .jobsearch-ResultsList li\").length" in front document' 2>/dev/null)
    echo "Found approximately $job_count job listings"
    
    # Look for Easy Apply jobs and apply
    for i in {1..5}; do
        echo "Checking job $i..."
        
        # Click on job listing
        osascript -e "tell application \"Safari\" to do JavaScript \"
            var jobs = document.querySelectorAll('.job_seen_beacon, .jobsearch-ResultsList li');
            if (jobs[$i-1]) { jobs[$i-1].querySelector('a').click(); }
        \" in front document" 2>/dev/null
        sleep 3
        
        # Check for Easy Apply button
        has_easy=$(osascript -e 'tell application "Safari" to do JavaScript "
            var ea = document.body.innerHTML.toLowerCase();
            ea.includes(\"easily apply\") || ea.includes(\"easy apply\") ? \"yes\" : \"no\"
        " in front document' 2>/dev/null)
        
        if [[ "$has_easy" == "yes" ]]; then
            echo "  Found Easy Apply! Attempting application..."
            click_easy_apply
            sleep 2
            
            # Try to fill common fields
            fill_field "input[name*='address'], input[placeholder*='address']" "$ADDRESS"
            fill_field "input[name*='salary'], input[placeholder*='salary']" "$SALARY"
            
            # Look for submit/continue buttons
            osascript -e 'tell application "Safari" to do JavaScript "
                var btns = document.querySelectorAll(\"button[type=submit], button\");
                for (var b of btns) {
                    var txt = (b.innerText || \"\").toLowerCase();
                    if (txt.includes(\"submit\") || txt.includes(\"apply\") || txt.includes(\"continue\")) {
                        b.click();
                        break;
                    }
                }
            " in front document' 2>/dev/null
            
            ((APPLICATIONS++))
            echo "  Application attempt #$APPLICATIONS"
            sleep 3
        else
            echo "  No Easy Apply available"
        fi
    done
done

echo ""
echo "==================================="
echo "PROJECT LEGION COMPLETE"
echo "Total Application Attempts: $APPLICATIONS"
echo "==================================="
