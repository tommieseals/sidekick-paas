#!/usr/bin/env python3
"""Fix providers.py and router.py in llm-router repo."""

import os

FILES = {
    "llm_router/providers.py": '''"""LLM Provider implementations."""

import time
import requests
from typing import Optional, Dict, Any


class BaseProvider:
    """Base class for LLM providers."""
    
    def generate(self, prompt: str, **kwargs) -> Dict[str, Any]:
        raise NotImplementedError


class OllamaProvider(BaseProvider):
    """Ollama local provider."""
    
    def __init__(self, url: str = "http://localhost:11434"):
        self.url = url
        self.timeout = 120
    
    def generate(
        self, 
        prompt: str, 
        model: str = "qwen2.5:3b",
        **kwargs
    ) -> Dict[str, Any]:
        try:
            start = time.time()
            response = requests.post(
                f"{self.url}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"temperature": 0.7, "num_predict": 1500}
                },
                timeout=self.timeout
            )
            elapsed = time.time() - start
            
            if response.status_code != 200:
                return {"error": f"HTTP {response.status_code}"}
            
            data = response.json()
            return {
                "provider": "ollama",
                "model": model,
                "content": data.get("response", ""),
                "elapsed_ms": int(elapsed * 1000),
                "cost": 0
            }
        except requests.exceptions.Timeout:
            return {"error": "Timeout"}
        except requests.exceptions.ConnectionError:
            return {"error": "Connection refused"}
        except Exception as e:
            return {"error": str(e)}
    
    def health_check(self) -> Dict[str, Any]:
        try:
            response = requests.get(f"{self.url}/api/tags", timeout=5)
            if response.status_code == 200:
                models = [m["name"] for m in response.json().get("models", [])]
                return {"healthy": True, "models": models}
            return {"healthy": False, "error": f"HTTP {response.status_code}"}
        except Exception as e:
            return {"healthy": False, "error": str(e)}


class NvidiaProvider(BaseProvider):
    """NVIDIA NIM API provider (Kimi, Llama, etc)."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://integrate.api.nvidia.com/v1"
        self.default_model = "moonshotai/kimi-k2.5"
    
    def generate(
        self, 
        prompt: str, 
        model: Optional[str] = None,
        image_url: Optional[str] = None,
        thinking: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        if not self.api_key:
            return {"error": "API key not configured"}
        
        model = model or self.default_model
        
        if image_url:
            content = [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": image_url}}
            ]
            messages = [{"role": "user", "content": content}]
        else:
            messages = [{"role": "user", "content": prompt}]
        
        try:
            start = time.time()
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": messages,
                    "max_tokens": 1400,
                    "chat_template_kwargs": {"thinking": thinking}
                },
                timeout=180
            )
            elapsed = time.time() - start
            
            if response.status_code != 200:
                return {"error": f"HTTP {response.status_code}"}
            
            data = response.json()
            return {
                "provider": "nvidia",
                "model": model,
                "content": data["choices"][0]["message"]["content"],
                "tokens": data.get("usage", {}).get("total_tokens", 0),
                "elapsed_ms": int(elapsed * 1000),
                "cost": 0
            }
        except Exception as e:
            return {"error": str(e)}


class OpenRouterProvider(BaseProvider):
    """OpenRouter API provider."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://openrouter.ai/api/v1"
    
    def generate(
        self, 
        prompt: str, 
        model: str = "openrouter/auto",
        **kwargs
    ) -> Dict[str, Any]:
        if not self.api_key:
            return {"error": "API key not configured"}
        
        try:
            start = time.time()
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 1400
                },
                timeout=60
            )
            elapsed = time.time() - start
            
            if response.status_code != 200:
                return {"error": f"HTTP {response.status_code}"}
            
            data = response.json()
            tokens = data.get("usage", {}).get("total_tokens", 0)
            return {
                "provider": "openrouter",
                "model": model,
                "content": data["choices"][0]["message"]["content"],
                "tokens": tokens,
                "elapsed_ms": int(elapsed * 1000),
                "cost": tokens * 0.000002
            }
        except Exception as e:
            return {"error": str(e)}


class PerplexityProvider(BaseProvider):
    """Perplexity AI provider for web-search powered answers."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.perplexity.ai"
    
    def generate(
        self, 
        prompt: str, 
        model: str = "sonar",
        **kwargs
    ) -> Dict[str, Any]:
        if not self.api_key:
            return {"error": "API key not configured"}
        
        try:
            start = time.time()
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 1400
                },
                timeout=60
            )
            elapsed = time.time() - start
            
            if response.status_code != 200:
                return {"error": f"HTTP {response.status_code}"}
            
            data = response.json()
            return {
                "provider": "perplexity",
                "model": model,
                "content": data["choices"][0]["message"]["content"],
                "citations": data.get("citations", [])[:5],
                "tokens": data.get("usage", {}).get("total_tokens", 0),
                "elapsed_ms": int(elapsed * 1000),
                "cost": 0.005
            }
        except Exception as e:
            return {"error": str(e)}
''',

    "llm_router/router.py": '''"""Core routing logic for LLM requests."""

import os
from typing import Optional, Dict, Any, Tuple
from .providers import OllamaProvider, NvidiaProvider, OpenRouterProvider, PerplexityProvider
from .health import HealthChecker
from .usage import UsageTracker

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
        
        if force_provider and force_provider in self.providers:
            return self._call_provider(force_provider, prompt, image_url=image_url)
        
        if image_url:
            result = self._call_provider("nvidia", prompt, image_url=image_url)
            if not result.get("error"):
                return result
        
        if task in ["research", "web", "search"]:
            result = self._call_provider("perplexity", prompt)
            if not result.get("error"):
                return result
        
        provider_id, model = TASK_ROUTING.get(task, ("ollama", "qwen2.5:3b"))
        
        if self.health.is_healthy(provider_id):
            result = self._call_provider(provider_id, prompt, model=model)
            if not result.get("error"):
                return result
        
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
'''
}

def main():
    base_dir = os.path.expanduser("~/llm-router")
    
    for filepath, content in FILES.items():
        full_path = os.path.join(base_dir, filepath)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        with open(full_path, "w") as f:
            f.write(content)
        print(f"Fixed: {filepath}")
    
    print("Done!")

if __name__ == "__main__":
    main()
