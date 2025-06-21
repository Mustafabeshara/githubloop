# User Guide

Welcome to the GitHub Code Copy Extension! This guide will help you make the most of all the features available.

## Getting Started

### First Time Setup

1. **Install the Extension**
   - Follow the [Installation Guide](INSTALL.md) to set up the extension
   - Optionally install terminal integration for advanced features

2. **Navigate to GitHub**
   - Open any GitHub repository in your browser
   - The extension will automatically activate on GitHub pages

3. **Open the Extension**
   - Click the extension icon in your browser toolbar
   - The popup will show the current status and available actions

## Core Features

### 1. Code Detection and Copying

#### Automatic Code Detection
The extension automatically detects code on various GitHub page types:

- **File Views**: Individual files in repositories (`/blob/` URLs)
- **Raw Views**: Raw file content
- **Gists**: Public and private gists
- **README Files**: Code blocks in markdown files
- **Issue Comments**: Code snippets in discussions
- **Pull Requests**: Code in diffs and comments

#### Copying Code

**Method 1: Extension Popup**
1. Click the extension icon
2. Verify the detected code information
3. Click "Copy Code"
4. The code is now in your clipboard

**Method 2: Injected Button**
1. Look for the "Copy Code" button on GitHub pages
2. It appears near file headers or code blocks
3. Click to copy instantly

**Method 3: Keyboard Shortcut**
- Press `Ctrl+Shift+C` (Windows/Linux) or `Cmd+Shift+C` (Mac)
- Works when code is detected on the current page

#### Copy Options
- **Format on Copy**: Automatically format code when copying
- **Include Comments**: Choose whether to include comments
- **Line Numbers**: Option to include line numbers

### 2. Code Analysis

#### Automatic Analysis
When enabled in settings, code is automatically analyzed when detected:

1. **Issue Detection**: Finds syntax errors, style violations, and potential bugs
2. **Quality Metrics**: Calculates complexity, maintainability scores
3. **Best Practices**: Suggests improvements following language conventions
4. **Security Checks**: Identifies common security vulnerabilities

#### Manual Analysis
1. Click the extension icon
2. Click "Analyze Code"
3. Wait for analysis to complete
4. Review results in the popup

#### Understanding Analysis Results

**Issue Types:**
- 🔴 **Error**: Syntax errors or critical issues that prevent code execution
- 🟡 **Warning**: Style violations or potential problems
- 🔵 **Info**: Suggestions for improvement or best practices

**Severity Levels:**
- **High**: Critical issues that should be fixed immediately
- **Medium**: Important issues that affect code quality
- **Low**: Minor suggestions for improvement

**Quality Score:**
- **Excellent**: 90-100% - High-quality, well-written code
- **Good**: 70-89% - Generally good with minor issues
- **Fair**: 50-69% - Acceptable but needs improvement
- **Poor**: Below 50% - Significant issues present

### 3. Code Fixing and Improvement

#### Auto-Fix Features
The extension can automatically fix common issues:

**JavaScript/TypeScript:**
- Replace `var` with `let` or `const`
- Convert `==` to `===` for strict equality
- Add missing semicolons
- Remove `console.log` statements
- Fix indentation and spacing

**Python:**
- Convert Python 2 print statements to Python 3
- Fix indentation to 4 spaces (PEP 8)
- Remove trailing whitespace
- Add type hints (basic)

**Java:**
- Add missing access modifiers
- Fix naming conventions
- Add `final` keyword where appropriate
- Improve code structure

#### Applying Fixes
1. Run code analysis first
2. Review suggested fixes in the results
3. Click "Apply Fixes" to automatically improve the code
4. Copy the improved code to your clipboard

#### Manual Improvements
- **Format Code**: Apply language-specific formatting
- **Optimize Code**: Improve performance and readability
- **Add Documentation**: Generate comments and documentation

### 4. Terminal Integration

#### Prerequisites
- Terminal integration must be installed (see Installation Guide)
- Python 3.7+ must be available on your system
- Terminal integration must be enabled in settings

#### Sending Code to Terminal
1. Detect code on a GitHub page
2. Click "Send to Terminal" in the popup
3. The extension will:
   - Create a temporary file with the code
   - Open your default terminal
   - Execute the code (if applicable)
   - Show results in the terminal

#### Supported Languages for Execution
- **Python**: Runs with `python3` command
- **JavaScript**: Runs with `node` command
- **Java**: Compiles with `javac` and runs with `java`
- **C/C++**: Compiles with `gcc`/`g++`
- **Go**: Runs with `go run`
- **Shell Scripts**: Executes with appropriate shell

#### Terminal Settings
- **Preferred Terminal**: Choose your default terminal application
- **Execution Timeout**: Set maximum time for code execution
- **Working Directory**: Set where temporary files are created

## Advanced Features

### 1. Custom Analysis Rules

You can add custom analysis rules for your specific needs:

1. Open extension settings
2. Go to "Analysis" tab
3. Click "Add Custom Rule"
4. Define your rule pattern and message
5. Save and apply to future analyses

### 2. Code Templates

Create templates for common code patterns:

1. Copy code that you use frequently
2. Save it as a template in settings
3. Use templates to quickly insert common patterns

### 3. Integration with IDEs

The extension can work with various IDEs:

**VS Code:**
- Copy code and paste directly into VS Code
- Use the VS Code terminal for execution
- Leverage VS Code's built-in formatting

**IntelliJ IDEA:**
- Copy formatted code for immediate use
- Use IDEA's terminal integration
- Apply IDEA's code style after copying

**Sublime Text:**
- Copy code with proper indentation
- Use Sublime's build systems for execution

### 4. Batch Operations

Process multiple files or code blocks:

1. Select multiple files in a GitHub repository
2. Use the extension to analyze all selected files
3. Get a combined report of all issues
4. Apply fixes across multiple files

## Settings and Customization

### General Settings

**Auto-analyze code**
- Automatically analyze code when detected
- Default: Enabled
- Recommendation: Keep enabled for best experience

**Format on copy**
- Automatically format code when copying to clipboard
- Default: Disabled
- Recommendation: Enable if you want consistently formatted code

**Language detection**
- Automatically detect programming language
- Default: Enabled
- Recommendation: Keep enabled for accurate analysis

### Analysis Settings

**Severity filter**
- Choose which issue types to display
- Options: All, Errors only, Errors + Warnings
- Default: All

**Auto-fix**
- Automatically apply safe fixes during analysis
- Default: Disabled
- Recommendation: Enable after you're comfortable with the fixes

**Custom rules**
- Add your own analysis patterns
- Useful for team-specific coding standards

### Terminal Settings

**Terminal integration**
- Enable/disable terminal features
- Default: Disabled (requires native host installation)

**Preferred terminal**
- Choose your default terminal application
- Options vary by operating system

**Execution timeout**
- Maximum time to wait for code execution
- Default: 30 seconds
- Range: 5-300 seconds

### Privacy Settings

**Data collection**
- The extension does not collect any personal data
- All processing happens locally in your browser
- No code is sent to external servers

**Permissions**
- Review and manage extension permissions
- Understand what each permission is used for

## Tips and Best Practices

### 1. Efficient Workflow

**For Learning:**
1. Find interesting code on GitHub
2. Copy and analyze it to understand patterns
3. Apply fixes to see improvements
4. Use terminal integration to test the code

**For Development:**
1. Copy code snippets for reference
2. Analyze your own code by pasting it into GitHub gists
3. Use the extension to maintain consistent code style
4. Share improved code with your team

### 2. Code Quality

**Before Copying:**
- Always review the analysis results
- Understand what each issue means
- Don't blindly apply all fixes

**After Copying:**
- Test the code in your development environment
- Adapt the code to your specific needs
- Consider the context of your project

### 3. Security Considerations

**Code Execution:**
- Only execute code you trust
- Review code before sending to terminal
- Be cautious with code that accesses files or network

**Sensitive Information:**
- Don't copy code containing passwords or API keys
- Be aware of what's in your clipboard
- Clear clipboard after copying sensitive code

## Keyboard Shortcuts

### Default Shortcuts
- **Ctrl+Shift+C** (Cmd+Shift+C): Copy detected code
- **Ctrl+Shift+A** (Cmd+Shift+A): Analyze code
- **Ctrl+Shift+T** (Cmd+Shift+T): Send to terminal
- **Ctrl+Shift+F** (Cmd+Shift+F): Format code

### Customizing Shortcuts
1. Go to `chrome://extensions/shortcuts`
2. Find "GitHub Code Copy Extension"
3. Click the pencil icon to edit shortcuts
4. Set your preferred key combinations

## Troubleshooting

### Common Issues

**Code Not Detected**
- Refresh the GitHub page
- Check if you're on a supported page type
- Look for the extension icon status
- Try manual selection if auto-detection fails

**Analysis Not Working**
- Check if the programming language is supported
- Verify the code doesn't have severe syntax errors
- Try with a smaller code sample
- Check browser console for error messages

**Terminal Integration Fails**
- Verify the native host is installed correctly
- Check if Python 3 is available
- Ensure terminal integration is enabled in settings
- Try restarting the browser

**Copy Not Working**
- Check browser clipboard permissions
- Try using the keyboard shortcut instead
- Verify the extension has necessary permissions
- Test with a simple text copy first

### Getting Help

**Browser Console:**
1. Press F12 to open developer tools
2. Go to the Console tab
3. Look for error messages from the extension
4. Copy any error messages for support

**Extension Console:**
1. Go to `chrome://extensions/`
2. Find the extension and click "Details"
3. Click "Inspect views: background page"
4. Check the console for background script errors

**Support Channels:**
- GitHub Issues: Report bugs and request features
- Documentation: Check the README and guides
- Community: Join discussions with other users

## Frequently Asked Questions

**Q: Does the extension work with private repositories?**
A: Yes, the extension works with any GitHub page you can access, including private repositories.

**Q: Can I use the extension offline?**
A: The extension works offline for code copying and analysis, but terminal integration requires an internet connection for the initial setup.

**Q: Is my code sent to any servers?**
A: No, all code processing happens locally in your browser. No code is transmitted to external servers.

**Q: Can I customize the analysis rules?**
A: Yes, you can add custom analysis rules in the extension settings.

**Q: Does the extension slow down GitHub?**
A: The extension is designed to be lightweight and should not noticeably impact GitHub's performance.

**Q: Can I use the extension on GitHub Enterprise?**
A: Yes, the extension works on GitHub Enterprise instances as well as github.com.

---

**Happy coding!** We hope this extension enhances your GitHub experience and helps you write better code.

