from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.simple_auth import register_user, login_user

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Pydantic models for request validation
class UserRegister(BaseModel):
    email: str
    username: str
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        # Basic email validation
        if "@" not in user_data.email or "." not in user_data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please enter a valid email address"
            )
        
        # Basic validation
        if len(user_data.username) < 3:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username must be at least 3 characters long"
            )
        
        if len(user_data.password) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 6 characters long"
            )
        
        if len(user_data.full_name) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Full name must be at least 2 characters long"
            )
        
        result = register_user(
            db, 
            user_data.email, 
            user_data.username, 
            user_data.full_name, 
            user_data.password
        )
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login")
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    try:
        result = login_user(db, user_credentials.email, user_credentials.password)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/test")
async def test_auth():
    """Test endpoint to verify auth routes are working"""
    return {
        "message": "Simple auth system is working!",
        "endpoints": [
            "POST /api/auth/register",
            "POST /api/auth/login",
            "GET /api/auth/test"
        ]
    }