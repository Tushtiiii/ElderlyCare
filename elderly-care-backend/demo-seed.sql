-- ============================================================================= -- Demo Data Seeding Script
-- Elderly Care System - Demo Accounts
-- Database: PostgreSQL
-- 
-- This file inserts demo accounts for testing all system roles:
-- ELDER, CHILD (Guardian), DOCTOR, PATHOLOGIST
--
-- IMPORTANT: Update the password hashes as needed. Passwords are BCrypt hashed.
-- To generate a BCrypt hash, use: https://bcrypt-generator.com/
-- Demo Password: DemoPass@123
-- BCrypt Hash (bcrypt rounds=10): $2a$10$slYQmyNdGzin7olVv76p2OPST9/PgBkqquzi.Ee1MxTlE8qcTuE2G
-- ============================================================================= BEGIN;

-- Disable foreign key constraints temporarily (if needed)
-- For PostgreSQL, foreign keys are enforced at commit time, but we can control with ALTER TABLE

-- ============================================================================= -- 1. ELDER Account (Patient)
-- ============================================================================= 
INSERT INTO users (
    id, 
    name, 
    email, 
    password_hash, 
    phone, 
    role, 
    date_of_birth, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID,
    'John Anderson',
    'elder.demo@example.com',
    '$2a$10$slYQmyNdGzin7olVv76p2OPST9/PgBkqquzi.Ee1MxTlE8qcTuE2G',
    '+1234567890',
    'ELDER',
    '1950-05-15'::DATE,
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================= -- 2. GUARDIAN/CHILD Account (Caregiver)
-- ============================================================================= 
INSERT INTO users (
    id, 
    name, 
    email, 
    password_hash, 
    phone, 
    role, 
    date_of_birth, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'b2c3d4e5-f6a7-4b5c-ad8e-7f8a6b5c4d3e'::UUID,
    'Sarah Anderson',
    'guardian.demo@example.com',
    '$2a$10$slYQmyNdGzin7olVv76p2OPST9/PgBkqquzi.Ee1MxTlE8qcTuE2G',
    '+1234567891',
    'CHILD',
    '1975-08-20'::DATE,
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================= -- 3. DOCTOR Account
-- ============================================================================= 
INSERT INTO users (
    id, 
    name, 
    email, 
    password_hash, 
    phone, 
    role, 
    date_of_birth, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'c3d4e5f6-a7b8-5c6d-be9f-8a9b7c6d5e4f'::UUID,
    'Dr. Michael Smith',
    'doctor.demo@example.com',
    '$2a$10$slYQmyNdGzin7olVv76p2OPST9/PgBkqquzi.Ee1MxTlE8qcTuE2G',
    '+1234567892',
    'DOCTOR',
    '1970-03-10'::DATE,
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================= -- 4. PATHOLOGIST Account
-- ============================================================================= 
INSERT INTO users (
    id, 
    name, 
    email, 
    password_hash, 
    phone, 
    role, 
    date_of_birth, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'd4e5f6a7-b8c9-6d7e-cf0a-9bac8d7e6f5a'::UUID,
    'Dr. Emily Johnson',
    'pathologist.demo@example.com',
    '$2a$10$slYQmyNdGzin7olVv76p2OPST9/PgBkqquzi.Ee1MxTlE8qcTuE2G',
    '+1234567893',
    'PATHOLOGIST',
    '1972-11-25'::DATE,
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

COMMIT;

-- ============================================================================= -- Verification Queries
-- Run these to verify the demo accounts were created successfully
-- ============================================================================= 
-- SELECT * FROM users WHERE email IN (
--     'elder.demo@example.com',
--     'guardian.demo@example.com',
--     'doctor.demo@example.com',
--     'pathologist.demo@example.com'
-- ) ORDER BY role;
