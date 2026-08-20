from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class VolunteerRequestCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    phone: str = Field(..., pattern=r"^\d{10}$")
    address: str = Field(..., min_length=10)
    age: int = Field(..., ge=18, le=80)
    occupation: str = Field(..., min_length=2)
    experience: Optional[str] = None
    availability: str = Field(..., min_length=2)
    skills: Optional[str] = None
    motivation: str = Field(..., min_length=20)


class VolunteerRequestResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    address: str
    age: int
    occupation: str
    experience: Optional[str] = None
    availability: str
    skills: Optional[str] = None
    motivation: str
    status: str
    admin_reply: Optional[str] = None
    user_email: str
    submitted_at: datetime

    class Config:
        from_attributes = True


class VolunteerRequestUpdate(BaseModel):
    status: str
    admin_reply: Optional[str] = None