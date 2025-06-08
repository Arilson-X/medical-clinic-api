-- Set timezone
SET timezone = 'UTC';

-- Create extensions if needed (on current DB, usually 'postgres')
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create databases
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'medical_clinic'
    ) THEN
        CREATE DATABASE medical_clinic;
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'medical_clinic_dev'
    ) THEN
        CREATE DATABASE medical_clinic_dev;
    END IF;
END
$$;

-- Create user
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_roles WHERE rolname = 'u_teste_api'
    ) THEN
        CREATE USER u_teste_api WITH PASSWORD 'connect123!';
    END IF;
END
$$;

-- Grant privileges in each DB
-- Connect into each DB to run these commands
\connect medical_clinic;

GRANT CONNECT ON DATABASE medical_clinic TO u_teste_api;
GRANT USAGE ON SCHEMA public TO u_teste_api;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO u_teste_api;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO u_teste_api;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO u_teste_api;

-- healthcheck function
CREATE OR REPLACE FUNCTION health_check()
RETURNS TEXT AS $$
BEGIN
    RETURN 'Database is healthy';
END;
$$ LANGUAGE plpgsql;

-- Repita para o segundo banco
\connect medical_clinic_dev;

GRANT CONNECT ON DATABASE medical_clinic_dev TO u_teste_api;
GRANT USAGE ON SCHEMA public TO u_teste_api;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO u_teste_api;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO u_teste_api;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO u_teste_api;

-- healthcheck function
CREATE OR REPLACE FUNCTION health_check()
RETURNS TEXT AS $$
BEGIN
    RETURN 'Database is healthy';
END;
$$ LANGUAGE plpgsql;
