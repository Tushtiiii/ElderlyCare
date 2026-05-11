-- ============================================================================= 
-- Demo Vital Records Only
-- Insert vital data for the existing demo elder account
-- ============================================================================= 

BEGIN;

-- Blood Sugar readings (mg/dL) - 8 readings
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

-- Blood Pressure readings (mmHg) - 8 readings
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

-- Heart Rate readings (bpm) - 8 readings
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

-- Oxygen Saturation readings (%) - 8 readings
INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
VALUES 
    ('44444444-4444-4444-4444-444444444401'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '30 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444402'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 96, '%', 'At rest', NOW() - INTERVAL '28 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444403'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 98, '%', 'At rest', NOW() - INTERVAL '25 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444404'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 93, '%', 'After activity', NOW() - INTERVAL '22 days', TRUE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444405'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '19 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444406'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 96, '%', 'At rest', NOW() - INTERVAL '16 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444407'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 98, '%', 'At rest', NOW() - INTERVAL '13 days', FALSE, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444408'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'OXYGEN_SATURATION', 97, '%', 'At rest', NOW() - INTERVAL '10 days', FALSE, NOW(), NOW());

-- Temperature readings (°C) - 8 readings
INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
VALUES 
    ('55555555-5555-5555-5555-555555555501'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.1, '°C', 'Oral', NOW() - INTERVAL '31 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555502'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.5, '°C', 'Oral', NOW() - INTERVAL '29 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555503'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 36.8, '°C', 'Oral', NOW() - INTERVAL '26 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555504'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 38.5, '°C', 'Oral', NOW() - INTERVAL '23 days', TRUE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555505'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.2, '°C', 'Oral', NOW() - INTERVAL '20 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555506'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.0, '°C', 'Oral', NOW() - INTERVAL '17 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555507'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.3, '°C', 'Oral', NOW() - INTERVAL '14 days', FALSE, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555508'::UUID, 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'::UUID, 'TEMPERATURE', 37.1, '°C', 'Oral', NOW() - INTERVAL '11 days', FALSE, NOW(), NOW());

COMMIT;
