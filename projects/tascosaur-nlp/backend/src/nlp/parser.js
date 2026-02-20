import nlp from 'compromise';
import * as chrono from 'chrono-node';
import { classifyIntent } from './intents.js';
import { extractEntities } from './entities.js';
import { enhanceWithLLM } from './llm.js';

/**
 * Main NLP Parser - Converts natural language to structured task data
 * 
 * Pipeline:
 * 1. Intent Classification (what does the user want?)
 * 2. Entity Extraction (what details did they provide?)
 * 3. LLM Enhancement (for complex/ambiguous inputs)
 */
export async function parseCommand(text) {
  const startTime = Date.now();
  
  // Normalize input
  const normalized = text.trim().toLowerCase();
  const doc = nlp(text);
  
  // Step 1: Classify intent
  const intent = classifyIntent(normalized, doc);
  
  // Step 2: Extract entities
  const entities = extractEntities(text, doc);
  
  // Step 3: Build result based on intent
  let result = {
    intent,
    raw: text,
    confidence: 0.8,
    parseTimeMs: 0
  };
  
  switch (intent) {
    case 'CREATE':
      result.task = buildTaskFromEntities(entities, normalized);
      break;
      
    case 'UPDATE':
      result.target = entities.target || findTaskReference(normalized);
      result.updates = buildUpdatesFromEntities(entities);
      break;
      
    case 'DELETE':
      result.target = entities.target || findTaskReference(normalized);
      break;
      
    case 'MOVE':
      result.target = entities.target || findTaskReference(normalized);
      result.destination = entities.status || findDestination(normalized);
      break;
      
    case 'QUERY':
      result.filters = buildFiltersFromEntities(entities);
      break;
      
    case 'UNKNOWN':
      // Try LLM enhancement for ambiguous input
      try {
        const enhanced = await enhanceWithLLM(text);
        if (enhanced && enhanced.intent !== 'UNKNOWN') {
          result = { ...result, ...enhanced, llmEnhanced: true };
        }
      } catch (e) {
        console.log('LLM enhancement unavailable, using regex fallback');
      }
      break;
  }
  
  result.parseTimeMs = Date.now() - startTime;
  return result;
}

/**
 * Build task object from extracted entities
 */
function buildTaskFromEntities(entities, normalized) {
  // Extract title - this is the tricky part
  let title = entities.title || extractTitle(normalized);
  
  return {
    title,
    priority: entities.priority || 'medium',
    tags: entities.tags || [],
    assignee: entities.assignee || null,
    dueDate: entities.dueDate || null,
    status: 'backlog',
    description: ''
  };
}

/**
 * Extract the main title/subject from the command
 */
function extractTitle(text) {
  // Remove common command words and extract the subject
  const patterns = [
    // "create a X for Y" -> "Y X"
    /(?:create|add|make|new)\s+(?:a\s+)?(?:high-priority\s+|low-priority\s+|medium-priority\s+|urgent\s+)?(\w+(?:\s+\w+)?)\s+(?:for|about|on)\s+(.+?)(?:\s+(?:by|due|assigned|@).*)?$/i,
    // "create X" -> "X"
    /(?:create|add|make|new)\s+(?:a\s+)?(?:high-priority\s+|low-priority\s+|medium-priority\s+|urgent\s+)?(.+?)(?:\s+(?:by|due|assigned|@).*)?$/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      if (match[2]) {
        // "X for Y" case
        return `${match[2]} ${match[1]}`.trim();
      }
      return match[1].trim();
    }
  }
  
  // Fallback: remove command words and use rest
  return text
    .replace(/^(create|add|make|new|update|delete|remove|move)\s+(a\s+)?/i, '')
    .replace(/\s+(high|low|medium|urgent)[-\s]?priority/gi, '')
    .replace(/\s+@\w+/g, '')
    .replace(/\s+by\s+.+$/i, '')
    .trim() || 'Untitled Task';
}

/**
 * Find task reference in text (for update/delete/move)
 */
function findTaskReference(text) {
  const patterns = [
    /(?:the\s+)?["']([^"']+)["']/i,  // Quoted text
    /(?:task|ticket|item)\s+(?:called\s+)?["']?([^"']+?)["']?(?:\s+to|\s*$)/i,
    /(?:move|update|delete|remove)\s+(?:the\s+)?(.+?)(?:\s+to\s+|\s*$)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  return null;
}

/**
 * Find destination status for move commands
 */
function findDestination(text) {
  const statusMap = {
    'backlog': ['backlog', 'todo', 'to do', 'to-do'],
    'in-progress': ['in progress', 'in-progress', 'doing', 'working', 'started'],
    'review': ['review', 'reviewing', 'pr', 'pull request'],
    'done': ['done', 'complete', 'completed', 'finished', 'resolved', 'closed']
  };
  
  const lowerText = text.toLowerCase();
  
  for (const [status, keywords] of Object.entries(statusMap)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      return status;
    }
  }
  
  return 'backlog';
}

/**
 * Build updates object from entities
 */
function buildUpdatesFromEntities(entities) {
  const updates = {};
  
  if (entities.priority) updates.priority = entities.priority;
  if (entities.assignee) updates.assignee = entities.assignee;
  if (entities.dueDate) updates.dueDate = entities.dueDate;
  if (entities.status) updates.status = entities.status;
  if (entities.tags?.length) updates.tags = entities.tags;
  
  return updates;
}

/**
 * Build query filters from entities
 */
function buildFiltersFromEntities(entities) {
  const filters = {};
  
  if (entities.priority) filters.priority = entities.priority;
  if (entities.assignee) filters.assignee = entities.assignee;
  if (entities.tags?.length) filters.tags = entities.tags;
  if (entities.status) filters.status = entities.status;
  
  return filters;
}

export { extractTitle, findTaskReference, findDestination };
