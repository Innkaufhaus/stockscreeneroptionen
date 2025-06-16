from fastapi import APIRouter
from app.api.v1.endpoints import auth, markets

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(markets.router, prefix="/markets", tags=["markets"]) 