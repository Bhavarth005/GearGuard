from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from .db.session import get_db, engine
from .models.maintenance import Base

# Ensure tables are created on startup (for v0)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="GearGuard API")

@app.get("/db-verify")
def verify_db_connection(db: Session = Depends(get_db)):
    try:
        # Attempt to perform a simple raw SQL query
        db.execute(text("SELECT 1"))
        return {
            "status": "success",
            "message": "Database connection verified!",
            "database": engine.url.database
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Database connection failed: {str(e)}"
        )