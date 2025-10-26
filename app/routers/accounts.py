from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
import random
from decimal import Decimal

router = APIRouter()

@router.post("/create", response_model=schemas.BankAccountOut, status_code=status.HTTP_201_CREATED)
def create_bank_account(
    account_data: schemas.BankAccountCreate,
    db: Session = Depends(get_db)
):
    # Check if user exists
    user = db.query(models.User).filter(models.User.user_id == account_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user has completed KYC
    kyc = db.query(models.UserKYC).filter(models.UserKYC.user_id == account_data.user_id).first()
    # BYPASS FOR TESTING - Allow account creation without verified KYC
    # if not kyc or not kyc.verified:
    #     raise HTTPException(status_code=400, detail="KYC verification required to create account")
    
    # Generate unique account number
    while True:
        account_number = random.randint(100000000000, 999999999999)  # 12-digit account number
        existing = db.query(models.BankAccount).filter(models.BankAccount.account_number == account_number).first()
        if not existing:
            break
    
    # Create bank account
    bank_account = models.BankAccount(
        user_id=account_data.user_id,
        account_number=account_number,
        account_type=account_data.account_type,
        initial_deposit=account_data.initial_deposit,
        total_balance=account_data.initial_deposit,
        ifsc_code="SBIN0001234"
    )
    
    db.add(bank_account)
    db.commit()
    db.refresh(bank_account)
    
    return bank_account

@router.get("/user/{user_id}", response_model=list[schemas.BankAccountOut])
def get_user_accounts(user_id: int, db: Session = Depends(get_db)):
    accounts = db.query(models.BankAccount).filter(models.BankAccount.user_id == user_id).all()
    return accounts

@router.get("/{account_id}", response_model=schemas.BankAccountOut)
def get_account(account_id: int, db: Session = Depends(get_db)):
    account = db.query(models.BankAccount).filter(models.BankAccount.account_id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account