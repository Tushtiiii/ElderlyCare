-- =============================================================================
-- Seed 1-Month Vitals for Elder Demo
-- Dynamically looks up elder UUID by email — no hardcoded IDs
-- Run: $env:PGPASSWORD='root@123'; psql -U postgres -d elderly_care_db -f "seed-1month-vitals.sql"
-- =============================================================================

BEGIN;

DO $$
DECLARE
    v_elder_id UUID;
BEGIN
    -- Look up the elder by email
    SELECT id INTO v_elder_id
    FROM users
    WHERE email = 'elder.demo@elderlycare.app'
    LIMIT 1;

    IF v_elder_id IS NULL THEN
        RAISE EXCEPTION 'Elder demo user not found. Make sure the backend has started at least once to seed demo users.';
    END IF;

    RAISE NOTICE 'Seeding vitals for elder ID: %', v_elder_id;

    -- Clear existing vitals to avoid duplicates
    DELETE FROM vital_records WHERE elder_id = v_elder_id;
    RAISE NOTICE 'Cleared existing vitals for elder.';

    -- ─── BLOOD SUGAR (mg/dL) — 12 readings over 30 days ─────────────────────
    INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
    VALUES
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 110, 'mg/dL', 'Fasting',         NOW() - INTERVAL '30 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 135, 'mg/dL', 'Post-meal',       NOW() - INTERVAL '27 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 98,  'mg/dL', 'Fasting',         NOW() - INTERVAL '24 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 155, 'mg/dL', 'Post-meal',       NOW() - INTERVAL '21 days', TRUE,  NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 118, 'mg/dL', 'Fasting',         NOW() - INTERVAL '18 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 142, 'mg/dL', 'Post-meal',       NOW() - INTERVAL '15 days', TRUE,  NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 105, 'mg/dL', 'Fasting',         NOW() - INTERVAL '12 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 128, 'mg/dL', 'Post-meal',       NOW() - INTERVAL '9 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 115, 'mg/dL', 'Fasting',         NOW() - INTERVAL '6 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 138, 'mg/dL', 'After breakfast', NOW() - INTERVAL '3 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 122, 'mg/dL', 'Fasting',         NOW() - INTERVAL '1 day',   FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_SUGAR', 130, 'mg/dL', 'Post-meal',       NOW() - INTERVAL '2 hours', FALSE, NOW(), NOW());

    -- ─── BLOOD PRESSURE (mmHg) — 12 readings over 30 days ───────────────────
    INSERT INTO vital_records (id, elder_id, vital_type, value, secondary_value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
    VALUES
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 128, 82, 'mmHg', 'Morning reading', NOW() - INTERVAL '29 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 135, 88, 'mmHg', 'Morning',         NOW() - INTERVAL '26 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 130, 85, 'mmHg', 'At rest',         NOW() - INTERVAL '23 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 145, 95, 'mmHg', 'After activity',  NOW() - INTERVAL '20 days', TRUE,  NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 132, 83, 'mmHg', 'At rest',         NOW() - INTERVAL '17 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 138, 87, 'mmHg', 'Morning',         NOW() - INTERVAL '14 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 129, 81, 'mmHg', 'At rest',         NOW() - INTERVAL '11 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 136, 86, 'mmHg', 'Morning',         NOW() - INTERVAL '8 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 127, 80, 'mmHg', 'Evening',         NOW() - INTERVAL '5 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 133, 84, 'mmHg', 'Morning',         NOW() - INTERVAL '2 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 131, 83, 'mmHg', 'At rest',         NOW() - INTERVAL '1 day',   FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'BLOOD_PRESSURE', 128, 82, 'mmHg', 'Morning reading', NOW() - INTERVAL '1 hour',  FALSE, NOW(), NOW());

    -- ─── HEART RATE (bpm) — 12 readings over 30 days ────────────────────────
    INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
    VALUES
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 72,  'bpm', 'Resting',        NOW() - INTERVAL '28 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 85,  'bpm', 'After walk',     NOW() - INTERVAL '25 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 68,  'bpm', 'Resting',        NOW() - INTERVAL '22 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 102, 'bpm', 'After activity', NOW() - INTERVAL '19 days', TRUE,  NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 75,  'bpm', 'Resting',        NOW() - INTERVAL '16 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 82,  'bpm', 'After walk',     NOW() - INTERVAL '13 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 70,  'bpm', 'Resting',        NOW() - INTERVAL '10 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 79,  'bpm', 'After walk',     NOW() - INTERVAL '7 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 74,  'bpm', 'Resting',        NOW() - INTERVAL '4 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 80,  'bpm', 'After walk',     NOW() - INTERVAL '2 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 71,  'bpm', 'Resting',        NOW() - INTERVAL '1 day',   FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'HEART_RATE', 76,  'bpm', 'Post-walk',      NOW() - INTERVAL '3 hours', FALSE, NOW(), NOW());

    -- ─── OXYGEN SATURATION (%) — 12 readings over 30 days ───────────────────
    INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
    VALUES
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 97, '%', 'At rest',        NOW() - INTERVAL '30 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 96, '%', 'At rest',        NOW() - INTERVAL '27 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 98, '%', 'At rest',        NOW() - INTERVAL '24 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 93, '%', 'After activity', NOW() - INTERVAL '21 days', TRUE,  NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 97, '%', 'At rest',        NOW() - INTERVAL '18 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 96, '%', 'At rest',        NOW() - INTERVAL '15 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 98, '%', 'At rest',        NOW() - INTERVAL '12 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 97, '%', 'At rest',        NOW() - INTERVAL '9 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 96, '%', 'At rest',        NOW() - INTERVAL '6 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 98, '%', 'At rest',        NOW() - INTERVAL '3 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 97, '%', 'At rest',        NOW() - INTERVAL '1 day',   FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'OXYGEN_SATURATION', 96, '%', 'Resting',        NOW() - INTERVAL '6 hours', FALSE, NOW(), NOW());

    -- ─── TEMPERATURE (°C) — 12 readings over 30 days ─────────────────────────
    INSERT INTO vital_records (id, elder_id, vital_type, value, unit, notes, recorded_at, is_abnormal, created_at, updated_at)
    VALUES
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 37.1, '°C', 'Oral',          NOW() - INTERVAL '31 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 37.5, '°C', 'Oral',          NOW() - INTERVAL '28 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 36.8, '°C', 'Oral',          NOW() - INTERVAL '25 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 38.5, '°C', 'Oral',          NOW() - INTERVAL '22 days', TRUE,  NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 37.2, '°C', 'Oral',          NOW() - INTERVAL '19 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 37.0, '°C', 'Oral',          NOW() - INTERVAL '16 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 37.3, '°C', 'Oral',          NOW() - INTERVAL '13 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 37.1, '°C', 'Oral',          NOW() - INTERVAL '10 days', FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 36.9, '°C', 'Oral',          NOW() - INTERVAL '7 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 37.4, '°C', 'Oral',          NOW() - INTERVAL '4 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 37.0, '°C', 'Oral',          NOW() - INTERVAL '2 days',  FALSE, NOW(), NOW()),
        (gen_random_uuid(), v_elder_id, 'TEMPERATURE', 37.1, '°C', 'Evening check', NOW() - INTERVAL '2 hours', FALSE, NOW(), NOW());

    RAISE NOTICE 'SUCCESS: Seeded 60 vital records (12 per type x 5 types) for elder %', v_elder_id;
END $$;

COMMIT;
