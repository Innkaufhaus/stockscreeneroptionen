from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from app.models.market import MarketType

class MarketBase(BaseModel):
    symbol: str
    name: str
    type: MarketType
    exchange: Optional[str] = None
    currency: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class MarketCreate(MarketBase):
    pass

class MarketUpdate(MarketBase):
    is_active: Optional[bool] = None

class MarketInDBBase(MarketBase):
    id: int
    is_active: bool
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True

class Market(MarketInDBBase):
    pass

class ScreeningCriteria(BaseModel):
    type: str
    parameters: Dict[str, Any]

class ScreeningResultBase(BaseModel):
    market_id: int
    screening_type: str
    result_data: Dict[str, Any]

class ScreeningResultCreate(ScreeningResultBase):
    pass

class ScreeningResult(ScreeningResultBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SavedScreenBase(BaseModel):
    name: str
    description: Optional[str] = None
    screening_criteria: ScreeningCriteria
    is_public: bool = False

class SavedScreenCreate(SavedScreenBase):
    pass

class SavedScreenUpdate(SavedScreenBase):
    pass

class SavedScreen(SavedScreenBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 