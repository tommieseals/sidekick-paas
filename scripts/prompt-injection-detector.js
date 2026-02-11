#!/usr/bin/env node
/**
 * Prompt Injection Detection Utility
 * Based on research from Lakera, OWASP, and security best practices
 * 
 * Usage: node prompt-injection-detector.js "user input text"
 * Returns: exit 0 (safe) or exit 1 (suspicious)
 */

const SUSPICIOUS_PATTERNS = [
  // Direct instruction overrides
  /ignore\s+(all\s+)?previous\s+instructions?/i,
  /forget\s+(everything|all|what)\s+(you'?ve?\s+)?(learned|been\s+told|discussed)/i,
  /disregard\s+(all\s+)?previous\s+(commands?|instructions?)/i,
  
  // Role-playing exploits
  /pretend\s+(you'?re?|to\s+be)\s+(a\s+)?(.+?)(hacker|expert|admin|system)/i,
  /act\s+as\s+(a\s+)?(.+?)(with\s+no\s+restrictions|without\s+limits)/i,
  /you\s+are\s+now\s+(a\s+)?(.+?)(developer|admin|root|system)/i,
  
  // Context hijacking
  /start\s+fresh/i,
  /new\s+conversation/i,
  /reset\s+(your|the)\s+(memory|context|instructions)/i,
  
  // Obfuscation attempts
  /[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]/,  // Excessive spacing
  /\u200B|\u200C|\u200D|\uFEFF/,  // Zero-width characters
  
  // System prompt extraction
  /what\s+(is|are)\s+(your|the)\s+(system\s+)?(prompt|instructions)/i,
  /show\s+me\s+(your|the)\s+(original|initial)\s+(prompt|instructions)/i,
  /print\s+(your|the)\s+(system\s+)?(prompt|rules|instructions)/i,
  
  // Instruction injection markers
  /\[SYSTEM\]/i,
  /\[ADMIN\]/i,
  /\[OVERRIDE\]/i,
  /<prompt>/i,
  /<\/prompt>/i,
  
  // Language switching exploitation
  /translate\s+to\s+(.+?)\s+and\s+(ignore|bypass|skip)/i,
  /in\s+(spanish|french|german|chinese|russian):\s*ignore/i,
  
  // Data exfiltration attempts
  /send\s+(me\s+)?(.+?)(api\s+key|password|token|secret)/i,
  /print\s+(the\s+)?(last\s+)?(user'?s?|admin|system)\s+(password|key|token)/i,
  
  // Multi-turn manipulation
  /continue\s+from\s+where\s+we\s+left/i,
  /remember\s+that\s+you\s+are/i,
  
  // Jailbreak attempts
  /DAN\s+mode/i,  // "Do Anything Now"
  /developer\s+mode/i,
  /unrestricted\s+mode/i,
  /jailbreak/i,
  
  // Code execution tricks
  /execute\s+the\s+following/i,
  /run\s+this\s+code/i,
  /eval\s*\(/i,
  /system\s*\(/i,
];

// Dangerous keywords that need context
const WARNING_KEYWORDS = [
  'bypass', 'override', 'ignore', 'admin', 'root', 'system',
  'elevated', 'privilege', 'sudo', 'password', 'credential',
  'api_key', 'token', 'secret', 'escape', 'jailbreak'
];

function detectPromptInjection(input) {
  const results = {
    suspicious: false,
    confidence: 0,
    triggers: [],
    warnings: []
  };
  
  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(input)) {
      results.suspicious = true;
      results.triggers.push({
        pattern: pattern.source,
        type: 'PATTERN_MATCH'
      });
    }
  }
  
  // Check for warning keywords
  const lowerInput = input.toLowerCase();
  for (const keyword of WARNING_KEYWORDS) {
    if (lowerInput.includes(keyword)) {
      results.warnings.push(keyword);
    }
  }
  
  // Calculate confidence score
  results.confidence = Math.min(
    results.triggers.length * 30 + results.warnings.length * 10,
    100
  );
  
  return results;
}

// CLI interface
if (require.main === module) {
  const input = process.argv.slice(2).join(' ');
  
  if (!input) {
    console.error('Usage: prompt-injection-detector.js "user input text"');
    process.exit(2);
  }
  
  const result = detectPromptInjection(input);
  
  console.log(JSON.stringify(result, null, 2));
  
  // Exit code: 0 = safe, 1 = suspicious
  process.exit(result.suspicious ? 1 : 0);
}

module.exports = { detectPromptInjection };
