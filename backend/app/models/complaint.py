from sqlalchemy import Column, Integer, String, Text
from database import Base
from sqlalchemy import DateTime
from datetime import datetime


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)

    contact_number = Column(String(10), nullable=False)  # NEW FIELD
    category = Column(String, nullable=False)            # NEW FIELD
    image_filename = Column(String, nullable=True)       # NEW FIELD FOR IMAGE

    status = Column(String, default="Pending")
    user_email = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)