# Medical Clinic API - Docker Management

.PHONY: help build up down logs clean dev dev-down dev-logs rebuild

# Default target
help:
	@echo "Medical Clinic API - Docker Commands"
	@echo ""
	@echo "Production Commands:"
	@echo "  make build     - Build Docker images"
	@echo "  make up        - Start production containers"
	@echo "  make down      - Stop production containers"
	@echo "  make logs      - View production logs"
	@echo "  make rebuild   - Rebuild and restart containers"
	@echo ""
	@echo "Development Commands:"
	@echo "  make dev       - Start development containers"
	@echo "  make dev-down  - Stop development containers"
	@echo "  make dev-logs  - View development logs"
	@echo ""
	@echo "Utility Commands:"
	@echo "  make clean     - Clean up containers and volumes"
	@echo "  make status    - Show container status"
	@echo "  make shell-api - Access API container shell"
	@echo "  make shell-db  - Access database container shell"

# Production commands
build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# Development commands
dev:
	docker-compose -f docker-compose.dev.yml up -d

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Utility commands
clean:
	docker-compose down -v --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	docker system prune -f

status:
	docker-compose ps

shell-api:
	docker exec -it medical-clinic-api /bin/sh

shell-api-dev:
	docker exec -it medical-clinic-api-dev /bin/sh

shell-db:
	docker exec -it medical-clinic-postgres psql -U postgres -d medical_clinic

shell-db-dev:
	docker exec -it medical-clinic-postgres-dev psql -U postgres -d medical_clinic_dev

# Database commands
db-backup:
	docker exec medical-clinic-postgres pg_dump -U postgres medical_clinic > backup_$(shell date +%Y%m%d_%H%M%S).sql

db-restore:
	@echo "Usage: make db-restore FILE=backup_file.sql"
	@if [ -z "$(FILE)" ]; then echo "Please specify FILE=backup_file.sql"; exit 1; fi
	docker exec -i medical-clinic-postgres psql -U postgres medical_clinic < $(FILE)
