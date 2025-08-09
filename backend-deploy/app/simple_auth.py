import hashlib
import secrets
import time
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.database import User, get_db

def hash_password(password: str) -> str:
    """Simple password hashing using hashlib"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}:{pwd_hash.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    try:
        salt, pwd_hash = hashed.split(':')
        return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex() == pwd_hash
    except:
        return False

def create_simple_token(user_email: str) -> str:
    """Create a simple token for session management"""
    timestamp = str(int(time.time()))
    token_data = f"{user_email}:{timestamp}:{secrets.token_hex(16)}"
    return hashlib.sha256(token_data.encode()).hexdigest()

def verify_simple_token(token: str, user_email: str) -> bool:
    """Basic token verification - in production you'd want something more sophisticated"""
    # For now, just check if token exists and is not empty
    return bool(token and len(token) == 64)

def register_user(db: Session, email: str, username: str, full_name: str, password: str) -> dict:
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == email) | (User.username == username)
    ).first()
    
    if existing_user:
        if existing_user.email == email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Create new user
    hashed_password = hash_password(password)
    db_user = User(
        email=email,
        username=username,
        full_name=full_name,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create simple token
    token = create_simple_token(db_user.email)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "username": db_user.username,
            "full_name": db_user.full_name,
            "is_active": db_user.is_active,
            "is_verified": db_user.is_verified
        }
    }

def login_user(db: Session, email: str, password: str) -> dict:
    """Login user"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create simple token
    token = create_simple_token(user.email)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "is_verified": user.is_verified
        }
    }