# GitHub Code Copy Extension

A powerful browser extension that enhances your GitHub experience by providing intelligent code copying, analysis, and terminal integration capabilities.

## Features

### 🚀 Core Features
- **Smart Code Detection**: Automatically detects and extracts code from GitHub pages
- **One-Click Copy**: Copy code to clipboard with a single click
- **Terminal Integration**: Send code directly to your terminal for execution
- **Code Analysis**: Advanced static analysis with issue detection and suggestions
- **Auto-Fix**: Automatic code improvements and formatting
- **Multi-Language Support**: Works with JavaScript, Python, Java, and more

### 🔍 Code Analysis
- **Issue Detection**: Identifies syntax errors, style violations, and potential bugs
- **Quality Metrics**: Provides code complexity analysis and quality scoring
- **Best Practices**: Suggests improvements following language conventions
- **Security Checks**: Detects common security vulnerabilities

### 🛠️ Code Fixing
- **Automatic Formatting**: Formats code according to language standards
- **Style Corrections**: Fixes indentation, spacing, and naming conventions
- **Optimization**: Improves code performance and readability
- **Documentation**: Adds missing comments and documentation

### 🖥️ Terminal Integration
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Multiple Terminals**: Supports various terminal applications
- **Code Execution**: Run code directly from GitHub pages
- **File Operations**: Create temporary files for testing

## Installation

### Browser Extension

1. **Download the Extension**
   - Download the extension package from the releases page
   - Or clone this repository and build it yourself

2. **Load in Chrome/Edge**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the extension folder
   - The extension icon should appear in your toolbar

3. **Load in Firefox**
   - Open Firefox and navigate to `about:debugging`
   - Click "This Firefox" in the sidebar
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the extension folder

### Native Messaging Host (Optional)

For terminal integration features, install the native messaging host:

#### Windows
1. Run `native-host/install.bat` as administrator
2. The script will install the host and register it in the Windows registry

#### macOS/Linux
1. Run `chmod +x native-host/install.sh`
2. Run `./native-host/install.sh`
3. The script will install the host in the appropriate system directories

## Usage

### Basic Code Copying

1. **Navigate to GitHub**
   - Visit any GitHub repository or file page
   - The extension automatically detects code content

2. **Copy Code**
   - Click the extension icon in your toolbar
   - Use the "Copy Code" button in the popup
   - Or click the injected copy button on the GitHub page

3. **Paste Anywhere**
   - The code is now in your clipboard
   - Paste it in your IDE, terminal, or any text editor

### Code Analysis

1. **Automatic Analysis**
   - Code is automatically analyzed when detected
   - Issues and suggestions appear in the extension popup

2. **Manual Analysis**
   - Click "Analyze Code" in the popup for detailed analysis
   - View issues categorized by severity (error, warning, info)

3. **Apply Fixes**
   - Review suggested fixes in the analysis results
   - Click "Apply Fixes" to automatically improve the code
   - Copy the improved code to your clipboard

### Terminal Integration

1. **Enable Terminal Integration**
   - Install the native messaging host (see installation section)
   - Enable terminal integration in extension settings

2. **Send to Terminal**
   - Click "Send to Terminal" in the popup
   - The code will be executed in your default terminal
   - View execution results and any errors

3. **Configure Terminal**
   - Choose your preferred terminal in settings
   - Set execution preferences for different languages

## Settings

Access settings by clicking the gear icon in the extension popup:

### General Settings
- **Auto-analyze code**: Automatically analyze detected code
- **Format on copy**: Format code when copying to clipboard
- **Language detection**: Enable automatic programming language detection

### Terminal Settings
- **Terminal integration**: Enable/disable terminal features
- **Preferred terminal**: Choose your default terminal application
- **Execution timeout**: Set timeout for code execution

### Analysis Settings
- **Auto-fix**: Automatically apply safe fixes
- **Severity filter**: Choose which issue types to display
- **Custom rules**: Add your own analysis rules

## Supported Languages

### Full Support (Analysis + Fixing)
- **JavaScript/TypeScript**: ES6+ features, JSDoc, common patterns
- **Python**: PEP 8 compliance, type hints, best practices
- **Java**: Oracle conventions, access modifiers, naming

### Basic Support (Detection + Copy)
- C/C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin
- HTML, CSS, SCSS, JSON, XML, YAML
- Shell scripts (Bash, PowerShell, Fish)
- SQL, R, MATLAB, Lua, Vim script

## GitHub Page Types

The extension works on various GitHub page types:

### Repository Files
- Individual file views (`/blob/` URLs)
- Raw file views
- File edit mode
- Blame view

### Code Snippets
- README code blocks
- Markdown files with syntax highlighting
- Issue comments with code
- Pull request diffs

### Gists
- Public and private gists
- Multi-file gists
- Gist revisions

## Keyboard Shortcuts

- **Ctrl+Shift+C** (Cmd+Shift+C on Mac): Copy detected code
- **Ctrl+Shift+A** (Cmd+Shift+A on Mac): Analyze code
- **Ctrl+Shift+T** (Cmd+Shift+T on Mac): Send to terminal
- **Ctrl+Shift+F** (Cmd+Shift+F on Mac): Format code

## Privacy & Security

### Data Handling
- **No Data Collection**: The extension does not collect or transmit personal data
- **Local Processing**: All code analysis happens locally in your browser
- **Secure Storage**: Settings are stored locally using Chrome's secure storage API

### Permissions
- **Active Tab**: Required to detect and extract code from GitHub pages
- **Clipboard**: Required to copy code to your system clipboard
- **Storage**: Required to save your preferences and settings
- **Native Messaging**: Optional, required only for terminal integration

### Security Features
- **Code Validation**: Validates code before execution
- **Sandboxed Execution**: Terminal operations run in isolated environment
- **Permission Checks**: Requires explicit user consent for sensitive operations

## Troubleshooting

### Extension Not Working
1. **Check Permissions**: Ensure the extension has required permissions
2. **Reload Extension**: Disable and re-enable the extension
3. **Update Browser**: Make sure you're using a supported browser version
4. **Check Console**: Open browser dev tools and check for error messages

### Code Not Detected
1. **Refresh Page**: Reload the GitHub page
2. **Check URL**: Ensure you're on a supported GitHub page type
3. **Wait for Load**: Large files may take time to load completely
4. **Manual Selection**: Try selecting code manually if auto-detection fails

### Terminal Integration Issues
1. **Install Host**: Ensure the native messaging host is properly installed
2. **Check Permissions**: Verify the host has execution permissions
3. **Python Version**: Ensure Python 3 is installed and accessible
4. **Firewall**: Check if firewall is blocking the native messaging host

### Analysis Problems
1. **Language Detection**: Verify the programming language is correctly detected
2. **File Size**: Very large files may cause analysis to timeout
3. **Syntax Errors**: Severe syntax errors may prevent analysis
4. **Browser Memory**: Close other tabs if experiencing performance issues

## Development

### Building from Source

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/github-code-copy-extension.git
   cd github-code-copy-extension
   ```

2. **Install Dependencies**
   ```bash
   # No build dependencies required for basic extension
   # For development tools:
   npm install -g web-ext  # For Firefox testing
   ```

3. **Load Extension**
   - Follow the installation instructions above
   - Use the extension folder directly

### Project Structure
```
github-code-copy-extension/
├── manifest.json              # Extension manifest
├── background/
│   └── background.js          # Background service worker
├── content/
│   ├── content.js            # Content script for GitHub pages
│   └── content.css           # Styles for injected elements
├── popup/
│   ├── popup.html            # Extension popup interface
│   ├── popup.css             # Popup styles
│   └── popup.js              # Popup functionality
├── src/
│   ├── code-analyzer.js      # Code analysis engine
│   └── code-fixer.js         # Code fixing utilities
├── icons/                    # Extension icons
├── native-host/              # Terminal integration
│   ├── terminal_host.py      # Native messaging host
│   ├── install.sh            # Unix installation script
│   ├── install.bat           # Windows installation script
│   └── *.json               # Host manifests
└── docs/                     # Documentation
```

### Contributing

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Style
- Use ESLint configuration provided
- Follow existing code patterns
- Add comments for complex logic
- Test on multiple browsers

## API Reference

### Content Script API

```javascript
// Get current code data
chrome.runtime.sendMessage({
  type: 'GET_CURRENT_CODE'
}, (response) => {
  if (response.success) {
    console.log(response.codeData);
  }
});

// Extract selected code
chrome.runtime.sendMessage({
  type: 'EXTRACT_SELECTED_CODE'
}, (response) => {
  if (response.success) {
    console.log(response.codeData);
  }
});
```

### Background Script API

```javascript
// Analyze code
chrome.runtime.sendMessage({
  type: 'ANALYZE_CODE',
  data: codeData
}, (response) => {
  if (response.success) {
    console.log(response.analysis);
  }
});

// Copy to clipboard
chrome.runtime.sendMessage({
  type: 'COPY_TO_CLIPBOARD',
  data: codeData
}, (response) => {
  if (response.success) {
    console.log('Code copied');
  }
});

// Send to terminal
chrome.runtime.sendMessage({
  type: 'SEND_TO_TERMINAL',
  data: codeData
}, (response) => {
  if (response.success) {
    console.log(response.result);
  }
});
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- GitHub for providing an excellent platform for code sharing
- The open-source community for inspiration and feedback
- Browser extension developers for best practices and examples

## Support

- **Issues**: Report bugs and request features on GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions
- **Email**: Contact the maintainers at support@example.com

---

**Made with ❤️ for developers by developers**

