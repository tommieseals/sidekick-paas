"""Core routing logic for LLM requests."""

import os
from typing import Optional, Dict, Any, Tuple
from .providers import OllamaProvider, NvidiaProvider, OpenRouterProvider, PerplexityProvider
from .health import HealthChecker
from .usage import UsageTracker

# Task to provider/model mapping
TASK_ROUTING = {
    "code": ("ollama", "deepseek-coder:6.7b"),
    "debug": ("ollama", "deepseek-coder:6.7b"),
    "script": ("ollama", "deepseek-coder:6.7b"),
    "fast": ("ollama", "phi3:mini"),
    "quick": ("ollama", "phi3:mini"),
    "simple": ("ollama", "phi3:mini"),
    "reasoning": ("ollama", "qwen2.5:7b"),
    "analysis": ("ollama", "qwen2.5:7b"),
    "routine": ("ollama", "qwen2.5:3b"),
    "research": ("perplexity", "sonar"),
    "web": ("perplexity", "sonar"),
    "search": ("perplexity", "sonar"),
}


class Router:
    """Intelligent LLM router with automatic failover."""
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.health = HealthChecker()
        self.usage = UsageTracker()
        
        # Initialize providers
        self.providers = {
            "ollama": OllamaProvider(
                url=os.getenv("OLLAMA_PRIMARY_URL", "http://localhost:11434")
            ),
            "nvidia": NvidiaProvider(
                api_key=os.getenv("NVIDIA_API_KEY", "")
            ),
            "openrouter": OpenRouterProvider(
                api_key=os.getenv("OPENROUTER_API_KEY", "")
            ),
            "perplexity": PerplexityProvider(
                api_key=os.getenv("PERPLEXITY_API_KEY", "")
            ),
        }
        
        # Fallback Ollama nodes
        fallback_url = os.getenv("OLLAMA_FALLBACK_URL")
        if fallback_url:
            self.providers["ollama_fallback"] = OllamaProvider(url=fallback_url)
    
    def query(
        self,
        prompt: str,
        task: str = "routine",
        image_url: Optional[str] = None,
        force_provider: Optional[str] = None,
        cost_sensitive: bool = True
    ) -> Dict[str, Any]:
        """Route and execute a query."""
        
        # Force specific provider
        if force_provider and force_provider in self.providers:
            return self._call_provider(force_provider, prompt, image_url=image_url)
        
        # Multimodal -> NVIDIA/Kimi
        if image_url:
            result = self._call_provider("nvidia", prompt, image_url=image_url)
            if not result.get("error"):
                return result
        
        # Research tasks -> Perplexity
        if task in ["research", "web", "search"]:
            result = self._call_provider("perplexity", prompt)
            if not result.get("error"):
                return result
        
        # Get task routing
        provider_id, model = TASK_ROUTING.get(task, ("ollama", "qwen2.5:3b"))
        
        # Check health and try primary
        if self.health.is_healthy(provider_id):
            result = self._call_provider(provider_id, prompt, model=model)
            if not result.get("error"):
                return result
        
        # Fallback chain
        for fallback in ["ollama_fallback", "openrouter"]:
            if fallback in self.providers and self.health.is_healthy(fallback):
                result = self._call_provider(fallback, prompt)
                if not result.get("error"):
                    return result
        
        return {"error": "All providers failed", "content": ""}
    
    def _call_provider(
        self, 
        provider_id: str, 
        prompt: str, 
        model: Optional[str] = None,
        image_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """Call a specific provider."""
        provider = self.providers.get(provider_id)
        if not provider:
            return {"error": f"Unknown provider: {provider_id}"}
        
        result = provider.generate(prompt, model=model, image_url=image_url)
        
        if not result.get("error"):
            self.usage.record(provider_id, result.get("tokens", 0), result.get("cost", 0))
        
        return result
    
    def check_health(self) -> Dict[str, Any]:
        """Check health of all providers."""
        return {pid: self.health.check(pid, p) for pid, p in self.providers.items()}
    
    def get_usage(self) -> Dict[str, Any]:
        """Get usage statistics."""
        return self.usage.get_stats()
