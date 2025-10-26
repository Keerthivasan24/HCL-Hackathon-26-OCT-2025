from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
import os, shutil

router = APIRouter()

@router.post("/create", response_model=schemas.KYCOut, status_code=status.HTTP_201_CREATED)
def create_kyc(
    user_id: int = Form(...),
    aadhar_number: str = Form(...),
    pan_number: str = Form(...),
    kyc_document: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    # Validate user exists
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Enforce one KYC per user (if that's your rule)
    existing = db.query(models.UserKYC).filter(models.UserKYC.user_id == user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="KYC already exists for this user")

    # Save optional document
    file_path = None
    if kyc_document:
        os.makedirs("kyc_docs", exist_ok=True)
        file_path = f"kyc_docs/{user_id}_{kyc_document.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(kyc_document.file, buffer)

    # Create KYC
    kyc = models.UserKYC(
        user_id=user_id,
        aadhar_number=aadhar_number,
        pan_number=pan_number,
        kyc_document=file_path,
    )
    db.add(kyc)
    db.commit()
    db.refresh(kyc)
    return kyc

@router.put("/update/{user_id}", response_model=schemas.KYCOut)
def update_kyc(
    user_id: int,
    aadhar_number: str | None = Form(None),
    pan_number: str | None = Form(None),
    verified: bool | None = Form(None),
    kyc_document: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    kyc = db.query(models.UserKYC).filter(models.UserKYC.user_id == user_id).first()
    if not kyc:
        raise HTTPException(status_code=404, detail="KYC not found")

    if aadhar_number is not None:
        kyc.aadhar_number = aadhar_number
    if pan_number is not None:
        kyc.pan_number = pan_number
    if verified is not None:
        kyc.verified = verified

    if kyc_document:
        os.makedirs("kyc_docs", exist_ok=True)
        file_path = f"kyc_docs/{user_id}_{kyc_document.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(kyc_document.file, buffer)
        kyc.kyc_document = file_path

    db.commit()
    db.refresh(kyc)
    return kyc

@router.get("/user/{user_id}", response_model=schemas.KYCOut)
def get_user_kyc(user_id: int, db: Session = Depends(get_db)):
    kyc = db.query(models.UserKYC).filter(models.UserKYC.user_id == user_id).first()
    if not kyc:
        raise HTTPException(status_code=404, detail="KYC not found")
    return kyc

@router.patch("/verify/{kyc_id}")
def verify_kyc(kyc_id: int, db: Session = Depends(get_db)):
    """Admin endpoint to verify KYC - for testing purposes"""
    kyc = db.query(models.UserKYC).filter(models.UserKYC.kyc_id == kyc_id).first()
    if not kyc:
        raise HTTPException(status_code=404, detail="KYC not found")
    
    kyc.verified = True
    db.commit()
    db.refresh(kyc)
    
    return {"message": "KYC verified successfully", "verified": True}