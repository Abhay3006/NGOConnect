from sqlalchemy import Column, Integer, String, Text, Float
from database import Base
from sqlalchemy import DateTime
from datetime import datetime


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=True)  # For monetary donations
    contact_number = Column(String(10), nullable=False)
    location = Column(String, nullable=True)  # Optional location
    status = Column(String, default="Pending")  # Pending, Approved, Completed
    user_email = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)