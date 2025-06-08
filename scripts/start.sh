#!/bin/bash

# Startup script for the API container
set -e

echo "Starting Medical Clinic API..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USERNAME; do
    echo "Database is not ready yet. Waiting..."
    sleep 2
done

echo "Database is ready!"

# Run database migrations if needed
# npm run typeorm migration:run

# Start the application
echo "Starting the API server..."
exec "$@"
