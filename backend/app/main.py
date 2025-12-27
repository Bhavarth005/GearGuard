import os

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from .db.session import get_db, engine
from .models.maintenance import Base
from app.routes import departments, users, equipment, teams, requests
from app.routes import auth

# Ensure tables are created on startup (for v0)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="GearGuard Backend")

# Configure CORS
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS")
if allowed_origins:
    default_origins = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=default_origins,  # customize via CORS_ALLOWED_ORIGINS env var
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(departments.router)
app.include_router(users.router)
app.include_router(equipment.router)
app.include_router(teams.router)
app.include_router(requests.router)
app.include_router(auth.router)
