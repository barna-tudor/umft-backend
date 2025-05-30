-- WARNING! ONLY RUN THIS SCRIPT ONCE IN PRODUCTION. IF USING ANOTHER SCHEMA THAN THE DEFAULT, REFER TO THE README.MD

BEGIN;
CREATE EXTENSION IF NOT EXISTS "pg_uuidv7";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS patient cascade;
DROP TABLE IF EXISTS ward cascade;
DROP TABLE IF EXISTS room cascade;
DROP TABLE IF EXISTS bed cascade;
DROP TABLE IF EXISTS alert cascade;
DROP TABLE IF EXISTS staff cascade;

DROP TYPE IF EXISTS alert_type;
CREATE TYPE alert_type as ENUM (
    'oxygen-saturation',
    'heart-rate',
    'blood-pressure',
    'temperature'
    );

CREATE TABLE ward
(
    ward_id   SERIAL PRIMARY KEY,
    ward_name TEXT UNIQUE NOT NULL,
    capacity  INTEGER     NOT NULL CHECK ( capacity > 0 )
);
CREATE TABLE room
(
    room_id   SERIAL PRIMARY KEY,
    room_name TEXT    NOT NULL,
    ward_id   INTEGER NOT NULL,
    capacity  INTEGER NOT NULL CHECK ( capacity > 0 ),
    CONSTRAINT fk_room_ward FOREIGN KEY (ward_id) REFERENCES ward (ward_id),
    CONSTRAINT unique_room_ward UNIQUE (ward_id, room_name)
);
CREATE TABLE bed
(
    bed_id      SERIAL PRIMARY KEY,
    bed_number  TEXT    NOT NULL, -- numerical or alphanumerical?
    ward_id     INTEGER NOT NULL,
    room_id     INTEGER NOT NULL,
    bed_type    TEXT    NOT NULL, -- E.G., orthopedic / regular
    is_occupied BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_bed_room FOREIGN KEY (room_id) REFERENCES room (room_id),
    CONSTRAINT fk_bed_ward FOREIGN KEY (ward_id) REFERENCES ward (ward_id),
    CONSTRAINT unique_bed_room UNIQUE (room_id, bed_number)
);

CREATE TABLE patient
(
    patient_id         UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    -- Personal data stored here? or elsewhere?
    -- first_name ...
    is_admitted        BOOLEAN   NULL   DEFAULT TRUE,
    admission_date     TIMESTAMP        DEFAULT now(),
    discharge_date     TIMESTAMP NULL,
    ward_id            INTEGER   NULL,
    room_id            INTEGER   NULL,
    bed_id             INTEGER   NULL,
    has_alert_history  BOOLEAN   NULL   DEFAULT FALSE,
    has_treatment_plan BOOLEAN   NULL   DEFAULT FALSE,
    is_archived        BOOLEAN   NULL   DEFAULT FALSE
);
CREATE TABLE alert
(
    alert_id     UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    patient_id   UUID       NOT NULL,
    "alert_type" alert_type NOT NULL,
    CONSTRAINT fk_alert_patient FOREIGN KEY (patient_id) REFERENCES patient (patient_id)
);

CREATE TABLE staff
(
    staff_id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_id    INTEGER NOT NULL,
    first_name TEXT    NOT NULL,
    last_name  TEXT    NOT NULL,
    CONSTRAINT fk_staff_ward FOREIGN KEY (ward_id) REFERENCES ward (ward_id)
);
COMMIT;