from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.auth.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login(payload: dict, db: Session = Depends(get_db)):
    result = db.execute(
        """
        SELECT user_id, full_name, role
        FROM sp_verify_user_login(:email, :password)
        """,
        {
            "email": payload["email"],
            "password": payload["password"]
        }
    ).mappings().first()

    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": str(result["user_id"]),
        "role": result["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": result
    }
