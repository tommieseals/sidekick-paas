/**
 * LLM Interface - Connects to local Ollama for AI responses
 */

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://100.88.105.106:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:3b';

/**
 * Query the LLM with a prompt
 */
export async function queryLLM(prompt, options = {}) {
  const {
    model = OLLAMA_MODEL,
    temperature = 0.7,
    maxTokens = 1024,
    timeout = 30000
  } = options;
  
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        }
      }),
      signal: AbortSignal.timeout(timeout)
    });
    
    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response?.trim() || 'No response generated.';
  } catch (error) {
    console.error('LLM query error:', error);
    throw error;
  }
}

/**
 * Check if Ollama is available
 */
export async function checkOllamaHealth() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) return { available: false };
    
    const data = await response.json();
    const models = data.models?.map(m => m.name) || [];
    
    return {
      available: true,
      models,
      hasRequiredModel: models.some(m => m.includes(OLLAMA_MODEL.split(':')[0]))
    };
  } catch (error) {
    return { available: false, error: error.message };
  }
}

/**
 * Stream LLM response (for real-time typing effect)
 */
export async function* streamLLM(prompt, options = {}) {
  const {
    model = OLLAMA_MODEL,
    temperature = 0.7,
    maxTokens = 1024
  } = options;
  
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: true,
      options: {
        temperature,
        num_predict: maxTokens,
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(Boolean);
    
    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.response) {
          yield data.response;
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
}
