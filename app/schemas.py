from pydantic import BaseModel, EmailStr, Field
from decimal import Decimal
from typing import Optional
from datetime import datetime
from enum import Enum
from pydantic import BaseModel

class UserBase(BaseModel):
    fullname: str = Field(..., max_length=100)
    email_id: EmailStr
    place: str | None = None
    location: str | None = None
    state: str | None = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    fullname: str | None = None
    place: str | None = None
    location: str | None = None
    state: str | None = None

class UserOut(BaseModel):
    user_id: int
    fullname: str
    email_id: EmailStr
    place: str | None
    location: str | None
    state: str | None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email_id: EmailStr
    password: str


class KYCCreate(BaseModel):
    user_id: int
    aadhar_number: str = Field(..., min_length=12, max_length=12)
    pan_number: str = Field(..., min_length=10, max_length=10)
   

class KYCUpdate(BaseModel):
    aadhar_number: str | None = Field(None, min_length=12, max_length=12)
    pan_number: str | None = Field(None, min_length=10, max_length=10)
    verified: bool | None = None
 
    kyc_document: str | None = None

class KYCOut(BaseModel):
    kyc_id: int
    user_id: int
    aadhar_number: str
    pan_number: str
    kyc_document: str | None
    verified: bool

class AccountType(str, Enum):
    Savings = "Savings"
    Current = "Current"
    FD = "FD"

class BankAccountCreate(BaseModel):
    user_id: int
    account_type: AccountType
    initial_deposit: Decimal = Field(..., gt=0, description="Initial deposit amount")

class BankAccountOut(BaseModel):
    account_id: int
    user_id: int
    account_number: int
    account_type: str
    initial_deposit: Decimal
    total_balance: Decimal
    created_at: datetime
    ifsc_code: str

    class Config:
        from_attributes = True
