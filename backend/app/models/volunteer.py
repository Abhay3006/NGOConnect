from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
from datetime import datetime


class VolunteerRequest(Base):
    __tablename__ = "volunteer_requests"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String(10), nullable=False)
    address = Column(Text, nullable=False)
    age = Column(Integer, nullable=False)
    occupation = Column(String, nullable=False)
    experience = Column(Text, nullable=True)
    availability = Column(String, nullable=False)  # e.g., "Weekends", "Weekdays", "Full-time"
    skills = Column(Text, nullable=True)
    motivation = Column(Text, nullable=False)
    status = Column(String, default="Pending")  # Pending, Approved, Rejected, Contacted
    admin_reply = Column(Text, nullable=True)
    user_email = Column(String, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)