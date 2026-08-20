from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from app.models.complaint import Complaint
from app.models.donation import Donation
from app.models.volunteer import VolunteerRequest
from app.utils.jwt import decode_access_token
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import func

router = APIRouter(prefix="/analytics", tags=["Analytics"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- COMPLAINT ANALYTICS ----------------
@router.get("/complaints")
def complaint_analytics(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    total = db.query(Complaint).count()
    resolved = db.query(Complaint).filter(Complaint.status == "Resolved").count()
    pending = db.query(Complaint).filter(Complaint.status == "Pending").count()
    in_progress = db.query(Complaint).filter(Complaint.status == "In Progress").count()

    resolution_rate = (resolved / total * 100) if total else 0

    # Category distribution
    category_data = db.query(
        Complaint.category,
        func.count()
    ).group_by(Complaint.category).all()

    # Time trend (FIXED)
    trend_raw = db.query(
        func.date(Complaint.created_at),
        func.count()
    ).group_by(func.date(Complaint.created_at)).all()

    trend = [
        {"date": str(t[0]), "count": t[1]}
        for t in trend_raw
    ]

    return {
        "kpis": {
            "total": total,
            "resolved": resolved,
            "pending": pending,
            "resolution_rate": round(resolution_rate, 2)
        },
        "status": {
            "Resolved": resolved,
            "Pending": pending,
            "In Progress": in_progress
        },
        "category": dict(category_data),
        "trend": trend
    }


# ---------------- DONATION ANALYTICS ----------------
@router.get("/donations")
def donation_analytics(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    donations = db.query(Donation).all()

    total = len(donations)
    total_amount = sum([d.amount or 0 for d in donations])
    avg = total_amount / total if total else 0

    # Category distribution
    category_data = db.query(
        Donation.category,
        func.count()
    ).group_by(Donation.category).all()

    # Time trend (FIXED)
    trend_raw = db.query(
        func.date(Donation.created_at),
        func.count()
    ).group_by(func.date(Donation.created_at)).all()

    trend = [
        {"date": str(t[0]), "count": t[1]}
        for t in trend_raw
    ]

    return {
        "kpis": {
            "total": total,
            "total_amount": total_amount,
            "average": round(avg, 2)
        },
        "category": dict(category_data),
        "trend": trend
    }


# ---------------- VOLUNTEER ANALYTICS ----------------
@router.get("/volunteers")
def volunteer_analytics(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    total = db.query(VolunteerRequest).count()
    approved = db.query(VolunteerRequest).filter(VolunteerRequest.status == "Approved").count()
    pending = db.query(VolunteerRequest).filter(VolunteerRequest.status == "Pending").count()
    rejected = db.query(VolunteerRequest).filter(VolunteerRequest.status == "Rejected").count()

    active = approved
    inactive = pending + rejected

    # Skills distribution
    skills_data = db.query(
        VolunteerRequest.skills,
        func.count()
    ).group_by(VolunteerRequest.skills).all()

    # Time trend (FIXED)
    trend_raw = db.query(
        func.date(VolunteerRequest.submitted_at),
        func.count()
    ).group_by(func.date(VolunteerRequest.submitted_at)).all()

    trend = [
        {"date": str(t[0]), "count": t[1]}
        for t in trend_raw
    ]

    return {
        "kpis": {
            "total": total,
            "active": active,
            "approved": approved,
            "pending": pending
        },
        "status": {
            "Approved": approved,
            "Pending": pending,
            "Rejected": rejected
        },
        "active_split": {
            "Active": active,
            "Inactive": inactive
        },
        "skills": dict(skills_data),
        "trend": trend
    }