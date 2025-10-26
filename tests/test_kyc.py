import pytest
from fastapi.testclient import TestClient
from app.database import SessionLocal
from app.models import User, UserKYC

def test_create_kyc(client: TestClient, db_session):
    """Test creating KYC"""
    # Create user
    user = User(
        fullname="Test User",
        email_id="test@example.com",
        password="hashed_password",
        place="Test Place",
        location="Test Location",
        state="Test State"
    )
    db_session.add(user)
    db_session.commit()
    
    # Create KYC
    form_data = {
        "user_id": user.user_id,
        "aadhar_number": "123456789012",
        "pan_number": "ABCDE1234F"
    }
    
    response = client.post("/kyc/create", data=form_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["aadhar_number"] == "123456789012"
    assert data["pan_number"] == "ABCDE1234F"
    assert data["verified"] == False

def test_get_user_kyc(client: TestClient, db_session):
    """Test retrieving user KYC status"""
    # Create user
    user = User(
        fullname="Test User",
        email_id="test@example.com",
        password="hashed_password",
        place="Test Place",
        location="Test Location",
        state="Test State"
    )
    db_session.add(user)
    db_session.commit()
    
    # Create KYC
    kyc = UserKYC(
        user_id=user.user_id,
        aadhar_number="123456789012",
        pan_number="ABCDE1234F",
        verified=True
    )
    db_session.add(kyc)
    db_session.commit()
    
    # Get user KYC
    response = client.get(f"/kyc/user/{user.user_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user.user_id
    assert data["verified"] == True

def test_update_kyc_verification(client: TestClient, db_session):
    """Test updating KYC verification status"""
    # Create user
    user = User(
        fullname="Test User",
        email_id="test@example.com",
        password="hashed_password",
        place="Test Place",
        location="Test Location",
        state="Test State"
    )
    db_session.add(user)
    db_session.commit()
    
    # Create KYC
    kyc = UserKYC(
        user_id=user.user_id,
        aadhar_number="123456789012",
        pan_number="ABCDE1234F",
        verified=False
    )
    db_session.add(kyc)
    db_session.commit()
    
    # Update KYC verification
    form_data = {
        "verified": True
    }
    
    response = client.put(f"/kyc/update/{user.user_id}", data=form_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["verified"] == True
