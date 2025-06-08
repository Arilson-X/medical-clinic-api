#!/bin/bash

# Health check script for the API container
set -e

# Check if the API is responding
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)

if [ "$response" = "200" ]; then
    echo "API is healthy"
    exit 0
else
    echo "API is unhealthy (HTTP $response)"
    exit 1
fi
