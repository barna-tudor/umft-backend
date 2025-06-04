-- WARNING! ONLY RUN THIS SCRIPT ONCE IN PRODUCTION. IF USING ANOTHER SCHEMA THAN THE DEFAULT, REFER TO THE README.MD

BEGIN;
CREATE EXTENSION IF NOT EXISTS "pg_uuidv7";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS patient CASCADE;
DROP TABLE IF EXISTS ward CASCADE;
DROP TABLE IF EXISTS room CASCADE;
DROP TABLE IF EXISTS bed CASCADE;
DROP TABLE IF EXISTS alert CASCADE;
DROP TABLE IF EXISTS staff CASCADE;

DROP TYPE IF EXISTS alert_type;
CREATE TYPE alert_type AS ENUM (
    'oxygen-saturation',
    'heart-rate',
    'blood-pressure',
    'temperature'
    );

CREATE TABLE ward
(
    ward_id   SERIAL PRIMARY KEY,
    ward_name VARCHAR(50) UNIQUE NOT NULL,
    capacity  INTEGER            NOT NULL CHECK ( capacity > 0 ),
    occupancy INTEGER            NOT NULL
);
CREATE TABLE room
(
    room_id   SERIAL PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_name VARCHAR(50) NOT NULL,
    ward_id   INTEGER     NOT NULL,
    capacity  INTEGER     NOT NULL CHECK ( capacity > 0 ),
    occupancy INTEGER     NOT NULL,
    CONSTRAINT fk_room_ward FOREIGN KEY (ward_id) REFERENCES ward (ward_id),
    CONSTRAINT unique_room_ward UNIQUE (ward_id, room_name)
);
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

CREATE TABLE alert
(
    alert_id     UUID       NOT NULL PRIMARY KEY DEFAULT uuid_generate_v7(),
    patient_id   UUID       NOT NULL,
    "alert_type" alert_type NOT NULL,
    "timestamp"  TIMESTAMP  NOT NULL             DEFAULT NOW(),
    CONSTRAINT fk_alert_patient FOREIGN KEY (patient_id) REFERENCES patient (patient_id)
);

CREATE TABLE staff
(
    staff_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_ward UUID NOT NULL,
    CONSTRAINT fk_staff_ward FOREIGN KEY (primary_ward) REFERENCES ward (ward_id)
);

CREATE TABLE alert_subscriptions
(
    staff_id UUID    NOT NULL,
    ward_id  INTEGER NOT NULL,
    PRIMARY KEY (staff_id, ward_id)
);

-- Better-Auth
CREATE TABLE "user"
(
    "id"            TEXT      NOT NULL PRIMARY KEY,
    "name"          TEXT      NOT NULL,
    "email"         TEXT      NOT NULL UNIQUE,
    "emailVerified" BOOLEAN   NOT NULL,
    "image"         TEXT,
    "createdAt"     TIMESTAMP NOT NULL,
    "updatedAt"     TIMESTAMP NOT NULL
);

CREATE TABLE "session"
(
    "id"        TEXT      NOT NULL PRIMARY KEY,
    "expiresAt" TIMESTAMP NOT NULL,
    "token"     TEXT      NOT NULL UNIQUE,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId"    TEXT      NOT NULL REFERENCES "user" ("id")
);

CREATE TABLE "account"
(
    "id"                    TEXT      NOT NULL PRIMARY KEY,
    "accountId"             TEXT      NOT NULL,
    "providerId"            TEXT      NOT NULL,
    "userId"                TEXT      NOT NULL REFERENCES "user" ("id"),
    "accessToken"           TEXT,
    "refreshToken"          TEXT,
    "idToken"               TEXT,
    "accessTokenExpiresAt"  TIMESTAMP,
    "refreshTokenExpiresAt" TIMESTAMP,
    "scope"                 TEXT,
    "password"              TEXT,
    "createdAt"             TIMESTAMP NOT NULL,
    "updatedAt"             TIMESTAMP NOT NULL
);

CREATE TABLE "verification"
(
    "id"         TEXT      NOT NULL PRIMARY KEY,
    "identifier" TEXT      NOT NULL,
    "value"      TEXT      NOT NULL,
    "expiresAt"  TIMESTAMP NOT NULL,
    "createdAt"  TIMESTAMP,
    "updatedAt"  TIMESTAMP
);



COMMIT;