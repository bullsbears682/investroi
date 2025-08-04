import json
import os
from dotenv import load_dotenv
from typing import Optional, Any, Dict
from datetime import datetime, timedelta

load_dotenv()

# In-memory cache for development
_cache = {}
_cache_expiry = {}

class CacheManager:
    def __init__(self):
        self.cache = _cache
        self.expiry = _cache_expiry
    
    def set_calculation(self, session_id: str, calculation_data: Dict[str, Any], expire: int = 3600):
        """Store ROI calculation in cache"""
        key = f"roi_calculation:{session_id}"
        self.cache[key] = calculation_data
        self.expiry[key] = datetime.now() + timedelta(seconds=expire)
    
    def get_calculation(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve ROI calculation from cache"""
        key = f"roi_calculation:{session_id}"
        if key in self.cache and datetime.now() < self.expiry.get(key, datetime.min):
            return self.cache[key]
        return None
    
    def set_user_preferences(self, session_id: str, preferences: Dict[str, Any], expire: int = 86400):
        """Store user preferences in cache"""
        key = f"user_preferences:{session_id}"
        self.cache[key] = preferences
        self.expiry[key] = datetime.now() + timedelta(seconds=expire)
    
    def get_user_preferences(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve user preferences from cache"""
        key = f"user_preferences:{session_id}"
        if key in self.cache and datetime.now() < self.expiry.get(key, datetime.min):
            return self.cache[key]
        return None
    
    def set_market_data(self, scenario_id: int, market_data: Dict[str, Any], expire: int = 86400):
        """Store market data in cache"""
        key = f"market_data:{scenario_id}"
        self.cache[key] = market_data
        self.expiry[key] = datetime.now() + timedelta(seconds=expire)
    
    def get_market_data(self, scenario_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve market data from cache"""
        key = f"market_data:{scenario_id}"
        if key in self.cache and datetime.now() < self.expiry.get(key, datetime.min):
            return self.cache[key]
        return None
    
    def set_tax_data(self, country_code: str, tax_data: Dict[str, Any], expire: int = 86400):
        """Store tax data in cache"""
        key = f"tax_data:{country_code}"
        self.cache[key] = tax_data
        self.expiry[key] = datetime.now() + timedelta(seconds=expire)
    
    def get_tax_data(self, country_code: str) -> Optional[Dict[str, Any]]:
        """Retrieve tax data from cache"""
        key = f"tax_data:{country_code}"
        if key in self.cache and datetime.now() < self.expiry.get(key, datetime.min):
            return self.cache[key]
        return None
    
    def increment_usage_counter(self, session_id: str):
        """Increment usage counter for analytics"""
        key = f"usage_counter:{session_id}"
        if key in self.cache:
            self.cache[key] += 1
        else:
            self.cache[key] = 1
        self.expiry[key] = datetime.now() + timedelta(seconds=86400)
    
    def get_usage_stats(self) -> Dict[str, int]:
        """Get usage statistics"""
        stats = {}
        for key in self.cache:
            if key.startswith("usage_counter:") and datetime.now() < self.expiry.get(key, datetime.min):
                session_id = key.split(":")[1]
                stats[session_id] = self.cache[key]
        return stats
    
    def clear_session_data(self, session_id: str):
        """Clear all session-related data"""
        patterns = [
            f"roi_calculation:{session_id}",
            f"user_preferences:{session_id}",
            f"usage_counter:{session_id}"
        ]
        for pattern in patterns:
            if pattern in self.cache:
                del self.cache[pattern]
            if pattern in self.expiry:
                del self.expiry[pattern]

# Global cache manager instance
cache_manager = CacheManager()