-- WARNING! ONLY RUN THIS SCRIPT ONCE IN PRODUCTION. IF USING ANOTHER SCHEMA THAN THE DEFAULT, REFER TO THE README.MD

CREATE EXTENSION IF NOT EXISTS "pg_uuidv7";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TYPE IF EXISTS alert_type CASCADE;
CREATE TYPE alert_type AS ENUM (
    'oxygen-saturation',
    'heart-rate',
    'blood-pressure',
    'temperature'
    );

DROP TABLE IF EXISTS ward CASCADE;
CREATE TABLE ward
(
    ward_id   SERIAL PRIMARY KEY,
    ward_name VARCHAR(50) UNIQUE NOT NULL,
    capacity  INTEGER            NOT NULL CHECK ( capacity > 0 ),
    occupancy INTEGER            NOT NULL
);

DROP TABLE IF EXISTS room CASCADE;
CREATE TABLE room
(
    room_id   SERIAL PRIMARY KEY,
    room_name VARCHAR(50) NOT NULL,
    ward_id   INTEGER     NOT NULL,
    capacity  INTEGER     NOT NULL CHECK ( capacity > 0 ),
    occupancy INTEGER     NOT NULL,
    CONSTRAINT fk_room_ward FOREIGN KEY (ward_id) REFERENCES ward (ward_id),
    CONSTRAINT unique_room_ward UNIQUE (ward_id, room_name)
);

DROP TABLE IF EXISTS bed CASCADE;
CREATE TABLE bed
(
    bed_id      SERIAL PRIMARY KEY,
    bed_number  VARCHAR(50) NOT NULL, -- numerical or alphanumerical?
    ward_id     INTEGER     NOT NULL,
    room_id     INTEGER     NOT NULL,
    bed_type    VARCHAR(20) NOT NULL, -- E.G., orthopedic / regular
    is_occupied BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_bed_room FOREIGN KEY (room_id) REFERENCES room (room_id),
    CONSTRAINT fk_bed_ward FOREIGN KEY (ward_id) REFERENCES ward (ward_id),
    CONSTRAINT unique_bed_room UNIQUE (room_id, bed_number)
);


DROP TABLE IF EXISTS patient CASCADE;
CREATE TABLE patient
(
    patient_id          UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    -- Personal data stored here? or elsewhere?
    -- first_name ...
    is_admitted         BOOLEAN   NULL   DEFAULT TRUE,
    admission_timestamp TIMESTAMP NULL   DEFAULT NULL,
    discharge_timestamp TIMESTAMP NULL   DEFAULT NULL,
    ward_id             INTEGER   NULL,
    room_id             INTEGER   NULL,
    bed_id              INTEGER   NULL,
    has_treatment_plan  BOOLEAN   NULL   DEFAULT FALSE,
    is_archived         BOOLEAN   NULL   DEFAULT FALSE,
    primary_physician   UUID             DEFAULT uuid_nil(),
    CONSTRAINT fk_patient_ward FOREIGN KEY (ward_id) REFERENCES ward (ward_id),
    CONSTRAINT fk_patient_room FOREIGN KEY (room_id) REFERENCES room (room_id),
    CONSTRAINT fk_patient_bed FOREIGN KEY (ward_id) REFERENCES ward (ward_id)
);

DROP TABLE IF EXISTS alert CASCADE;
CREATE TABLE alert
(
    alert_id     UUID       NOT NULL PRIMARY KEY DEFAULT uuid_generate_v7(),
    patient_id   UUID       NOT NULL,
    "alert_type" alert_type NOT NULL,
    "timestamp"  TIMESTAMP  NOT NULL             DEFAULT NOW(),
    CONSTRAINT fk_alert_patient FOREIGN KEY (patient_id) REFERENCES patient (patient_id)
);

-- Bedside computer API keys:
DROP TABLE IF EXISTS bedside_api_keys;
CREATE TABLE bedside_api_keys
(
    id           UUID      DEFAULT uuid_generate_v1(),
    ward_id      INTEGER NOT NULL,
    room_id      INTEGER NOT NULL,
    bed_id       INTEGER NOT NULL,
    client_name  TEXT    NOT NULL,
    api_key_hash TEXT    NOT NULL,
    created_at   TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (ward_id, room_id, bed_id),
    CONSTRAINT fk_apikey_ward FOREIGN KEY (ward_id) REFERENCES ward (ward_id),
    CONSTRAINT fk_apikey_room FOREIGN KEY (room_id) REFERENCES room (room_id),
    CONSTRAINT fk_apikey_bed FOREIGN KEY (bed_id) REFERENCES bed (bed_id)
);