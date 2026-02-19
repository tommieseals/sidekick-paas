"""Usage tracking for LLM providers."""

import json
import time
from pathlib import Path
from typing import Dict, Any

class UsageTracker:
    """Tracks usage statistics for providers."""
    
    def __init__(self, storage_path: str = None):
        self.storage_path = Path(storage_path or Path.home() / ".llm-router" / "usage.json")
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        self.stats: Dict[str, Dict] = self._load()
    
    def _load(self) -> Dict:
        """Load stats from disk."""
        if self.storage_path.exists():
            try:
                return json.loads(self.storage_path.read_text())
            except Exception:
                return {}
        return {}
    
    def _save(self):
        """Save stats to disk."""
        self.storage_path.write_text(json.dumps(self.stats, indent=2))
    
    def record(self, provider_id: str, tokens: int = 0, cost: float = 0):
        """Record usage for a provider."""
        today = time.strftime("%Y-%m-%d")
        
        if provider_id not in self.stats:
            self.stats[provider_id] = {}
        if today not in self.stats[provider_id]:
            self.stats[provider_id][today] = {"calls": 0, "tokens": 0, "cost": 0}
        
        self.stats[provider_id][today]["calls"] += 1
        self.stats[provider_id][today]["tokens"] += tokens
        self.stats[provider_id][today]["cost"] += cost
        
        self._save()
    
    def get_stats(self, provider_id: str = None) -> Dict[str, Any]:
        """Get usage statistics."""
        if provider_id:
            return self.stats.get(provider_id, {})
        return self.stats
    
    def get_today(self, provider_id: str) -> Dict[str, Any]:
        """Get today's usage for a provider."""
        today = time.strftime("%Y-%m-%d")
        return self.stats.get(provider_id, {}).get(today, {"calls": 0, "tokens": 0, "cost": 0})
