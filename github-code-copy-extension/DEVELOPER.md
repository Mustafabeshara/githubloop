# Developer Documentation

This document provides technical details for developers who want to understand, modify, or contribute to the GitHub Code Copy Extension.

## Architecture Overview

### Extension Structure

The extension follows the Manifest V3 architecture with the following components:

```
Extension Components:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Content       │    │   Background    │    │     Popup       │
│   Script        │◄──►│   Service       │◄──►│   Interface     │
│                 │    │   Worker        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub        │    │   Code Analysis │    │   User          │
│   DOM           │    │   Engine        │    │   Settings      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Native        │    │   Storage       │
│   Messaging     │    │   API           │
└─────────────────┘    └─────────────────┘
```

### Component Responsibilities

**Content Script (`content/content.js`)**
- Detects GitHub page types and code content
- Extracts code from various GitHub elements
- Injects copy buttons and UI elements
- Communicates with background script

**Background Service Worker (`background/background.js`)**
- Handles extension lifecycle and messaging
- Manages code analysis and fixing operations
- Interfaces with native messaging host
- Stores and retrieves user settings

**Popup Interface (`popup/`)**
- Provides user interface for extension features
- Displays code information and analysis results
- Manages user settings and preferences
- Triggers actions through background script

**Analysis Engine (`src/code-analyzer.js`)**
- Performs static code analysis
- Detects issues and suggests improvements
- Calculates code quality metrics
- Supports multiple programming languages

**Code Fixer (`src/code-fixer.js`)**
- Applies automatic code fixes
- Formats code according to language standards
- Optimizes code for performance and readability
- Validates syntax after modifications

## API Reference

### Content Script API

#### Message Types

**GET_CURRENT_CODE**
```javascript
chrome.runtime.sendMessage({
  type: 'GET_CURRENT_CODE'
}, (response) => {
  // response.success: boolean
  // response.codeData: CodeData | null
});
```

**EXTRACT_SELECTED_CODE**
```javascript
chrome.runtime.sendMessage({
  type: 'EXTRACT_SELECTED_CODE'
}, (response) => {
  // response.success: boolean
  // response.codeData: CodeData | null
});
```

#### Data Structures

**CodeData**
```typescript
interface CodeData {
  content: string;        // The actual code content
  language: string;       // Programming language (e.g., 'javascript')
  filename: string;       // Name of the file
  source: string;         // Source type ('textarea', 'rendered', 'blob', etc.)
  url: string;           // GitHub URL where code was found
}
```

### Background Script API

#### Message Types

**ANALYZE_CODE**
```javascript
chrome.runtime.sendMessage({
  type: 'ANALYZE_CODE',
  data: codeData
}, (response) => {
  // response.success: boolean
  // response.analysis: AnalysisResult
});
```

**COPY_TO_CLIPBOARD**
```javascript
chrome.runtime.sendMessage({
  type: 'COPY_TO_CLIPBOARD',
  data: codeData
}, (response) => {
  // response.success: boolean
  // response.message: string
  // response.formatted: boolean
});
```

**SEND_TO_TERMINAL**
```javascript
chrome.runtime.sendMessage({
  type: 'SEND_TO_TERMINAL',
  data: codeData
}, (response) => {
  // response.success: boolean
  // response.result: TerminalResult
});
```

**FIX_CODE**
```javascript
chrome.runtime.sendMessage({
  type: 'FIX_CODE',
  data: {
    content: string,
    language: string,
    fixerIds?: string[]
  }
}, (response) => {
  // response.success: boolean
  // response.fixedContent: string
  // response.appliedFixes: Fix[]
  // response.validation: ValidationResult
});
```

#### Data Structures

**AnalysisResult**
```typescript
interface AnalysisResult {
  language: string;
  filename: string;
  issues: Issue[];
  suggestions: Suggestion[];
  metrics: CodeMetrics;
  timestamp: string;
  summary: AnalysisSummary;
}

interface Issue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column?: number;
  severity: 'high' | 'medium' | 'low';
  ruleId: string;
}

interface CodeMetrics {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  emptyLines: number;
  averageLineLength: number;
  longestLine: number;
  complexity: number;
}
```

### Native Messaging API

#### Host Communication

**Execute Code**
```python
{
  "action": "execute",
  "code": "print('Hello, World!')",
  "language": "python",
  "filename": "hello.py"
}
```

**Open Terminal**
```python
{
  "action": "open_terminal",
  "command": "python hello.py"  # optional
}
```

**Copy to Clipboard**
```python
{
  "action": "copy_clipboard",
  "text": "code content"
}
```

## Code Analysis Engine

### Rule System

The analysis engine uses a rule-based system to detect issues:

```javascript
// Example rule definition
{
  id: 'no-var',
  type: 'warning',
  pattern: /\bvar\s+/g,
  message: 'Use let or const instead of var for better scoping',
  severity: 'medium'
}
```

### Adding New Rules

1. **Define the Rule**
   ```javascript
   const newRule = {
     id: 'custom-rule',
     type: 'warning',
     pattern: /pattern-to-match/g,
     message: 'Description of the issue',
     severity: 'medium'
   };
   ```

2. **Add to Language Rules**
   ```javascript
   // In code-analyzer.js
   this.rules.set('javascript', [
     ...existingRules,
     newRule
   ]);
   ```

3. **Create Corresponding Fixer** (optional)
   ```javascript
   const newFixer = {
     id: 'fix-custom-rule',
     pattern: /pattern-to-fix/g,
     replacement: 'fixed-pattern',
     description: 'Fix description'
   };
   ```

### Language Support

#### Adding New Language Support

1. **Add Language Rules**
   ```javascript
   // In initializeRules()
   this.rules.set('newlang', [
     {
       id: 'newlang-rule',
       type: 'warning',
       pattern: /specific-pattern/g,
       message: 'Language-specific issue',
       severity: 'medium'
     }
   ]);
   ```

2. **Add Language Fixers**
   ```javascript
   // In initializeFixers()
   this.fixers.set('newlang', [
     {
       id: 'fix-newlang-issue',
       pattern: /issue-pattern/g,
       replacement: 'fixed-pattern',
       description: 'Fix description'
     }
   ]);
   ```

3. **Update File Extension Mapping**
   ```javascript
   // In mapFileExtensionToLanguage()
   const languageMap = {
     ...existingMappings,
     'newext': 'newlang'
   };
   ```

## GitHub Integration

### Page Detection

The extension detects various GitHub page types:

```javascript
const urlPatterns = {
  fileView: /github\.com\/[^\/]+\/[^\/]+\/blob\/[^\/]+\/.+/,
  gist: /gist\.github\.com\/[^\/]+\/[a-f0-9]+/,
  repository: /github\.com\/[^\/]+\/[^\/]+$/
};
```

### Code Extraction Strategies

**File View Extraction**
1. Try textarea element (edit mode)
2. Extract from rendered code lines
3. Fall back to blob wrapper content

**Gist Extraction**
1. Find gist file containers
2. Extract from file data elements
3. Handle multi-file gists

**Markdown Extraction**
1. Find code blocks in markdown
2. Extract language from class names
3. Handle syntax highlighting

### DOM Selectors

```javascript
const selectors = {
  // File content
  fileContent: 'textarea[data-testid="file-editor-text-area"]',
  codeLines: '.js-file-line',
  blobCode: '.blob-code',
  
  // Gist content
  gistFile: '.gist-file',
  gistContent: '.file-data',
  
  // Markdown code
  markdownCode: 'pre code, .highlight pre'
};
```

## Terminal Integration

### Native Messaging Host

The native messaging host is a Python script that handles terminal operations:

```python
class TerminalHost:
    def execute_code(self, code, language, filename=None):
        # Create temporary file
        # Generate execution command
        # Run command and capture output
        
    def open_terminal(self, command=None):
        # Open system terminal
        # Execute command if provided
        
    def copy_to_clipboard(self, text):
        # Copy text to system clipboard
```

### Cross-Platform Support

**Windows**
- Uses `cmd` and `powershell` for execution
- Registry integration for native messaging
- `clip` command for clipboard operations

**macOS**
- Uses `Terminal.app` by default
- Supports iTerm2 and other terminals
- `pbcopy` for clipboard operations

**Linux**
- Detects available terminals (gnome-terminal, konsole, etc.)
- Uses `xclip` or `xsel` for clipboard operations
- Supports various desktop environments

## Testing

### Unit Testing

```javascript
// Example test for code analyzer
describe('CodeAnalyzer', () => {
  it('should detect var usage in JavaScript', () => {
    const analyzer = new CodeAnalyzer();
    const code = 'var x = 5;';
    const result = analyzer.analyzeCode({
      content: code,
      language: 'javascript'
    });
    
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        ruleId: 'no-var',
        type: 'warning'
      })
    );
  });
});
```

### Integration Testing

```javascript
// Example test for extension messaging
describe('Extension Messaging', () => {
  it('should copy code to clipboard', async () => {
    const response = await chrome.runtime.sendMessage({
      type: 'COPY_TO_CLIPBOARD',
      data: { content: 'test code' }
    });
    
    expect(response.success).toBe(true);
  });
});
```

### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Code detection works on various GitHub pages
- [ ] Copy functionality works correctly
- [ ] Analysis produces expected results
- [ ] Terminal integration executes code
- [ ] Settings are saved and loaded properly
- [ ] UI is responsive and accessible

## Performance Considerations

### Code Analysis Optimization

1. **Lazy Loading**: Load analysis rules only when needed
2. **Caching**: Cache analysis results for identical code
3. **Throttling**: Limit analysis frequency for large files
4. **Worker Threads**: Use web workers for heavy analysis

### Memory Management

```javascript
// Clean up resources
function cleanup() {
  // Remove event listeners
  observer?.disconnect();
  
  // Clear cached data
  analysisCache.clear();
  
  // Remove injected elements
  injectedElements.forEach(el => el.remove());
}
```

### DOM Performance

```javascript
// Efficient DOM queries
const codeElements = document.querySelectorAll('.js-file-line');
const fragment = document.createDocumentFragment();

// Batch DOM updates
codeElements.forEach(element => {
  // Process element
  fragment.appendChild(processedElement);
});

container.appendChild(fragment);
```

## Security Considerations

### Content Security Policy

The extension follows strict CSP guidelines:

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### Code Execution Safety

1. **Validation**: Validate code before execution
2. **Sandboxing**: Execute code in isolated environment
3. **Timeouts**: Limit execution time
4. **User Consent**: Require explicit user action

### Data Privacy

1. **Local Processing**: All analysis happens locally
2. **No Telemetry**: No data is sent to external servers
3. **Secure Storage**: Use Chrome's secure storage APIs
4. **Permission Minimization**: Request only necessary permissions

## Building and Deployment

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-username/github-code-copy-extension.git
cd github-code-copy-extension

# Install development tools (optional)
npm install -g web-ext

# Load extension in browser
# Chrome: chrome://extensions/ -> Load unpacked
# Firefox: about:debugging -> Load Temporary Add-on
```

### Build Process

```bash
# Create distribution package
./scripts/build.sh

# This will:
# 1. Validate manifest.json
# 2. Minify JavaScript files
# 3. Optimize images
# 4. Create .zip package
```

### Release Process

1. **Version Bump**
   ```bash
   # Update version in manifest.json
   # Update CHANGELOG.md
   # Commit changes
   ```

2. **Testing**
   ```bash
   # Run automated tests
   npm test
   
   # Manual testing on multiple browsers
   # Test on different operating systems
   ```

3. **Package Creation**
   ```bash
   # Create release package
   ./scripts/package.sh
   
   # Sign extension (if required)
   ./scripts/sign.sh
   ```

4. **Store Submission**
   - Upload to Chrome Web Store
   - Submit for Firefox Add-ons
   - Update documentation

## Contributing

### Code Style

```javascript
// Use consistent formatting
const config = {
  indent: 2,
  quotes: 'single',
  semicolons: true,
  trailingComma: true
};

// Add JSDoc comments
/**
 * Analyzes code and returns issues
 * @param {CodeData} codeData - The code to analyze
 * @returns {Promise<AnalysisResult>} Analysis results
 */
async function analyzeCode(codeData) {
  // Implementation
}
```

### Pull Request Process

1. **Fork Repository**
2. **Create Feature Branch**: `git checkout -b feature/new-feature`
3. **Make Changes**: Follow code style guidelines
4. **Add Tests**: Include unit tests for new functionality
5. **Update Documentation**: Update relevant documentation
6. **Submit PR**: Create pull request with detailed description

### Issue Reporting

When reporting issues, include:

- Browser version and operating system
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Console error messages (if any)
- Screenshots (if applicable)

## Troubleshooting Development Issues

### Common Problems

**Extension Not Loading**
- Check manifest.json syntax
- Verify all referenced files exist
- Check browser console for errors

**Content Script Not Injecting**
- Verify matches patterns in manifest
- Check if GitHub changed their DOM structure
- Test on different GitHub page types

**Background Script Errors**
- Check service worker console
- Verify message passing syntax
- Test with simplified code

**Native Messaging Issues**
- Verify host installation
- Check host manifest paths
- Test host script independently

---

This documentation should help you understand and contribute to the GitHub Code Copy Extension. For additional questions, please refer to the GitHub repository or create an issue.

