from fastapi import APIRouter, Depends, HTTPException
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
def update_request_status(
    request_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    user=Depends(require_role("Manager", "Technician")),
):
    request_row = db.execute(
        text(
            """
            SELECT request_id, status_id, equipment_id
            FROM maintenance_requests
            WHERE request_id = :id
            """
        ),
        {"id": request_id},
    ).first()

    if not request_row:
        raise HTTPException(status_code=404, detail="Maintenance request not found")

    new_status = payload["status_id"]
    duration = payload.get("duration_hours")

    if new_status == 4:
        db.execute(
            text("UPDATE equipment SET is_scrapped = TRUE WHERE equipment_id = :equipment_id"),
            {"equipment_id": request_row.equipment_id},
        )

    if new_status == 3:
        db.execute(
            text(
                """
                UPDATE maintenance_requests
                SET status_id = :status_id,
                    completed_at = CURRENT_TIMESTAMP,
                    duration_hours = :duration
                WHERE request_id = :id
                """
            ),
            {"status_id": new_status, "duration": duration, "id": request_id},
        )
    else:
        db.execute(
            text(
                """
                UPDATE maintenance_requests
                SET status_id = :status_id
                WHERE request_id = :id
                """
            ),
            {"status_id": new_status, "id": request_id},
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
