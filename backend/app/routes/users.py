from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.session import SessionLocal

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_user(payload: dict, db: Session = Depends(get_db)):
    db.execute(
        text("""
        SELECT sp_create_user(
            :name, :email, :phone, :password,
            :role, :dept, :avatar
        )
        """),
        payload
    )
    db.commit()
    return {"message": "User created"}

@router.get("/")
@router.get("/{user_id}")
def get_users(user_id: int | None = None, db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT * FROM sp_get_users(:id)"),
        {"id": user_id}
    )
    return result.mappings().all()
