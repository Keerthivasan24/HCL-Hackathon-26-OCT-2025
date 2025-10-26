
#  SmartBank

A demo-ready **banking application** built with **FastAPI (Python)** for the backend and **Angular** for the frontend.  
It supports **user registration, KYC verification, and account creation** with proper database normalization and audit-friendly design.

---

##  Project Structure

```
backend/
├── app/
│   ├── routers/
│   │   ├── auth.py        # User registration & login
│   │   ├── users.py       # User-related endpoints
│   │   ├── kyc.py         # KYC creation & update
│   │   └── accounts.py    # Bank account creation
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas
│   ├── database.py        # DB connection/session
│   ├── config.py
│   └── security.py        # Password hashing & JWT
├── main.py                # FastAPI entrypoint
└── requirements.txt

frontend/
├── src/app/
│   ├── register/          # Registration component
│   ├── kyc/               # KYC form component
│   └── account-create/    # Account creation component
```

##  Backend (FastAPI)

### Features Implemented
- **User Registration & Login** (`/auth/register`, `/auth/login`)
- **KYC Management**
  - `POST /kyc/create` → submit Aadhaar, PAN, and document
  - `PUT /kyc/update/{user_id}` → update Aadhaar, PAN, verification status
- **Account Creation**
  - `POST /account/create` → create bank account (requires verified KYC)

### Highlights
- JWT-based authentication
- SQLAlchemy ORM with relationships
- Pydantic schemas for validation
- Enum usage for account types
- Auto-generated account numbers (later removed from DB, using `account_id` instead)
- Default IFSC code for all accounts

---

## Frontend (Angular)

### Components
- **RegisterComponent** → user signup form
- **KycComponent** → Aadhaar, PAN, and file upload
- **AccountCreateComponent** → choose account type, enter deposit, create account

### API Integration
- Uses Angular `HttpClient` to call FastAPI endpoints
- Handles validation and error messages
- Redirects after successful actions

---

## How to Run

### Backend
```bash
cd backend
python -m venv backendvenv
backendvenv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

---


Would you like me to also extend this README with **sample API request/response JSON** (for register, KYC, and account creation) so anyone testing with Postman or Swagger can see exactly how to call your APIs?
