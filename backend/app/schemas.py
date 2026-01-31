from pydantic import BaseModel, Field
from datetime import date, datetime
from decimal import Decimal

class ExpenseCreate(BaseModel):
    amount: Decimal = Field(..., gt=0)
    category: str
    description: str | None = None
    date: date


class ExpenseOut(BaseModel):
    id: int
    amount: Decimal
    category: str
    description: str | None
    date: date
    created_at: datetime

    class Config:
        from_attributes = True
