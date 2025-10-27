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

This service follows **Domain-Driven Design** principles with clear bounded contexts:

- ✅ **Owns:** Training data, workout logic, session history
- ❌ **Delegates:** Authentication (Auth Service), media storage (Media Service), user profiles (User Service)

---

## Architecture Documentation

For comprehensive system design, entity relationships, and scientific foundations:

📘 **[Read Full Architecture Documentation](./docs/ARCHITECTURE.md)**

### Quick Reference

| **Document**                                      | **Purpose**                                         |
| ------------------------------------------------- | --------------------------------------------------- |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md)         | Service boundaries, domain model, evolution roadmap |
| [ENTITIES.md](./docs/ENTITIES.md)                 | Detailed entity definitions and relationships       |
| [API_CONTRACTS.md](./docs/API_CONTRACTS.md)       | Inter-service communication patterns                |
| [TRAINING_SCIENCE.md](./docs/TRAINING_SCIENCE.md) | Periodization principles and load monitoring        |

---

## Technology Stack

| **Layer**      | **Technology**  | **Purpose**                                     |
| -------------- | --------------- | ----------------------------------------------- |
| **Framework**  | NestJS 11.x     | Enterprise TypeScript with dependency injection |
| **ORM**        | Prisma 6.x      | Type-safe database queries and migrations       |
| **Database**   | PostgreSQL 16.x | Relational integrity and time-series support    |
| **Validation** | class-validator | Declarative DTO validation                      |
| **API Docs**   | Swagger/OpenAPI | Auto-generated REST documentation               |
| **Testing**    | Jest            | Unit, integration, and E2E test suites          |

---

## Core Domain Entities

```
Exercise (Catalog)
    ↓
WorkoutExercise ← Workout (Template) → Session (Log)
    ↓                                      ↓
                                   SessionExercise
```

### Entity Summary

| **Entity**        | **Ownership** | **Purpose**                             |
| ----------------- | ------------- | --------------------------------------- |
| `Exercise`        | Platform      | Canonical movement library (shared)     |
| `Workout`         | User          | Prescriptive training template          |
| `Session`         | User          | Completed training log with actual data |
| `WorkoutExercise` | Compositional | Planned sets/reps/rest configuration    |
| `SessionExercise` | Compositional | Actual performance (reps/sets/notes)    |

**Future Entities:**

- `TrainingMetrics` (derived load, tonnage, RPE)
- `Goal` (performance targets)
- `TrainingPhase` (periodization structure)

---

---

## Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 16.x or higher
- **npm** or **pnpm** package manager

### Installation

```bash
# Clone repository
git clone <repository-url>
cd training-service

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate deploy

# Seed exercise catalog
npm run seed
```

### Development

```bash
# Start development server with hot-reload
npm run start:dev

# API will be available at http://localhost:3000
# Swagger documentation at http://localhost:3000/api/docs
```

### Database Management

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name <migration-name>

# Open Prisma Studio (GUI for database)
npx prisma studio

# Reset database (DANGER: deletes all data)
npx prisma migrate reset
```

---

## Project Structure

```
training-service/
├── src/
│   ├── auth/                 # JWT authentication guards
│   ├── exercise/             # Exercise catalog module
│   ├── workout/              # Workout template module
│   ├── session/              # Training session module
│   ├── prisma/               # Prisma service wrapper
│   ├── main.ts               # Application entry point
│   ├── swagger.ts            # OpenAPI configuration
│   └── seed.ts               # Database seeding script
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   └── migrations/           # Version-controlled migrations
├── docs/                     # Architecture documentation
├── test/                     # E2E test suites
├── docker-compose.yml        # Local development stack
└── Dockerfile                # Production container image
```

---

## API Endpoints

### Exercise Catalog (Public)

```http
GET    /api/v1/exercises           # List all exercises
GET    /api/v1/exercises/:id       # Get exercise details
```

### Workout Templates (User-scoped)

```http
POST   /api/v1/users/:userId/workouts        # Create workout template
GET    /api/v1/users/:userId/workouts        # List user's workouts
GET    /api/v1/users/:userId/workouts/:id    # Get workout details
PUT    /api/v1/users/:userId/workouts/:id    # Update workout
DELETE /api/v1/users/:userId/workouts/:id    # Delete workout
```

### Training Sessions (User-scoped)

```http
POST   /api/v1/users/:userId/sessions        # Log training session
GET    /api/v1/users/:userId/sessions        # List user's sessions
GET    /api/v1/users/:userId/sessions/:id    # Get session details
GET    /api/v1/users/:userId/sessions?from=<date>&to=<date>  # Date range query
```

**📘 Full API Documentation:** Available at `/api/docs` when service is running

---

## Testing

```bash
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

### Test Strategy

- **Unit Tests:** Service logic, validation, business rules (80%+ coverage target)
- **Integration Tests:** Database interactions, Prisma queries
- **E2E Tests:** Full request/response cycles through controllers
- **Contract Tests:** API schema validation for downstream services

---

## Deployment

### Docker (Recommended)

```bash
# Build production image
docker build -t training-service:latest .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Check health
curl http://localhost:3000/health
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/training_db"

# Application
PORT=3000
NODE_ENV=production

# Authentication (JWT secret for validation)
JWT_SECRET="your-secret-key"

# External Services
AUTH_SERVICE_URL="http://auth-service:3001"
MEDIA_SERVICE_URL="http://media-service:3002"
```

### Production Checklist

- [ ] Database migrations applied (`npx prisma migrate deploy`)
- [ ] Exercise catalog seeded
- [ ] JWT secret configured
- [ ] Database connection pooling tuned
- [ ] Health check endpoint configured
- [ ] Logging/monitoring integrated (e.g., Datadog, New Relic)
- [ ] Rate limiting enabled at API Gateway

---

## Development Workflow

### Adding a New Entity

1. **Update Prisma schema** (`prisma/schema.prisma`)
2. **Generate migration** (`npx prisma migrate dev --name add_new_entity`)
3. **Create NestJS module** (`nest g module entity-name`)
4. **Create service** (`nest g service entity-name`)
5. **Create controller** (`nest g controller entity-name`)
6. **Add DTOs with validation** (`src/entity-name/dto/`)
7. **Write tests** (unit + E2E)
8. **Update API documentation** (Swagger decorators)

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npx tsc --noEmit
```

---

## Scientific Foundations

This service implements evidence-based training principles:

### Progressive Overload

Session logs enable time-series tracking of volume and intensity increases over time.

### Periodization

Workout templates support systematic variation of training stress (future: TrainingPhase entity).

### Specificity

Exercise categorization (Push/Pull/Legs/Core/Skill) aligns with biomechanical movement patterns.

### Fatigue Management

Session duration and notes capture readiness markers for auto-regulation.

**📖 Deep Dive:** See [TRAINING_SCIENCE.md](./docs/TRAINING_SCIENCE.md) for detailed methodology.

---

## Roadmap

### Current Phase (v1.0)

- [x] Exercise catalog with seeding
- [x] Workout template CRUD
- [x] Session logging
- [x] User data isolation
- [x] Swagger API documentation

### Next Phase (v1.1 - Q1 2026)

- [ ] Session volume metrics (total reps, tonnage)
- [ ] Weekly/monthly aggregates
- [ ] Export API for analytics
- [ ] Exercise progression tracking

### Future Phases

- [ ] TrainingPhase entity (periodization)
- [ ] Goal setting and tracking
- [ ] Load monitoring (ACWR)
- [ ] Coach-athlete multi-tenancy
- [ ] AI workout recommendations

---

## Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and write tests
4. Run linting and tests (`npm run lint && npm run test`)
5. Commit changes (`git commit -m 'feat: add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: improve code structure
test: add missing tests
chore: update dependencies
```

---

## Support & Community

- **Issues:** [GitHub Issues](./issues)
- **Discussions:** [GitHub Discussions](./discussions)
- **Documentation:** [/docs](./docs/)

---

## License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

### Scientific References

- Bompa, T. & Haff, G. (2009). _Periodization: Theory and Methodology of Training_
- Gallagher, P. (2013). _Overcoming Gravity: A Systematic Approach to Gymnastics and Bodyweight Strength_

### Technology Stack

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [PostgreSQL](https://www.postgresql.org/) - Advanced open-source database

---

**Built with 💪 by the Engineering Team**
