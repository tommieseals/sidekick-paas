#!/usr/bin/env python3
"""Fix corrupted Python files in asset-tracker repo."""

import os

FILES = {
    "backend/app/config.py": '''"""Configuration settings"""
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./assets.db")
    
    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # AI Search (OpenAI compatible)
    AI_API_URL: str = os.getenv("AI_API_URL", "http://localhost:11434/v1")
    AI_MODEL: str = os.getenv("AI_MODEL", "qwen2.5:3b")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "ollama")
    
    class Config:
        env_file = ".env"

settings = Settings()
''',

    "backend/app/auth.py": '''"""Authentication utilities"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .config import settings
from .database import get_db
from .models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if user_id is None or token_type != "access":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        raise credentials_exception
    return user


async def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user
''',

    "backend/app/main.py": '''"""Main FastAPI application"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .database import engine, Base
from .routers import users, assets, audit

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created")
    yield


app = FastAPI(
    title="Asset Tracker API",
    description="Internal asset inventory tracker with AI-powered search",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(assets.router, prefix="/api/assets", tags=["assets"])
app.include_router(audit.router, prefix="/api/audit", tags=["audit"])


@app.get("/")
async def root():
    return {"message": "Asset Tracker API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
''',

    "backend/app/schemas.py": '''"""Pydantic schemas for request/response validation"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from enum import Enum


class AssetStatus(str, Enum):
    AVAILABLE = "available"
    IN_USE = "in_use"
    MAINTENANCE = "maintenance"
    RETIRED = "retired"


class AssetCategory(str, Enum):
    HARDWARE = "hardware"
    SOFTWARE = "software"
    LICENSE = "license"
    PERIPHERAL = "peripheral"


class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"


# User schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    department: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.USER


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Asset schemas
class AssetBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: AssetCategory
    serial_number: Optional[str] = None
    purchase_date: Optional[datetime] = None
    purchase_price: Optional[float] = None
    location: Optional[str] = None
    notes: Optional[str] = None


class AssetCreate(AssetBase):
    status: AssetStatus = AssetStatus.AVAILABLE
    assigned_to_id: Optional[int] = None


class AssetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[AssetCategory] = None
    status: Optional[AssetStatus] = None
    serial_number: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    assigned_to_id: Optional[int] = None


class AssetResponse(AssetBase):
    id: int
    status: AssetStatus
    assigned_to_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Search schemas
class SearchQuery(BaseModel):
    query: str
    use_ai: bool = True
    category: Optional[AssetCategory] = None
    status: Optional[AssetStatus] = None


class SearchResult(BaseModel):
    assets: List[AssetResponse]
    total: int
    ai_summary: Optional[str] = None


# Audit schemas
class AuditAction(str, Enum):
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    ASSIGN = "assign"
    UNASSIGN = "unassign"


class AuditLogResponse(BaseModel):
    id: int
    action: AuditAction
    entity_type: str
    entity_id: int
    user_id: int
    changes: Optional[dict] = None
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)


# Token schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


# Dashboard schemas
class DashboardStats(BaseModel):
    total_assets: int
    by_status: dict
    by_category: dict
    recent_activity: List[AuditLogResponse]


# Export schemas
class ExportRequest(BaseModel):
    format: str = Field(default="csv", pattern="^(csv|xlsx)$")
    category: Optional[AssetCategory] = None
    status: Optional[AssetStatus] = None
''',

    "backend/app/routers/users.py": '''"""User management routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserUpdate, UserResponse, Token, TokenRefresh
from ..auth import (
    get_password_hash, verify_password, create_access_token,
    create_refresh_token, get_current_user, get_current_admin
)

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        department=user_data.department,
        hashed_password=get_password_hash(user_data.password),
        role=user_data.role.value
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return Token(
        access_token=create_access_token({"sub": str(user.id)}),
        refresh_token=create_refresh_token({"sub": str(user.id)})
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=List[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    result = await db.execute(select(User))
    return result.scalars().all()
''',

    "backend/app/routers/assets.py": '''"""Asset management routes"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import List, Optional
import httpx

from ..database import get_db
from ..models import Asset, User, AuditLog
from ..schemas import (
    AssetCreate, AssetUpdate, AssetResponse, AssetStatus, AssetCategory,
    SearchQuery, SearchResult, DashboardStats, AuditLogResponse
)
from ..auth import get_current_user
from ..config import settings

router = APIRouter()


async def log_action(db: AsyncSession, action: str, entity_type: str, entity_id: int, user_id: int, changes: dict = None):
    log = AuditLog(
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        user_id=user_id,
        changes=changes
    )
    db.add(log)


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total = await db.scalar(select(func.count(Asset.id)))
    
    by_status = {}
    for status in AssetStatus:
        count = await db.scalar(select(func.count(Asset.id)).where(Asset.status == status.value))
        by_status[status.value] = count
    
    by_category = {}
    for category in AssetCategory:
        count = await db.scalar(select(func.count(Asset.id)).where(Asset.category == category.value))
        by_category[category.value] = count
    
    result = await db.execute(
        select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(10)
    )
    recent = result.scalars().all()
    
    return DashboardStats(
        total_assets=total or 0,
        by_status=by_status,
        by_category=by_category,
        recent_activity=[AuditLogResponse.model_validate(r) for r in recent]
    )


@router.post("/", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
async def create_asset(
    asset_data: AssetCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    asset = Asset(**asset_data.model_dump())
    db.add(asset)
    await db.commit()
    await db.refresh(asset)
    
    await log_action(db, "create", "asset", asset.id, current_user.id)
    await db.commit()
    
    return asset


@router.get("/", response_model=List[AssetResponse])
async def list_assets(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    category: Optional[AssetCategory] = None,
    status: Optional[AssetStatus] = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
):
    query = select(Asset)
    if category:
        query = query.where(Asset.category == category.value)
    if status:
        query = query.where(Asset.status == status.value)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(
    asset_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
):
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.put("/{asset_id}", response_model=AssetResponse)
async def update_asset(
    asset_id: int,
    asset_data: AssetUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    changes = {}
    for field, value in asset_data.model_dump(exclude_unset=True).items():
        if getattr(asset, field) != value:
            changes[field] = {"old": getattr(asset, field), "new": value}
            setattr(asset, field, value)
    
    if changes:
        await log_action(db, "update", "asset", asset.id, current_user.id, changes)
    
    await db.commit()
    await db.refresh(asset)
    return asset


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(
    asset_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    await log_action(db, "delete", "asset", asset.id, current_user.id)
    await db.delete(asset)
    await db.commit()


@router.post("/search", response_model=SearchResult)
async def search_assets(
    search: SearchQuery,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
):
    query = select(Asset)
    
    if search.category:
        query = query.where(Asset.category == search.category.value)
    if search.status:
        query = query.where(Asset.status == search.status.value)
    
    query = query.where(
        or_(
            Asset.name.ilike(f"%{search.query}%"),
            Asset.description.ilike(f"%{search.query}%"),
            Asset.serial_number.ilike(f"%{search.query}%"),
            Asset.location.ilike(f"%{search.query}%")
        )
    )
    
    result = await db.execute(query)
    assets = result.scalars().all()
    
    ai_summary = None
    if search.use_ai and assets:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.AI_API_URL}/chat/completions",
                    json={
                        "model": settings.AI_MODEL,
                        "messages": [
                            {"role": "system", "content": "Summarize these search results briefly."},
                            {"role": "user", "content": f"Query: {search.query}\\nResults: {[a.name for a in assets[:10]]}"}
                        ],
                        "max_tokens": 100
                    },
                    headers={"Authorization": f"Bearer {settings.AI_API_KEY}"},
                    timeout=10
                )
                if response.status_code == 200:
                    ai_summary = response.json()["choices"][0]["message"]["content"]
        except Exception:
            pass
    
    return SearchResult(
        assets=[AssetResponse.model_validate(a) for a in assets],
        total=len(assets),
        ai_summary=ai_summary
    )
''',

    "backend/app/routers/audit.py": '''"""Audit log routes"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models import AuditLog, User
from ..schemas import AuditLogResponse, AuditAction
from ..auth import get_current_user, get_current_admin

router = APIRouter()


@router.get("/", response_model=List[AuditLogResponse])
async def list_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    action: Optional[AuditAction] = None,
    entity_type: Optional[str] = None,
    user_id: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    query = select(AuditLog)
    
    if action:
        query = query.where(AuditLog.action == action.value)
    if entity_type:
        query = query.where(AuditLog.entity_type == entity_type)
    if user_id:
        query = query.where(AuditLog.user_id == user_id)
    if start_date:
        query = query.where(AuditLog.timestamp >= start_date)
    if end_date:
        query = query.where(AuditLog.timestamp <= end_date)
    
    query = query.order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{log_id}", response_model=AuditLogResponse)
async def get_audit_log(
    log_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    result = await db.execute(select(AuditLog).where(AuditLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Audit log not found")
    return log
''',

    "backend/app/routers/__init__.py": '''"""Routers package"""
from . import users, assets, audit
'''
}

def main():
    base_dir = os.path.expanduser("~/asset-tracker")
    
    for filepath, content in FILES.items():
        full_path = os.path.join(base_dir, filepath)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        with open(full_path, "w") as f:
            f.write(content)
        print(f"Fixed: {filepath}")
    
    print("Done!")

if __name__ == "__main__":
    main()
