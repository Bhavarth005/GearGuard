from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.auth.deps import require_role

router = APIRouter(prefix="/requests", tags=["Requests"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_request(payload: dict, db: Session = Depends(get_db)):
    db.execute(
        text("""
        SELECT sp_create_request(
            :request_number, :subject, :description,
            :equipment_id, :request_type_id,
            :requested_by, :scheduled_date
        )
        """),
        payload
    )
    db.commit()
    return {"message": "Request created"}

@router.patch("/{request_id}/status")
def update_request_status(request_id: int, payload: dict, db: Session = Depends(get_db),  user=Depends(require_role("Manager", "Technician"))):
    db.execute(
        text("""
        SELECT sp_update_request_status(
            :id, :status, :changed_by, :duration, :notes
        )
        """),
        {
            "id": request_id,
            "status": payload["status_id"],
            "changed_by": payload["changed_by"],
            "duration": payload.get("duration_hours"),
            "notes": payload.get("notes")
        }
    )
    db.commit()
    return {"message": "Status updated"}

@router.get("/")
@router.get("/{request_id}")
def get_requests(request_id: int | None = None, db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT * FROM sp_get_requests(:id)"),
        {"id": request_id}
    )
    return result.mappings().all()
