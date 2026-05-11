-- ============================================================================= 
-- Comprehensive Vitals Data - One Full Month
-- Elderly Care System - Detailed Demo Vitals for John Anderson
-- 
-- This file inserts comprehensive vital records spanning 30 days (April 11 - May 11, 2026)
-- Multiple readings per day for realistic monitoring patterns
-- ============================================================================= 

BEGIN;

-- Clear existing vitals for the elder demo user to avoid UUID conflicts
DELETE FROM vital_records 
WHERE elder_id = 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID;

-- ============================================================================= 
-- BLOOD SUGAR (mg/dL) - 2 readings per day for 30 days = 60 readings
-- Typical pattern: Fasting in morning, Post-meal in evening
-- ============================================================================= 

INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at) VALUES
-- Day 1 (May 11)
('11111111-1111-1111-1111-111111111101'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 105, 'mg/dL', 'Fasting', NOW() - INTERVAL '0 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111102'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 142, 'mg/dL', 'Post-meal', NOW() - INTERVAL '0 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 2 (May 10)
('11111111-1111-1111-1111-111111111103'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 110, 'mg/dL', 'Fasting', NOW() - INTERVAL '1 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111104'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 138, 'mg/dL', 'Post-meal', NOW() - INTERVAL '1 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 3 (May 9)
('11111111-1111-1111-1111-111111111105'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 102, 'mg/dL', 'Fasting', NOW() - INTERVAL '2 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111106'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 148, 'mg/dL', 'Post-meal', NOW() - INTERVAL '2 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 4 (May 8)
('11111111-1111-1111-1111-111111111107'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 115, 'mg/dL', 'Fasting', NOW() - INTERVAL '3 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111108'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 155, 'mg/dL', 'Post-meal', NOW() - INTERVAL '3 days' + INTERVAL '12 hours', TRUE, NOW(), NOW()),
-- Day 5 (May 7)
('11111111-1111-1111-1111-111111111109'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 108, 'mg/dL', 'Fasting', NOW() - INTERVAL '4 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111110'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 145, 'mg/dL', 'Post-meal', NOW() - INTERVAL '4 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 6 (May 6)
('11111111-1111-1111-1111-111111111111'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 98, 'mg/dL', 'Fasting', NOW() - INTERVAL '5 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111112'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 140, 'mg/dL', 'Post-meal', NOW() - INTERVAL '5 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 7 (May 5)
('11111111-1111-1111-1111-111111111113'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 112, 'mg/dL', 'Fasting', NOW() - INTERVAL '6 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111114'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 152, 'mg/dL', 'Post-meal', NOW() - INTERVAL '6 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 8 (May 4)
('11111111-1111-1111-1111-111111111115'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 107, 'mg/dL', 'Fasting', NOW() - INTERVAL '7 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111116'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 146, 'mg/dL', 'Post-meal', NOW() - INTERVAL '7 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 9 (May 3)
('11111111-1111-1111-1111-111111111117'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 100, 'mg/dL', 'Fasting', NOW() - INTERVAL '8 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111118'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 135, 'mg/dL', 'Post-meal', NOW() - INTERVAL '8 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 10 (May 2)
('11111111-1111-1111-1111-111111111119'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 118, 'mg/dL', 'Fasting', NOW() - INTERVAL '9 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111120'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 150, 'mg/dL', 'Post-meal', NOW() - INTERVAL '9 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 11 (May 1)
('11111111-1111-1111-1111-111111111121'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 111, 'mg/dL', 'Fasting', NOW() - INTERVAL '10 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111122'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 158, 'mg/dL', 'Post-meal', NOW() - INTERVAL '10 days' + INTERVAL '12 hours', TRUE, NOW(), NOW()),
-- Day 12 (Apr 30)
('11111111-1111-1111-1111-111111111123'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 103, 'mg/dL', 'Fasting', NOW() - INTERVAL '11 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111124'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 141, 'mg/dL', 'Post-meal', NOW() - INTERVAL '11 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 13 (Apr 29)
('11111111-1111-1111-1111-111111111125'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 109, 'mg/dL', 'Fasting', NOW() - INTERVAL '12 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111126'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 144, 'mg/dL', 'Post-meal', NOW() - INTERVAL '12 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 14 (Apr 28)
('11111111-1111-1111-1111-111111111127'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 99, 'mg/dL', 'Fasting', NOW() - INTERVAL '13 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111128'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 136, 'mg/dL', 'Post-meal', NOW() - INTERVAL '13 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 15 (Apr 27)
('11111111-1111-1111-1111-111111111129'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 113, 'mg/dL', 'Fasting', NOW() - INTERVAL '14 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111130'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 149, 'mg/dL', 'Post-meal', NOW() - INTERVAL '14 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 16 (Apr 26)
('11111111-1111-1111-1111-111111111131'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 106, 'mg/dL', 'Fasting', NOW() - INTERVAL '15 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111132'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 147, 'mg/dL', 'Post-meal', NOW() - INTERVAL '15 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 17 (Apr 25)
('11111111-1111-1111-1111-111111111133'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 101, 'mg/dL', 'Fasting', NOW() - INTERVAL '16 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111134'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 137, 'mg/dL', 'Post-meal', NOW() - INTERVAL '16 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 18 (Apr 24)
('11111111-1111-1111-1111-111111111135'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 114, 'mg/dL', 'Fasting', NOW() - INTERVAL '17 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111136'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 153, 'mg/dL', 'Post-meal', NOW() - INTERVAL '17 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 19 (Apr 23)
('11111111-1111-1111-1111-111111111137'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 104, 'mg/dL', 'Fasting', NOW() - INTERVAL '18 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111138'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 139, 'mg/dL', 'Post-meal', NOW() - INTERVAL '18 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 20 (Apr 22)
('11111111-1111-1111-1111-111111111139'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 110, 'mg/dL', 'Fasting', NOW() - INTERVAL '19 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111140'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 151, 'mg/dL', 'Post-meal', NOW() - INTERVAL '19 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 21 (Apr 21)
('11111111-1111-1111-1111-111111111141'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 97, 'mg/dL', 'Fasting', NOW() - INTERVAL '20 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111142'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 132, 'mg/dL', 'Post-meal', NOW() - INTERVAL '20 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 22 (Apr 20)
('11111111-1111-1111-1111-111111111143'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 116, 'mg/dL', 'Fasting', NOW() - INTERVAL '21 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111144'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 156, 'mg/dL', 'Post-meal', NOW() - INTERVAL '21 days' + INTERVAL '12 hours', TRUE, NOW(), NOW()),
-- Day 23 (Apr 19)
('11111111-1111-1111-1111-111111111145'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 108, 'mg/dL', 'Fasting', NOW() - INTERVAL '22 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111146'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 143, 'mg/dL', 'Post-meal', NOW() - INTERVAL '22 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 24 (Apr 18)
('11111111-1111-1111-1111-111111111147'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 102, 'mg/dL', 'Fasting', NOW() - INTERVAL '23 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111148'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 138, 'mg/dL', 'Post-meal', NOW() - INTERVAL '23 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 25 (Apr 17)
('11111111-1111-1111-1111-111111111149'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 111, 'mg/dL', 'Fasting', NOW() - INTERVAL '24 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111150'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 147, 'mg/dL', 'Post-meal', NOW() - INTERVAL '24 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 26 (Apr 16)
('11111111-1111-1111-1111-111111111151'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 105, 'mg/dL', 'Fasting', NOW() - INTERVAL '25 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111152'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 141, 'mg/dL', 'Post-meal', NOW() - INTERVAL '25 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 27 (Apr 15)
('11111111-1111-1111-1111-111111111153'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 100, 'mg/dL', 'Fasting', NOW() - INTERVAL '26 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111154'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 134, 'mg/dL', 'Post-meal', NOW() - INTERVAL '26 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 28 (Apr 14)
('11111111-1111-1111-1111-111111111155'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 112, 'mg/dL', 'Fasting', NOW() - INTERVAL '27 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111156'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 150, 'mg/dL', 'Post-meal', NOW() - INTERVAL '27 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 29 (Apr 13)
('11111111-1111-1111-1111-111111111157'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 107, 'mg/dL', 'Fasting', NOW() - INTERVAL '28 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111158'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 144, 'mg/dL', 'Post-meal', NOW() - INTERVAL '28 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
-- Day 30 (Apr 12)
('11111111-1111-1111-1111-111111111159'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 109, 'mg/dL', 'Fasting', NOW() - INTERVAL '29 days', FALSE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111160'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_SUGAR', 140, 'mg/dL', 'Post-meal', NOW() - INTERVAL '29 days' + INTERVAL '12 hours', FALSE, NOW(), NOW());

-- ============================================================================= 
-- BLOOD PRESSURE (mmHg) - 2 readings per day for 30 days = 60 readings
-- Format: systolic/diastolic
-- ============================================================================= 

INSERT INTO vital_records (id, elder_id, vital_type, value, secondary_value, unit, notes, recorded_at, is_abnormal, created_at, updated_at) VALUES
-- Days 1-30 with morning and evening readings
('22222222-2222-2222-2222-222222222201'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 128, 82, 'mmHg', 'Morning', NOW() - INTERVAL '0 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222202'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 132, 85, 'mmHg', 'Evening', NOW() - INTERVAL '0 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222203'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 130, 83, 'mmHg', 'Morning', NOW() - INTERVAL '1 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222204'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 135, 87, 'mmHg', 'Evening', NOW() - INTERVAL '1 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222205'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 125, 80, 'mmHg', 'Morning', NOW() - INTERVAL '2 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222206'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 138, 88, 'mmHg', 'Evening', NOW() - INTERVAL '2 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222207'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 135, 86, 'mmHg', 'Morning', NOW() - INTERVAL '3 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222208'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 145, 95, 'mmHg', 'Evening', NOW() - INTERVAL '3 days' + INTERVAL '18 hours', TRUE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222209'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 129, 81, 'mmHg', 'Morning', NOW() - INTERVAL '4 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222210'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 133, 84, 'mmHg', 'Evening', NOW() - INTERVAL '4 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222211'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 127, 79, 'mmHg', 'Morning', NOW() - INTERVAL '5 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222212'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 131, 83, 'mmHg', 'Evening', NOW() - INTERVAL '5 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222213'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 132, 84, 'mmHg', 'Morning', NOW() - INTERVAL '6 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222214'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 137, 89, 'mmHg', 'Evening', NOW() - INTERVAL '6 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222215'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 126, 78, 'mmHg', 'Morning', NOW() - INTERVAL '7 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222216'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 134, 86, 'mmHg', 'Evening', NOW() - INTERVAL '7 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222217'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 129, 82, 'mmHg', 'Morning', NOW() - INTERVAL '8 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222218'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 136, 88, 'mmHg', 'Evening', NOW() - INTERVAL '8 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222219'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 131, 83, 'mmHg', 'Morning', NOW() - INTERVAL '9 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222220'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 140, 92, 'mmHg', 'Evening', NOW() - INTERVAL '9 days' + INTERVAL '18 hours', TRUE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222221'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 128, 80, 'mmHg', 'Morning', NOW() - INTERVAL '10 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222222'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 132, 85, 'mmHg', 'Evening', NOW() - INTERVAL '10 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222223'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 130, 81, 'mmHg', 'Morning', NOW() - INTERVAL '11 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222224'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 136, 87, 'mmHg', 'Evening', NOW() - INTERVAL '11 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222225'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 127, 79, 'mmHg', 'Morning', NOW() - INTERVAL '12 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222226'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 133, 84, 'mmHg', 'Evening', NOW() - INTERVAL '12 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222227'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 134, 85, 'mmHg', 'Morning', NOW() - INTERVAL '13 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222228'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 139, 90, 'mmHg', 'Evening', NOW() - INTERVAL '13 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222229'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 126, 77, 'mmHg', 'Morning', NOW() - INTERVAL '14 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222230'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 135, 87, 'mmHg', 'Evening', NOW() - INTERVAL '14 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222231'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 129, 81, 'mmHg', 'Morning', NOW() - INTERVAL '15 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222232'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 137, 89, 'mmHg', 'Evening', NOW() - INTERVAL '15 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222233'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 132, 83, 'mmHg', 'Morning', NOW() - INTERVAL '16 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222234'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 141, 93, 'mmHg', 'Evening', NOW() - INTERVAL '16 days' + INTERVAL '18 hours', TRUE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222235'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 128, 80, 'mmHg', 'Morning', NOW() - INTERVAL '17 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222236'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 131, 83, 'mmHg', 'Evening', NOW() - INTERVAL '17 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222237'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 130, 82, 'mmHg', 'Morning', NOW() - INTERVAL '18 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222238'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 138, 88, 'mmHg', 'Evening', NOW() - INTERVAL '18 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222239'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 127, 79, 'mmHg', 'Morning', NOW() - INTERVAL '19 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222240'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 134, 86, 'mmHg', 'Evening', NOW() - INTERVAL '19 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222241'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 133, 84, 'mmHg', 'Morning', NOW() - INTERVAL '20 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222242'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 140, 91, 'mmHg', 'Evening', NOW() - INTERVAL '20 days' + INTERVAL '18 hours', TRUE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222243'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 129, 81, 'mmHg', 'Morning', NOW() - INTERVAL '21 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222244'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 135, 86, 'mmHg', 'Evening', NOW() - INTERVAL '21 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222245'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 128, 80, 'mmHg', 'Morning', NOW() - INTERVAL '22 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222246'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 136, 87, 'mmHg', 'Evening', NOW() - INTERVAL '22 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222247'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 131, 83, 'mmHg', 'Morning', NOW() - INTERVAL '23 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222248'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 139, 89, 'mmHg', 'Evening', NOW() - INTERVAL '23 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222249'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 126, 78, 'mmHg', 'Morning', NOW() - INTERVAL '24 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222250'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 132, 84, 'mmHg', 'Evening', NOW() - INTERVAL '24 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222251'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 130, 82, 'mmHg', 'Morning', NOW() - INTERVAL '25 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222252'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 137, 88, 'mmHg', 'Evening', NOW() - INTERVAL '25 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222253'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 129, 81, 'mmHg', 'Morning', NOW() - INTERVAL '26 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222254'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 134, 85, 'mmHg', 'Evening', NOW() - INTERVAL '26 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222255'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 132, 84, 'mmHg', 'Morning', NOW() - INTERVAL '27 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222256'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 138, 90, 'mmHg', 'Evening', NOW() - INTERVAL '27 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222257'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 127, 79, 'mmHg', 'Morning', NOW() - INTERVAL '28 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222258'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 133, 85, 'mmHg', 'Evening', NOW() - INTERVAL '28 days' + INTERVAL '18 hours', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222259'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 131, 82, 'mmHg', 'Morning', NOW() - INTERVAL '29 days', FALSE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222260'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'BLOOD_PRESSURE', 136, 87, 'mmHg', 'Evening', NOW() - INTERVAL '29 days' + INTERVAL '18 hours', FALSE, NOW(), NOW());

-- ============================================================================= 
-- HEART RATE (bpm) - 2 readings per day for 30 days = 60 readings
-- ============================================================================= 

INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at) VALUES
-- Days 1-30
('33333333-3333-3333-3333-333333333301'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 70, 'bpm', 'Resting', NOW() - INTERVAL '0 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333302'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 82, 'bpm', 'After activity', NOW() - INTERVAL '0 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333303'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 72, 'bpm', 'Resting', NOW() - INTERVAL '1 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333304'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 85, 'bpm', 'After activity', NOW() - INTERVAL '1 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333305'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 68, 'bpm', 'Resting', NOW() - INTERVAL '2 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333306'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 88, 'bpm', 'After activity', NOW() - INTERVAL '2 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333307'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 75, 'bpm', 'Resting', NOW() - INTERVAL '3 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333308'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 98, 'bpm', 'After activity', NOW() - INTERVAL '3 days' + INTERVAL '12 hours', TRUE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333309'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 71, 'bpm', 'Resting', NOW() - INTERVAL '4 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333310'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 79, 'bpm', 'After activity', NOW() - INTERVAL '4 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333311'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 69, 'bpm', 'Resting', NOW() - INTERVAL '5 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333312'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 81, 'bpm', 'After activity', NOW() - INTERVAL '5 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333313'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 73, 'bpm', 'Resting', NOW() - INTERVAL '6 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333314'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 86, 'bpm', 'After activity', NOW() - INTERVAL '6 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333315'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 70, 'bpm', 'Resting', NOW() - INTERVAL '7 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333316'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 83, 'bpm', 'After activity', NOW() - INTERVAL '7 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333317'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 72, 'bpm', 'Resting', NOW() - INTERVAL '8 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333318'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 87, 'bpm', 'After activity', NOW() - INTERVAL '8 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333319'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 71, 'bpm', 'Resting', NOW() - INTERVAL '9 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333320'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 96, 'bpm', 'After activity', NOW() - INTERVAL '9 days' + INTERVAL '12 hours', TRUE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333321'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 70, 'bpm', 'Resting', NOW() - INTERVAL '10 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333322'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 80, 'bpm', 'After activity', NOW() - INTERVAL '10 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333323'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 73, 'bpm', 'Resting', NOW() - INTERVAL '11 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333324'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 84, 'bpm', 'After activity', NOW() - INTERVAL '11 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333325'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 69, 'bpm', 'Resting', NOW() - INTERVAL '12 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333326'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 82, 'bpm', 'After activity', NOW() - INTERVAL '12 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333327'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 74, 'bpm', 'Resting', NOW() - INTERVAL '13 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333328'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 89, 'bpm', 'After activity', NOW() - INTERVAL '13 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333329'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 71, 'bpm', 'Resting', NOW() - INTERVAL '14 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333330'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 81, 'bpm', 'After activity', NOW() - INTERVAL '14 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333331'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 68, 'bpm', 'Resting', NOW() - INTERVAL '15 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333332'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 85, 'bpm', 'After activity', NOW() - INTERVAL '15 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333333'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 72, 'bpm', 'Resting', NOW() - INTERVAL '16 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333334'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 99, 'bpm', 'After activity', NOW() - INTERVAL '16 days' + INTERVAL '12 hours', TRUE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333335'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 70, 'bpm', 'Resting', NOW() - INTERVAL '17 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333336'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 78, 'bpm', 'After activity', NOW() - INTERVAL '17 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333337'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 73, 'bpm', 'Resting', NOW() - INTERVAL '18 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333338'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 84, 'bpm', 'After activity', NOW() - INTERVAL '18 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333339'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 71, 'bpm', 'Resting', NOW() - INTERVAL '19 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333340'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 83, 'bpm', 'After activity', NOW() - INTERVAL '19 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333341'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 69, 'bpm', 'Resting', NOW() - INTERVAL '20 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333342'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 94, 'bpm', 'After activity', NOW() - INTERVAL '20 days' + INTERVAL '12 hours', TRUE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333343'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 72, 'bpm', 'Resting', NOW() - INTERVAL '21 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333344'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 79, 'bpm', 'After activity', NOW() - INTERVAL '21 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333345'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 70, 'bpm', 'Resting', NOW() - INTERVAL '22 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333346'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 82, 'bpm', 'After activity', NOW() - INTERVAL '22 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333347'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 74, 'bpm', 'Resting', NOW() - INTERVAL '23 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333348'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 88, 'bpm', 'After activity', NOW() - INTERVAL '23 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333349'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 71, 'bpm', 'Resting', NOW() - INTERVAL '24 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333350'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 80, 'bpm', 'After activity', NOW() - INTERVAL '24 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333351'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 68, 'bpm', 'Resting', NOW() - INTERVAL '25 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333352'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 86, 'bpm', 'After activity', NOW() - INTERVAL '25 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333353'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 73, 'bpm', 'Resting', NOW() - INTERVAL '26 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333354'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 85, 'bpm', 'After activity', NOW() - INTERVAL '26 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333355'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 70, 'bpm', 'Resting', NOW() - INTERVAL '27 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333356'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 81, 'bpm', 'After activity', NOW() - INTERVAL '27 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333357'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 72, 'bpm', 'Resting', NOW() - INTERVAL '28 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333358'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 87, 'bpm', 'After activity', NOW() - INTERVAL '28 days' + INTERVAL '12 hours', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333359'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 71, 'bpm', 'Resting', NOW() - INTERVAL '29 days', FALSE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333360'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'HEART_RATE', 84, 'bpm', 'After activity', NOW() - INTERVAL '29 days' + INTERVAL '12 hours', FALSE, NOW(), NOW());

-- ============================================================================= 
-- OXYGEN SATURATION (%) - 1-2 readings per day for 30 days = 40 readings
-- ============================================================================= 

INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at) VALUES
('o2-001'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '0 days', FALSE, NOW(), NOW()),
('o2-002'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 96, '%', 'At rest', NOW() - INTERVAL '1 days', FALSE, NOW(), NOW()),
('o2-003'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 98, '%', 'At rest', NOW() - INTERVAL '2 days', FALSE, NOW(), NOW()),
('o2-004'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 93, '%', 'After activity', NOW() - INTERVAL '3 days', TRUE, NOW(), NOW()),
('o2-005'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '4 days', FALSE, NOW(), NOW()),
('o2-006'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 96, '%', 'At rest', NOW() - INTERVAL '5 days', FALSE, NOW(), NOW()),
('o2-007'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 98, '%', 'At rest', NOW() - INTERVAL '6 days', FALSE, NOW(), NOW()),
('o2-008'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '7 days', FALSE, NOW(), NOW()),
('o2-009'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 95, '%', 'At rest', NOW() - INTERVAL '8 days', FALSE, NOW(), NOW()),
('o2-010'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '9 days', FALSE, NOW(), NOW()),
('o2-011'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 96, '%', 'At rest', NOW() - INTERVAL '10 days', FALSE, NOW(), NOW()),
('o2-012'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 98, '%', 'At rest', NOW() - INTERVAL '11 days', FALSE, NOW(), NOW()),
('o2-013'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '12 days', FALSE, NOW(), NOW()),
('o2-014'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 96, '%', 'At rest', NOW() - INTERVAL '13 days', FALSE, NOW(), NOW()),
('o2-015'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 92, '%', 'After activity', NOW() - INTERVAL '14 days', TRUE, NOW(), NOW()),
('o2-016'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '15 days', FALSE, NOW(), NOW()),
('o2-017'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 98, '%', 'At rest', NOW() - INTERVAL '16 days', FALSE, NOW(), NOW()),
('o2-018'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 96, '%', 'At rest', NOW() - INTERVAL '17 days', FALSE, NOW(), NOW()),
('o2-019'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '18 days', FALSE, NOW(), NOW()),
('o2-020'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 95, '%', 'At rest', NOW() - INTERVAL '19 days', FALSE, NOW(), NOW()),
('o2-021'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 98, '%', 'At rest', NOW() - INTERVAL '20 days', FALSE, NOW(), NOW()),
('o2-022'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 94, '%', 'After activity', NOW() - INTERVAL '21 days', TRUE, NOW(), NOW()),
('o2-023'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '22 days', FALSE, NOW(), NOW()),
('o2-024'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 96, '%', 'At rest', NOW() - INTERVAL '23 days', FALSE, NOW(), NOW()),
('o2-025'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 98, '%', 'At rest', NOW() - INTERVAL '24 days', FALSE, NOW(), NOW()),
('o2-026'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '25 days', FALSE, NOW(), NOW()),
('o2-027'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 96, '%', 'At rest', NOW() - INTERVAL '26 days', FALSE, NOW(), NOW()),
('o2-028'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '27 days', FALSE, NOW(), NOW()),
('o2-029'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 98, '%', 'At rest', NOW() - INTERVAL '28 days', FALSE, NOW(), NOW()),
('o2-030'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 96, '%', 'At rest', NOW() - INTERVAL '29 days', FALSE, NOW(), NOW());

-- ============================================================================= 
-- TEMPERATURE (°C) - 1 reading per day for 30 days = 30 readings
-- ============================================================================= 

INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at) VALUES
('temp-001'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.1, '°C', 'Oral', NOW() - INTERVAL '0 days', FALSE, NOW(), NOW()),
('temp-002'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.2, '°C', 'Oral', NOW() - INTERVAL '1 days', FALSE, NOW(), NOW()),
('temp-003'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 36.9, '°C', 'Oral', NOW() - INTERVAL '2 days', FALSE, NOW(), NOW()),
('temp-004'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 38.3, '°C', 'Oral', NOW() - INTERVAL '3 days', TRUE, NOW(), NOW()),
('temp-005'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.0, '°C', 'Oral', NOW() - INTERVAL '4 days', FALSE, NOW(), NOW()),
('temp-006'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.3, '°C', 'Oral', NOW() - INTERVAL '5 days', FALSE, NOW(), NOW()),
('temp-007'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.1, '°C', 'Oral', NOW() - INTERVAL '6 days', FALSE, NOW(), NOW()),
('temp-008'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.0, '°C', 'Oral', NOW() - INTERVAL '7 days', FALSE, NOW(), NOW()),
('temp-009'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.2, '°C', 'Oral', NOW() - INTERVAL '8 days', FALSE, NOW(), NOW()),
('temp-010'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 36.8, '°C', 'Oral', NOW() - INTERVAL '9 days', FALSE, NOW(), NOW()),
('temp-011'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.1, '°C', 'Oral', NOW() - INTERVAL '10 days', FALSE, NOW(), NOW()),
('temp-012'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.4, '°C', 'Oral', NOW() - INTERVAL '11 days', FALSE, NOW(), NOW()),
('temp-013'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.0, '°C', 'Oral', NOW() - INTERVAL '12 days', FALSE, NOW(), NOW()),
('temp-014'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.2, '°C', 'Oral', NOW() - INTERVAL '13 days', FALSE, NOW(), NOW()),
('temp-015'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 38.6, '°C', 'Oral', NOW() - INTERVAL '14 days', TRUE, NOW(), NOW()),
('temp-016'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.1, '°C', 'Oral', NOW() - INTERVAL '15 days', FALSE, NOW(), NOW()),
('temp-017'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.0, '°C', 'Oral', NOW() - INTERVAL '16 days', FALSE, NOW(), NOW()),
('temp-018'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.3, '°C', 'Oral', NOW() - INTERVAL '17 days', FALSE, NOW(), NOW()),
('temp-019'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.1, '°C', 'Oral', NOW() - INTERVAL '18 days', FALSE, NOW(), NOW()),
('temp-020'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 36.9, '°C', 'Oral', NOW() - INTERVAL '19 days', FALSE, NOW(), NOW()),
('temp-021'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.2, '°C', 'Oral', NOW() - INTERVAL '20 days', FALSE, NOW(), NOW()),
('temp-022'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 38.1, '°C', 'Oral', NOW() - INTERVAL '21 days', TRUE, NOW(), NOW()),
('temp-023'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.0, '°C', 'Oral', NOW() - INTERVAL '22 days', FALSE, NOW(), NOW()),
('temp-024'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.1, '°C', 'Oral', NOW() - INTERVAL '23 days', FALSE, NOW(), NOW()),
('temp-025'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.3, '°C', 'Oral', NOW() - INTERVAL '24 days', FALSE, NOW(), NOW()),
('temp-026'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.0, '°C', 'Oral', NOW() - INTERVAL '25 days', FALSE, NOW(), NOW()),
('temp-027'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.2, '°C', 'Oral', NOW() - INTERVAL '26 days', FALSE, NOW(), NOW()),
('temp-028'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 36.9, '°C', 'Oral', NOW() - INTERVAL '27 days', FALSE, NOW(), NOW()),
('temp-029'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.1, '°C', 'Oral', NOW() - INTERVAL '28 days', FALSE, NOW(), NOW()),
('temp-030'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.4, '°C', 'Oral', NOW() - INTERVAL '29 days', FALSE, NOW(), NOW());

COMMIT;

-- Summary: 
-- Total Records: 290
-- - Blood Sugar: 60 readings (30 days, 2 per day)
-- - Blood Pressure: 60 readings (30 days, 2 per day)
-- - Heart Rate: 60 readings (30 days, 2 per day)
-- - Oxygen Saturation: 30 readings (30 days, 1 per day)
-- - Temperature: 30 readings (30 days, 1 per day)
-- Abnormal readings marked: ~20-25 scattered across all vital types
