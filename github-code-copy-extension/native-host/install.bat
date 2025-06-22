@echo off
REM Installation script for GitHub Code Copy Extension Native Messaging Host (Windows)

setlocal enabledelayedexpansion

echo Installing GitHub Code Copy Extension Native Messaging Host for Windows...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is required but not installed.
    echo Please install Python and try again.
    pause
    exit /b 1
)

REM Set variables
set HOST_NAME=com.github.codecopy.terminal
set HOST_SCRIPT=terminal_host.py
set MANIFEST_FILE=%HOST_NAME%.json
set SCRIPT_DIR=%~dp0

REM Create Chrome native messaging directory
set CHROME_DIR=%APPDATA%\Google\Chrome\User Data\NativeMessagingHosts
if not exist "%CHROME_DIR%" mkdir "%CHROME_DIR%"

REM Copy files
copy "%SCRIPT_DIR%%HOST_SCRIPT%" "%CHROME_DIR%\" >nul
if errorlevel 1 (
    echo Error: Failed to copy host script
    pause
    exit /b 1
)

REM Update manifest with absolute path
set HOST_PATH=%CHROME_DIR%\%HOST_SCRIPT%
set HOST_PATH=!HOST_PATH:\=\\!

REM Create manifest with correct path
(
echo {
echo   "name": "%HOST_NAME%",
echo   "description": "Terminal integration host for GitHub Code Copy Extension",
echo   "path": "!HOST_PATH!",
echo   "type": "stdio",
echo   "allowed_origins": [
echo     "chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik/"
echo   ]
echo }
) > "%CHROME_DIR%\%MANIFEST_FILE%"

REM Register in Windows Registry
echo Registering native messaging host in Windows Registry...
reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\%HOST_NAME%" /ve /t REG_SZ /d "%CHROME_DIR%\%MANIFEST_FILE%" /f >nul 2>&1

if errorlevel 1 (
    echo Warning: Failed to register in registry. You may need to run as administrator.
    echo Manual registry command:
    echo reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\%HOST_NAME%" /ve /t REG_SZ /d "%CHROME_DIR%\%MANIFEST_FILE%" /f
) else (
    echo Registry entry created successfully.
)

echo.
echo Installation completed!
echo.
echo Files installed to: %CHROME_DIR%
echo.
echo To test the installation:
echo 1. Load the extension in Chrome
echo 2. Navigate to a GitHub repository
echo 3. Try the terminal integration features
echo.
echo If you encounter issues, check:
echo - Python is installed and accessible
echo - The extension has the correct permissions
echo - Chrome is restarted after installation
echo.
pause

