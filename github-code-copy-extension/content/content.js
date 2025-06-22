// Content script for GitHub Code Copy Extension
// Runs on GitHub pages to detect and extract code

(function() {
  'use strict';
  
  console.log('GitHub Code Copy content script loaded');
  
  // Configuration
  const CONFIG = {
    selectors: {
      // GitHub file view selectors
      fileContent: 'textarea[data-testid="file-editor-text-area"]',
      codeTable: 'table[data-hunk]',
      codeLines: '.js-file-line',
      lineNumbers: '.js-line-number',
      
      // GitHub blob view selectors
      blobWrapper: '.blob-wrapper',
      blobCode: '.blob-code',
      blobNum: '.blob-num',
      
      // README and markdown code blocks
      markdownCode: 'pre code, .highlight pre',
      
      // Gist selectors
      gistFile: '.gist-file',
      gistContent: '.file-data',
      
      // File header for metadata
      fileHeader: '.file-header',
      fileName: '.file-info a, .file-header-text',
      languageTag: '.language-'
    },
    
    // GitHub URL patterns
    urlPatterns: {
      fileView: /github\.com\/[^\/]+\/[^\/]+\/blob\/[^\/]+\/.+/,
      gist: /gist\.github\.com\/[^\/]+\/[a-f0-9]+/,
      repository: /github\.com\/[^\/]+\/[^\/]+$/
    }
  };
  
  // Current state
  let currentCodeData = null;
  let observer = null;
  let copyButton = null;
  
  // Initialize content script
  function initialize() {
    console.log('Initializing GitHub code detection');
    
    // Detect current page type and extract code
    detectAndExtractCode();
    
    // Set up mutation observer for dynamic content
    setupMutationObserver();
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener(handleMessage);
    
    // Set up periodic checks for code changes
    setInterval(detectAndExtractCode, 2000);
  }
  
  // Handle messages from popup and background
  function handleMessage(message, sender, sendResponse) {
    console.log('Content script received message:', message);
    
    switch (message.type) {
      case 'GET_CURRENT_CODE':
        sendResponse({
          success: true,
          codeData: currentCodeData
        });
        break;
        
      case 'EXTRACT_SELECTED_CODE':
        const selectedCode = extractSelectedCode();
        sendResponse({
          success: true,
          codeData: selectedCode
        });
        break;
        
      default:
        sendResponse({
          success: false,
          error: 'Unknown message type'
        });
    }
  }
  
  // Detect and extract code from current page
  function detectAndExtractCode() {
    const url = window.location.href;
    let codeData = null;
    
    try {
      if (CONFIG.urlPatterns.fileView.test(url)) {
        codeData = extractFromFileView();
      } else if (CONFIG.urlPatterns.gist.test(url)) {
        codeData = extractFromGist();
      } else {
        // Try to extract from markdown code blocks
        codeData = extractFromMarkdown();
      }
      
      if (codeData && codeData.content) {
        updateCurrentCodeData(codeData);
        injectCopyButton();
      } else {
        clearCurrentCodeData();
        removeCopyButton();
      }
    } catch (error) {
      console.error('Code detection error:', error);
      clearCurrentCodeData();
    }
  }
  
  // Extract code from GitHub file view
  function extractFromFileView() {
    console.log('Extracting from file view');
    
    // Try textarea first (edit mode or raw view)
    const textarea = document.querySelector(CONFIG.selectors.fileContent);
    if (textarea && textarea.value) {
      return {
        content: textarea.value,
        language: detectLanguageFromURL() || detectLanguageFromFilename(),
        filename: extractFilenameFromURL(),
        source: 'textarea',
        url: window.location.href
      };
    }
    
    // Try to extract from rendered code view
    const codeLines = document.querySelectorAll(CONFIG.selectors.codeLines);
    if (codeLines.length > 0) {
      const content = Array.from(codeLines)
        .map(line => line.textContent || '')
        .join('\n');
      
      return {
        content: content,
        language: detectLanguageFromURL() || detectLanguageFromFilename(),
        filename: extractFilenameFromURL(),
        source: 'rendered',
        url: window.location.href
      };
    }
    
    // Try blob wrapper approach
    const blobWrapper = document.querySelector(CONFIG.selectors.blobWrapper);
    if (blobWrapper) {
      const blobCodes = blobWrapper.querySelectorAll(CONFIG.selectors.blobCode);
      if (blobCodes.length > 0) {
        const content = Array.from(blobCodes)
          .map(code => code.textContent || '')
          .join('\n');
        
        return {
          content: content,
          language: detectLanguageFromURL() || detectLanguageFromFilename(),
          filename: extractFilenameFromURL(),
          source: 'blob',
          url: window.location.href
        };
      }
    }
    
    return null;
  }
  
  // Extract code from GitHub Gist
  function extractFromGist() {
    console.log('Extracting from gist');
    
    const gistFiles = document.querySelectorAll(CONFIG.selectors.gistFile);
    if (gistFiles.length === 0) return null;
    
    // For now, extract the first file
    const firstFile = gistFiles[0];
    const fileContent = firstFile.querySelector(CONFIG.selectors.gistContent);
    
    if (fileContent) {
      const codeLines = fileContent.querySelectorAll('.js-file-line');
      if (codeLines.length > 0) {
        const content = Array.from(codeLines)
          .map(line => line.textContent || '')
          .join('\n');
        
        const filename = firstFile.querySelector('.file-info a')?.textContent || 'gist-file';
        
        return {
          content: content,
          language: detectLanguageFromFilename(filename),
          filename: filename,
          source: 'gist',
          url: window.location.href
        };
      }
    }
    
    return null;
  }
  
  // Extract code from markdown code blocks
  function extractFromMarkdown() {
    console.log('Extracting from markdown');
    
    const codeBlocks = document.querySelectorAll(CONFIG.selectors.markdownCode);
    if (codeBlocks.length === 0) return null;
    
    // For now, extract the first code block
    const firstBlock = codeBlocks[0];
    const content = firstBlock.textContent || '';
    
    if (content.trim()) {
      // Try to detect language from class names
      const language = detectLanguageFromElement(firstBlock);
      
      return {
        content: content,
        language: language,
        filename: 'code-snippet',
        source: 'markdown',
        url: window.location.href
      };
    }
    
    return null;
  }
  
  // Extract selected code (if user has selected text)
  function extractSelectedCode() {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    
    if (selectedText.trim()) {
      return {
        content: selectedText,
        language: currentCodeData?.language || 'unknown',
        filename: 'selected-code',
        source: 'selection',
        url: window.location.href
      };
    }
    
    return null;
  }
  
  // Detect programming language from URL
  function detectLanguageFromURL() {
    const url = window.location.href;
    const match = url.match(/\.([a-zA-Z0-9]+)$/);
    
    if (match) {
      return mapFileExtensionToLanguage(match[1]);
    }
    
    return null;
  }
  
  // Detect programming language from filename
  function detectLanguageFromFilename(filename) {
    if (!filename) {
      filename = extractFilenameFromURL();
    }
    
    if (!filename) return null;
    
    const match = filename.match(/\.([a-zA-Z0-9]+)$/);
    if (match) {
      return mapFileExtensionToLanguage(match[1]);
    }
    
    return null;
  }
  
  // Detect language from element classes
  function detectLanguageFromElement(element) {
    const classList = element.classList || [];
    
    for (const className of classList) {
      if (className.startsWith('language-')) {
        return className.replace('language-', '');
      }
      if (className.startsWith('lang-')) {
        return className.replace('lang-', '');
      }
    }
    
    // Check parent elements
    let parent = element.parentElement;
    while (parent) {
      const parentClasses = parent.classList || [];
      for (const className of parentClasses) {
        if (className.startsWith('language-')) {
          return className.replace('language-', '');
        }
        if (className.startsWith('lang-')) {
          return className.replace('lang-', '');
        }
      }
      parent = parent.parentElement;
    }
    
    return null;
  }
  
  // Extract filename from URL
  function extractFilenameFromURL() {
    const url = window.location.href;
    const match = url.match(/\/([^\/]+)$/);
    
    if (match) {
      return decodeURIComponent(match[1]);
    }
    
    // Try to get from page title or file header
    const fileHeader = document.querySelector(CONFIG.selectors.fileName);
    if (fileHeader) {
      return fileHeader.textContent?.trim() || null;
    }
    
    return null;
  }
  
  // Map file extension to programming language
  function mapFileExtensionToLanguage(extension) {
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'sh': 'bash',
      'bash': 'bash',
      'zsh': 'zsh',
      'fish': 'fish',
      'ps1': 'powershell',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'toml': 'toml',
      'ini': 'ini',
      'cfg': 'ini',
      'conf': 'ini',
      'md': 'markdown',
      'markdown': 'markdown',
      'sql': 'sql',
      'r': 'r',
      'R': 'r',
      'matlab': 'matlab',
      'm': 'matlab',
      'pl': 'perl',
      'lua': 'lua',
      'vim': 'vim',
      'dockerfile': 'dockerfile',
      'makefile': 'makefile'
    };
    
    return languageMap[extension.toLowerCase()] || extension.toLowerCase();
  }
  
  // Update current code data
  function updateCurrentCodeData(codeData) {
    const hasChanged = !currentCodeData || 
      currentCodeData.content !== codeData.content ||
      currentCodeData.url !== codeData.url;
    
    if (hasChanged) {
      currentCodeData = codeData;
      console.log('Code data updated:', {
        language: codeData.language,
        filename: codeData.filename,
        lines: codeData.content.split('\n').length,
        source: codeData.source
      });
      
      // Notify popup about code detection
      chrome.runtime.sendMessage({
        type: 'CODE_DETECTED',
        data: codeData
      });
    }
  }
  
  // Clear current code data
  function clearCurrentCodeData() {
    if (currentCodeData) {
      currentCodeData = null;
      console.log('Code data cleared');
      
      // Notify popup about code clearing
      chrome.runtime.sendMessage({
        type: 'CODE_CLEARED'
      });
    }
  }
  
  // Inject copy button into the page
  function injectCopyButton() {
    if (copyButton) return; // Already injected
    
    // Find a suitable location to inject the button
    const fileHeader = document.querySelector('.file-header, .gist-file .file-actions');
    if (!fileHeader) return;
    
    // Create copy button
    copyButton = document.createElement('button');
    copyButton.className = 'btn btn-sm github-code-copy-btn';
    copyButton.innerHTML = `
      <svg class="octicon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
        <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
      </svg>
      Copy Code
    `;
    
    copyButton.style.cssText = `
      margin-left: 8px;
      background-color: #f6f8fa;
      border: 1px solid #d1d9e0;
      border-radius: 6px;
      color: #24292f;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.5;
      transition: all 0.2s ease;
    `;
    
    // Add hover effect
    copyButton.addEventListener('mouseenter', () => {
      copyButton.style.backgroundColor = '#f3f4f6';
      copyButton.style.borderColor = '#c7d2da';
    });
    
    copyButton.addEventListener('mouseleave', () => {
      copyButton.style.backgroundColor = '#f6f8fa';
      copyButton.style.borderColor = '#d1d9e0';
    });
    
    // Add click handler
    copyButton.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (currentCodeData) {
        try {
          await navigator.clipboard.writeText(currentCodeData.content);
          
          // Show success feedback
          const originalText = copyButton.innerHTML;
          copyButton.innerHTML = `
            <svg class="octicon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
            </svg>
            Copied!
          `;
          copyButton.style.color = '#1a7f37';
          
          setTimeout(() => {
            copyButton.innerHTML = originalText;
            copyButton.style.color = '#24292f';
          }, 2000);
        } catch (error) {
          console.error('Copy failed:', error);
          
          // Show error feedback
          const originalText = copyButton.innerHTML;
          copyButton.innerHTML = `
            <svg class="octicon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
            </svg>
            Failed
          `;
          copyButton.style.color = '#d1242f';
          
          setTimeout(() => {
            copyButton.innerHTML = originalText;
            copyButton.style.color = '#24292f';
          }, 2000);
        }
      }
    });
    
    // Inject the button
    fileHeader.appendChild(copyButton);
  }
  
  // Remove copy button from the page
  function removeCopyButton() {
    if (copyButton) {
      copyButton.remove();
      copyButton = null;
    }
  }
  
  // Set up mutation observer for dynamic content
  function setupMutationObserver() {
    if (observer) {
      observer.disconnect();
    }
    
    observer = new MutationObserver((mutations) => {
      let shouldRecheck = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added nodes contain code-related elements
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              if (element.matches && (
                element.matches('.blob-wrapper') ||
                element.matches('.file-data') ||
                element.matches('.highlight') ||
                element.querySelector('.blob-wrapper, .file-data, .highlight')
              )) {
                shouldRecheck = true;
                break;
              }
            }
          }
        }
      });
      
      if (shouldRecheck) {
        setTimeout(detectAndExtractCode, 500);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Also initialize on page navigation (for SPA behavior)
  let lastUrl = window.location.href;
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      console.log('URL changed, reinitializing');
      setTimeout(initialize, 1000);
    }
  }, 1000);
  
})();

