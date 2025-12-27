from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.auth.deps import require_role

router = APIRouter(prefix="/departments", tags=["Departments"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_department(payload: dict, db: Session = Depends(get_db), user=Depends(require_role("Admin"))):
    db.execute(
        "SELECT sp_create_department(:name, :desc)",
        {
            "name": payload["department_name"],
            "desc": payload.get("description")
        }
    )
    db.commit()
    return {"message": "Department created"}

@router.put("/{department_id}")
def update_department(department_id: int, payload: dict, db: Session = Depends(get_db)):
    db.execute(
        "SELECT sp_update_department(:id, :name, :desc, :active)",
        {
            "id": department_id,
            "name": payload["department_name"],
            "desc": payload.get("description"),
            "active": payload["is_active"]
        }
    )
    db.commit()
    return {"message": "Department updated"}

@router.get("/")
@router.get("/{department_id}")
def get_departments(department_id: int | None = None, db: Session = Depends(get_db)):
    result = db.execute(
        "SELECT * FROM sp_get_departments(:id)",
        {"id": department_id}
    )
    return result.mappings().all()
