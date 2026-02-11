---
name: llm-gateway-integration
description: Integrate with LLM Gateway v2.0 for smart model routing and usage tracking
---

# LLM Gateway Integration

Smart wrapper for `~/dta/gateway/llm-gateway.py` that provides:
- Intelligent model selection
- Usage tracking & alerts
- Cost optimization
- Multi-model routing

## Quick Commands

```bash
# Quick query (auto-routes to best model)
llm-ask "your question"

# Force specific model
llm-ask "write code" --model qwen_coder
llm-ask "analyze screenshot" --model kimi --image url

# Check usage
llm-usage

# Think deeply
llm-think "complex problem"
```

## Models Available

1. **Ollama (qwen2.5:3b)** - FREE, local
   - Best for: Simple queries, fast responses
   - Cost: $0
   - Speed: 0.47s

2. **Kimi K2.5** - Multimodal + Thinking
   - Best for: Screenshots, debugging, reasoning
   - Limit: 50/day (shared with other NVIDIA models)

3. **Llama 90B Vision** - Huge model
   - Best for: Complex docs, deep analysis
   - Limit: 50/day (shared)

4. **Llama 11B Vision** - Fast vision
   - Best for: Quick image analysis
   - Limit: 50/day (shared)

5. **Qwen Coder 32B** - Code specialist
   - Best for: Python, JavaScript, debugging
   - Limit: 50/day (shared)

## Routing Logic

The gateway uses smart routing:
- Code keywords → Qwen Coder
- Complex vision/docs → Llama 90B
- Screenshots + errors → Kimi (thinking mode)
- Fast vision → Llama 11B
- Simple queries → Ollama (FREE!)

## Usage Tracking

Check current usage:
```bash
llm-usage
```

Monitor with alerts:
```bash
llm-usage-monitor
# Warns at 40/50 (⚠️ yellow)
# Critical at 45/50 (🚨 red)
```

## Cost Optimization

**Brain vs Muscles Strategy:**
- **Brain** (expensive): Claude Opus, Kimi, Llama 90B
  - Complex reasoning
  - Strategic planning
  - Architecture decisions

- **Muscles** (cheap/free): Ollama, Haiku, Llama 11B
  - Execution
  - Boilerplate code
  - Simple checks

## Configuration

Gateway location: `~/dta/gateway/`

Key files:
- `llm-gateway.py` - Main router
- `ask` - Quick query wrapper
- `think-deep` - Reasoning mode
- `llm-usage` - Usage tracker
- `analyze-screenshot` - Screenshot analysis

Environment variables (in `~/dta/gateway/.env`):
- `NVIDIA_API_KEY` - For Kimi/Llama/Qwen
- `OLLAMA_URL` - Local Ollama endpoint
- `OPENROUTER_API_KEY` - Fallback provider

## Examples

### Simple query (uses free Ollama)
```bash
llm-ask "What's the weather?"
```

### Code generation (routes to Qwen Coder)
```bash
llm-ask "Write a Python function to parse JSON"
```

### Image analysis (routes to Llama 11B)
```bash
llm-ask "Describe this image" --image https://example.com/photo.jpg
```

### Deep reasoning (routes to Kimi)
```bash
llm-think "Design a scalable microservices architecture"
```

## Integration with Clawdbot

Use via exec tool:
```bash
~/dta/gateway/ask "your question"
```

Or Python directly:
```python
python3 ~/dta/gateway/llm-gateway.py "your prompt"
```

## Monitoring

Daily usage limits:
- NVIDIA models: 50 calls/day (shared)
- Ollama: Unlimited (FREE)

Check status:
```bash
# Quick check
~/dta/gateway/llm-usage

# Full monitor (with alerts)
/Users/tommie/clawd/scripts/llm-usage-monitor.sh
```

## Tips

1. **Use Ollama first** for simple queries (FREE!)
2. **Reserve NVIDIA calls** for complex tasks
3. **Check usage** before batch operations
4. **Think mode** costs more tokens - use sparingly
5. **Image tasks** use vision models automatically

## Performance

Current optimization:
- Ollama: 0.47s response time (model in memory)
- NVIDIA models: ~2-5s depending on complexity
- Smart caching reduces repeated queries

## Troubleshooting

**Error: "Daily limit reached"**
- Check usage: `~/dta/gateway/llm-usage`
- Use Ollama: `--force ollama`
- Wait until midnight (resets daily)

**Slow responses:**
- Check Ollama: `ollama ps`
- Restart gateway if needed
- Verify model is loaded

**Connection errors:**
- Check NVIDIA_API_KEY in .env
- Verify Ollama running: `ollama serve`
- Check network connectivity
