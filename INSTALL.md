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
   git clone https://github.com/<your-username>/github-code-copy-extension.git
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