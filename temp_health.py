"""Health checking for LLM providers."""

import time
from typing import Dict, Any

class HealthChecker:
    """Tracks health status of providers."""
    
    def __init__(self):
        self.status: Dict[str, Dict] = {}
        self.last_check: Dict[str, float] = {}
    
    def is_healthy(self, provider_id: str) -> bool:
        """Check if a provider is healthy."""
        status = self.status.get(provider_id, {})
        return status.get("healthy", True)
    
    def check(self, provider_id: str, provider) -> Dict[str, Any]:
        """Run health check on a provider."""
        if hasattr(provider, "health_check"):
            result = provider.health_check()
        else:
            result = {"healthy": True, "note": "No health check available"}
        
        self.status[provider_id] = result
        self.last_check[provider_id] = time.time()
        return result
    
    def mark_unhealthy(self, provider_id: str, reason: str):
        """Mark a provider as unhealthy."""
        self.status[provider_id] = {"healthy": False, "reason": reason}
    
    def get_all_status(self) -> Dict[str, Dict]:
        """Get status of all providers."""
        return self.status
