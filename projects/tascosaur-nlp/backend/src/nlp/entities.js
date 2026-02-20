import nlp from 'compromise';
import * as chrono from 'chrono-node';

/**
 * Entity Extraction Module
 * 
 * Extracts structured data from natural language:
 * - Priority (high/medium/low)
 * - Tags (bug, feature, etc.)
 * - Assignee (@username)
 * - Due Date (natural language dates)
 * - Target (referenced task name)
 * - Status (backlog, in-progress, done, etc.)
 */

const priorityPatterns = {
  high: [
    /\b(high|urgent|critical|p1|p0|asap|important|priority\s*1)\b/i,
    /\b(🔴|❗|‼️)\b/,
    /!\s*$/,
  ],
  medium: [
    /\b(medium|normal|p2|moderate|priority\s*2)\b/i,
    /\b(🟡|🟠)\b/,
  ],
  low: [
    /\b(low|minor|p3|p4|trivial|nice\s*to\s*have|priority\s*3)\b/i,
    /\b(🟢|🔵)\b/,
  ],
};

const tagPatterns = {
  bug: /\b(bug|issue|error|crash|broken|fix)\b/i,
  feature: /\b(feature|enhancement|add|implement|new)\b/i,
  docs: /\b(docs?|documentation|readme|wiki)\b/i,
  refactor: /\b(refactor|cleanup|clean\s*up|technical\s*debt|tech\s*debt)\b/i,
  test: /\b(test|testing|unit\s*test|e2e|spec)\b/i,
  ui: /\b(ui|ux|frontend|design|style|css)\b/i,
  backend: /\b(backend|api|server|database|db)\b/i,
  devops: /\b(devops|ci|cd|deploy|infrastructure|infra)\b/i,
  security: /\b(security|auth|authentication|vulnerability|cve)\b/i,
};

const statusPatterns = {
  backlog: /\b(backlog|todo|to[-\s]?do|pending|not\s*started)\b/i,
  'in-progress': /\b(in[-\s]?progress|doing|working|started|wip)\b/i,
  review: /\b(review|reviewing|pr|pull\s*request|code\s*review)\b/i,
  done: /\b(done|complete|completed|finished|resolved|closed|fixed)\b/i,
};

/**
 * Extract all entities from text
 * @param {string} text - Original input text
 * @param {object} doc - Compromise.js document
 * @returns {object} Extracted entities
 */
export function extractEntities(text, doc) {
  const entities = {
    priority: extractPriority(text),
    tags: extractTags(text),
    assignee: extractAssignee(text),
    dueDate: extractDueDate(text),
    target: extractTarget(text, doc),
    status: extractStatus(text),
    title: null, // Set by parser based on context
  };
  
  return entities;
}

/**
 * Extract priority level
 */
export function extractPriority(text) {
  for (const [priority, patterns] of Object.entries(priorityPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return priority;
      }
    }
  }
  return null; // Will default to 'medium'
}

/**
 * Extract tags/labels
 */
export function extractTags(text) {
  const tags = [];
  
  // Check for explicit hashtags
  const hashtagMatches = text.match(/#(\w+)/g);
  if (hashtagMatches) {
    tags.push(...hashtagMatches.map(t => t.slice(1).toLowerCase()));
  }
  
  // Check for implicit tags from content
  for (const [tag, pattern] of Object.entries(tagPatterns)) {
    if (pattern.test(text) && !tags.includes(tag)) {
      tags.push(tag);
    }
  }
  
  return [...new Set(tags)]; // Dedupe
}

/**
 * Extract assignee from @mentions
 */
export function extractAssignee(text) {
  // @username pattern
  const atMatch = text.match(/@(\w+)/);
  if (atMatch) {
    return atMatch[1].toLowerCase();
  }
  
  // "assign to X" pattern
  const assignMatch = text.match(/(?:assign(?:ed)?\s+to|for)\s+(\w+)/i);
  if (assignMatch) {
    return assignMatch[1].toLowerCase();
  }
  
  return null;
}

/**
 * Extract due date using chrono-node
 */
export function extractDueDate(text) {
  const results = chrono.parse(text);
  
  if (results.length > 0) {
    const date = results[0].start.date();
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }
  
  return null;
}

/**
 * Extract target task reference (for update/delete/move)
 */
export function extractTarget(text, doc) {
  // Quoted text
  const quotedMatch = text.match(/["']([^"']+)["']/);
  if (quotedMatch) {
    return quotedMatch[1];
  }
  
  // "the X task/ticket" pattern
  const theMatch = text.match(/the\s+(.+?)\s+(?:task|ticket|item|issue)/i);
  if (theMatch) {
    return theMatch[1];
  }
  
  // Use Compromise to find noun phrases
  const nouns = doc.nouns().out('array');
  if (nouns.length > 0) {
    // Filter out common words
    const stopWords = ['task', 'ticket', 'item', 'priority', 'status'];
    const validNouns = nouns.filter(n => !stopWords.includes(n.toLowerCase()));
    if (validNouns.length > 0) {
      return validNouns[0];
    }
  }
  
  return null;
}

/**
 * Extract status/column
 */
export function extractStatus(text) {
  for (const [status, pattern] of Object.entries(statusPatterns)) {
    if (pattern.test(text)) {
      return status;
    }
  }
  return null;
}

/**
 * Get all entity types for debugging
 */
export function describeEntities(entities) {
  const parts = [];
  
  if (entities.priority) parts.push(`priority: ${entities.priority}`);
  if (entities.tags?.length) parts.push(`tags: [${entities.tags.join(', ')}]`);
  if (entities.assignee) parts.push(`assignee: @${entities.assignee}`);
  if (entities.dueDate) parts.push(`due: ${entities.dueDate}`);
  if (entities.status) parts.push(`status: ${entities.status}`);
  if (entities.target) parts.push(`target: "${entities.target}"`);
  
  return parts.join(' | ') || 'no entities extracted';
}
