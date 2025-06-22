// Enhanced code analysis module for GitHub Code Copy Extension

class CodeAnalyzer {
  constructor() {
    this.rules = new Map();
    this.fixers = new Map();
    this.initializeRules();
    this.initializeFixers();
  }
  
  // Initialize analysis rules for different languages
  initializeRules() {
    // JavaScript/TypeScript rules
    this.rules.set('javascript', [
      {
        id: 'no-var',
        type: 'warning',
        pattern: /\bvar\s+/g,
        message: 'Use let or const instead of var for better scoping',
        severity: 'medium'
      },
      {
        id: 'loose-equality',
        type: 'warning',
        pattern: /(?<![!=])={2}(?!=)/g,
        message: 'Use strict equality (===) instead of loose equality (==)',
        severity: 'medium'
      },
      {
        id: 'missing-semicolon',
        type: 'info',
        pattern: /[^;\s\{\}]\s*$/gm,
        message: 'Consider adding semicolon at end of statement',
        severity: 'low'
      },
      {
        id: 'console-log',
        type: 'info',
        pattern: /console\.log\(/g,
        message: 'Remove console.log statements before production',
        severity: 'low'
      },
      {
        id: 'unused-variable',
        type: 'warning',
        pattern: /(?:let|const|var)\s+(\w+)\s*=.*?(?:\n|$)(?![\s\S]*\b\1\b)/g,
        message: 'Variable appears to be unused',
        severity: 'medium'
      }
    ]);
    
    // Python rules
    this.rules.set('python', [
      {
        id: 'python2-print',
        type: 'error',
        pattern: /print\s+(?!\()/g,
        message: 'Use Python 3 print() function instead of Python 2 print statement',
        severity: 'high'
      },
      {
        id: 'indentation',
        type: 'warning',
        pattern: /^[ ]{1,3}(?=\S)/gm,
        message: 'Use 4 spaces for indentation (PEP 8)',
        severity: 'medium'
      },
      {
        id: 'line-length',
        type: 'info',
        pattern: /.{80,}/g,
        message: 'Line exceeds 79 characters (PEP 8)',
        severity: 'low'
      },
      {
        id: 'import-order',
        type: 'info',
        pattern: /^from\s+\w+.*\nimport\s+\w+/gm,
        message: 'Import statements should be grouped and ordered (PEP 8)',
        severity: 'low'
      }
    ]);
    
    // Java rules
    this.rules.set('java', [
      {
        id: 'class-naming',
        type: 'warning',
        pattern: /class\s+([a-z]\w*)/g,
        message: 'Class names should start with uppercase letter',
        severity: 'medium'
      },
      {
        id: 'method-naming',
        type: 'warning',
        pattern: /(?:public|private|protected)?\s*\w+\s+([A-Z]\w*)\s*\(/g,
        message: 'Method names should start with lowercase letter',
        severity: 'medium'
      },
      {
        id: 'missing-access-modifier',
        type: 'info',
        pattern: /^\s*(?!public|private|protected)\w+\s+\w+\s*\(/gm,
        message: 'Consider adding explicit access modifier',
        severity: 'low'
      }
    ]);
    
    // Generic rules for all languages
    this.rules.set('generic', [
      {
        id: 'todo-comment',
        type: 'info',
        pattern: /(?:TODO|FIXME|HACK|XXX).*$/gm,
        message: 'TODO/FIXME comment found',
        severity: 'low'
      },
      {
        id: 'long-line',
        type: 'info',
        pattern: /.{120,}/g,
        message: 'Line is very long (>120 characters)',
        severity: 'low'
      },
      {
        id: 'trailing-whitespace',
        type: 'info',
        pattern: /[ \t]+$/gm,
        message: 'Trailing whitespace found',
        severity: 'low'
      },
      {
        id: 'multiple-empty-lines',
        type: 'info',
        pattern: /\n\s*\n\s*\n/g,
        message: 'Multiple consecutive empty lines',
        severity: 'low'
      }
    ]);
  }
  
  // Initialize code fixers
  initializeFixers() {
    // JavaScript fixers
    this.fixers.set('javascript', [
      {
        id: 'fix-var',
        pattern: /\bvar\s+/g,
        replacement: 'let ',
        description: 'Replace var with let'
      },
      {
        id: 'fix-loose-equality',
        pattern: /(?<![!=])={2}(?!=)/g,
        replacement: '===',
        description: 'Replace == with ==='
      },
      {
        id: 'add-semicolon',
        pattern: /([^;\s\{\}])\s*$/gm,
        replacement: '$1;',
        description: 'Add missing semicolons'
      },
      {
        id: 'remove-console-log',
        pattern: /console\.log\([^)]*\);\s*/g,
        replacement: '',
        description: 'Remove console.log statements'
      }
    ]);
    
    // Python fixers
    this.fixers.set('python', [
      {
        id: 'fix-print',
        pattern: /print\s+([^(].*?)$/gm,
        replacement: 'print($1)',
        description: 'Convert to Python 3 print function'
      },
      {
        id: 'fix-indentation',
        pattern: /^([ ]{1,3})(?=\S)/gm,
        replacement: '    ',
        description: 'Fix indentation to 4 spaces'
      },
      {
        id: 'remove-trailing-whitespace',
        pattern: /[ \t]+$/gm,
        replacement: '',
        description: 'Remove trailing whitespace'
      }
    ]);
    
    // Generic fixers
    this.fixers.set('generic', [
      {
        id: 'remove-trailing-whitespace',
        pattern: /[ \t]+$/gm,
        replacement: '',
        description: 'Remove trailing whitespace'
      },
      {
        id: 'fix-multiple-empty-lines',
        pattern: /\n\s*\n\s*\n/g,
        replacement: '\n\n',
        description: 'Remove excessive empty lines'
      }
    ]);
  }
  
  // Analyze code and return issues
  async analyzeCode(codeData) {
    const { content, language, filename } = codeData;
    const issues = [];
    const suggestions = [];
    const metrics = this.calculateMetrics(content);
    
    try {
      // Get language-specific rules
      const languageRules = this.rules.get(language?.toLowerCase()) || [];
      const genericRules = this.rules.get('generic') || [];
      const allRules = [...languageRules, ...genericRules];
      
      // Apply rules to find issues
      for (const rule of allRules) {
        const matches = this.findMatches(content, rule);
        issues.push(...matches);
      }
      
      // Generate suggestions based on issues
      const fixSuggestions = this.generateFixSuggestions(content, language, issues);
      suggestions.push(...fixSuggestions);
      
      // Add language-specific suggestions
      const languageSuggestions = this.getLanguageSpecificSuggestions(content, language);
      suggestions.push(...languageSuggestions);
      
      return {
        language: language,
        filename: filename,
        issues: issues.sort((a, b) => this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity)),
        suggestions: suggestions,
        metrics: metrics,
        timestamp: new Date().toISOString(),
        summary: this.generateSummary(issues, metrics)
      };
      
    } catch (error) {
      console.error('Code analysis error:', error);
      return {
        language: language,
        filename: filename,
        issues: [{
          type: 'error',
          message: `Analysis failed: ${error.message}`,
          line: 1,
          severity: 'high'
        }],
        suggestions: [],
        metrics: metrics,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  // Find pattern matches in code
  findMatches(content, rule) {
    const matches = [];
    const lines = content.split('\n');
    
    if (rule.pattern.global) {
      // Global pattern - find all matches
      let match;
      while ((match = rule.pattern.exec(content)) !== null) {
        const lineNumber = this.getLineNumber(content, match.index);
        matches.push({
          type: rule.type,
          message: rule.message,
          line: lineNumber,
          severity: rule.severity,
          ruleId: rule.id,
          column: this.getColumnNumber(content, match.index)
        });
      }
    } else {
      // Non-global pattern - test each line
      lines.forEach((line, index) => {
        if (rule.pattern.test(line)) {
          matches.push({
            type: rule.type,
            message: rule.message,
            line: index + 1,
            severity: rule.severity,
            ruleId: rule.id,
            column: 1
          });
        }
      });
    }
    
    return matches;
  }
  
  // Get line number from character index
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }
  
  // Get column number from character index
  getColumnNumber(content, index) {
    const beforeMatch = content.substring(0, index);
    const lastNewline = beforeMatch.lastIndexOf('\n');
    return index - lastNewline;
  }
  
  // Calculate code metrics
  calculateMetrics(content) {
    const lines = content.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const commentLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.startsWith('//') || 
             trimmed.startsWith('#') || 
             trimmed.startsWith('/*') || 
             trimmed.startsWith('*') ||
             trimmed.startsWith('<!--');
    });
    
    return {
      totalLines: lines.length,
      codeLines: nonEmptyLines.length,
      commentLines: commentLines.length,
      emptyLines: lines.length - nonEmptyLines.length,
      averageLineLength: Math.round(
        nonEmptyLines.reduce((sum, line) => sum + line.length, 0) / nonEmptyLines.length || 0
      ),
      longestLine: Math.max(...lines.map(line => line.length)),
      complexity: this.calculateComplexity(content)
    };
  }
  
  // Calculate cyclomatic complexity (simplified)
  calculateComplexity(content) {
    const complexityKeywords = [
      'if', 'else', 'elif', 'while', 'for', 'foreach', 'switch', 'case',
      'try', 'catch', 'except', 'finally', '&&', '||', '?', ':'
    ];
    
    let complexity = 1; // Base complexity
    
    for (const keyword of complexityKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = content.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    }
    
    return complexity;
  }
  
  // Generate fix suggestions
  generateFixSuggestions(content, language, issues) {
    const suggestions = [];
    const fixers = this.fixers.get(language?.toLowerCase()) || [];
    const genericFixers = this.fixers.get('generic') || [];
    const allFixers = [...fixers, ...genericFixers];
    
    // Group issues by rule ID
    const issuesByRule = new Map();
    issues.forEach(issue => {
      if (!issuesByRule.has(issue.ruleId)) {
        issuesByRule.set(issue.ruleId, []);
      }
      issuesByRule.get(issue.ruleId).push(issue);
    });
    
    // Generate fix suggestions for each rule
    for (const [ruleId, ruleIssues] of issuesByRule) {
      const fixer = allFixers.find(f => f.id === `fix-${ruleId.replace('no-', '')}`);
      if (fixer && ruleIssues.length > 0) {
        suggestions.push({
          type: 'fix',
          description: fixer.description,
          affectedLines: ruleIssues.length,
          severity: 'medium',
          autoFixable: true,
          fixerId: fixer.id
        });
      }
    }
    
    return suggestions;
  }
  
  // Get language-specific suggestions
  getLanguageSpecificSuggestions(content, language) {
    const suggestions = [];
    
    switch (language?.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        if (!content.includes('use strict')) {
          suggestions.push({
            type: 'improvement',
            description: 'Consider adding "use strict" directive',
            severity: 'low'
          });
        }
        if (content.includes('function(') && !content.includes('=>')) {
          suggestions.push({
            type: 'improvement',
            description: 'Consider using arrow functions for better readability',
            severity: 'low'
          });
        }
        break;
        
      case 'python':
        if (!content.includes('#!/usr/bin/env python')) {
          suggestions.push({
            type: 'improvement',
            description: 'Consider adding shebang line for executable scripts',
            severity: 'low'
          });
        }
        if (!content.includes('"""') && !content.includes("'''")) {
          suggestions.push({
            type: 'improvement',
            description: 'Consider adding docstrings for better documentation',
            severity: 'low'
          });
        }
        break;
        
      case 'java':
        if (!content.includes('package ')) {
          suggestions.push({
            type: 'improvement',
            description: 'Consider organizing code into packages',
            severity: 'low'
          });
        }
        break;
    }
    
    return suggestions;
  }
  
  // Generate analysis summary
  generateSummary(issues, metrics) {
    const errorCount = issues.filter(i => i.type === 'error').length;
    const warningCount = issues.filter(i => i.type === 'warning').length;
    const infoCount = issues.filter(i => i.type === 'info').length;
    
    let quality = 'excellent';
    if (errorCount > 0) {
      quality = 'poor';
    } else if (warningCount > 5) {
      quality = 'fair';
    } else if (warningCount > 0 || infoCount > 10) {
      quality = 'good';
    }
    
    return {
      quality: quality,
      totalIssues: issues.length,
      errorCount: errorCount,
      warningCount: warningCount,
      infoCount: infoCount,
      codeLines: metrics.codeLines,
      complexity: metrics.complexity
    };
  }
  
  // Get severity weight for sorting
  getSeverityWeight(severity) {
    const weights = {
      'high': 3,
      'medium': 2,
      'low': 1
    };
    return weights[severity] || 0;
  }
  
  // Apply automatic fixes
  async applyFixes(content, language, fixerIds) {
    let fixedContent = content;
    const appliedFixes = [];
    
    const fixers = this.fixers.get(language?.toLowerCase()) || [];
    const genericFixers = this.fixers.get('generic') || [];
    const allFixers = [...fixers, ...genericFixers];
    
    for (const fixerId of fixerIds) {
      const fixer = allFixers.find(f => f.id === fixerId);
      if (fixer) {
        const beforeLength = fixedContent.length;
        fixedContent = fixedContent.replace(fixer.pattern, fixer.replacement);
        const afterLength = fixedContent.length;
        
        if (beforeLength !== afterLength) {
          appliedFixes.push({
            id: fixer.id,
            description: fixer.description,
            applied: true
          });
        }
      }
    }
    
    return {
      content: fixedContent,
      appliedFixes: appliedFixes
    };
  }
  
  // Get available fixes for content
  getAvailableFixes(content, language) {
    const fixers = this.fixers.get(language?.toLowerCase()) || [];
    const genericFixers = this.fixers.get('generic') || [];
    const allFixers = [...fixers, ...genericFixers];
    
    return allFixers.filter(fixer => {
      return fixer.pattern.test(content);
    }).map(fixer => ({
      id: fixer.id,
      description: fixer.description,
      available: true
    }));
  }
}

// Export for use in background script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodeAnalyzer;
} else if (typeof window !== 'undefined') {
  window.CodeAnalyzer = CodeAnalyzer;
}

