-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- DEPARTMENTS
-- =====================================================
INSERT INTO departments (department_name, description, is_active)
VALUES
('Admin', 'Administration department', TRUE),
('IT', 'IT and systems department', TRUE),
('Manufacturing', 'Manufacturing floor', TRUE),
('Operations', 'Operations and logistics', TRUE)
ON CONFLICT (department_name) DO NOTHING;

-- =====================================================
-- USERS
-- =====================================================
INSERT INTO users (
    full_name, email, password_hash,
    phone, avatar_url, role,
    department_id, is_active
)
VALUES
(
    'Admin User',
    'admin@gearguard.com',
    crypt('Admin@123', gen_salt('bf')),
    '9999999999',
    NULL,
    'Admin',
    (SELECT department_id FROM departments WHERE department_name = 'Admin'),
    TRUE
),
(
    'IT Manager',
    'it.manager@gearguard.com',
    crypt('Manager@123', gen_salt('bf')),
    '8888888888',
    NULL,
    'Manager',
    (SELECT department_id FROM departments WHERE department_name = 'IT'),
    TRUE
),
(
    'Maintenance Technician',
    'tech@gearguard.com',
    crypt('Tech@123', gen_salt('bf')),
    '7777777777',
    NULL,
    'Technician',
    (SELECT department_id FROM departments WHERE department_name = 'Manufacturing'),
    TRUE
),
(
    'Operations Staff',
    'ops@gearguard.com',
    crypt('Ops@123', gen_salt('bf')),
    '6666666666',
    NULL,
    'Employee',
    (SELECT department_id FROM departments WHERE department_name = 'Operations'),
    TRUE
)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- EQUIPMENT CATEGORIES
-- =====================================================
INSERT INTO equipment_categories (category_name, description)
VALUES
('CNC Machine', 'Heavy industrial CNC machine'),
('Printer', 'Office printer'),
('Laptop', 'Employee laptop'),
('Vehicle', 'Company vehicle')
ON CONFLICT (category_name) DO NOTHING;

-- =====================================================
-- MAINTENANCE TEAMS
-- =====================================================
INSERT INTO maintenance_teams (team_name, description)
VALUES
('Mechanical Team', 'Handles mechanical issues'),
('IT Support Team', 'Handles IT related issues')
ON CONFLICT (team_name) DO NOTHING;

-- =====================================================
-- MAINTENANCE TEAM MEMBERS
-- =====================================================
INSERT INTO maintenance_team_members (team_id, user_id)
SELECT
    t.team_id,
    u.user_id
FROM maintenance_teams t
JOIN users u ON u.email = 'tech@gearguard.com'
WHERE t.team_name = 'Mechanical Team'
ON CONFLICT DO NOTHING;

INSERT INTO maintenance_team_members (team_id, user_id)
SELECT
    t.team_id,
    u.user_id
FROM maintenance_teams t
JOIN users u ON u.email = 'it.manager@gearguard.com'
WHERE t.team_name = 'IT Support Team'
ON CONFLICT DO NOTHING;

-- =====================================================
-- EQUIPMENT
-- =====================================================
INSERT INTO equipment (
    equipment_name, serial_number, category_id,
    department_id, assigned_user_id,
    maintenance_team_id, default_technician_id,
    purchase_date, warranty_end_date,
    location, is_scrapped
)
VALUES
(
    'CNC Alpha',
    'CNC-001',
    (SELECT category_id FROM equipment_categories WHERE category_name = 'CNC Machine'),
    (SELECT department_id FROM departments WHERE department_name = 'Manufacturing'),
    NULL,
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'Mechanical Team'),
    (SELECT user_id FROM users WHERE email = 'tech@gearguard.com'),
    '2022-01-01',
    '2026-01-01',
    'Manufacturing Floor',
    FALSE
),
(
    'HP Office Printer',
    'PR-001',
    (SELECT category_id FROM equipment_categories WHERE category_name = 'Printer'),
    (SELECT department_id FROM departments WHERE department_name = 'Admin'),
    (SELECT user_id FROM users WHERE email = 'ops@gearguard.com'),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'IT Support Team'),
    (SELECT user_id FROM users WHERE email = 'it.manager@gearguard.com'),
    '2023-03-10',
    '2025-03-10',
    'Admin Office',
    FALSE
)
ON CONFLICT (serial_number) DO NOTHING;

-- =====================================================
-- MAINTENANCE REQUEST TYPES
-- =====================================================
INSERT INTO maintenance_request_types (type_name)
VALUES
('Corrective'),
('Preventive')
ON CONFLICT (type_name) DO NOTHING;

-- =====================================================
-- MAINTENANCE REQUEST STATUSES
-- =====================================================
INSERT INTO maintenance_request_statuses (status_name, sort_order)
VALUES
('New', 1),
('In Progress', 2),
('Repaired', 3),
('Scrap', 4)
ON CONFLICT (status_name) DO NOTHING;

-- =====================================================
-- MAINTENANCE REQUESTS
-- =====================================================
INSERT INTO maintenance_requests (
    request_number, subject, description,
    equipment_id, category_id, team_id,
    request_type_id, status_id,
    requested_by, assigned_to,
    scheduled_date
)
VALUES
(
    'REQ-001',
    'CNC abnormal noise',
    'Strange noise during operation',
    (SELECT equipment_id FROM equipment WHERE serial_number = 'CNC-001'),
    (SELECT category_id FROM equipment_categories WHERE category_name = 'CNC Machine'),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'Mechanical Team'),
    (SELECT request_type_id FROM maintenance_request_types WHERE type_name = 'Corrective'),
    (SELECT status_id FROM maintenance_request_statuses WHERE status_name = 'New'),
    (SELECT user_id FROM users WHERE email = 'admin@gearguard.com'),
    (SELECT user_id FROM users WHERE email = 'tech@gearguard.com'),
    CURRENT_DATE + 1
)
ON CONFLICT (request_number) DO NOTHING;


