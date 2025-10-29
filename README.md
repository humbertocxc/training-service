# Training Service

> **Core training logic engine for calisthenics programming and performance tracking**

[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-336791?logo=postgresql)](https://www.postgresql.org/)

---

## Overview

The **Training Service** is a specialized microservice that manages the complete lifecycle of calisthenics training data—from exercise definitions through workout templates to executed training sessions. Built on evidence-based sports science principles, it serves as the **single source of truth** for all training-related operations in the platform.

### Key Capabilities

- 🏋️ **Exercise Catalog Management** — Bodyweight & weighted calisthenics movement library
- 📋 **Workout Template Engine** — User-scoped reusable training programs
- 📊 **Session Logging** — Precise execution tracking with timestamps and volume metrics
- 🔒 **User Data Isolation** — Strict multi-tenant boundaries via `externalUserId`
- 📈 **Future-Ready Architecture** — Designed for periodization, load monitoring, and AI-driven programming

### Service Philosophy

# Training Service (short)

This microservice manages training data for calisthenics programming: exercise definitions, workout templates, and recorded training sessions. It's the single source of truth for training-related state and simple domain logic (templates, session logging, and exercise catalog).

Key responsibilities

- Exercise catalog (shared, read-only catalog + seeding)
- Workout templates (user-scoped CRUD)
- Session logging (user-scoped execution records with sets/reps/notes)

Why this service exists

- Keep training data consistent and versionable across the platform
- Provide a compact API for other services (auth, media, profiles) to consume training data

Quick start (dev)

1. Install dependencies: npm install
2. Configure env: copy `.env.example` to `.env` and update `DATABASE_URL`
3. Run migrations: npx prisma migrate deploy
4. Seed exercises: npm run seed
5. Start: npm run start:dev (API at http://localhost:3000, docs at /api/docs)

Primary endpoints (examples)

- GET /api/v1/exercises
- GET /api/v1/exercises/:id
- POST /api/v1/users/:userId/workouts
- GET /api/v1/users/:userId/sessions

Docs and references

- API docs: /api/docs (when running)
- Architecture & entities: see `docs/ARCHITECTURE.md` and `docs/ENTITIES.md`
- Training concepts: `docs/TRAINING_SCIENCE.md`

Environment (important)

- DATABASE_URL — Postgres connection string
- JWT_SECRET — used to validate tokens (Auth service is external)

Next steps / where to look

- Add derived metrics (tonnage, volume) in `src/session` when implementing analytics
- Review `prisma/schema.prisma` for the canonical model

License: MIT

## Events & RabbitMQ

This service publishes domain events for training actions (for example: session.completed, workout.created) so other services can react asynchronously. For now the messages are published to a topic exchange named by `RABBITMQ_EXCHANGE` and routing keys describe the event type.

Why publish events

- Decouples training data producers from consumers (periodization, analytics, notifications).
- Allows the future `periodization-service` to react to session completions and update periodized plans.

Development / running RabbitMQ

- The project includes a local RabbitMQ service in `docker-compose.yml`. To start RabbitMQ and Postgres for development run:

```sh
docker compose up -d postgres rabbitmq
```

- Environment variables (see `.env`):
  - `RABBITMQ_URL` (default: `amqp://rabbitmq:5672`)
  - `RABBITMQ_EXCHANGE` (default: `training.events`)
  - `RABBITMQ_EXCHANGE_TYPE` (default: `topic`)

If you prefer to start RabbitMQ manually (e.g. on a different host), set `RABBITMQ_URL` in your `.env` to point to the broker and start the app normally.
