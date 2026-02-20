let isRunning = false;
let followCount = 0;
let skipCount = 0;
let processedCount = 0;
let pageCount = 0;
let processing = false;
let processedUsersOnPage = new Set();

// Settings with defaults
let MAX_PROCESSED = 10000;
let MAX_FOLLOWED = 500;
let DELAY_MIN = 8;
let DELAY_MAX = 16;
let ENABLED_REGIONS = {
  northAmerica: true,
  southAmerica: false,
  europe: true,
  asia: false,
  africa: false,
  oceania: false
};

// ALLOWED_REGIONS and EXCLUDED_COUNTRIES are loaded from regions.js

// Load settings from storage
chrome.storage.local.get([
  'maxProcessed', 'maxFollowed', 'delayMin', 'delayMax',
  'regionNorthAmerica', 'regionSouthAmerica', 'regionEurope',
  'regionAsia', 'regionAfrica', 'regionOceania'
], (data) => {
  MAX_PROCESSED = data.maxProcessed || 10000;
  MAX_FOLLOWED = data.maxFollowed || 500;
  DELAY_MIN = data.delayMin || 8;
  DELAY_MAX = data.delayMax || 16;
  
  ENABLED_REGIONS = {
    northAmerica: data.regionNorthAmerica !== undefined ? data.regionNorthAmerica : true,
    southAmerica: data.regionSouthAmerica || false,
    europe: data.regionEurope !== undefined ? data.regionEurope : true,
    asia: data.regionAsia || false,
    africa: data.regionAfrica || false,
    oceania: data.regionOceania || false
  };
  
  console.log(`Settings loaded - Max Processed: ${MAX_PROCESSED}, Max Followed: ${MAX_FOLLOWED}, Delay: ${DELAY_MIN}-${DELAY_MAX}s`);
  console.log('Enabled regions:', ENABLED_REGIONS);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'start') {
    // Reload settings before starting
    chrome.storage.local.get([
      'maxProcessed', 'maxFollowed', 'delayMin', 'delayMax',
      'regionNorthAmerica', 'regionSouthAmerica', 'regionEurope',
      'regionAsia', 'regionAfrica', 'regionOceania'
    ], (data) => {
      MAX_PROCESSED = data.maxProcessed || 10000;
      MAX_FOLLOWED = data.maxFollowed || 500;
      DELAY_MIN = data.delayMin || 8;
      DELAY_MAX = data.delayMax || 16;
      
      // Load region settings
      ENABLED_REGIONS = {
        northAmerica: data.regionNorthAmerica !== undefined ? data.regionNorthAmerica : true,
        southAmerica: data.regionSouthAmerica || false,
        europe: data.regionEurope !== undefined ? data.regionEurope : true,
        asia: data.regionAsia || false,
        africa: data.regionAfrica || false,
        oceania: data.regionOceania || false
      };
      
      console.log(`Bot starting with settings - Max Processed: ${MAX_PROCESSED}, Max Followed: ${MAX_FOLLOWED}, Delay: ${DELAY_MIN}-${DELAY_MAX}s`);
      console.log('Enabled regions:', ENABLED_REGIONS);
      
      isRunning = true;
      followCount = 0;
      skipCount = 0;
      processedCount = 0;
      pageCount = 1;
      processedUsersOnPage.clear();
      
      chrome.storage.local.set({ 
        isRunning: true,
        followCount: 0,
        skipCount: 0,
        processedCount: 0,
        pageCount: 1
      });
      
      console.log('Bot started!');
      startProcessing();
    });
  } else if (message.action === 'stop') {
    isRunning = false;
    processing = false;
    chrome.storage.local.set({ isRunning: false });
    console.log('Bot stopped by user');
  }
});

// Check if bot should resume after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    chrome.storage.local.get(['isRunning', 'followCount', 'skipCount', 'processedCount', 'pageCount'], (data) => {
      if (data.isRunning && !isRunning) {
        console.log('=== RESUMING BOT AFTER PAGE NAVIGATION ===');
        isRunning = true;
        followCount = data.followCount || 0;
        skipCount = data.skipCount || 0;
        processedCount = data.processedCount || 0;
        pageCount = data.pageCount || 1;
        processedUsersOnPage.clear();
        
        console.log(`Resumed - Page: ${pageCount}, Followed: ${followCount}, Skipped: ${skipCount}, Processed: ${processedCount}`);
        startProcessing();
      }
    });
  }, 3000);
});

function startProcessing() {
  if (!processing) {
    processing = true;
    processNextUser();
  }
}

function processNextUser() {
  if (!isRunning) {
    processing = false;
    console.log('Bot stopped');
    return;
  }
  
  // Check limits
  if (processedCount >= MAX_PROCESSED) {
    console.log(`LIMIT REACHED: Processed ${MAX_PROCESSED} users`);
    stopBot();
    alert(`Bot stopped: Processed ${MAX_PROCESSED} users`);
    return;
  }
  
  if (followCount >= MAX_FOLLOWED) {
    console.log(`LIMIT REACHED: Followed ${MAX_FOLLOWED} users`);
    stopBot();
    alert(`Bot stopped: Followed ${MAX_FOLLOWED} users`);
    return;
  }
  
  // Find all user rows
  const userRows = document.querySelectorAll('div.d-table');
  
  // Find next unprocessed user
  for (const row of userRows) {
    const usernameEl = row.querySelector('span.Link--secondary');
    if (!usernameEl) continue;
    
    const username = usernameEl.textContent.trim();
    
    // Skip if already processed on this page
    if (processedUsersOnPage.has(username)) continue;
    
    // Mark as processed
    processedUsersOnPage.add(username);
    processedCount++;
    
    // Get location
    const locationIcon = row.querySelector('svg.octicon-location');
    let location = '';
    if (locationIcon) {
      location = locationIcon.parentElement.textContent.trim().toLowerCase();
    }
    
    // Check follow button
    const followBtn = row.querySelector('input[type="submit"][value="Follow"]');
    const unfollowBtn = row.querySelector('input[type="submit"][value="Unfollow"]');
    
    let canFollow = false;
    if (followBtn) {
      const followForm = followBtn.closest('form');
      canFollow = followForm && !followForm.hasAttribute('hidden');
    }
    
    // If already following, skip
    if (!canFollow) {
      skipCount++;
      console.log(`Already followed: ${username}`);
      updateStats();
      setTimeout(() => processNextUser(), 100);
      return;
    }
    
    // Check location
    const shouldFollow = checkLocation(location);
    
    if (shouldFollow) {
      // Follow user
      followBtn.click();
      followCount++;
      console.log(`✓ Followed: ${username} (${location || 'no location'})`);
      
      updateStats();
      
      // Wait with configured delay
      const delay = (Math.random() * (DELAY_MAX - DELAY_MIN) + DELAY_MIN) * 1000;
      console.log(`Waiting ${Math.round(delay/1000)}s... (Followed: ${followCount}/${MAX_FOLLOWED}, Processed: ${processedCount}/${MAX_PROCESSED}, Page: ${pageCount})`);
      setTimeout(() => processNextUser(), delay);
    } else {
      // Location doesn't match - don't follow, don't count as skipped
      console.log(`✗ Location not matched: ${username} (${location || 'no location'})`);
      
      updateStats();
      
      // Check next user immediately
      setTimeout(() => processNextUser(), 100);
    }
    return;
  }
  
  // No more users on this page
  console.log(`=== PAGE ${pageCount} COMPLETE ===`);
  console.log(`Processed ${processedUsersOnPage.size} users on this page`);
  console.log(`Total: Followed ${followCount}, Already Followed ${skipCount}, Processed ${processedCount}`);
  
  // Look for Next button
  const pagination = document.querySelector('.pagination');
  console.log('Pagination element found:', !!pagination);
  
  if (!pagination) {
    console.log('No pagination found - Bot finished!');
    stopBot();
    return;
  }
  
  // Find all links in pagination
  const allLinks = pagination.querySelectorAll('a');
  console.log('Links in pagination:', allLinks.length);
  
  // Find the Next link
  let nextLink = null;
  for (const link of allLinks) {
    console.log('Link text:', link.textContent.trim(), 'href:', link.href);
    if (link.textContent.trim() === 'Next') {
      nextLink = link;
      break;
    }
  }
  
  if (!nextLink) {
    console.log('No Next button - Bot finished!');
    stopBot();
    return;
  }
  
  // Go to next page
  console.log(`Next button found! Going to: ${nextLink.href}`);
  pageCount++;
  
  chrome.storage.local.set({ 
    isRunning: true,
    followCount,
    skipCount,
    processedCount,
    pageCount
  }, () => {
    console.log('State saved, navigating now...');
    window.location.href = nextLink.href;
  });
}

function checkLocation(location) {
  if (!location) return false;
  
  const locationLower = location.toLowerCase().trim();
  
  // Check if any regions are enabled
  const anyRegionEnabled = Object.values(ENABLED_REGIONS).some(enabled => enabled);
  
  // If no regions are selected, follow everyone
  if (!anyRegionEnabled) {
    console.log('No regions selected - following all users');
    return true;
  }
  
  // Helper function to check if a word exists as a whole word (not substring)
  const containsWholeWord = (text, word) => {
    // Create regex that matches word boundaries
    const regex = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    return regex.test(text);
  };
  
  // First check if location is ONLY invalid/generic (not part of a real location)
  const trimmedLocation = locationLower.replace(/[^a-z0-9\s]/g, ' ').trim();
  const isOnlyInvalid = INVALID_LOCATIONS.some(invalid => {
    const cleanInvalid = invalid.replace(/[^a-z0-9\s]/g, ' ').trim();
    return trimmedLocation === cleanInvalid || trimmedLocation.split(/\s+/).length === 1 && trimmedLocation === cleanInvalid;
  });
  
  if (isOnlyInvalid) {
    return false; // Skip if ONLY generic location
  }
  
  // Check which region this location belongs to
  const matchesRegion = (regionList) => {
    return regionList.some(region => {
      if (region.includes(' ')) {
        return locationLower.includes(region);
      }
      return containsWholeWord(locationLower, region);
    });
  };
  
  // Check each enabled region
  if (ENABLED_REGIONS.northAmerica && matchesRegion(NORTH_AMERICA_REGIONS)) {
    return true;
  }
  if (ENABLED_REGIONS.southAmerica && matchesRegion(SOUTH_AMERICA_REGIONS)) {
    return true;
  }
  if (ENABLED_REGIONS.europe && matchesRegion(EUROPE_REGIONS)) {
    return true;
  }
  if (ENABLED_REGIONS.asia && matchesRegion(ASIA_REGIONS)) {
    return true;
  }
  if (ENABLED_REGIONS.africa && matchesRegion(AFRICA_REGIONS)) {
    return true;
  }
  if (ENABLED_REGIONS.oceania && matchesRegion(OCEANIA_REGIONS)) {
    return true;
  }
  
  return false;
}

function updateStats() {
  chrome.storage.local.set({ followCount, skipCount, processedCount, pageCount });
  chrome.runtime.sendMessage({ 
    action: 'updateStats', 
    followCount, 
    skipCount,
    processedCount,
    pageCount
  }).catch(() => {});
}

function stopBot() {
  isRunning = false;
  processing = false;
  chrome.storage.local.set({ isRunning: false });
  console.log(`=== BOT FINISHED ===`);
  console.log(`Final stats - Pages: ${pageCount}, Followed: ${followCount}, Already Followed: ${skipCount}, Total Processed: ${processedCount}`);
}
