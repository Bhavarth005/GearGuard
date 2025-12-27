CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- DEPARTMENTS (CRUD)
-- =====================================================

CREATE OR REPLACE FUNCTION sp_create_department(
    p_department_name VARCHAR,
    p_description TEXT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO departments (department_name, description)
    VALUES (p_department_name, p_description);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_update_department(
    p_department_id INT,
    p_department_name VARCHAR,
    p_description TEXT,
    p_is_active BOOLEAN
) RETURNS VOID AS $$
BEGIN
    UPDATE departments
    SET department_name = p_department_name,
        description = p_description,
        is_active = p_is_active
    WHERE department_id = p_department_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_get_departments(
    p_department_id INT DEFAULT NULL
) RETURNS SETOF departments AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM departments
    WHERE p_department_id IS NULL
       OR department_id = p_department_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- USERS (CRUD)
-- =====================================================

CREATE OR REPLACE FUNCTION sp_create_user(
    p_full_name VARCHAR,
    p_email VARCHAR,
    p_phone VARCHAR,
    p_password TEXT,
    p_role VARCHAR,
    p_department_id INT,
    p_avatar_url TEXT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO users (
        full_name, email, phone, password_hash,
        role, department_id, avatar_url
    )
    VALUES (
        p_full_name,
        p_email,
        p_phone,
        crypt(p_password, gen_salt('bf')),
        p_role,
        p_department_id,
        p_avatar_url
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_update_user(
    p_user_id INT,
    p_full_name VARCHAR,
    p_email VARCHAR,
    p_phone VARCHAR,
    p_role VARCHAR,
    p_department_id INT,
    p_is_active BOOLEAN
) RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET full_name = p_full_name,
        email = p_email,
        phone = p_phone,
        role = p_role,
        department_id = p_department_id,
        is_active = p_is_active
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_get_users(
    p_user_id INT DEFAULT NULL
) RETURNS SETOF users AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM users
    WHERE p_user_id IS NULL
       OR user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MAINTENANCE TEAMS (CRUD)
-- =====================================================

CREATE OR REPLACE FUNCTION sp_create_team(
    p_team_name VARCHAR,
    p_description TEXT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO maintenance_teams (team_name, description)
    VALUES (p_team_name, p_description);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_get_teams(
    p_team_id INT DEFAULT NULL
) RETURNS SETOF maintenance_teams AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM maintenance_teams
    WHERE p_team_id IS NULL
       OR team_id = p_team_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- EQUIPMENT (CRUD)
-- =====================================================

CREATE OR REPLACE FUNCTION sp_create_equipment(
    p_equipment_name VARCHAR,
    p_serial_number VARCHAR,
    p_category_id INT,
    p_department_id INT,
    p_assigned_user_id INT,
    p_maintenance_team_id INT,
    p_default_technician_id INT,
    p_purchase_date DATE,
    p_warranty_end_date DATE,
    p_location VARCHAR
) RETURNS VOID AS $$
BEGIN
    INSERT INTO equipment (
        equipment_name, serial_number, category_id,
        department_id, assigned_user_id,
        maintenance_team_id, default_technician_id,
        purchase_date, warranty_end_date, location
    )
    VALUES (
        p_equipment_name, p_serial_number, p_category_id,
        p_department_id, p_assigned_user_id,
        p_maintenance_team_id, p_default_technician_id,
        p_purchase_date, p_warranty_end_date, p_location
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_update_equipment(
    p_equipment_id INT,
    p_equipment_name VARCHAR,
    p_category_id INT,
    p_department_id INT,
    p_assigned_user_id INT,
    p_maintenance_team_id INT,
    p_default_technician_id INT,
    p_warranty_end_date DATE,
    p_location VARCHAR
) RETURNS VOID AS $$
BEGIN
    UPDATE equipment
    SET equipment_name = p_equipment_name,
        category_id = p_category_id,
        department_id = p_department_id,
        assigned_user_id = p_assigned_user_id,
        maintenance_team_id = p_maintenance_team_id,
        default_technician_id = p_default_technician_id,
        warranty_end_date = p_warranty_end_date,
        location = p_location
    WHERE equipment_id = p_equipment_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_get_equipment(
    p_equipment_id INT DEFAULT NULL
) RETURNS SETOF equipment AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM equipment
    WHERE p_equipment_id IS NULL
       OR equipment_id = p_equipment_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MAINTENANCE REQUESTS (CRUD)
-- =====================================================

CREATE OR REPLACE FUNCTION sp_create_request(
    p_request_number VARCHAR,
    p_subject TEXT,
    p_description TEXT,
    p_equipment_id INT,
    p_request_type_id INT,
    p_requested_by INT,
    p_scheduled_date DATE
) RETURNS VOID AS $$
DECLARE
    v_category_id INT;
    v_team_id INT;
BEGIN
    SELECT category_id, maintenance_team_id
    INTO v_category_id, v_team_id
    FROM equipment
    WHERE equipment_id = p_equipment_id;

    INSERT INTO maintenance_requests (
        request_number, subject, description,
        equipment_id, category_id, team_id,
        request_type_id, status_id,
        requested_by, scheduled_date
    )
    VALUES (
        p_request_number, p_subject, p_description,
        p_equipment_id, v_category_id, v_team_id,
        p_request_type_id, 1,
        p_requested_by, p_scheduled_date
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_update_request_status(
    p_request_id INT,
    p_new_status_id INT, 
    p_changed_by INT,
    p_duration_hours NUMERIC DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    v_old_status INT;
    v_equipment_id INT;
BEGIN
    SELECT status_id, equipment_id INTO v_old_status, v_equipment_id
    FROM maintenance_requests
    WHERE request_id = p_request_id;

    IF p_new_status_id = 4 THEN
        UPDATE equipment SET is_scrapped = TRUE WHERE equipment_id = v_equipment_id;
    END IF;

    IF p_new_status_id = 3 THEN
        UPDATE maintenance_requests 
        SET status_id = p_new_status_id,
            completed_at = CURRENT_TIMESTAMP,
            duration_hours = p_duration_hours
        WHERE request_id = p_request_id;
    ELSE
        UPDATE maintenance_requests
        SET status_id = p_new_status_id
        WHERE request_id = p_request_id;
    END IF;

    INSERT INTO maintenance_request_history (request_id, old_status_id, new_status_id, changed_by, notes)
    VALUES (p_request_id, v_old_status, p_new_status_id, p_changed_by, p_notes);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sp_get_requests(
    p_request_id INT DEFAULT NULL
) RETURNS SETOF maintenance_requests AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM maintenance_requests
    WHERE p_request_id IS NULL
       OR request_id = p_request_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- END OF SCRIPT
-- =====================================================
