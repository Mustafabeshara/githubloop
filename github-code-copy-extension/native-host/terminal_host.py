#!/usr/bin/env python3
"""
Native messaging host for GitHub Code Copy Extension
Handles terminal integration and file operations
"""

import sys
import json
import struct
import subprocess
import tempfile
import os
import platform
from pathlib import Path

class TerminalHost:
    def __init__(self):
        self.system = platform.system().lower()
        self.supported_terminals = {
            'windows': ['cmd', 'powershell', 'wt'],
            'darwin': ['terminal', 'iterm2', 'kitty'],
            'linux': ['gnome-terminal', 'konsole', 'xterm', 'kitty', 'alacritty']
        }
    
    def read_message(self):
        """Read a message from stdin"""
        try:
            # Read the message length (4 bytes)
            raw_length = sys.stdin.buffer.read(4)
            if not raw_length:
                return None
            
            message_length = struct.unpack('=I', raw_length)[0]
            
            # Read the message
            message = sys.stdin.buffer.read(message_length).decode('utf-8')
            return json.loads(message)
        except Exception as e:
            self.send_error(f"Failed to read message: {str(e)}")
            return None
    
    def send_message(self, message):
        """Send a message to stdout"""
        try:
            encoded_message = json.dumps(message).encode('utf-8')
            message_length = len(encoded_message)
            
            # Send the message length (4 bytes)
            sys.stdout.buffer.write(struct.pack('=I', message_length))
            
            # Send the message
            sys.stdout.buffer.write(encoded_message)
            sys.stdout.buffer.flush()
        except Exception as e:
            self.send_error(f"Failed to send message: {str(e)}")
    
    def send_error(self, error_message):
        """Send an error message"""
        error_response = {
            'success': False,
            'error': error_message
        }
        try:
            self.send_message(error_response)
        except:
            pass  # If we can't send the error, there's nothing more we can do
    
    def send_success(self, data=None):
        """Send a success message"""
        response = {
            'success': True
        }
        if data:
            response['data'] = data
        self.send_message(response)
    
    def execute_code(self, code, language, filename=None):
        """Execute code in terminal"""
        try:
            # Create a temporary file for the code
            temp_file = self.create_temp_file(code, language, filename)
            
            # Generate terminal command based on language
            command = self.generate_command(temp_file, language)
            
            if not command:
                self.send_error(f"Unsupported language: {language}")
                return
            
            # Execute the command
            result = self.run_command(command)
            
            # Clean up temporary file
            try:
                os.unlink(temp_file)
            except:
                pass
            
            self.send_success({
                'output': result['output'],
                'error': result['error'],
                'returncode': result['returncode'],
                'command': ' '.join(command) if isinstance(command, list) else command
            })
            
        except Exception as e:
            self.send_error(f"Execution failed: {str(e)}")
    
    def create_temp_file(self, code, language, filename=None):
        """Create a temporary file with the code"""
        # Determine file extension
        extensions = {
            'python': '.py',
            'javascript': '.js',
            'java': '.java',
            'cpp': '.cpp',
            'c': '.c',
            'csharp': '.cs',
            'go': '.go',
            'rust': '.rs',
            'php': '.php',
            'ruby': '.rb',
            'bash': '.sh',
            'powershell': '.ps1',
            'sql': '.sql',
            'html': '.html',
            'css': '.css'
        }
        
        extension = extensions.get(language.lower(), '.txt')
        
        # Create temporary file
        if filename:
            # Use provided filename but in temp directory
            temp_dir = tempfile.gettempdir()
            temp_file = os.path.join(temp_dir, filename)
        else:
            # Create a new temporary file
            fd, temp_file = tempfile.mkstemp(suffix=extension)
            os.close(fd)
        
        # Write code to file
        with open(temp_file, 'w', encoding='utf-8') as f:
            f.write(code)
        
        return temp_file
    
    def generate_command(self, filepath, language):
        """Generate command to execute the code"""
        language = language.lower()
        
        if language in ['python', 'py']:
            return ['python3', filepath] if self.system != 'windows' else ['python', filepath]
        
        elif language in ['javascript', 'js']:
            return ['node', filepath]
        
        elif language == 'java':
            # Compile and run Java in one command
            class_name = Path(filepath).stem
            if self.system == 'windows':
                return [
                    'cmd', '/c',
                    f'javac "{filepath}" && java -cp "{Path(filepath).parent}" {class_name}'
                ]
            else:
                return [
                    'bash', '-c',
                    f'javac "{filepath}" && java -cp "{Path(filepath).parent}" {class_name}'
                ]
        
        elif language in ['cpp', 'c++']:
            # Compile and run C++
            output_file = filepath.replace('.cpp', '.exe' if self.system == 'windows' else '')
            compile_cmd = ['g++', filepath, '-o', output_file]
            return compile_cmd
        
        elif language == 'c':
            # Compile and run C
            output_file = filepath.replace('.c', '.exe' if self.system == 'windows' else '')
            compile_cmd = ['gcc', filepath, '-o', output_file]
            return compile_cmd
        
        elif language == 'go':
            return ['go', 'run', filepath]
        
        elif language == 'rust':
            return ['rustc', filepath]
        
        elif language == 'php':
            return ['php', filepath]
        
        elif language == 'ruby':
            return ['ruby', filepath]
        
        elif language in ['bash', 'sh']:
            if self.system == 'windows':
                return ['bash', filepath]  # Requires WSL or Git Bash
            else:
                return ['bash', filepath]
        
        elif language == 'powershell':
            return ['powershell', '-ExecutionPolicy', 'Bypass', '-File', filepath]
        
        else:
            # For other languages, just open the file
            return self.get_open_command(filepath)
    
    def get_open_command(self, filepath):
        """Get command to open a file in the default application"""
        if self.system == 'windows':
            return ['start', '', filepath]
        elif self.system == 'darwin':
            return ['open', filepath]
        else:
            return ['xdg-open', filepath]
    
    def run_command(self, command):
        """Run a command and return the result"""
        try:
            if self.system == 'windows' and command[0] == 'start':
                # Special handling for Windows start command
                subprocess.Popen(command, shell=True)
                return {
                    'output': 'File opened successfully',
                    'error': '',
                    'returncode': 0
                }
            
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=30  # 30 second timeout
            )
            
            return {
                'output': result.stdout,
                'error': result.stderr,
                'returncode': result.returncode
            }
            
        except subprocess.TimeoutExpired:
            return {
                'output': '',
                'error': 'Command timed out after 30 seconds',
                'returncode': -1
            }
        except Exception as e:
            return {
                'output': '',
                'error': str(e),
                'returncode': -1
            }
    
    def open_terminal(self, command=None):
        """Open a new terminal window"""
        try:
            if self.system == 'windows':
                if command:
                    subprocess.Popen(['start', 'cmd', '/k', command], shell=True)
                else:
                    subprocess.Popen(['start', 'cmd'], shell=True)
            
            elif self.system == 'darwin':
                if command:
                    subprocess.Popen(['open', '-a', 'Terminal', '--args', command])
                else:
                    subprocess.Popen(['open', '-a', 'Terminal'])
            
            else:  # Linux
                terminal_cmd = self.find_available_terminal()
                if terminal_cmd:
                    if command:
                        subprocess.Popen([terminal_cmd, '-e', command])
                    else:
                        subprocess.Popen([terminal_cmd])
                else:
                    raise Exception("No suitable terminal found")
            
            self.send_success({'message': 'Terminal opened successfully'})
            
        except Exception as e:
            self.send_error(f"Failed to open terminal: {str(e)}")
    
    def find_available_terminal(self):
        """Find an available terminal on Linux"""
        terminals = ['gnome-terminal', 'konsole', 'xterm', 'kitty', 'alacritty']
        
        for terminal in terminals:
            try:
                subprocess.run(['which', terminal], capture_output=True, check=True)
                return terminal
            except subprocess.CalledProcessError:
                continue
        
        return None
    
    def copy_to_clipboard(self, text):
        """Copy text to system clipboard"""
        try:
            if self.system == 'windows':
                subprocess.run(['clip'], input=text, text=True, check=True)
            elif self.system == 'darwin':
                subprocess.run(['pbcopy'], input=text, text=True, check=True)
            else:
                # Try xclip first, then xsel
                try:
                    subprocess.run(['xclip', '-selection', 'clipboard'], 
                                 input=text, text=True, check=True)
                except subprocess.CalledProcessError:
                    subprocess.run(['xsel', '--clipboard', '--input'], 
                                 input=text, text=True, check=True)
            
            self.send_success({'message': 'Text copied to clipboard'})
            
        except Exception as e:
            self.send_error(f"Failed to copy to clipboard: {str(e)}")
    
    def handle_message(self, message):
        """Handle incoming message from extension"""
        action = message.get('action')
        
        if action == 'execute':
            code = message.get('code', '')
            language = message.get('language', 'text')
            filename = message.get('filename')
            self.execute_code(code, language, filename)
        
        elif action == 'open_terminal':
            command = message.get('command')
            self.open_terminal(command)
        
        elif action == 'copy_clipboard':
            text = message.get('text', '')
            self.copy_to_clipboard(text)
        
        elif action == 'ping':
            self.send_success({'message': 'pong'})
        
        else:
            self.send_error(f"Unknown action: {action}")
    
    def run(self):
        """Main loop"""
        try:
            while True:
                message = self.read_message()
                if message is None:
                    break
                
                self.handle_message(message)
        
        except KeyboardInterrupt:
            pass
        except Exception as e:
            self.send_error(f"Host error: {str(e)}")

if __name__ == '__main__':
    host = TerminalHost()
    host.run()

