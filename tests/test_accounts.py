import pytest
from fastapi.testclient import TestClient
from app.database import SessionLocal
from app.models import User, UserKYC, BankAccount
from decimal import Decimal

def test_create_account_requires_kyc(client: TestClient, db_session):
    """Test that account creation requires KYC verification"""
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
    
    # Try to create account without KYC
    response = client.post(
        "/accounts/create",
        json={
            "user_id": user.user_id,
            "account_type": "Savings",
            "initial_deposit": 1000.00
        }
    )
    
    assert response.status_code == 400
    assert "KYC verification required" in response.json()["detail"]

def test_create_account_with_kyc(client: TestClient, db_session):
    """Test successful account creation with verified KYC"""
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
    
    # Create account
    response = client.post(
        "/accounts/create",
        json={
            "user_id": user.user_id,
            "account_type": "Savings",
            "initial_deposit": 1000.00
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["account_type"] == "Savings"
    assert data["total_balance"] == 1000.00
    assert data["account_number"] is not None

def test_get_user_accounts(client: TestClient, db_session):
    """Test retrieving user accounts"""
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
    
    # Create account
    account = BankAccount(
        user_id=user.user_id,
        account_number=123456789012,
        account_type="Savings",
        initial_deposit=Decimal("1000.00"),
        total_balance=Decimal("1000.00"),
        ifsc_code="SBIN0001234"
    )
    db_session.add(account)
    db_session.commit()
    
    # Get user accounts
    response = client.get(f"/accounts/user/{user.user_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["account_type"] == "Savings"
