const statusEl = document.getElementById('status');
const followCountEl = document.getElementById('followCount');
const skipCountEl = document.getElementById('skipCount');
const processedCountEl = document.getElementById('processedCount');
const pageCountEl = document.getElementById('pageCount');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const saveSettingsBtn = document.getElementById('saveSettings');

const maxProcessedInput = document.getElementById('maxProcessed');
const maxFollowedInput = document.getElementById('maxFollowed');
const delayMinInput = document.getElementById('delayMin');
const delayMaxInput = document.getElementById('delayMax');

const regionNorthAmerica = document.getElementById('regionNorthAmerica');
const regionSouthAmerica = document.getElementById('regionSouthAmerica');
const regionEurope = document.getElementById('regionEurope');
const regionAsia = document.getElementById('regionAsia');
const regionAfrica = document.getElementById('regionAfrica');
const regionOceania = document.getElementById('regionOceania');

// Load saved settings
chrome.storage.local.get([
  'maxProcessed', 'maxFollowed', 'delayMin', 'delayMax',
  'regionNorthAmerica', 'regionSouthAmerica', 'regionEurope', 
  'regionAsia', 'regionAfrica', 'regionOceania'
], (data) => {
  maxProcessedInput.value = data.maxProcessed || 10000;
  maxFollowedInput.value = data.maxFollowed || 500;
  delayMinInput.value = data.delayMin || 8;
  delayMaxInput.value = data.delayMax || 16;
  
  // Default: North America and Europe checked
  regionNorthAmerica.checked = data.regionNorthAmerica !== undefined ? data.regionNorthAmerica : true;
  regionSouthAmerica.checked = data.regionSouthAmerica || false;
  regionEurope.checked = data.regionEurope !== undefined ? data.regionEurope : true;
  regionAsia.checked = data.regionAsia || false;
  regionAfrica.checked = data.regionAfrica || false;
  regionOceania.checked = data.regionOceania || false;
});

// Load saved data
chrome.storage.local.get(['isRunning', 'followCount', 'skipCount', 'processedCount', 'pageCount'], (data) => {
  if (data.isRunning) {
    updateUIRunning();
  }
  followCountEl.textContent = data.followCount || 0;
  skipCountEl.textContent = data.skipCount || 0;
  processedCountEl.textContent = data.processedCount || 0;
  pageCountEl.textContent = data.pageCount || 0;
});

// Save settings
saveSettingsBtn.addEventListener('click', () => {
  const maxProcessed = parseInt(maxProcessedInput.value) || 10000;
  const maxFollowed = parseInt(maxFollowedInput.value) || 500;
  const delayMin = parseInt(delayMinInput.value) || 8;
  const delayMax = parseInt(delayMaxInput.value) || 16;
  
  if (delayMin > delayMax) {
    alert('Delay Min cannot be greater than Delay Max');
    return;
  }
  
  chrome.storage.local.set({ 
    maxProcessed, 
    maxFollowed, 
    delayMin, 
    delayMax,
    regionNorthAmerica: regionNorthAmerica.checked,
    regionSouthAmerica: regionSouthAmerica.checked,
    regionEurope: regionEurope.checked,
    regionAsia: regionAsia.checked,
    regionAfrica: regionAfrica.checked,
    regionOceania: regionOceania.checked
  }, () => {
    alert('Settings saved!');
  });
});

// Start button
startBtn.addEventListener('click', async () => {
  // Reset stats to 0
  chrome.storage.local.set({ 
    isRunning: true, 
    followCount: 0, 
    skipCount: 0,
    processedCount: 0,
    pageCount: 0
  }, () => {
    followCountEl.textContent = 0;
    skipCountEl.textContent = 0;
    processedCountEl.textContent = 0;
    pageCountEl.textContent = 0;
    updateUIRunning();
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'start' });
    });
  });
});

// Stop button
stopBtn.addEventListener('click', () => {
  chrome.storage.local.set({ isRunning: false }, () => {
    updateUIStopped();
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' });
    });
  });
});

function updateUIRunning() {
  statusEl.textContent = 'Running';
  statusEl.style.color = '#2da44e';
  startBtn.disabled = true;
  stopBtn.disabled = false;
}

function updateUIStopped() {
  statusEl.textContent = 'Stopped';
  statusEl.style.color = '#cf222e';
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

// Listen for updates from content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateStats') {
    followCountEl.textContent = message.followCount;
    skipCountEl.textContent = message.skipCount;
    processedCountEl.textContent = message.processedCount;
    pageCountEl.textContent = message.pageCount;
  }
});
