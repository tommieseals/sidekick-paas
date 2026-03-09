#!/bin/bash
cd /Users/tommie/clawd/dashboard

# Backup server.js
cp server.js server.js.bak-terminator

# Add terminator.html route before the 404 handler
# Find the line with "} else {" followed by "// 404" and insert the route before it

sed -i '' '/    } else {/{
    N
    /\/\/ 404/{
        i\
    } else if (req.url === '"'"'/terminator.html'"'"') {\
        const html = fs.readFileSync(path.join(__dirname, '"'"'terminator.html'"'"'), '"'"'utf8'"'"');\
        res.writeHead(200, { '"'"'Content-Type'"'"': '"'"'text/html'"'"' });\
        res.end(html);
    }
}' server.js

# Verify it was added
if grep -q "terminator.html" server.js; then
    echo "SUCCESS: terminator.html route added to server.js"
    grep -n "terminator" server.js
else
    echo "FAILED: Route not added"
fi
