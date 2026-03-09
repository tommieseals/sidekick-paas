-- AppleScript to click Apply button on Indeed
-- First, activate Chrome
tell application "Google Chrome"
    activate
    delay 1
end tell

-- Use System Events to click
tell application "System Events"
    tell process "Google Chrome"
        -- Click at the Apply Now button location (adjust coordinates as needed)
        -- This assumes the Apply button is visible on screen
        click at {740, 730}
    end tell
end tell

delay 2
