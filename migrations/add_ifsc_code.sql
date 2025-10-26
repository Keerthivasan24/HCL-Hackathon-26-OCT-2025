-- Migration script to add ifsc_code to bank_accounts table
-- Run this script in your MySQL database

USE banking_db; -- Replace with your database name

-- Add ifsc_code column if it doesn't exist
ALTER TABLE bank_accounts 
ADD COLUMN IF NOT EXISTS ifsc_code VARCHAR(11) DEFAULT 'SBIN0001234' NOT NULL AFTER created_at;

-- Verify the table structure
DESCRIBE bank_accounts;
