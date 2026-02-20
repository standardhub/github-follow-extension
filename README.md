# GitHub Follow Bot Chrome Extension

Auto-follow GitHub users from North America and Europe.

## Features
- Reads location directly from GitHub page UI
- Follows users from US, Canada, Mexico, and Europe
- 5-8 follows per minute with random delays (7-12 seconds)
- Start/Stop controls
- Tracks followed, skipped, and processed users
- No API token needed - uses your logged-in session
- Automatically goes to next page when current page is done

## Setup

1. Load the extension:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select this folder

2. Use the extension:
   - Log into GitHub in your browser
   - Navigate to any GitHub page with users (followers, following, search results)
   - Click the extension icon
   - Click Start to begin auto-following
   - Click Stop to pause

## How it works
- Reads user location directly from the page UI
- Checks if location matches North America (US, Canada, Mexico) or Europe
- Includes states, provinces, and major cities
- Clicks Follow button if location matches
- Random delays between 7-12 seconds after each follow (5-8 per minute)
- Skips users instantly if location doesn't match
- Automatically navigates to next page when done
- Displays stats in popup (Followed, Skipped, Processed)

## Note
Make sure you're logged into GitHub before starting the bot.
