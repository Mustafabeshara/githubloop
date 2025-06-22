# Installation Guide

This guide will walk you through installing the GitHub Code Copy Extension and its optional terminal integration features.

## Prerequisites

### Browser Requirements
- **Chrome**: Version 88 or later
- **Edge**: Version 88 or later (Chromium-based)
- **Firefox**: Version 109 or later
- **Opera**: Version 74 or later

### System Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **Python**: Version 3.7 or later (required for terminal integration)
- **Memory**: At least 100MB free RAM
- **Storage**: 10MB free disk space

## Part 1: Browser Extension Installation

### Method 1: Chrome Web Store (Recommended)
*Note: This extension is not yet published to the Chrome Web Store*

1. Visit the Chrome Web Store
2. Search for "GitHub Code Copy Extension"
3. Click "Add to Chrome"
4. Confirm installation when prompted

### Method 2: Manual Installation (Developer Mode)

#### For Chrome/Edge:

1. **Download the Extension**
   ```bash
   # Option A: Download from releases
   # Go to GitHub releases page and download the latest .zip file
   
   # Option B: Clone from source
   git clone https://github.com/your-username/github-code-copy-extension.git
   cd github-code-copy-extension
   ```

2. **Enable Developer Mode**
   - Open Chrome/Edge
   - Navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Toggle "Developer mode" in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the extension folder (containing `manifest.json`)
   - The extension should appear in your extensions list

4. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in the toolbar
   - Find "GitHub Code Copy Extension"
   - Click the pin icon to keep it visible

#### For Firefox:

1. **Download the Extension**
   - Same as Chrome instructions above

2. **Load Temporarily**
   - Open Firefox
   - Navigate to `about:debugging`
   - Click "This Firefox" in the sidebar
   - Click "Load Temporary Add-on..."
   - Select the `manifest.json` file

3. **Permanent Installation** (Advanced)
   - Package the extension as a .xpi file
   - Sign it through Mozilla's developer portal
   - Install the signed .xpi file

## Part 2: Terminal Integration Setup (Optional)

Terminal integration allows the extension to execute code directly in your system terminal. This feature is optional but provides enhanced functionality.

### Windows Installation

#### Method 1: Automatic Installation (Recommended)

1. **Run Installation Script**
   ```cmd
   # Navigate to the extension folder
   cd github-code-copy-extension\native-host
   
   # Run as administrator
   install.bat
   ```

2. **Verify Installation**
   - The script will install files to `%APPDATA%\Google\Chrome\User Data\NativeMessagingHosts`
   - Registry entries will be created automatically
   - Python dependencies will be checked

#### Method 2: Manual Installation

1. **Install Python**
   - Download Python 3.7+ from python.org
   - Ensure Python is added to PATH during installation
   - Verify: `python --version`

2. **Copy Files**
   ```cmd
   # Create directory
   mkdir "%APPDATA%\Google\Chrome\User Data\NativeMessagingHosts"
   
   # Copy host files
   copy native-host\terminal_host.py "%APPDATA%\Google\Chrome\User Data\NativeMessagingHosts\"
   copy native-host\com.github.codecopy.terminal.json "%APPDATA%\Google\Chrome\User Data\NativeMessagingHosts\"
   ```

3. **Update Manifest**
   - Edit the JSON file to use absolute paths
   - Replace `"path": "terminal_host.py"` with full path

4. **Register in Registry**
   ```cmd
   reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.github.codecopy.terminal" /ve /t REG_SZ /d "%APPDATA%\Google\Chrome\User Data\NativeMessagingHosts\com.github.codecopy.terminal.json" /f
   ```

### macOS Installation

#### Automatic Installation

1. **Run Installation Script**
   ```bash
   cd github-code-copy-extension/native-host
   chmod +x install.sh
   ./install.sh
   ```

2. **Grant Permissions**
   - macOS may prompt for security permissions
   - Go to System Preferences > Security & Privacy
   - Allow the terminal host to run

#### Manual Installation

1. **Install Python**
   ```bash
   # Using Homebrew (recommended)
   brew install python3
   
   # Or download from python.org
   # Verify installation
   python3 --version
   ```

2. **Create Directories**
   ```bash
   mkdir -p ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts
   mkdir -p ~/Library/Application\ Support/Chromium/NativeMessagingHosts
   ```

3. **Copy Files**
   ```bash
   cp native-host/terminal_host.py ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/
   cp native-host/com.github.codecopy.terminal.json ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/
   
   # Make executable
   chmod +x ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/terminal_host.py
   ```

4. **Update Manifest**
   - Edit the JSON file to use absolute path:
   ```json
   {
     "name": "com.github.codecopy.terminal",
     "description": "Terminal integration host for GitHub Code Copy Extension",
     "path": "/Users/YOUR_USERNAME/Library/Application Support/Google/Chrome/NativeMessagingHosts/terminal_host.py",
     "type": "stdio",
     "allowed_origins": [
       "chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik/"
     ]
   }
   ```

### Linux Installation

#### Automatic Installation

1. **Run Installation Script**
   ```bash
   cd github-code-copy-extension/native-host
   chmod +x install.sh
   ./install.sh
   ```

2. **Install Dependencies**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install python3 python3-pip
   
   # CentOS/RHEL/Fedora
   sudo yum install python3 python3-pip
   # or
   sudo dnf install python3 python3-pip
   
   # Arch Linux
   sudo pacman -S python python-pip
   ```

#### Manual Installation

1. **Install Python**
   ```bash
   # Most Linux distributions include Python 3
   python3 --version
   
   # If not installed, use your package manager
   sudo apt install python3  # Ubuntu/Debian
   sudo yum install python3   # CentOS/RHEL
   sudo pacman -S python      # Arch Linux
   ```

2. **Create Directories**
   ```bash
   mkdir -p ~/.config/google-chrome/NativeMessagingHosts
   mkdir -p ~/.config/chromium/NativeMessagingHosts
   ```

3. **Copy Files**
   ```bash
   cp native-host/terminal_host.py ~/.config/google-chrome/NativeMessagingHosts/
   cp native-host/com.github.codecopy.terminal.json ~/.config/google-chrome/NativeMessagingHosts/
   
   # Make executable
   chmod +x ~/.config/google-chrome/NativeMessagingHosts/terminal_host.py
   ```

4. **Update Manifest**
   - Edit the JSON file with absolute path:
   ```json
   {
     "name": "com.github.codecopy.terminal",
     "description": "Terminal integration host for GitHub Code Copy Extension",
     "path": "/home/YOUR_USERNAME/.config/google-chrome/NativeMessagingHosts/terminal_host.py",
     "type": "stdio",
     "allowed_origins": [
       "chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik/"
     ]
   }
   ```

## Part 3: Verification and Testing

### Test Browser Extension

1. **Navigate to GitHub**
   - Go to any GitHub repository
   - Open a file (e.g., `https://github.com/microsoft/vscode/blob/main/package.json`)

2. **Check Extension Icon**
   - The extension icon should appear in your browser toolbar
   - Click it to open the popup interface

3. **Test Code Detection**
   - The popup should show detected code information
   - Language, filename, and line count should be displayed

4. **Test Copy Functionality**
   - Click "Copy Code" in the popup
   - Paste in a text editor to verify the code was copied

### Test Terminal Integration

1. **Enable Terminal Integration**
   - Click the extension icon
   - Click the settings (gear) icon
   - Enable "Terminal integration"
   - Save settings

2. **Test Code Execution**
   - Navigate to a simple Python or JavaScript file on GitHub
   - Click "Send to Terminal" in the popup
   - Check if a terminal window opens and executes the code

3. **Verify Native Host**
   - Open browser developer tools (F12)
   - Check the console for any native messaging errors
   - Look for successful connection messages

### Test Code Analysis

1. **Navigate to Code with Issues**
   - Find a JavaScript file that uses `var` instead of `let/const`
   - Or a Python file with style issues

2. **Run Analysis**
   - Click "Analyze Code" in the popup
   - Check if issues are detected and displayed
   - Verify suggestions are provided

3. **Test Auto-Fix**
   - Click "Apply Fixes" if available
   - Verify that the fixed code is shown
   - Copy and compare with original

## Troubleshooting Installation

### Common Issues

#### Extension Not Loading
```
Error: "Manifest file is missing or unreadable"
```
**Solution:**
- Ensure you selected the correct folder containing `manifest.json`
- Check file permissions
- Try downloading the extension again

#### Native Host Not Working
```
Error: "Native messaging host not found"
```
**Solution:**
- Verify Python 3 is installed: `python3 --version`
- Check if the host files are in the correct location
- Ensure the manifest has the correct absolute path
- Restart the browser after installation

#### Permission Denied Errors
```
Error: "Permission denied when executing terminal_host.py"
```
**Solution:**
- Make the file executable: `chmod +x terminal_host.py`
- Check if antivirus is blocking the file
- Run installation script as administrator (Windows)

#### Registry Issues (Windows)
```
Error: "Failed to register in registry"
```
**Solution:**
- Run the installation script as administrator
- Manually add registry entry using `regedit`
- Check Windows UAC settings

### Getting Help

If you encounter issues not covered here:

1. **Check Browser Console**
   - Open developer tools (F12)
   - Look for error messages in the console
   - Note any red error messages

2. **Check Extension Logs**
   - Go to `chrome://extensions/`
   - Click "Details" on the extension
   - Click "Inspect views: background page"
   - Check console for errors

3. **Verify File Locations**
   - Ensure all files are in the correct directories
   - Check that paths in manifest files are absolute
   - Verify file permissions

4. **Report Issues**
   - Create an issue on the GitHub repository
   - Include your operating system and browser version
   - Attach any error messages or logs
   - Describe the steps you followed

## Next Steps

After successful installation:

1. **Read the User Guide** - Learn about all available features
2. **Configure Settings** - Customize the extension to your preferences
3. **Try Advanced Features** - Explore code analysis and fixing capabilities
4. **Provide Feedback** - Help improve the extension by reporting issues or suggestions

---

**Installation complete!** You're now ready to enhance your GitHub experience with intelligent code copying and analysis.

