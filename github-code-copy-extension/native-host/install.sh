#!/bin/bash

# Installation script for GitHub Code Copy Extension Native Messaging Host

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST_NAME="com.github.codecopy.terminal"
HOST_SCRIPT="terminal_host.py"
MANIFEST_FILE="${HOST_NAME}.json"

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo "Installing GitHub Code Copy Extension Native Messaging Host..."
echo "Detected OS: ${MACHINE}"

# Function to install on Linux
install_linux() {
    echo "Installing for Linux..."
    
    # Create directories
    mkdir -p ~/.config/google-chrome/NativeMessagingHosts
    mkdir -p ~/.config/chromium/NativeMessagingHosts
    
    # Copy files
    cp "${SCRIPT_DIR}/${HOST_SCRIPT}" ~/.config/google-chrome/NativeMessagingHosts/
    cp "${SCRIPT_DIR}/${HOST_SCRIPT}" ~/.config/chromium/NativeMessagingHosts/
    
    # Update manifest with absolute path
    ABSOLUTE_PATH="$HOME/.config/google-chrome/NativeMessagingHosts/${HOST_SCRIPT}"
    sed "s|\"path\": \"${HOST_SCRIPT}\"|\"path\": \"${ABSOLUTE_PATH}\"|" "${SCRIPT_DIR}/${MANIFEST_FILE}" > ~/.config/google-chrome/NativeMessagingHosts/${MANIFEST_FILE}
    
    ABSOLUTE_PATH="$HOME/.config/chromium/NativeMessagingHosts/${HOST_SCRIPT}"
    sed "s|\"path\": \"${HOST_SCRIPT}\"|\"path\": \"${ABSOLUTE_PATH}\"|" "${SCRIPT_DIR}/${MANIFEST_FILE}" > ~/.config/chromium/NativeMessagingHosts/${MANIFEST_FILE}
    
    # Make executable
    chmod +x ~/.config/google-chrome/NativeMessagingHosts/${HOST_SCRIPT}
    chmod +x ~/.config/chromium/NativeMessagingHosts/${HOST_SCRIPT}
    
    echo "Installation completed for Linux"
}

# Function to install on Mac
install_mac() {
    echo "Installing for macOS..."
    
    # Create directories
    mkdir -p ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts
    mkdir -p ~/Library/Application\ Support/Chromium/NativeMessagingHosts
    
    # Copy files
    cp "${SCRIPT_DIR}/${HOST_SCRIPT}" ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/
    cp "${SCRIPT_DIR}/${HOST_SCRIPT}" ~/Library/Application\ Support/Chromium/NativeMessagingHosts/
    
    # Update manifest with absolute path
    ABSOLUTE_PATH="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts/${HOST_SCRIPT}"
    sed "s|\"path\": \"${HOST_SCRIPT}\"|\"path\": \"${ABSOLUTE_PATH}\"|" "${SCRIPT_DIR}/${MANIFEST_FILE}" > ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/${MANIFEST_FILE}
    
    ABSOLUTE_PATH="$HOME/Library/Application Support/Chromium/NativeMessagingHosts/${HOST_SCRIPT}"
    sed "s|\"path\": \"${HOST_SCRIPT}\"|\"path\": \"${ABSOLUTE_PATH}\"|" "${SCRIPT_DIR}/${MANIFEST_FILE}" > ~/Library/Application\ Support/Chromium/NativeMessagingHosts/${MANIFEST_FILE}
    
    # Make executable
    chmod +x ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/${HOST_SCRIPT}
    chmod +x ~/Library/Application\ Support/Chromium/NativeMessagingHosts/${HOST_SCRIPT}
    
    echo "Installation completed for macOS"
}

# Function to install on Windows (via WSL or Git Bash)
install_windows() {
    echo "Installing for Windows..."
    echo "Note: This script should be run from WSL or Git Bash"
    
    # Windows paths
    CHROME_PATH="$APPDATA/Google/Chrome/User Data/NativeMessagingHosts"
    
    # Create directory
    mkdir -p "$CHROME_PATH"
    
    # Copy files
    cp "${SCRIPT_DIR}/${HOST_SCRIPT}" "$CHROME_PATH/"
    
    # Update manifest with Windows path
    WINDOWS_PATH="$(wslpath -w "$CHROME_PATH/${HOST_SCRIPT}" 2>/dev/null || echo "$CHROME_PATH/${HOST_SCRIPT}")"
    sed "s|\"path\": \"${HOST_SCRIPT}\"|\"path\": \"${WINDOWS_PATH}\"|" "${SCRIPT_DIR}/${MANIFEST_FILE}" > "$CHROME_PATH/${MANIFEST_FILE}"
    
    echo "Installation completed for Windows"
    echo "You may need to register the native messaging host in the Windows registry:"
    echo "REG ADD \"HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${HOST_NAME}\" /ve /t REG_SZ /d \"${CHROME_PATH}\\${MANIFEST_FILE}\" /f"
}

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

# Install based on OS
case "${MACHINE}" in
    Linux)
        install_linux
        ;;
    Mac)
        install_mac
        ;;
    Cygwin|MinGw)
        install_windows
        ;;
    *)
        echo "Unsupported operating system: ${MACHINE}"
        echo "Please install manually according to your OS documentation."
        exit 1
        ;;
esac

echo ""
echo "Native messaging host installation completed!"
echo ""
echo "To test the installation, you can:"
echo "1. Load the extension in Chrome"
echo "2. Navigate to a GitHub repository"
echo "3. Try the terminal integration features"
echo ""
echo "If you encounter issues, check:"
echo "- Python 3 is installed and accessible"
echo "- The extension has the correct permissions"
echo "- The native messaging host manifest is in the correct location"

