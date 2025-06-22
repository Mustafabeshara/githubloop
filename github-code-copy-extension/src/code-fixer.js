// Code fixing utilities for GitHub Code Copy Extension

class CodeFixer {
  constructor() {
    this.formatters = new Map();
    this.initializeFormatters();
  }
  
  // Initialize code formatters for different languages
  initializeFormatters() {
    // JavaScript formatter
    this.formatters.set('javascript', {
      indentSize: 2,
      useTabs: false,
      semicolons: true,
      quotes: 'single',
      trailingComma: true,
      bracketSpacing: true
    });
    
    // Python formatter
    this.formatters.set('python', {
      indentSize: 4,
      useTabs: false,
      maxLineLength: 79,
      blankLinesAroundClasses: 2,
      blankLinesAroundMethods: 1
    });
    
    // Java formatter
    this.formatters.set('java', {
      indentSize: 4,
      useTabs: false,
      bracesOnNewLine: false,
      maxLineLength: 120
    });
  }
  
  // Format code according to language standards
  formatCode(content, language) {
    const formatter = this.formatters.get(language?.toLowerCase());
    if (!formatter) {
      return this.genericFormat(content);
    }
    
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return this.formatJavaScript(content, formatter);
      case 'python':
        return this.formatPython(content, formatter);
      case 'java':
        return this.formatJava(content, formatter);
      default:
        return this.genericFormat(content);
    }
  }
  
  // Format JavaScript code
  formatJavaScript(content, options) {
    let formatted = content;
    
    // Fix indentation
    formatted = this.fixIndentation(formatted, options.indentSize, options.useTabs);
    
    // Add missing semicolons
    if (options.semicolons) {
      formatted = formatted.replace(/([^;\s\{\}])\s*$/gm, '$1;');
    }
    
    // Fix spacing around operators
    formatted = formatted.replace(/([^=!<>])=([^=])/g, '$1 = $2');
    formatted = formatted.replace(/([^=!<>])==([^=])/g, '$1 == $2');
    formatted = formatted.replace(/([^=!<>])===([^=])/g, '$1 === $2');
    
    // Fix spacing in function declarations
    formatted = formatted.replace(/function\s*\(/g, 'function (');
    
    // Fix object literal spacing
    if (options.bracketSpacing) {
      formatted = formatted.replace(/\{\s*([^}])/g, '{ $1');
      formatted = formatted.replace(/([^{])\s*\}/g, '$1 }');
    }
    
    // Remove trailing whitespace
    formatted = formatted.replace(/[ \t]+$/gm, '');
    
    return formatted;
  }
  
  // Format Python code
  formatPython(content, options) {
    let formatted = content;
    
    // Fix indentation to 4 spaces
    formatted = this.fixIndentation(formatted, options.indentSize, options.useTabs);
    
    // Fix spacing around operators
    formatted = formatted.replace(/([^=!<>])=([^=])/g, '$1 = $2');
    formatted = formatted.replace(/([^=!<>])==([^=])/g, '$1 == $2');
    
    // Fix spacing after commas
    formatted = formatted.replace(/,([^\s])/g, ', $1');
    
    // Fix spacing around colons in dictionaries
    formatted = formatted.replace(/:\s*([^\s])/g, ': $1');
    
    // Remove trailing whitespace
    formatted = formatted.replace(/[ \t]+$/gm, '');
    
    // Fix blank lines around classes and functions
    formatted = this.fixPythonBlankLines(formatted, options);
    
    return formatted;
  }
  
  // Format Java code
  formatJava(content, options) {
    let formatted = content;
    
    // Fix indentation
    formatted = this.fixIndentation(formatted, options.indentSize, options.useTabs);
    
    // Fix spacing around operators
    formatted = formatted.replace(/([^=!<>])=([^=])/g, '$1 = $2');
    formatted = formatted.replace(/([^=!<>])==([^=])/g, '$1 == $2');
    
    // Fix spacing in method declarations
    formatted = formatted.replace(/(\w+)\s*\(/g, '$1(');
    
    // Fix brace placement
    if (!options.bracesOnNewLine) {
      formatted = formatted.replace(/\s*\n\s*\{/g, ' {');
    }
    
    // Remove trailing whitespace
    formatted = formatted.replace(/[ \t]+$/gm, '');
    
    return formatted;
  }
  
  // Generic formatting for unknown languages
  genericFormat(content) {
    let formatted = content;
    
    // Remove trailing whitespace
    formatted = formatted.replace(/[ \t]+$/gm, '');
    
    // Fix multiple empty lines
    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Ensure file ends with newline
    if (!formatted.endsWith('\n')) {
      formatted += '\n';
    }
    
    return formatted;
  }
  
  // Fix indentation
  fixIndentation(content, indentSize, useTabs) {
    const lines = content.split('\n');
    const indentChar = useTabs ? '\t' : ' '.repeat(indentSize);
    let indentLevel = 0;
    
    return lines.map(line => {
      const trimmed = line.trim();
      
      if (trimmed === '') {
        return '';
      }
      
      // Decrease indent for closing braces/brackets
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = indentChar.repeat(indentLevel) + trimmed;
      
      // Increase indent for opening braces/brackets
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
        indentLevel++;
      }
      
      return indentedLine;
    }).join('\n');
  }
  
  // Fix blank lines in Python code
  fixPythonBlankLines(content, options) {
    const lines = content.split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Add blank lines before class definitions
      if (trimmed.startsWith('class ') && i > 0) {
        const prevLine = lines[i - 1].trim();
        if (prevLine !== '') {
          for (let j = 0; j < options.blankLinesAroundClasses; j++) {
            result.push('');
          }
        }
      }
      
      // Add blank lines before function definitions
      if (trimmed.startsWith('def ') && i > 0) {
        const prevLine = lines[i - 1].trim();
        if (prevLine !== '' && !prevLine.startsWith('class ')) {
          for (let j = 0; j < options.blankLinesAroundMethods; j++) {
            result.push('');
          }
        }
      }
      
      result.push(line);
    }
    
    return result.join('\n');
  }
  
  // Generate improved code with best practices
  improveCode(content, language) {
    let improved = content;
    
    switch (language?.toLowerCase()) {
      case 'javascript':
        improved = this.improveJavaScript(improved);
        break;
      case 'python':
        improved = this.improvePython(improved);
        break;
      case 'java':
        improved = this.improveJava(improved);
        break;
    }
    
    return improved;
  }
  
  // Improve JavaScript code
  improveJavaScript(content) {
    let improved = content;
    
    // Replace var with let/const
    improved = improved.replace(/\bvar\s+(\w+)\s*=\s*([^;]+);/g, (match, varName, value) => {
      // Simple heuristic: if value looks like a constant, use const
      if (/^['"`].*['"`]$/.test(value.trim()) || /^\d+$/.test(value.trim())) {
        return `const ${varName} = ${value};`;
      }
      return `let ${varName} = ${value};`;
    });
    
    // Replace == with ===
    improved = improved.replace(/(?<![!=])={2}(?!=)/g, '===');
    improved = improved.replace(/(?<![!=])!={1}(?!=)/g, '!==');
    
    // Add 'use strict' if not present
    if (!improved.includes('use strict')) {
      improved = "'use strict';\n\n" + improved;
    }
    
    return improved;
  }
  
  // Improve Python code
  improvePython(content) {
    let improved = content;
    
    // Fix Python 2 print statements
    improved = improved.replace(/print\s+([^(].*?)$/gm, 'print($1)');
    
    // Add type hints for function parameters (basic)
    improved = improved.replace(/def\s+(\w+)\s*\(([^)]+)\):/g, (match, funcName, params) => {
      // This is a simplified type hint addition
      const typedParams = params.split(',').map(param => {
        const trimmed = param.trim();
        if (trimmed && !trimmed.includes(':')) {
          return `${trimmed}: str`;  // Default to str type
        }
        return trimmed;
      }).join(', ');
      return `def ${funcName}(${typedParams}):`;
    });
    
    return improved;
  }
  
  // Improve Java code
  improveJava(content) {
    let improved = content;
    
    // Add access modifiers if missing
    improved = improved.replace(/^\s*(?!public|private|protected|class|interface)\w+\s+(\w+)\s*\(/gm, 'public $&');
    
    // Add final keyword to variables that are not reassigned (simplified)
    improved = improved.replace(/(\w+)\s+(\w+)\s*=\s*([^;]+);/g, (match, type, varName, value) => {
      // Simple heuristic: if it looks like a constant
      if (/^[A-Z_]+$/.test(varName)) {
        return `final ${type} ${varName} = ${value};`;
      }
      return match;
    });
    
    return improved;
  }
  
  // Optimize code for performance
  optimizeCode(content, language) {
    let optimized = content;
    
    switch (language?.toLowerCase()) {
      case 'javascript':
        // Remove console.log statements
        optimized = optimized.replace(/console\.log\([^)]*\);\s*/g, '');
        
        // Replace string concatenation with template literals
        optimized = optimized.replace(/'([^']*)'?\s*\+\s*(\w+)\s*\+\s*'([^']*)'/g, "`$1${$2}$3`");
        break;
        
      case 'python':
        // Replace string concatenation with f-strings
        optimized = optimized.replace(/'([^']*)'?\s*\+\s*str\((\w+)\)\s*\+\s*'([^']*)'/g, "f'$1{$2}$3'");
        break;
    }
    
    return optimized;
  }
  
  // Add documentation to code
  addDocumentation(content, language) {
    let documented = content;
    
    switch (language?.toLowerCase()) {
      case 'javascript':
        // Add JSDoc comments to functions
        documented = documented.replace(/function\s+(\w+)\s*\([^)]*\)\s*\{/g, (match, funcName) => {
          return `/**\n * ${funcName} function\n * @returns {*}\n */\n${match}`;
        });
        break;
        
      case 'python':
        // Add docstrings to functions
        documented = documented.replace(/def\s+(\w+)\s*\([^)]*\):\s*\n/g, (match, funcName) => {
          return `${match}    """${funcName} function."""\n`;
        });
        break;
        
      case 'java':
        // Add Javadoc comments to methods
        documented = documented.replace(/public\s+\w+\s+(\w+)\s*\([^)]*\)\s*\{/g, (match, methodName) => {
          return `/**\n * ${methodName} method\n */\n${match}`;
        });
        break;
    }
    
    return documented;
  }
  
  // Validate code syntax (basic)
  validateSyntax(content, language) {
    const errors = [];
    
    switch (language?.toLowerCase()) {
      case 'javascript':
        // Check for basic syntax errors
        if (!this.validateJavaScriptSyntax(content)) {
          errors.push('JavaScript syntax errors detected');
        }
        break;
        
      case 'python':
        // Check for basic Python syntax
        if (!this.validatePythonSyntax(content)) {
          errors.push('Python syntax errors detected');
        }
        break;
        
      case 'java':
        // Check for basic Java syntax
        if (!this.validateJavaSyntax(content)) {
          errors.push('Java syntax errors detected');
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
  // Basic JavaScript syntax validation
  validateJavaScriptSyntax(content) {
    try {
      // Check for balanced braces, brackets, and parentheses
      const braces = (content.match(/\{/g) || []).length - (content.match(/\}/g) || []).length;
      const brackets = (content.match(/\[/g) || []).length - (content.match(/\]/g) || []).length;
      const parens = (content.match(/\(/g) || []).length - (content.match(/\)/g) || []).length;
      
      return braces === 0 && brackets === 0 && parens === 0;
    } catch (error) {
      return false;
    }
  }
  
  // Basic Python syntax validation
  validatePythonSyntax(content) {
    try {
      // Check for consistent indentation
      const lines = content.split('\n');
      let indentLevel = 0;
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === '') continue;
        
        const indent = line.length - line.trimStart().length;
        
        if (trimmed.endsWith(':')) {
          indentLevel += 4;
        } else if (indent < indentLevel && trimmed !== '') {
          indentLevel = indent;
        }
        
        // Check if indentation is consistent
        if (indent % 4 !== 0 && indent > 0) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Basic Java syntax validation
  validateJavaSyntax(content) {
    try {
      // Check for balanced braces
      const braces = (content.match(/\{/g) || []).length - (content.match(/\}/g) || []).length;
      
      // Check for semicolons after statements (simplified)
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && 
            !trimmed.endsWith(';') && 
            !trimmed.endsWith('{') && 
            !trimmed.endsWith('}') &&
            !trimmed.startsWith('//') &&
            !trimmed.startsWith('/*') &&
            !trimmed.includes('class ') &&
            !trimmed.includes('if ') &&
            !trimmed.includes('for ') &&
            !trimmed.includes('while ') &&
            trimmed.length > 5) {
          return false;
        }
      }
      
      return braces === 0;
    } catch (error) {
      return false;
    }
  }
}

// Export for use in background script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodeFixer;
} else if (typeof window !== 'undefined') {
  window.CodeFixer = CodeFixer;
}

