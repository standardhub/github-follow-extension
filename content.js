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
let SAVE_RESULTS = false;
let ENABLED_REGIONS = {
  northAmerica: true,
  southAmerica: false,
  europe: true,
  asia: false,
  africa: false,
  oceania: false
};
let followedUsers = {};

// ALLOWED_REGIONS and EXCLUDED_COUNTRIES are loaded from regions.js

// Load settings from storage
chrome.storage.local.get([
  'maxProcessed', 'maxFollowed', 'delayMin', 'delayMax',
  'regionNorthAmerica', 'regionSouthAmerica', 'regionEurope',
  'regionAsia', 'regionAfrica', 'regionOceania', 'saveResults', 'followedUsers'
], (data) => {
  MAX_PROCESSED = data.maxProcessed || 10000;
  MAX_FOLLOWED = data.maxFollowed || 500;
  DELAY_MIN = data.delayMin || 8;
  DELAY_MAX = data.delayMax || 16;
  SAVE_RESULTS = data.saveResults || false;
  followedUsers = data.followedUsers || {};
  
  ENABLED_REGIONS = {
    northAmerica: data.regionNorthAmerica !== undefined ? data.regionNorthAmerica : true,
    southAmerica: data.regionSouthAmerica || false,
    europe: data.regionEurope !== undefined ? data.regionEurope : true,
    asia: data.regionAsia || false,
    africa: data.regionAfrica || false,
    oceania: data.regionOceania || false
  };
  
  console.log(`Settings loaded - Max Processed: ${MAX_PROCESSED}, Max Followed: ${MAX_FOLLOWED}, Delay: ${DELAY_MIN}-${DELAY_MAX}s`);
  console.log('Save Results:', SAVE_RESULTS);
  console.log('Enabled regions:', ENABLED_REGIONS);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'start') {
    // Reload settings before starting
    chrome.storage.local.get([
      'maxProcessed', 'maxFollowed', 'delayMin', 'delayMax',
      'regionNorthAmerica', 'regionSouthAmerica', 'regionEurope',
      'regionAsia', 'regionAfrica', 'regionOceania', 'saveResults'
    ], (data) => {
      MAX_PROCESSED = data.maxProcessed || 10000;
      MAX_FOLLOWED = data.maxFollowed || 500;
      DELAY_MIN = data.delayMin || 8;
      DELAY_MAX = data.delayMax || 16;
      SAVE_RESULTS = data.saveResults || false;
      
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
      console.log('Save Results:', SAVE_RESULTS);
      console.log('Enabled regions:', ENABLED_REGIONS);
      
      isRunning = true;
      followCount = 0;
      skipCount = 0;
      processedCount = 0;
      pageCount = 1;
      processedUsersOnPage.clear();
      followedUsers = {}; // Reset followed users on start
      
      chrome.storage.local.set({ 
        isRunning: true,
        followCount: 0,
        skipCount: 0,
        processedCount: 0,
        pageCount: 1,
        followedUsers: {}
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
    chrome.storage.local.get(['isRunning', 'followCount', 'skipCount', 'processedCount', 'pageCount', 'followedUsers', 'saveResults'], (data) => {
      if (data.isRunning && !isRunning) {
        console.log('=== RESUMING BOT AFTER PAGE NAVIGATION ===');
        isRunning = true;
        followCount = data.followCount || 0;
        skipCount = data.skipCount || 0;
        processedCount = data.processedCount || 0;
        pageCount = data.pageCount || 1;
        followedUsers = data.followedUsers || {};
        SAVE_RESULTS = data.saveResults || false;
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
      
      // Save to results if enabled
      if (SAVE_RESULTS) {
        const country = extractCountry(location);
        if (!followedUsers[country]) {
          followedUsers[country] = [];
        }
        followedUsers[country].push(username);
      }
      
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
    pageCount,
    followedUsers
  }, () => {
    console.log('State saved, navigating now...');
    window.location.href = nextLink.href;
  });
}

function extractCountry(location) {
  if (!location) return 'Unknown';
  
  const locationLower = location.toLowerCase().trim();
  
  // Check each region and return the country name
  // North America
  if (locationLower.includes('usa') || locationLower.includes('united states') || locationLower.includes('america')) {
    return 'United States';
  }
  
  // Check US states
  const usStates = ['alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 
    'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 
    'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 
    'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 
    'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 
    'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 
    'west virginia', 'wisconsin', 'wyoming'];
  
  const usStateAbbr = [' al', ' ak', ' az', ' ar', ' ca', ' co', ' ct', ' de', ' fl', ' ga', ' hi', ' id', 
    ' il', ' in', ' ia', ' ks', ' ky', ' la', ' me', ' md', ' ma', ' mi', ' mn', ' ms', ' mo', ' mt', 
    ' ne', ' nv', ' nh', ' nj', ' nm', ' ny', ' nc', ' nd', ' oh', ' ok', ' or', ' pa', ' ri', ' sc', 
    ' sd', ' tn', ' tx', ' ut', ' vt', ' va', ' wa', ' wv', ' wi', ' wy'];
  
  const usCities = ['new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 'san antonio', 
    'san diego', 'dallas', 'san jose', 'austin', 'jacksonville', 'fort worth', 'columbus', 'charlotte', 
    'san francisco', 'indianapolis', 'seattle', 'denver', 'boston', 'nashville', 'detroit', 'portland', 
    'las vegas', 'miami', 'atlanta', 'oakland', 'minneapolis', 'tampa', 'orlando', 'cleveland', 'pittsburgh', 
    'sacramento', 'kansas city', 'raleigh', 'baltimore', 'milwaukee', 'salt lake city', 'silicon valley', 
    'bay area', 'palo alto', 'mountain view', 'sunnyvale', 'santa clara'];
  
  for (const state of usStates) {
    if (locationLower.includes(state)) return 'United States';
  }
  for (const abbr of usStateAbbr) {
    if (locationLower.includes(abbr)) return 'United States';
  }
  for (const city of usCities) {
    if (locationLower.includes(city)) return 'United States';
  }
  
  // Canada
  if (locationLower.includes('canada') || locationLower.includes('canadian') || 
      locationLower.includes('toronto') || locationLower.includes('montreal') || 
      locationLower.includes('vancouver') || locationLower.includes('calgary') || 
      locationLower.includes('ottawa') || locationLower.includes('ontario') || 
      locationLower.includes('quebec') || locationLower.includes('british columbia') || 
      locationLower.includes('alberta')) {
    return 'Canada';
  }
  
  // Mexico
  if (locationLower.includes('mexico') || locationLower.includes('méxico')) {
    return 'Mexico';
  }
  
  // UK
  if (locationLower.includes('uk') || locationLower.includes('united kingdom') || 
      locationLower.includes('england') || locationLower.includes('scotland') || 
      locationLower.includes('wales') || locationLower.includes('northern ireland') || 
      locationLower.includes('london') || locationLower.includes('manchester') || 
      locationLower.includes('birmingham') || locationLower.includes('liverpool') || 
      locationLower.includes('edinburgh') || locationLower.includes('glasgow') || 
      locationLower.includes('cardiff') || locationLower.includes('belfast') ||
      locationLower.includes('ipswich') || locationLower.includes('britain') || 
      locationLower.includes('british')) {
    return 'United Kingdom';
  }
  
  // Ireland
  if (locationLower.includes('ireland') || locationLower.includes('dublin') || locationLower.includes('irish')) {
    return 'Ireland';
  }
  
  // France
  if (locationLower.includes('france') || locationLower.includes('french') || 
      locationLower.includes('paris') || locationLower.includes('marseille') || locationLower.includes('lyon')) {
    return 'France';
  }
  
  // Germany
  if (locationLower.includes('germany') || locationLower.includes('german') || 
      locationLower.includes('deutschland') || locationLower.includes('berlin') || 
      locationLower.includes('munich') || locationLower.includes('hamburg') || locationLower.includes('frankfurt')) {
    return 'Germany';
  }
  
  // Netherlands
  if (locationLower.includes('netherlands') || locationLower.includes('dutch') || 
      locationLower.includes('holland') || locationLower.includes('amsterdam') || locationLower.includes('rotterdam')) {
    return 'Netherlands';
  }
  
  // Spain
  if (locationLower.includes('spain') || locationLower.includes('spanish') || 
      locationLower.includes('españa') || locationLower.includes('madrid') || 
      locationLower.includes('barcelona') || locationLower.includes('valencia')) {
    return 'Spain';
  }
  
  // Italy
  if (locationLower.includes('italy') || locationLower.includes('italian') || 
      locationLower.includes('italia') || locationLower.includes('rome') || 
      locationLower.includes('milan') || locationLower.includes('naples') || locationLower.includes('florence')) {
    return 'Italy';
  }
  
  // Other European countries
  if (locationLower.includes('portugal') || locationLower.includes('lisbon')) return 'Portugal';
  if (locationLower.includes('belgium') || locationLower.includes('brussels')) return 'Belgium';
  if (locationLower.includes('switzerland') || locationLower.includes('zurich')) return 'Switzerland';
  if (locationLower.includes('austria') || locationLower.includes('vienna')) return 'Austria';
  if (locationLower.includes('sweden') || locationLower.includes('stockholm')) return 'Sweden';
  if (locationLower.includes('norway') || locationLower.includes('oslo')) return 'Norway';
  if (locationLower.includes('denmark') || locationLower.includes('copenhagen')) return 'Denmark';
  if (locationLower.includes('finland') || locationLower.includes('helsinki')) return 'Finland';
  if (locationLower.includes('poland') || locationLower.includes('warsaw')) return 'Poland';
  if (locationLower.includes('czech') || locationLower.includes('prague')) return 'Czech Republic';
  if (locationLower.includes('greece') || locationLower.includes('athens')) return 'Greece';
  
  // Asia
  if (locationLower.includes('china') || locationLower.includes('chinese') || 
      locationLower.includes('beijing') || locationLower.includes('shanghai')) return 'China';
  if (locationLower.includes('japan') || locationLower.includes('japanese') || 
      locationLower.includes('tokyo') || locationLower.includes('osaka')) return 'Japan';
  if (locationLower.includes('korea') || locationLower.includes('korean') || 
      locationLower.includes('seoul')) return 'South Korea';
  if (locationLower.includes('india') || locationLower.includes('indian') || 
      locationLower.includes('delhi') || locationLower.includes('mumbai') || 
      locationLower.includes('bangalore')) return 'India';
  if (locationLower.includes('singapore')) return 'Singapore';
  if (locationLower.includes('thailand') || locationLower.includes('bangkok')) return 'Thailand';
  if (locationLower.includes('vietnam') || locationLower.includes('hanoi')) return 'Vietnam';
  if (locationLower.includes('indonesia') || locationLower.includes('jakarta')) return 'Indonesia';
  if (locationLower.includes('philippines') || locationLower.includes('manila')) return 'Philippines';
  if (locationLower.includes('malaysia') || locationLower.includes('kuala lumpur')) return 'Malaysia';
  if (locationLower.includes('taiwan') || locationLower.includes('taipei')) return 'Taiwan';
  if (locationLower.includes('hong kong')) return 'Hong Kong';
  
  // South America
  if (locationLower.includes('brazil') || locationLower.includes('brasil') || 
      locationLower.includes('são paulo') || locationLower.includes('rio de janeiro')) return 'Brazil';
  if (locationLower.includes('argentina') || locationLower.includes('buenos aires')) return 'Argentina';
  if (locationLower.includes('colombia') || locationLower.includes('bogotá')) return 'Colombia';
  if (locationLower.includes('chile') || locationLower.includes('santiago')) return 'Chile';
  if (locationLower.includes('peru') || locationLower.includes('lima')) return 'Peru';
  
  // Oceania
  if (locationLower.includes('australia') || locationLower.includes('sydney') || 
      locationLower.includes('melbourne') || locationLower.includes('brisbane')) return 'Australia';
  if (locationLower.includes('new zealand') || locationLower.includes('auckland')) return 'New Zealand';
  
  // Africa
  if (locationLower.includes('south africa') || locationLower.includes('cape town')) return 'South Africa';
  if (locationLower.includes('nigeria') || locationLower.includes('lagos')) return 'Nigeria';
  if (locationLower.includes('egypt') || locationLower.includes('cairo')) return 'Egypt';
  if (locationLower.includes('kenya') || locationLower.includes('nairobi')) return 'Kenya';
  
  return 'Other';
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
  chrome.storage.local.set({ followCount, skipCount, processedCount, pageCount, followedUsers });
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
