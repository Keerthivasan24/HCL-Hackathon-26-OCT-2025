SMARTBANK 

A demo-ready banking application built with FastAPI (Python) for the backend and Angular for the frontend. It supports user registration, KYC verification, and account creation with proper database normalization and audit-friendly design.

Components
RegisterComponent → user signup form

KycComponent → Aadhaar, PAN, and file upload

AccountCreateComponent → choose account type, enter deposit, create account

API Integration
Uses Angular HttpClient to call FastAPI endpoints

Handles validation and error messages

Redirects after successful actions

How to Run

**Backend**
cd backend
python -m venv backendvenv
backendvenv\Scripts\activate  
pip install -r requirements.txt
uvicorn main:app --reload

**Frontend**
cd frontend
npm install
ng serve
