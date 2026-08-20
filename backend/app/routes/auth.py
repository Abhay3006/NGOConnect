from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ------------------ DATABASE DEPENDENCY ------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------ REGISTER API ------------------
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = User(
    name=user.name,
    email=user.email,
    password=hash_password(user.password),
    role="citizen"   # default role
)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ------------------ LOGIN API ------------------
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(
        data={"sub": db_user.email, "role": db_user.role}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user.role
    }
