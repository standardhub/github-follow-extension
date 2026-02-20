const statusEl = document.getElementById('status');
const followCountEl = document.getElementById('followCount');
const skipCountEl = document.getElementById('skipCount');
const processedCountEl = document.getElementById('processedCount');
const pageCountEl = document.getElementById('pageCount');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

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
