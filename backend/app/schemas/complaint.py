from pydantic import BaseModel, Field

class ComplaintCreate(BaseModel):
    title: str
    contact_number: str = Field(..., pattern=r"^\d{10}$")
    category: str
    description: str
    location: str
    image_filename: str | None = None  # NEW FIELD FOR IMAGE


class ComplaintResponse(BaseModel):
    id: int
    title: str
    contact_number: str
    category: str
    description: str
    location: str
    status: str
    user_email: str
    user_name: str | None = None   # NEW FIELD
    image_filename: str | None = None  # NEW FIELD FOR IMAGE

    class Config:
        from_attributes = True