#!/bin/bash
cd ~/clawd/dashboard

# Get total lines minus 2 (remove </body></html>)
total=$(wc -l < fort-knox.html)
keep=$((total - 2))

# Create temp file without last 2 lines
head -n $keep fort-knox.html > fort-knox-temp.html

# Append the info section
cat ~/temp-fort-knox-append.html >> fort-knox-temp.html

# Add closing tags
printf '\n</body>\n</html>\n' >> fort-knox-temp.html

# Replace original
mv fort-knox-temp.html fort-knox.html

echo "Done! Original had $total lines, kept $keep"
