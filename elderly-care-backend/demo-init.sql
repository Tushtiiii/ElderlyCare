-- ============================================================================= 
-- Fresh Demo Data Initialization
-- Elderly Care System - Demo Accounts Setup
-- ============================================================================= 

BEGIN;

-- First, ensure demo users exist (delete if exists to start fresh)
DELETE FROM users WHERE email IN (
    'elder.demo@example.com',
    'guardian.demo@example.com',
    'doctor.demo@example.com',
    'pathologist.demo@example.com'
);

-- ============================================================================= 
-- Create Demo Users
-- ============================================================================= 

-- ELDER Account
INSERT INTO users (
    id, name, email, password_hash, phone, role, date_of_birth, is_active, created_at, updated_at
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
);

-- GUARDIAN/CHILD Account
INSERT INTO users (
    id, name, email, password_hash, phone, role, date_of_birth, is_active, created_at, updated_at
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
);

-- DOCTOR Account
INSERT INTO users (
    id, name, email, password_hash, phone, role, date_of_birth, is_active, created_at, updated_at
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
);

-- PATHOLOGIST Account
INSERT INTO users (
    id, name, email, password_hash, phone, role, date_of_birth, is_active, created_at, updated_at
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
);

-- ============================================================================= 
-- Create Elder-Guardian Relationship
-- ============================================================================= 

DELETE FROM elder_child_relationship 
WHERE elder_id = 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID 
AND child_id = 'b2c3d4e5-f6a7-4b5c-ad8e-7f8a6b5c4d3e'::UUID;

INSERT INTO elder_child_relationship (
    id, elder_id, child_id, status, requested_by, created_at, updated_at
) VALUES (
    'e5f6a7b8-c9da-7e8f-d01b-acbdaebf0c6a'::UUID,
    'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID,
    'b2c3d4e5-f6a7-4b5c-ad8e-7f8a6b5c4d3e'::UUID,
    'ACTIVE',
    'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID,
    NOW(),
    NOW()
);

-- ============================================================================= 
-- Delete existing demo vitals (optional - clean slate)
-- ============================================================================= 

DELETE FROM vital_records 
WHERE elder_id = 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID;

-- ============================================================================= 
-- Insert Demo Vital Records (Last 30 days)
-- ============================================================================= 

-- Blood Sugar readings (mg/dL)
INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111101'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 110, 'mg/dL', 'Fasting', NOW() - INTERVAL '28 days', FALSE, NOW(), NOW()),
    ('11111111-1111-1111-1111-111111111102'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 135, 'mg/dL', 'Post-meal', NOW() - INTERVAL '25 days', FALSE, NOW(), NOW()),
    ('11111111-1111-1111-1111-111111111103'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 98, 'mg/dL', 'Fasting', NOW() - INTERVAL '22 days', FALSE, NOW(), NOW()),
    ('11111111-1111-1111-1111-111111111104'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 155, 'mg/dL', 'Post-meal', NOW() - INTERVAL '19 days', TRUE, NOW(), NOW()),
    ('11111111-1111-1111-1111-111111111105'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 118, 'mg/dL', 'Fasting', NOW() - INTERVAL '16 days', FALSE, NOW(), NOW()),
    ('11111111-1111-1111-1111-111111111106'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 142, 'mg/dL', 'Post-meal', NOW() - INTERVAL '13 days', FALSE, NOW(), NOW()),
    ('11111111-1111-1111-1111-111111111107'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 105, 'mg/dL', 'Fasting', NOW() - INTERVAL '10 days', FALSE, NOW(), NOW()),
    ('11111111-1111-1111-1111-111111111108'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 128, 'mg/dL', 'Post-meal', NOW() - INTERVAL '7 days', FALSE, NOW(), NOW());

-- Blood Pressure readings (mmHg)
INSERT INTO vital_records (id, elder_id, vital_type, value, secondary_value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
VALUES 
    ('22222222-2222-2222-2222-222222222201'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 128, 82, 'mmHg', 'At rest', NOW() - INTERVAL '29 days', FALSE, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222202'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 135, 88, 'mmHg', 'Morning', NOW() - INTERVAL '26 days', FALSE, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222203'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 130, 85, 'mmHg', 'At rest', NOW() - INTERVAL '23 days', FALSE, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222204'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 145, 95, 'mmHg', 'After activity', NOW() - INTERVAL '20 days', TRUE, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222205'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 132, 83, 'mmHg', 'At rest', NOW() - INTERVAL '17 days', FALSE, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222206'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 138, 87, 'mmHg', 'Morning', NOW() - INTERVAL '14 days', FALSE, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222207'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 129, 81, 'mmHg', 'At rest', NOW() - INTERVAL '11 days', FALSE, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222208'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 136, 86, 'mmHg', 'Morning', NOW() - INTERVAL '8 days', FALSE, NOW(), NOW());

-- Heart Rate readings (bpm)
INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
VALUES 
    ('33333333-3333-3333-3333-333333333301'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 72, 'bpm', 'Resting', NOW() - INTERVAL '27 days', FALSE, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333302'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 85, 'bpm', 'After walk', NOW() - INTERVAL '24 days', FALSE, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333303'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 68, 'bpm', 'Resting', NOW() - INTERVAL '21 days', FALSE, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333304'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 98, 'bpm', 'After activity', NOW() - INTERVAL '18 days', TRUE, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333305'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 75, 'bpm', 'Resting', NOW() - INTERVAL '15 days', FALSE, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333306'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 82, 'bpm', 'After walk', NOW() - INTERVAL '12 days', FALSE, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333307'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 70, 'bpm', 'Resting', NOW() - INTERVAL '9 days', FALSE, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333308'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 79, 'bpm', 'After walk', NOW() - INTERVAL '6 days', FALSE, NOW(), NOW());

-- Oxygen Saturation readings (%)
INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
VALUES 
    ('44444444-4444-4444-4444-444444444401'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '30 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444402'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 96, '%', 'At rest', NOW() - INTERVAL '28 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444403'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 98, '%', 'At rest', NOW() - INTERVAL '25 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444404'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 93, '%', 'After activity', NOW() - INTERVAL '22 days', TRUE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444405'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '19 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444406'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 95, '%', 'At rest', NOW() - INTERVAL '16 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444407'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 98, '%', 'At rest', NOW() - INTERVAL '13 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444408'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '10 days', FALSE, NOW(), NOW());

-- Temperature readings (°C)
INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
VALUES 
    ('55555555-5555-5555-5555-555555555501'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 36.8, '°C', 'Morning', NOW() - INTERVAL '31 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555502'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.1, '°C', 'Afternoon', NOW() - INTERVAL '28 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555503'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 36.9, '°C', 'Morning', NOW() - INTERVAL '25 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555504'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 38.2, '°C', 'Evening', NOW() - INTERVAL '22 days', TRUE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555505'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.0, '°C', 'Morning', NOW() - INTERVAL '19 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555506'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 36.7, '°C', 'Afternoon', NOW() - INTERVAL '16 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555507'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.2, '°C', 'Morning', NOW() - INTERVAL '13 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555508'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 36.9, '°C', 'Afternoon', NOW() - INTERVAL '10 days', FALSE, NOW(), NOW());

-- ============================================================================= 
-- Commit Transaction
-- ============================================================================= 

COMMIT;

-- Verify data was inserted
SELECT COUNT(*) as total_vitals FROM vital_records WHERE elder_id = 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID;
SELECT COUNT(*) as total_users FROM users WHERE email IN ('elder.demo@example.com', 'guardian.demo@example.com', 'doctor.demo@example.com', 'pathologist.demo@example.com');
SELECT COUNT(*) as relationships FROM elder_child_relationship WHERE elder_id = 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID;
