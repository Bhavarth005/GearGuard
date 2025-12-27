from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.session import SessionLocal

router = APIRouter(prefix="/teams", tags=["Teams"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_team(payload: dict, db: Session = Depends(get_db)):
    db.execute(
        text("SELECT sp_create_team(:team_name, :description)"), payload
    )
    db.commit()
    return {"message": "Team created"}

@router.get("/")
@router.get("/{team_id}")
def get_teams(team_id: int | None = None, db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT * FROM sp_get_teams(:id)"),
        {"id": team_id}
    )
    return result.mappings().all()
