from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from polygon import RESTClient
from datetime import datetime, timedelta

from app.api.deps import get_current_active_user
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.models.market import Market, MarketType
from app.schemas.market import (
    Market as MarketSchema,
    MarketCreate,
    ScreeningCriteria,
    ScreeningResult,
    SavedScreen,
    SavedScreenCreate,
)

router = APIRouter()
polygon_client = RESTClient(settings.POLYGON_API_KEY)

@router.get("/markets", response_model=List[MarketSchema])
async def get_markets(
    *,
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    market_type: Optional[MarketType] = None,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve markets.
    """
    query = db.query(Market)
    if market_type:
        query = query.filter(Market.type == market_type)
    markets = await query.offset(skip).limit(limit).all()
    return markets

@router.post("/markets/screen", response_model=List[ScreeningResult])
async def screen_markets(
    *,
    db: AsyncSession = Depends(get_db),
    criteria: ScreeningCriteria,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Screen markets based on provided criteria.
    """
    # Get markets to screen based on criteria
    markets = await db.query(Market).filter(Market.is_active == True).all()
    results = []

    for market in markets:
        # Get market data from Polygon.io
        try:
            # Get daily aggregates for the last 200 days
            end_date = datetime.now()
            start_date = end_date - timedelta(days=200)
            
            aggs = polygon_client.list_aggs(
                ticker=market.symbol,
                multiplier=1,
                timespan="day",
                from_=start_date.strftime("%Y-%m-%d"),
                to=end_date.strftime("%Y-%m-%d"),
                limit=200
            )

            # Convert to list for easier processing
            aggs_list = list(aggs)
            
            if not aggs_list:
                continue

            # Apply screening criteria
            if criteria.type == "minervini":
                # Implement Minervini screening logic
                result = apply_minervini_screen(aggs_list)
            elif criteria.type == "adx_golden_cross":
                # Implement ADX Golden Cross screening logic
                result = apply_adx_golden_cross(aggs_list)
            else:
                continue

            if result["passes"]:
                screening_result = ScreeningResult(
                    market_id=market.id,
                    user_id=current_user.id,
                    screening_type=criteria.type,
                    result_data=result
                )
                db.add(screening_result)
                results.append(screening_result)

        except Exception as e:
            print(f"Error processing {market.symbol}: {str(e)}")
            continue

    await db.commit()
    return results

@router.post("/screens", response_model=SavedScreen)
async def create_saved_screen(
    *,
    db: AsyncSession = Depends(get_db),
    screen_in: SavedScreenCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new saved screen.
    """
    screen = SavedScreen(
        **screen_in.dict(),
        user_id=current_user.id
    )
    db.add(screen)
    await db.commit()
    await db.refresh(screen)
    return screen

@router.get("/screens", response_model=List[SavedScreen])
async def get_saved_screens(
    *,
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve saved screens.
    """
    screens = await db.query(SavedScreen).filter(
        (SavedScreen.user_id == current_user.id) | (SavedScreen.is_public == True)
    ).offset(skip).limit(limit).all()
    return screens

def apply_minervini_screen(aggs_list: List[Any]) -> dict:
    """
    Apply Minervini screening criteria to market data.
    """
    # Implement Minervini screening logic here
    # This is a placeholder implementation
    return {
        "passes": True,
        "criteria_met": ["trend", "volume"],
        "details": {
            "trend": "uptrend",
            "volume": "increasing"
        }
    }

def apply_adx_golden_cross(aggs_list: List[Any]) -> dict:
    """
    Apply ADX Golden Cross screening criteria to market data.
    """
    # Implement ADX Golden Cross screening logic here
    # This is a placeholder implementation
    return {
        "passes": True,
        "criteria_met": ["adx", "golden_cross"],
        "details": {
            "adx": "strong_trend",
            "golden_cross": "confirmed"
        }
    } 