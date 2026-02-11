# Local AI Setup Documentation
Last updated: 2026-02-08

## Current Infrastructure

### Hub (Mac Mini - 100.82.234.66)
**Specs:** M-chip, 16GB RAM
**Role:** Primary orchestrator, agent runtime, local inference

**Installed Models:**
- `qwen2.5:3b` (1.9GB) - Fast general-purpose model
  - Use: Admin scripts, quick analysis
  - Speed: ~1-3 seconds for short prompts
  - Quality: Good for structured analysis
  
- `nomic-embed-text:latest` (274MB) - Text embeddings
  - Use: Semantic search, similarity
  - Speed: Very fast

**RAM Constraints:**
- Available RAM: ~4-6GB typically
- Model limit: 3GB max to avoid swapping
- Threshold: Auto-offload to cloud if <5GB RAM

### Cloud Worker (GCP ARM - 100.107.231.87)
**Specs:** 4 OCPU, 24GB RAM
**Role:** Heavy compute offload, overflow processing

**Installed Models:**
- `qwen2.5:7b` (4GB) - Higher quality model
  - Use: Complex analysis, offload tasks
  - Speed: ~5-10 seconds for short prompts
  - Quality: Better reasoning than 3B
  
- `nomic-embed-text:latest` (274MB) - Text embeddings

**Connectivity:**
- Latency: 30-100ms via Tailscale
- Always-on, auto-offload target

### Worker (Dell PC - 100.119.87.108)
**Specs:** i9, 64GB RAM
**Role:** Heavy compute offload (when available)
**Status:** CrowdStrike-monitored work computer - DO NOT USE

**Installed Models:**
- `phi3:mini` - Small fast model
- Ollama running and accessible

**Important:** This is OFF LIMITS due to work monitoring

## Inference Chain

### Current 3-Tier Fallback

```bash
get_ai_response "prompt" "script-name"
```

**Tier 1: Local (Mac Mini)**
- Model: qwen2.5:3b
- Timeout: 60s
- Cost: $0 (self-hosted)
- Success rate: ~95% (when RAM >3GB)

**Tier 2: Cloud (GCP ARM)**
- Model: qwen2.5:7b  
- Timeout: 120s
- Cost: $0 (self-hosted)
- Success rate: ~99%

**Tier 3: OpenRouter (if configured)**
- Model: gemma-2-9b-it:free
- Timeout: default
- Cost: $0 (free tier) or paid
- Success rate: ~99%

**Fallback:** Log to backlog, return error

## Token Usage & Cost Tracking

**Tracking:** `~/clawd/logs/token-usage.log`

**View stats:**
```bash
source ~/scripts/track-tokens.sh && get_token_stats
```

**Current Usage (2026-02-08):**
- admin-security: ~127 tokens/run
- Total cost: $0.00 (all local/cloud self-hosted)

**Estimated Daily Usage:**
```
4 admin scripts × 2 runs/day × 130 tokens = ~1,040 tokens/day
Monthly: ~31,200 tokens
Cost: $0 (all self-hosted)
```

## Model Selection Recommendations

### For Different Task Types

**Quick Analysis (< 100 tokens output):**
- ✅ qwen2.5:3b (local)
- Speed: 1-3s
- Quality: Good enough

**Complex Reasoning (100-500 tokens):**
- ✅ qwen2.5:7b (cloud)  
- Speed: 5-10s
- Quality: Better coherence

**Long-Form Generation (500+ tokens):**
- Consider: Larger models via OpenRouter
- Or: Break into chunks with qwen2.5:7b

**Code Generation:**
- Current: qwen2.5 models work okay
- Better: Could add deepseek-coder or qwen-coder

**Specialized Tasks:**
- Math: Consider adding model with better math capabilities
- Multi-lingual: qwen2.5 supports multiple languages
- Vision: Would need separate vision model

## Optimization Opportunities

### Immediate (This Week)

1. **Monitor Token Usage**
   - ✅ Tracking enabled
   - [ ] Collect 1 week of data
   - [ ] Identify high-token operations

2. **Test Model Variants**
   - [ ] Try qwen2.5:1.5b for simple tasks
   - [ ] Test qwen-coder for code tasks
   - [ ] Evaluate phi3:mini as fallback

### Medium Term (This Month)

3. **Expand Model Library**
   - [ ] Add specialized code model
   - [ ] Add math-focused model
   - [ ] Test vision model for image tasks

4. **Optimize Prompts**
   - [ ] Shorten context where possible
   - [ ] Use system prompts more effectively
   - [ ] Template common queries

### Long Term (Next Quarter)

5. **Fine-Tuning**
   - [ ] Collect admin script examples
   - [ ] Fine-tune small model for admin tasks
   - [ ] Test vs current setup

6. **Model Quantization**
   - Current: q8_0 for 7B model
   - Could try: q4_0 for speed (may lose quality)

## Comparison: Local vs Cloud AI

### Local Ollama (What We Use)

**Pros:**
- ✅ $0 cost
- ✅ No API limits
- ✅ Privacy (data stays local)
- ✅ Fast (no network latency)
- ✅ Works offline

**Cons:**
- ❌ RAM limited (3-7B models max)
- ❌ Slower than cloud GPUs
- ❌ Limited to open-source models

### Cloud APIs (Anthropic, OpenAI)

**Pros:**
- ✅ Latest models (Claude 4, GPT-4)
- ✅ Better quality
- ✅ Faster inference
- ✅ No hardware requirements

**Cons:**
- ❌ $$$cost per token
- ❌ API rate limits
- ❌ Data sent to third party
- ❌ Requires internet

### Our Hybrid Approach

✅ **Best of both worlds:**
- Use local for 90% of tasks ($0)
- Offload to self-hosted cloud for complex tasks ($0)
- Fall back to APIs only if both fail ($$ only when needed)

**Result:** ~$0/month vs $50-200/month for pure API usage

## Resources

- **Ollama docs:** https://ollama.ai/
- **Model library:** https://ollama.ai/library
- **Qwen models:** https://huggingface.co/Qwen
- **Performance benchmarks:** https://ollama.ai/blog/performance

## Next Steps

1. [ ] Run admin cycle and collect full token usage data
2. [ ] Evaluate smaller models for simple tasks  
3. [ ] Test specialized models (code, math)
4. [ ] Document prompt optimization strategies
5. [ ] Set up automated model health monitoring
