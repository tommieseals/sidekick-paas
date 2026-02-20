/**
 * LLM Enhancement Module
 * 
 * Fallback to local Ollama for complex/ambiguous inputs
 * Uses qwen2.5:3b on Mac Mini (or any available model)
 */

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://100.88.105.106:11434';
const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:3b';

const SYSTEM_PROMPT = `You are a task parser. Convert natural language into structured JSON.

Output ONLY valid JSON with this structure:
{
  "intent": "CREATE" | "UPDATE" | "DELETE" | "MOVE" | "QUERY",
  "task": { "title": string, "priority": "high"|"medium"|"low", "tags": string[], "assignee": string|null, "dueDate": string|null },
  "target": string (for UPDATE/DELETE/MOVE - the task being referenced),
  "updates": { ... } (for UPDATE - fields to change),
  "destination": string (for MOVE - target status),
  "filters": { ... } (for QUERY - search criteria)
}

Examples:
- "Create a high-priority bug for login page" → {"intent":"CREATE","task":{"title":"login page bug","priority":"high","tags":["bug"]}}
- "Move the API task to done" → {"intent":"MOVE","target":"API task","destination":"done"}
- "Show all urgent bugs" → {"intent":"QUERY","filters":{"priority":"high","tags":["bug"]}}`;

/**
 * Enhance parsing with LLM for complex inputs
 * @param {string} text - User input
 * @returns {object|null} Parsed result or null
 */
export async function enhanceWithLLM(text) {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt: `${SYSTEM_PROMPT}\n\nParse this command:\n"${text}"\n\nJSON:`,
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 256,
        },
      }),
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const output = data.response?.trim();
    
    // Extract JSON from response
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return null;
  } catch (error) {
    console.error('LLM enhancement failed:', error.message);
    return null;
  }
}

/**
 * Check if Ollama is available
 */
export async function checkOllamaHealth() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
