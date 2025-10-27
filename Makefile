DEV_TARGET=dev
PROD_TARGET=prod

.PHONY: dev prod setup db-migrate db-seed

dev:
	docker-compose up --build app db

prod:
	docker-compose -f docker-compose.yml up --build app db

setup:
	bash setup.sh

db-migrate:
	npx prisma migrate dev

db-seed:
	npx ts-node src/seed.ts
