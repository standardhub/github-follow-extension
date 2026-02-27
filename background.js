// Background service worker for handling extension lifecycle

chrome.runtime.onInstalled.addListener(() => {
  console.log('GitHub Follow Bot installed');
  
  // Initialize storage with default settings
  chrome.storage.local.set({
    isRunning: false,
    followCount: 0,
    skipCount: 0,
    processedCount: 0,
    pageCount: 0,
    maxProcessed: 10000,
    maxFollowed: 500,
    delayMin: 8,
    delayMax: 16,
    regionNorthAmerica: true,
    regionSouthAmerica: false,
    regionEurope: true,
    regionAsia: false,
    regionAfrica: false,
    regionOceania: false,
    saveResults: false,
    followedUsers: {}
  });
});

chrome.runtime.onStartup.addListener(() => {
  // Reset running state on browser startup
  chrome.storage.local.set({
    isRunning: false
  });
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateStats') {
    // Forward stats update to popup if it's open
    chrome.runtime.sendMessage(message).catch(() => {
      // Popup might be closed, ignore error
    });
  }
});
