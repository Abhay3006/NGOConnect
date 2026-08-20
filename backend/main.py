import os
from dotenv import load_dotenv

load_dotenv()

import razorpay
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from database import engine, Base
from app.models import user
from app.models.complaint import Complaint
from app.models.donation import Donation
from app.models.volunteer import VolunteerRequest
from app.routes import auth
from app.routes.complaint import router as complaint_router
from app.routes.donation import router as donation_router
from app.routes.volunteer import router as volunteer_router
from app.routes.analytics import router as analytics_router

app = FastAPI(title="NGOConnect API")

# Razorpay setup
razorpay_client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID"),
        os.getenv("RAZORPAY_KEY_SECRET")
    )
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

from database import SessionLocal
from app.models.user import User
from app.utils.security import hash_password


def create_default_admin():
    db = SessionLocal()

    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_email or not admin_password:
        print("Admin credentials not configured. Skipping default admin creation.")
        db.close()
        return

    existing_admin = db.query(User).filter(User.email == admin_email).first()

    if not existing_admin:
        admin_user = User(
            name="Admin",
            email=admin_email,
            password=hash_password(admin_password),
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        print("Default admin created.")
    else:
        print("Admin already exists.")

    db.close()


create_default_admin()

uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(auth.router)
app.include_router(complaint_router)
app.include_router(donation_router)
app.include_router(volunteer_router)
app.include_router(analytics_router)

@app.get("/")
def root():
    return {"message": "NGOConnect backend running"}