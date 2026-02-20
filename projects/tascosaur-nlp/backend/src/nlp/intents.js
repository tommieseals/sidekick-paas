/**
 * Intent Classification Module
 * 
 * Classifies user commands into action intents:
 * CREATE, UPDATE, DELETE, MOVE, QUERY, UNKNOWN
 */

const intentPatterns = {
  CREATE: [
    /^(create|add|make|new|insert)\b/i,
    /^(i need|i want|let'?s? (create|add|make))\b/i,
    /^(can you )?(create|add|make)\b/i,
    /\b(new task|new ticket|new item)\b/i,
  ],
  
  UPDATE: [
    /^(update|edit|modify|change|set)\b/i,
    /^(assign|reassign)\b/i,
    /^(mark|flag)\b/i,
    /\b(change|update)\s+(the\s+)?(priority|assignee|due|deadline)\b/i,
  ],
  
  DELETE: [
    /^(delete|remove|cancel|drop|trash)\b/i,
    /^(get rid of)\b/i,
  ],
  
  MOVE: [
    /^move\b/i,
    /\bto\s+(done|backlog|in[- ]?progress|review|complete|finished)\b/i,
    /^(complete|finish|close|resolve)\b/i,
    /^(start|begin)\s+(working\s+on|on)?\b/i,
  ],
  
  QUERY: [
    /^(show|list|find|get|display|view|search)\b/i,
    /^(what|which|where)\b/i,
    /^(filter|sort)\b/i,
    /\b(all|my)\s+(tasks|tickets|items)\b/i,
  ],
};

/**
 * Classify the intent of a command
 * @param {string} text - Normalized input text
 * @param {object} doc - Compromise.js document
 * @returns {string} Intent type
 */
export function classifyIntent(text, doc) {
  const lowerText = text.toLowerCase();
  
  // Check patterns in priority order
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerText)) {
        return intent;
      }
    }
  }
  
  // Use Compromise.js for verb analysis
  const verbs = doc.verbs().out('array');
  if (verbs.length > 0) {
    const firstVerb = verbs[0].toLowerCase();
    
    if (['create', 'add', 'make', 'build'].includes(firstVerb)) return 'CREATE';
    if (['update', 'change', 'edit', 'modify', 'set', 'assign'].includes(firstVerb)) return 'UPDATE';
    if (['delete', 'remove', 'cancel'].includes(firstVerb)) return 'DELETE';
    if (['move', 'transfer', 'complete', 'finish', 'start'].includes(firstVerb)) return 'MOVE';
    if (['show', 'list', 'find', 'get', 'display', 'search'].includes(firstVerb)) return 'QUERY';
  }
  
  // Default to CREATE if it looks like a task description
  if (doc.nouns().length > 0 && !doc.questions().length) {
    return 'CREATE';
  }
  
  return 'UNKNOWN';
}

/**
 * Get confidence score for intent classification
 */
export function getIntentConfidence(text, intent) {
  const lowerText = text.toLowerCase();
  const patterns = intentPatterns[intent] || [];
  
  let score = 0;
  for (const pattern of patterns) {
    if (pattern.test(lowerText)) {
      // Earlier patterns in array = higher confidence
      score = Math.max(score, 0.9 - (patterns.indexOf(pattern) * 0.1));
    }
  }
  
  return Math.max(score, 0.5); // Minimum 0.5 confidence
}
