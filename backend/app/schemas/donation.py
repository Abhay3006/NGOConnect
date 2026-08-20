from pydantic import BaseModel, Field


class DonationCreate(BaseModel):
    title: str
    description: str
    category: str
    amount: float | None = None
    contact_number: str = Field(..., pattern=r"^\d{10}$")
    location: str | None = None


class DonationResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    amount: float | None = None
    contact_number: str
    location: str | None = None
    status: str
    user_email: str
    user_name: str | None = None

    class Config:
        from_attributes = True