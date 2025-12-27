CREATE TABLE departments (
    department_id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name      VARCHAR(150) NOT NULL,
    email          VARCHAR(150) UNIQUE,
    phone          VARCHAR(20),
    avatar_url     TEXT,
    role           VARCHAR(50) NOT NULL
                 CHECK (role IN ('Admin','Manager','Technician','Employee')),
    department_id  INTEGER,
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE SET NULL
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER TABLE users
ADD COLUMN password_hash TEXT;
CREATE TABLE equipment_categories (
    category_id    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name  VARCHAR(100) NOT NULL UNIQUE,
    description    TEXT
);

CREATE TABLE maintenance_teams (
    team_id      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_name    VARCHAR(100) NOT NULL UNIQUE,
    description  TEXT
);

CREATE TABLE maintenance_team_members (
    team_member_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_id        INTEGER NOT NULL,
    user_id        INTEGER NOT NULL,

    CONSTRAINT uq_team_user UNIQUE (team_id, user_id),

    FOREIGN KEY (team_id)
        REFERENCES maintenance_teams(team_id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE equipment (
    equipment_id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    equipment_name          VARCHAR(150) NOT NULL,
    serial_number           VARCHAR(100) NOT NULL UNIQUE,
    category_id             INTEGER NOT NULL,
    department_id           INTEGER,
    assigned_user_id        INTEGER,
    maintenance_team_id     INTEGER NOT NULL,
    default_technician_id   INTEGER,
    purchase_date           DATE,
    warranty_end_date       DATE,
    location                VARCHAR(150),
    is_scrapped             BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES equipment_categories(category_id),

    FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE SET NULL,

    FOREIGN KEY (assigned_user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    FOREIGN KEY (maintenance_team_id)
        REFERENCES maintenance_teams(team_id),

    FOREIGN KEY (default_technician_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

CREATE TABLE maintenance_request_types (
    request_type_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type_name       VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO maintenance_request_types (type_name)
VALUES ('Corrective'), ('Preventive');

CREATE TABLE maintenance_request_statuses (
    status_id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    sort_order  INTEGER NOT NULL
);

INSERT INTO maintenance_request_statuses (status_name, sort_order)
VALUES
('New', 1),
('In Progress', 2),
('Repaired', 3),
('Scrap', 4);

CREATE TABLE maintenance_requests (
    request_id       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    request_number   VARCHAR(50) NOT NULL UNIQUE,
    subject          TEXT NOT NULL,
    description      TEXT,

    equipment_id     INTEGER NOT NULL,
    category_id      INTEGER NOT NULL,
    team_id          INTEGER NOT NULL,

    request_type_id  INTEGER NOT NULL,
    status_id        INTEGER NOT NULL,

    requested_by     INTEGER NOT NULL,
    assigned_to      INTEGER,

    scheduled_date   DATE,
    started_at       TIMESTAMP,
    completed_at     TIMESTAMP,
    duration_hours   NUMERIC(5,2),

    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id),
    FOREIGN KEY (category_id) REFERENCES equipment_categories(category_id),
    FOREIGN KEY (team_id) REFERENCES maintenance_teams(team_id),
    FOREIGN KEY (request_type_id) REFERENCES maintenance_request_types(request_type_id),
    FOREIGN KEY (status_id) REFERENCES maintenance_request_statuses(status_id),
    FOREIGN KEY (requested_by) REFERENCES users(user_id),
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);


CREATE VIEW maintenance_requests_with_overdue AS
SELECT *,
       CASE
           WHEN scheduled_date IS NOT NULL
            AND completed_at IS NULL
            AND scheduled_date < CURRENT_DATE
           THEN TRUE
           ELSE FALSE
       END AS is_overdue
FROM maintenance_requests;



