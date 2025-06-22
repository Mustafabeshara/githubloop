// Background service worker for GitHub Code Copy Extension

// Import analysis modules
importScripts('src/code-analyzer.js', 'src/code-fixer.js');

// Initialize analysis tools
const codeAnalyzer = new CodeAnalyzer();
const codeFixer = new CodeFixer();

// Extension installation and update handling
chrome.runtime.onInstalled.addListener((details) => {
  console.log('GitHub Code Copy Extension installed/updated:', details.reason);
  
  // Initialize default settings
  chrome.storage.sync.set({
    autoAnalyze: true,
    terminalIntegration: false,
    preferredTerminal: 'default',
    codeLanguageDetection: true,
    autoFix: false,
    formatOnCopy: false
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  switch (message.type) {
    case 'ANALYZE_CODE':
      handleCodeAnalysis(message.data, sendResponse);
      return true; // Keep message channel open for async response
      
    case 'COPY_TO_CLIPBOARD':
      handleClipboardCopy(message.data, sendResponse);
      return true;
      
    case 'SEND_TO_TERMINAL':
      handleTerminalIntegration(message.data, sendResponse);
      return true;
      
    case 'FIX_CODE':
      handleCodeFix(message.data, sendResponse);
      return true;
      
    case 'FORMAT_CODE':
      handleCodeFormat(message.data, sendResponse);
      return true;
      
    case 'OPTIMIZE_CODE':
      handleCodeOptimize(message.data, sendResponse);
      return true;
      
    case 'GET_SETTINGS':
      handleGetSettings(sendResponse);
      return true;
      
    default:
      console.warn('Unknown message type:', message.type);
      sendResponse({ success: false, error: 'Unknown message type' });
  }
});

// Enhanced code analysis function
async function handleCodeAnalysis(codeData, sendResponse) {
  try {
    console.log('Analyzing code:', codeData.language, codeData.content.length, 'characters');
    
    // Use enhanced analyzer
    const analysis = await codeAnalyzer.analyzeCode(codeData);
    
    sendResponse({
      success: true,
      analysis: analysis
    });
  } catch (error) {
    console.error('Code analysis error:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Enhanced clipboard copy function
async function handleClipboardCopy(data, sendResponse) {
  try {
    let contentToCopy = data.content;
    
    // Check if formatting on copy is enabled
    const settings = await chrome.storage.sync.get(['formatOnCopy']);
    if (settings.formatOnCopy) {
      contentToCopy = codeFixer.formatCode(contentToCopy, data.language);
    }
    
    // Use the clipboard API to copy code
    await navigator.clipboard.writeText(contentToCopy);
    
    console.log('Code copied to clipboard:', contentToCopy.length, 'characters');
    
    sendResponse({
      success: true,
      message: 'Code copied to clipboard',
      formatted: settings.formatOnCopy
    });
  } catch (error) {
    console.error('Clipboard copy error:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Terminal integration function
async function handleTerminalIntegration(data, sendResponse) {
  try {
    // Check if native messaging is available
    const settings = await chrome.storage.sync.get(['terminalIntegration']);
    
    if (!settings.terminalIntegration) {
      sendResponse({
        success: false,
        error: 'Terminal integration is disabled'
      });
      return;
    }
    
    // Send message to native host
    chrome.runtime.sendNativeMessage(
      'com.github.codecopy.terminal',
      {
        action: 'execute',
        code: data.content,
        language: data.language,
        filename: data.filename
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Native messaging error:', chrome.runtime.lastError);
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message
          });
        } else {
          sendResponse({
            success: true,
            result: response
          });
        }
      }
    );
  } catch (error) {
    console.error('Terminal integration error:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Code fixing function
async function handleCodeFix(data, sendResponse) {
  try {
    const { content, language, fixerIds } = data;
    
    let fixedContent = content;
    let appliedFixes = [];
    
    if (fixerIds && fixerIds.length > 0) {
      // Apply specific fixes
      const result = await codeAnalyzer.applyFixes(content, language, fixerIds);
      fixedContent = result.content;
      appliedFixes = result.appliedFixes;
    } else {
      // Apply general improvements
      fixedContent = codeFixer.improveCode(content, language);
      appliedFixes = [{ description: 'General code improvements applied' }];
    }
    
    // Validate the fixed code
    const validation = codeFixer.validateSyntax(fixedContent, language);
    
    sendResponse({
      success: true,
      fixedContent: fixedContent,
      appliedFixes: appliedFixes,
      validation: validation
    });
  } catch (error) {
    console.error('Code fix error:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Code formatting function
async function handleCodeFormat(data, sendResponse) {
  try {
    const { content, language } = data;
    
    const formattedContent = codeFixer.formatCode(content, language);
    const validation = codeFixer.validateSyntax(formattedContent, language);
    
    sendResponse({
      success: true,
      formattedContent: formattedContent,
      validation: validation
    });
  } catch (error) {
    console.error('Code format error:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Code optimization function
async function handleCodeOptimize(data, sendResponse) {
  try {
    const { content, language } = data;
    
    let optimizedContent = codeFixer.optimizeCode(content, language);
    optimizedContent = codeFixer.addDocumentation(optimizedContent, language);
    
    const validation = codeFixer.validateSyntax(optimizedContent, language);
    
    sendResponse({
      success: true,
      optimizedContent: optimizedContent,
      validation: validation
    });
  } catch (error) {
    console.error('Code optimize error:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Get settings function
async function handleGetSettings(sendResponse) {
  try {
    const settings = await chrome.storage.sync.get([
      'autoAnalyze',
      'terminalIntegration',
      'preferredTerminal',
      'codeLanguageDetection',
      'autoFix',
      'formatOnCopy'
    ]);
    
    sendResponse({
      success: true,
      settings: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

console.log('GitHub Code Copy Extension background script loaded with enhanced analysis');

