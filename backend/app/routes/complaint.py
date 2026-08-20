from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
import os
import uuid
from datetime import datetime

from database import SessionLocal
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintResponse
from app.utils.jwt import decode_access_token

router = APIRouter(prefix="/complaints", tags=["Complaints"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Upload folder configuration
UPLOAD_FOLDER = "uploads/complaints"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# 🔒 Frozen Category List
VALID_CATEGORIES = [
    "Garbage Collection Issue",
    "Drainage Problem",
    "Street Cleaning",
    "Dead Animal Removal",
    "Illegal Dumping",
    "Other"
]


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------- CREATE COMPLAINT ----------------
@router.post("/", response_model=ComplaintResponse)
async def create_complaint(
    title: str = Form(...),
    contact_number: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    file: UploadFile | None = File(None),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = decode_access_token(token)

        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_email = payload.get("sub")

        # Validate category
        if category not in VALID_CATEGORIES:
            raise HTTPException(status_code=400, detail="Invalid category selected")

        # Validate contact number
        if not contact_number.isdigit() or len(contact_number) != 10:
            raise HTTPException(status_code=400, detail="Contact number must be 10 digits")

        image_filename = None

        # Handle file upload
        if file and file.filename:
            if not allowed_file(file.filename):
                raise HTTPException(status_code=400, detail="Only images (png, jpg, jpeg, gif) are allowed")

            # Generate unique filename
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            image_filename = f"{uuid.uuid4()}_{datetime.now().timestamp()}.{file_extension}"

            # Save file
            file_path = os.path.join(UPLOAD_FOLDER, image_filename)
            contents = await file.read()
            with open(file_path, "wb") as f:
                f.write(contents)

        new_complaint = Complaint(
            title=title,
            description=description,
            location=location,
            contact_number=contact_number,
            category=category,
            image_filename=image_filename,
            status="Pending",
            user_email=user_email
        )

        db.add(new_complaint)
        db.commit()
        db.refresh(new_complaint)
        return new_complaint
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating complaint: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating complaint: {str(e)}")

# ---------------- GET COMPLAINTS ----------------
@router.get("/", response_model=list[ComplaintResponse])
def get_all_complaints(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_email = payload.get("sub")
    role = payload.get("role")

    if role == "admin":
        complaints = db.query(Complaint).all()
    else:
        complaints = db.query(Complaint).filter(
            Complaint.user_email == user_email
        ).all()

    result = []

    for c in complaints:
        user = db.query(User).filter(User.email == c.user_email).first()

        result.append({
            "id": c.id,
            "title": c.title,
            "contact_number": c.contact_number,
            "category": c.category,
            "description": c.description,
            "location": c.location,
            "status": c.status,
            "user_email": c.user_email,
            "user_name": user.name if user else None,
            "image_filename": c.image_filename
        })

    return result
    # ---------------- DELETE COMPLAINT ----------------
@router.delete("/{complaint_id}")
def delete_complaint(
    complaint_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_email = payload.get("sub")
    role = payload.get("role")

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if role != "admin" and complaint.user_email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Delete associated image file if it exists
    if complaint.image_filename:
        file_path = os.path.join(UPLOAD_FOLDER, complaint.image_filename)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Error deleting file: {e}")

    db.delete(complaint)
    db.commit()

    return {"message": "Complaint deleted successfully"}
# ---------------- UPDATE COMPLAINT STATUS ----------------
@router.put("/{complaint_id}/status")
def update_complaint_status(
    complaint_id: int,
    status: str,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    role = payload.get("role")

    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    VALID_STATUS = ["Pending", "In Progress", "Resolved"]

    if status not in VALID_STATUS:
        raise HTTPException(status_code=400, detail="Invalid status")

    complaint.status = status

    db.commit()
    db.refresh(complaint)

    return {"message": "Status updated successfully"}