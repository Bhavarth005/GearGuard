from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal

router = APIRouter(prefix="/equipment", tags=["Equipment"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_equipment(payload: dict, db: Session = Depends(get_db)):
    db.execute(
        """
        SELECT sp_create_equipment(
            :equipment_name, :serial_number, :category_id,
            :department_id, :assigned_user_id,
            :maintenance_team_id, :default_technician_id,
            :purchase_date, :warranty_end_date, :location
        )
        """,
        payload
    )
    db.commit()
    return {"message": "Equipment created"}

@router.get("/")
@router.get("/{equipment_id}")
def get_equipment(equipment_id: int | None = None, db: Session = Depends(get_db)):
    result = db.execute(
        "SELECT * FROM sp_get_equipment(:id)",
        {"id": equipment_id}
    )
    return result.mappings().all()
