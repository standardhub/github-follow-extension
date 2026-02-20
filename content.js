let isRunning = false;
let followCount = 0;
let skipCount = 0;
let processedCount = 0;
let pageCount = 0;
let processing = false;
let processedUsersOnPage = new Set();

const MAX_PROCESSED = 100000;
const MAX_FOLLOWED = 800;

// ALLOWED_REGIONS is loaded from regions.js

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'start') {
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
      console.log(`Already following: ${username}`);
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
      
      // Wait 7-12 seconds before next follow
      const delay = Math.random() * 5000 + 7000;
      console.log(`Waiting ${Math.round(delay/1000)}s... (Followed: ${followCount}/${MAX_FOLLOWED}, Processed: ${processedCount}/${MAX_PROCESSED}, Page: ${pageCount})`);
      setTimeout(() => processNextUser(), delay);
    } else {
      // Skip user
      skipCount++;
      console.log(`✗ Skipped: ${username} (${location || 'no location'})`);
      
      updateStats();
      
      // Check next user immediately
      setTimeout(() => processNextUser(), 100);
    }
    return;
  }
  
  // No more users on this page
  console.log(`=== PAGE ${pageCount} COMPLETE ===`);
  console.log(`Processed ${processedUsersOnPage.size} users on this page`);
  console.log(`Total: Followed ${followCount}, Skipped ${skipCount}, Processed ${processedCount}`);
  
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
  
  const locationLower = location.toLowerCase();
  
  // First check if location contains any EXCLUDED country
  // This takes priority to avoid false positives (e.g., "Paris, Texas" vs "Paris, France")
  const hasExcludedCountry = EXCLUDED_COUNTRIES.some(country => locationLower.includes(country));
  if (hasExcludedCountry) {
    return false; // Skip if from excluded country
  }
  
  // Then check if location contains any ALLOWED region
  const hasAllowedRegion = ALLOWED_REGIONS.some(region => locationLower.includes(region));
  return hasAllowedRegion;
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
  console.log(`Final stats - Pages: ${pageCount}, Followed: ${followCount}, Skipped: ${skipCount}, Total Processed: ${processedCount}`);
}
