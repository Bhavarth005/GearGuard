from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from .db.session import get_db, engine
from .models.maintenance import Base
from app.routes import departments, users, equipment, teams, requests

# Ensure tables are created on startup (for v0)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="GearGuard API")

app = FastAPI(title="GearGuard Backend")

app.include_router(departments.router)
app.include_router(users.router)
app.include_router(equipment.router)
app.include_router(teams.router)
app.include_router(requests.router)
