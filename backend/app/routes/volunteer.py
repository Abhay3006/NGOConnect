from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from database import SessionLocal
from app.models.volunteer import VolunteerRequest
from app.schemas.volunteer import VolunteerRequestCreate, VolunteerRequestResponse, VolunteerRequestUpdate
from app.utils.jwt import decode_access_token

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

VALID_STATUSES = ["Pending", "Approved", "Rejected", "Contacted"]


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- CREATE VOLUNTEER REQUEST ----------------
@router.post("/", response_model=VolunteerRequestResponse)
async def create_volunteer_request(
    request: VolunteerRequestCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = decode_access_token(token)

        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_email = payload.get("sub")

        # Check if user already has a pending request
        existing_request = db.query(VolunteerRequest).filter(
            VolunteerRequest.user_email == user_email,
            VolunteerRequest.status.in_(["Pending", "Approved"])
        ).first()

        if existing_request:
            raise HTTPException(
                status_code=400,
                detail="You already have a pending or approved volunteer request"
            )

        new_request = VolunteerRequest(
            full_name=request.full_name,
            email=request.email,
            phone=request.phone,
            address=request.address,
            age=request.age,
            occupation=request.occupation,
            experience=request.experience,
            availability=request.availability,
            skills=request.skills,
            motivation=request.motivation,
            status="Pending",
            user_email=user_email
        )

        db.add(new_request)
        db.commit()
        db.refresh(new_request)
        return new_request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating volunteer request: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating volunteer request: {str(e)}")


# ---------------- GET VOLUNTEER REQUESTS ----------------
@router.get("/", response_model=list[VolunteerRequestResponse])
def get_volunteer_requests(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_email = payload.get("sub")
    role = payload.get("role")

    if role == "admin":
        requests = db.query(VolunteerRequest).order_by(VolunteerRequest.submitted_at.desc()).all()
    else:
        requests = db.query(VolunteerRequest).filter(
            VolunteerRequest.user_email == user_email
        ).order_by(VolunteerRequest.submitted_at.desc()).all()

    return requests


# ---------------- UPDATE VOLUNTEER REQUEST STATUS ----------------
@router.put("/{request_id}", response_model=VolunteerRequestResponse)
def update_volunteer_request(
    request_id: int,
    update_data: VolunteerRequestUpdate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_email = payload.get("sub")
    role = payload.get("role")

    request = db.query(VolunteerRequest).filter(VolunteerRequest.id == request_id).first()

    if not request:
        raise HTTPException(status_code=404, detail="Volunteer request not found")

    # Only admin can update status, or user can update their own request (limited)
    if role != "admin" and request.user_email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized")

    if role != "admin" and update_data.status != request.status:
        raise HTTPException(status_code=403, detail="Only admins can change request status")

    if update_data.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")

    request.status = update_data.status
    if update_data.admin_reply is not None:
        request.admin_reply = update_data.admin_reply

    db.commit()
    db.refresh(request)
    return request


# ---------------- DELETE VOLUNTEER REQUEST ----------------
@router.delete("/{request_id}")
def delete_volunteer_request(
    request_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_email = payload.get("sub")
    role = payload.get("role")

    request = db.query(VolunteerRequest).filter(VolunteerRequest.id == request_id).first()

    if not request:
        raise HTTPException(status_code=404, detail="Volunteer request not found")

    if role != "admin" and request.user_email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(request)
    db.commit()

    return {"message": "Volunteer request deleted successfully"}