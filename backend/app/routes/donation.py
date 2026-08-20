import os
from dotenv import load_dotenv

load_dotenv()
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import razorpay

from database import SessionLocal
from app.models.donation import Donation
from app.schemas.donation import DonationCreate, DonationResponse
from app.utils.jwt import decode_access_token

router = APIRouter(prefix="/donations", tags=["Donations"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# 🔒 Frozen Category List
VALID_DONATION_CATEGORIES = [
    "Food",
    "Clothes",
    "Money",
    "Medical Supplies",
    "Educational Materials",
    "Other"
]

# Razorpay setup
razorpay_client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID"),
        os.getenv("RAZORPAY_KEY_SECRET")
    )
)

# ✅ Request model (fixes 422 error)
class OrderRequest(BaseModel):
    amount: float


# ---------------- DB SESSION ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- 💳 CREATE PAYMENT ORDER ----------------
@router.post("/create-order")
def create_order(data: OrderRequest):
    try:
        order = razorpay_client.order.create({
            "amount": int(data.amount * 100),  # ₹ → paise
            "currency": "INR",
            "payment_capture": 1
        })
        return order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- CREATE DONATION ----------------
@router.post("/", response_model=DonationResponse)
async def create_donation(
    donation: DonationCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        if token.startswith("Bearer "):
            token = token.split(" ")[1]

        payload = decode_access_token(token)

        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_email = payload.get("sub")

        # Validate category
        if donation.category not in VALID_DONATION_CATEGORIES:
            raise HTTPException(status_code=400, detail="Invalid category selected")

        # Validate contact number
        if not donation.contact_number.isdigit() or len(donation.contact_number) != 10:
            raise HTTPException(status_code=400, detail="Contact number must be 10 digits")

        new_donation = Donation(
            title=donation.title,
            description=donation.description,
            category=donation.category,
            amount=donation.amount,
            contact_number=donation.contact_number,
            location=donation.location,
            status="Pending",
            user_email=user_email
        )

        db.add(new_donation)
        db.commit()
        db.refresh(new_donation)
        return new_donation

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating donation: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating donation: {str(e)}")


# ---------------- GET DONATIONS ----------------
@router.get("/", response_model=list[DonationResponse])
def get_all_donations(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_email = payload.get("sub")
    role = payload.get("role")

    if role == "admin":
        donations = db.query(Donation).all()
    else:
        donations = db.query(Donation).filter(
            Donation.user_email == user_email
        ).all()

    result = []

    for d in donations:
        user = db.query(User).filter(User.email == d.user_email).first()

        result.append({
            "id": d.id,
            "title": d.title,
            "description": d.description,
            "category": d.category,
            "amount": d.amount,
            "contact_number": d.contact_number,
            "location": d.location,
            "status": d.status,
            "user_email": d.user_email,
            "user_name": user.name if user else None
        })

    return result


# ---------------- UPDATE DONATION STATUS ----------------
@router.put("/{donation_id}/status")
def update_donation_status(
    donation_id: int,
    status: str,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    role = payload.get("role")

    if role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update donation status")

    donation = db.query(Donation).filter(Donation.id == donation_id).first()

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    valid_statuses = ["Pending", "Approved", "Completed", "Rejected"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    donation.status = status
    db.commit()

    return {"message": "Donation status updated successfully"}


# ---------------- DELETE DONATION ----------------
@router.delete("/{donation_id}")
def delete_donation(
    donation_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_email = payload.get("sub")
    role = payload.get("role")

    donation = db.query(Donation).filter(Donation.id == donation_id).first()

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    if role != "admin" and donation.user_email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(donation)
    db.commit()

    return {"message": "Donation deleted successfully"}