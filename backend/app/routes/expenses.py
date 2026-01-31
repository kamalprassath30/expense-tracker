from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from fastapi import Query
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/expenses",
    tags=["expenses"]
)

@router.get("", response_model=List[schemas.ExpenseOut])
def get_expenses(
    category: Optional[str] = Query(None),
    sort: Optional[str] = Query(None, description="Use 'date_desc' for newest first"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Expense)

    # Filter by category if provided
    if category:
        query = query.filter(models.Expense.category == category)

    # Sort by date descending if requested
    if sort == "date_desc":
        query = query.order_by(models.Expense.date.desc())
    else:
        query = query.order_by(models.Expense.date.asc())

    return query.all()

@router.post("", response_model=schemas.ExpenseOut)
def create_expense(
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
    idempotency_key: str = Header(..., alias="Idempotency-Key"),
):
    # Check if this request was already processed
    existing_expense = (
        db.query(models.Expense)
        .filter(models.Expense.idempotency_key == idempotency_key)
        .first()
    )

    if existing_expense:
        # print("Id: ", existing_expense.id)
        return existing_expense

    new_expense = models.Expense(
        amount=expense.amount,
        category=expense.category,
        description=expense.description,
        date=expense.date,
        idempotency_key=idempotency_key,
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense
