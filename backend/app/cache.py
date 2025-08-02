import redis
import json
import os
from dotenv import load_dotenv
from typing import Optional, Any, Dict

load_dotenv()

# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

class CacheManager:
    def __init__(self):
        self.redis = redis_client
    
    def set_calculation(self, session_id: str, calculation_data: Dict[str, Any], expire: int = 3600):
        """Store ROI calculation in cache"""
        key = f"roi_calculation:{session_id}"
        self.redis.setex(key, expire, json.dumps(calculation_data))
    
    def get_calculation(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve ROI calculation from cache"""
        key = f"roi_calculation:{session_id}"
        data = self.redis.get(key)
        return json.loads(data) if data else None
    
    def set_user_preferences(self, session_id: str, preferences: Dict[str, Any], expire: int = 86400):
        """Store user preferences in cache"""
        key = f"user_preferences:{session_id}"
        self.redis.setex(key, expire, json.dumps(preferences))
    
    def get_user_preferences(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve user preferences from cache"""
        key = f"user_preferences:{session_id}"
        data = self.redis.get(key)
        return json.loads(data) if data else None
    
    def set_market_data(self, scenario_id: int, market_data: Dict[str, Any], expire: int = 86400):
        """Store market data in cache"""
        key = f"market_data:{scenario_id}"
        self.redis.setex(key, expire, json.dumps(market_data))
    
    def get_market_data(self, scenario_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve market data from cache"""
        key = f"market_data:{scenario_id}"
        data = self.redis.get(key)
        return json.loads(data) if data else None
    
    def set_tax_data(self, country_code: str, tax_data: Dict[str, Any], expire: int = 86400):
        """Store tax data in cache"""
        key = f"tax_data:{country_code}"
        self.redis.setex(key, expire, json.dumps(tax_data))
    
    def get_tax_data(self, country_code: str) -> Optional[Dict[str, Any]]:
        """Retrieve tax data from cache"""
        key = f"tax_data:{country_code}"
        data = self.redis.get(key)
        return json.loads(data) if data else None
    
    def increment_usage_counter(self, session_id: str):
        """Increment usage counter for analytics"""
        key = f"usage_counter:{session_id}"
        self.redis.incr(key)
        self.redis.expire(key, 86400)  # Expire after 24 hours
    
    def get_usage_stats(self) -> Dict[str, int]:
        """Get usage statistics"""
        keys = self.redis.keys("usage_counter:*")
        stats = {}
        for key in keys:
            session_id = key.split(":")[1]
            count = self.redis.get(key)
            stats[session_id] = int(count) if count else 0
        return stats
    
    def clear_session_data(self, session_id: str):
        """Clear all session-related data"""
        patterns = [
            f"roi_calculation:{session_id}",
            f"user_preferences:{session_id}",
            f"usage_counter:{session_id}"
        ]
        for pattern in patterns:
            self.redis.delete(pattern)

# Global cache manager instance
cache_manager = CacheManager()