#!/bin/bash
# Check Safari status

echo "=== Safari Status Check ==="

# Check if Safari is running
if pgrep -x Safari > /dev/null; then
    echo "✅ Safari is running"
else
    echo "❌ Safari is NOT running"
    echo "Starting Safari..."
    open -a Safari
    sleep 3
fi

# Test JavaScript execution
echo ""
echo "Testing JavaScript from Apple Events..."
result=$(osascript -e 'tell application "Safari" to tell document 1 to do JavaScript "document.title"' 2>&1)

if [[ $? -eq 0 ]]; then
    echo "✅ JavaScript execution works!"
    echo "   Current page: $result"
else
    echo "❌ JavaScript execution FAILED"
    echo "   Error: $result"
    echo ""
    echo "⚠️  Make sure 'Allow JavaScript from Apple Events' is enabled in:"
    echo "    Safari → Settings → Developer"
fi

# Check if on Indeed
echo ""
if [[ "$result" == *"Indeed"* ]] || [[ "$result" == *"indeed"* ]]; then
    echo "✅ Safari is on Indeed"
else
    echo "⚠️  Safari may not be on Indeed - current page: $result"
fi

# Check profile config exists
echo ""
if [[ -f ~/project-legion-rusty-fix/Project-Legion/profile_config.json ]]; then
    echo "✅ Profile config exists"
else
    echo "❌ Profile config MISSING at ~/project-legion-rusty-fix/Project-Legion/profile_config.json"
fi

# Check daemon state
echo ""
echo "=== Daemon State ==="
if [[ -f ~/project-legion-rusty-fix/Project-Legion/daemon_state.json ]]; then
    cat ~/project-legion-rusty-fix/Project-Legion/daemon_state.json
else
    echo "No daemon state file found"
fi

echo ""
echo "=== Check Complete ==="
