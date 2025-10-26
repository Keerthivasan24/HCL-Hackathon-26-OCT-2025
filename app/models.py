import enum
from sqlalchemy import TIMESTAMP, BigInteger, Boolean, Column, Enum, ForeignKey, Integer, Numeric, String, func
from app.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Enum as SqlEnum 

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    fullname = Column(String(100), nullable=False)
    email_id = Column(String(150), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    place = Column(String(100))
    location = Column(String(100))
    state = Column(String(100))
    kyc = relationship("UserKYC", back_populates="user", uselist=False, cascade="all, delete-orphan")
    accounts = relationship("BankAccount", back_populates="user")


class UserKYC(Base):
    __tablename__ = "user_kyc"

    kyc_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), unique=True, nullable=False)
    aadhar_number = Column(String(12), unique=True, nullable=False)
    pan_number = Column(String(10), unique=True, nullable=False)
    kyc_document = Column(String(255), nullable=True)
    verified = Column(Boolean, default=False)

    user = relationship("User", back_populates="kyc")

class AccountType(enum.Enum):
    Savings = "Savings"
    Current = "Current"
    FD = "FD"

class BankAccount(Base):
    __tablename__ = "bank_accounts"

    account_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    account_number = Column(BigInteger, unique=True, nullable=False)
    account_type = Column(SqlEnum(AccountType), nullable=False) 
    initial_deposit = Column(Numeric(12,2), nullable=False)
    total_balance = Column(Numeric(12,2), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    ifsc_code = Column(String(20), default="HACK0001234", nullable=False)


    user = relationship("User", back_populates="accounts")