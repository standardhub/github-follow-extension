# GitHub Follow Bot Chrome Extension

Auto-follow GitHub users based on customizable region selection.

## Features
- Configurable region filtering (North America, South America, Europe, Asia, Africa, Oceania)
- Default: North America and Europe enabled
- Uncheck all regions to follow all users regardless of location
- Reads location directly from GitHub page UI
- Configurable limits (max processed, max followed)
- Adjustable follow delay (default 8-16 seconds)
- Start/Stop controls
- Tracks followed, already followed, processed users, and pages
- No API token needed - uses your logged-in session
- Automatically goes to next page when current page is done

## Setup

1. Load the extension:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select this folder

2. Configure settings:
   - Click the extension icon
   - Set your limits (Max Processed: 10,000, Max Followed: 500)
   - Set follow delay (Min: 8s, Max: 16s)
   - Select regions to follow (default: North America and Europe)
   - Click "Save Settings"

3. Use the extension:
   - Log into GitHub in your browser
   - Navigate to any GitHub page with users (followers, following, search results)
   - Click the extension icon
   - Click Start to begin auto-following
   - Click Stop to pause

## How it works
- Reads user location directly from the page UI
- Checks if location matches your selected regions
- Includes countries, states/provinces, and major cities for each region
- Clicks Follow button if location matches enabled regions
- Random delays between configured min/max seconds after each follow
- Skips users already being followed (counts as "Already Followed")
- Users with non-matching locations are not counted as skipped
- Automatically navigates to next page when done (max 50 users per page)
- Displays stats in popup (Followed, Already Followed, Processed, Pages)
- Stops automatically when limits are reached

## Note
Make sure you're logged into GitHub before starting the bot.
