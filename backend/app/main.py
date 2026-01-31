from fastapi import FastAPI
from .database import engine
from . import models
from app.routes import expenses
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Expense Tracker API")
# Create database tables on startup
models.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expenses.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
