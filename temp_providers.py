"""LLM Provider implementations."""

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
