// Popup script for GitHub Code Copy Extension

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup loaded');
  
  // Get DOM elements
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const codeInfo = document.getElementById('codeInfo');
  const codeLanguage = document.getElementById('codeLanguage');
  const codeLines = document.getElementById('codeLines');
  const codeFilename = document.getElementById('codeFilename');
  
  const copyBtn = document.getElementById('copyBtn');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const terminalBtn = document.getElementById('terminalBtn');
  
  const analysisResults = document.getElementById('analysisResults');
  const issuesList = document.getElementById('issuesList');
  const suggestionsList = document.getElementById('suggestionsList');
  
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  
  // Settings elements
  const autoAnalyzeCheck = document.getElementById('autoAnalyzeCheck');
  const terminalIntegrationCheck = document.getElementById('terminalIntegrationCheck');
  const languageDetectionCheck = document.getElementById('languageDetectionCheck');
  const terminalSelect = document.getElementById('terminalSelect');
  
  let currentCodeData = null;
  
  // Initialize popup
  await initializePopup();
  
  // Event listeners
  copyBtn.addEventListener('click', handleCopyCode);
  analyzeBtn.addEventListener('click', handleAnalyzeCode);
  terminalBtn.addEventListener('click', handleSendToTerminal);
  settingsBtn.addEventListener('click', showSettings);
  saveSettingsBtn.addEventListener('click', saveSettings);
  cancelSettingsBtn.addEventListener('click', hideSettings);
  
  // Initialize popup state
  async function initializePopup() {
    try {
      // Load settings
      await loadSettings();
      
      // Check if we're on a GitHub page
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (isGitHubPage(tab.url)) {
        updateStatus('ready', 'Ready to detect code');
        
        // Try to get current code data from content script
        chrome.tabs.sendMessage(tab.id, { type: 'GET_CURRENT_CODE' }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('No content script response:', chrome.runtime.lastError.message);
            updateStatus('info', 'Navigate to a GitHub file to detect code');
          } else if (response && response.success && response.codeData) {
            updateCodeInfo(response.codeData);
            currentCodeData = response.codeData;
            enableActions();
          } else {
            updateStatus('info', 'No code detected on this page');
          }
        });
      } else {
        updateStatus('warning', 'Not on a GitHub page');
        updateStatusText('Please navigate to GitHub to use this extension');
      }
    } catch (error) {
      console.error('Initialization error:', error);
      updateStatus('error', 'Extension initialization failed');
    }
  }
  
  // Check if URL is a GitHub page
  function isGitHubPage(url) {
    return url && (url.includes('github.com') || url.includes('gist.github.com'));
  }
  
  // Update status indicator
  function updateStatus(type, message) {
    const statusDot = statusIndicator.querySelector('.status-dot');
    statusDot.className = `status-dot ${type}`;
    statusText.textContent = message;
  }
  
  // Update status text only
  function updateStatusText(message) {
    statusText.textContent = message;
  }
  
  // Update code information display
  function updateCodeInfo(codeData) {
    codeLanguage.textContent = codeData.language || 'Unknown';
    codeLines.textContent = codeData.content ? codeData.content.split('\n').length : 0;
    codeFilename.textContent = codeData.filename || 'Unknown';
    
    codeInfo.style.display = 'block';
    updateStatus('ready', 'Code detected and ready');
  }
  
  // Enable action buttons
  function enableActions() {
    copyBtn.disabled = false;
    analyzeBtn.disabled = false;
    terminalBtn.disabled = false;
  }
  
  // Disable action buttons
  function disableActions() {
    copyBtn.disabled = true;
    analyzeBtn.disabled = true;
    terminalBtn.disabled = true;
  }
  
  // Handle copy code action
  async function handleCopyCode() {
    if (!currentCodeData) {
      updateStatus('error', 'No code data available');
      return;
    }
    
    try {
      copyBtn.disabled = true;
      updateStatus('info', 'Copying to clipboard...');
      
      const response = await sendMessageToBackground({
        type: 'COPY_TO_CLIPBOARD',
        data: currentCodeData
      });
      
      if (response.success) {
        updateStatus('ready', 'Code copied to clipboard!');
        setTimeout(() => {
          updateStatus('ready', 'Ready');
        }, 2000);
      } else {
        updateStatus('error', response.error || 'Copy failed');
      }
    } catch (error) {
      console.error('Copy error:', error);
      updateStatus('error', 'Copy operation failed');
    } finally {
      copyBtn.disabled = false;
    }
  }
  
  // Handle analyze code action
  async function handleAnalyzeCode() {
    if (!currentCodeData) {
      updateStatus('error', 'No code data available');
      return;
    }
    
    try {
      analyzeBtn.disabled = true;
      updateStatus('info', 'Analyzing code...');
      
      const response = await sendMessageToBackground({
        type: 'ANALYZE_CODE',
        data: currentCodeData
      });
      
      if (response.success) {
        displayAnalysisResults(response.analysis);
        updateStatus('ready', 'Analysis complete');
      } else {
        updateStatus('error', response.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      updateStatus('error', 'Analysis operation failed');
    } finally {
      analyzeBtn.disabled = false;
    }
  }
  
  // Handle send to terminal action
  async function handleSendToTerminal() {
    if (!currentCodeData) {
      updateStatus('error', 'No code data available');
      return;
    }
    
    try {
      terminalBtn.disabled = true;
      updateStatus('info', 'Sending to terminal...');
      
      const response = await sendMessageToBackground({
        type: 'SEND_TO_TERMINAL',
        data: currentCodeData
      });
      
      if (response.success) {
        updateStatus('ready', 'Sent to terminal successfully');
        setTimeout(() => {
          updateStatus('ready', 'Ready');
        }, 2000);
      } else {
        updateStatus('error', response.error || 'Terminal operation failed');
      }
    } catch (error) {
      console.error('Terminal error:', error);
      updateStatus('error', 'Terminal operation failed');
    } finally {
      terminalBtn.disabled = false;
    }
  }
  
  // Display analysis results
  function displayAnalysisResults(analysis) {
    // Clear previous results
    issuesList.innerHTML = '';
    suggestionsList.innerHTML = '';
    
    // Display issues
    if (analysis.issues && analysis.issues.length > 0) {
      analysis.issues.forEach(issue => {
        const issueElement = document.createElement('div');
        issueElement.className = `issue-item ${issue.type}`;
        issueElement.innerHTML = `
          <div class="issue-message">${issue.message}</div>
          <div class="issue-line">Line ${issue.line}</div>
        `;
        issuesList.appendChild(issueElement);
      });
    } else {
      issuesList.innerHTML = '<p class="no-issues">No issues found</p>';
    }
    
    // Display suggestions
    if (analysis.suggestions && analysis.suggestions.length > 0) {
      analysis.suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion-item';
        suggestionElement.textContent = suggestion;
        suggestionsList.appendChild(suggestionElement);
      });
    } else {
      suggestionsList.innerHTML = '<p class="no-suggestions">No suggestions available</p>';
    }
    
    // Show analysis results
    analysisResults.style.display = 'block';
  }
  
  // Show settings panel
  function showSettings() {
    settingsPanel.style.display = 'block';
  }
  
  // Hide settings panel
  function hideSettings() {
    settingsPanel.style.display = 'none';
  }
  
  // Load settings from storage
  async function loadSettings() {
    try {
      const response = await sendMessageToBackground({ type: 'GET_SETTINGS' });
      
      if (response.success) {
        const settings = response.settings;
        autoAnalyzeCheck.checked = settings.autoAnalyze !== false;
        terminalIntegrationCheck.checked = settings.terminalIntegration === true;
        languageDetectionCheck.checked = settings.codeLanguageDetection !== false;
        terminalSelect.value = settings.preferredTerminal || 'default';
      }
    } catch (error) {
      console.error('Load settings error:', error);
    }
  }
  
  // Save settings to storage
  async function saveSettings() {
    try {
      const settings = {
        autoAnalyze: autoAnalyzeCheck.checked,
        terminalIntegration: terminalIntegrationCheck.checked,
        codeLanguageDetection: languageDetectionCheck.checked,
        preferredTerminal: terminalSelect.value
      };
      
      await chrome.storage.sync.set(settings);
      
      updateStatus('ready', 'Settings saved');
      hideSettings();
      
      setTimeout(() => {
        updateStatus('ready', 'Ready');
      }, 2000);
    } catch (error) {
      console.error('Save settings error:', error);
      updateStatus('error', 'Failed to save settings');
    }
  }
  
  // Send message to background script
  function sendMessageToBackground(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'CODE_DETECTED') {
      updateCodeInfo(message.data);
      currentCodeData = message.data;
      enableActions();
      
      // Auto-analyze if enabled
      if (autoAnalyzeCheck.checked) {
        handleAnalyzeCode();
      }
    } else if (message.type === 'CODE_CLEARED') {
      codeInfo.style.display = 'none';
      analysisResults.style.display = 'none';
      currentCodeData = null;
      disableActions();
      updateStatus('info', 'No code detected');
    }
  });
});

console.log('Popup script loaded');

