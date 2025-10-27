
.PHONY: help setup dev-up dev-down prod-up prod-down prod-rebuild logs logs-dev logs-prod migrate clean build

help:
	@echo "Available commands:"
	@echo "  make setup          - Run interactive setup script"
	@echo "  make dev-up         - Start PostgreSQL for development"
	@echo "  make dev-down       - Stop development containers"
	@echo "  make prod-up        - Start production containers"
	@echo "  make prod-down      - Stop production containers"
	@echo "  make prod-rebuild   - Rebuild and start production"
	@echo "  make logs           - View all logs"
	@echo "  make logs-dev       - View development PostgreSQL logs"
	@echo "  make logs-prod      - View production logs"
	@echo "  make migrate        - Run database migrations"
	@echo "  make clean          - Remove all containers and volumes"
	@echo "  make build          - Build production image"

setup:
	@bash setup.sh

dev-up:
	@echo "Starting PostgreSQL for development..."
	@docker compose up -d
	@echo "PostgreSQL is ready at localhost:5432"

dev-down:
	@docker compose down

prod-up:
	@echo "Starting production containers..."
	@docker compose -f docker-compose.prod.yml up -d
	@echo "Application is ready at http://localhost:3000"

prod-down:
	@docker compose -f docker-compose.prod.yml down

prod-rebuild:
	@echo "Rebuilding and starting production..."
	@docker compose -f docker-compose.prod.yml up --build -d

logs:
	@docker compose logs -f

logs-dev:
	@docker compose logs -f postgres

logs-prod:
	@docker compose -f docker-compose.prod.yml logs -f

migrate:
	@npx prisma migrate dev

clean:
	@echo "Removing all containers and volumes..."
	@docker compose down -v
	@docker compose -f docker-compose.prod.yml down -v
	@echo "Cleaned up!"

build:
	@docker build -t training-service:latest .
