from sqlalchemy import Column, Integer, String, Date, DateTime, Numeric
from sqlalchemy.sql import func

from .database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    # Correct type for money (avoid float)
    amount = Column(Numeric(10, 2), nullable=False)

    category = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)

    date = Column(Date, nullable=False)

    # Used to make POST /expenses retry-safe
    idempotency_key = Column(String, nullable=False, unique=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
