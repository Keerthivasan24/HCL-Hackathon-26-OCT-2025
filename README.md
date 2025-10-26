SMART BANKING 

User Registration Module — Angular + FastAPI + MySQL

current-Progress 

- User Registration Form (Angular)
- Form validation (required fields, email format, etc.)
- API Integration with FastAPI using HTTP POST
- MySQL table (`users`) to store registration details
- CORS-enabled backend for Angular communication

Yet to work : 
JWT authentication 
password hashing 

DB DESIGN :

CREATE DATABASE IF NOT EXISTS hackathon_bank;
USE hackathon_bank;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email_id VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    place VARCHAR(100),
    location VARCHAR(100),
    state VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
SHOW TABLES;
DESCRIBE users;
USE hackathon_bank;

ALTER TABLE users
ADD COLUMN kyc_document VARCHAR(255);




