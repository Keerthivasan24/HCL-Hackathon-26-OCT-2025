from fastapi import FastAPI
from app.routers import auth, users, kyc, accounts
from app.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from app.routers import accounts

# Create tables if not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hackathon Bank API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(kyc.router, prefix="/kyc", tags=["KYC"])
app.include_router(accounts.router, prefix="/accounts", tags=["Bank Accounts"])
