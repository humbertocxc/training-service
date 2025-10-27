# Training Service Documentation Index

> **Complete guide to the Training Service architecture, domain model, and scientific foundations**

**Last Updated:** October 27, 2025  
**Status:** 🟢 Active Development

---

## 📚 Documentation Overview

This directory contains comprehensive documentation for the **Training Service** — the core training logic engine for the calisthenics full-stack platform.

### Quick Navigation

| **Document**                                     | **Purpose**                                         | **Audience**                         | **Priority** |
| ------------------------------------------------ | --------------------------------------------------- | ------------------------------------ | ------------ |
| [**ARCHITECTURE.md**](./ARCHITECTURE.md)         | Service boundaries, domain model, evolution roadmap | All engineers, product team          | 🔴 Critical  |
| [**ENTITIES.md**](./ENTITIES.md)                 | Detailed entity definitions and relationships       | Backend engineers, data architects   | 🔴 Critical  |
| [**API_CONTRACTS.md**](./API_CONTRACTS.md)       | Inter-service communication patterns                | API consumers, integration engineers | 🟡 Important |
| [**TRAINING_SCIENCE.md**](./TRAINING_SCIENCE.md) | Periodization principles and load monitoring        | Domain experts, product team         | 🟢 Reference |

---

## 🎯 Document Purposes

### [ARCHITECTURE.md](./ARCHITECTURE.md) — System Design Blueprint

**What it covers:**

- Service mission and responsibilities
- Domain model overview with visual diagrams
- Entity relationship mappings
- Inter-service dependencies (Auth, Media)
- Technology stack rationale
- Evolution roadmap (5-phase plan)
- Data governance and compliance

**When to reference:**

- Onboarding new team members
- Making architectural decisions
- Planning new features
- Understanding service boundaries

**Key sections:**

- ✅ Service Purpose & Responsibilities
- ✅ Domain Model Overview
- ✅ Entity Relationships & Boundaries
- ✅ Inter-Service Communication
- ✅ Scientific Foundations
- ✅ Evolution Roadmap

---

### [ENTITIES.md](./ENTITIES.md) — Domain Data Dictionary

**What it covers:**

- Comprehensive entity specifications (Exercise, Workout, Session)
- Database schema with field-level documentation
- Business rules and validation constraints
- Cascade behaviors and referential integrity
- Future entity proposals (TrainingMetrics, Goal, TrainingPhase)
- Design patterns (Template-Instance, Compositional vs. Referential)

**When to reference:**

- Writing database migrations
- Implementing service methods
- Understanding data relationships
- Designing new features

**Key sections:**

- ✅ Entity Relationship Diagram
- ✅ Core Entities (Exercise, Workout, Session)
- ✅ Compositional Entities (WorkoutExercise, SessionExercise)
- ✅ Future Entities (Metrics, Goals, Phases)
- ✅ Design Patterns

---

### [API_CONTRACTS.md](./API_CONTRACTS.md) — Service Interface Specification

**What it covers:**

- REST API endpoint catalog
- Request/response schemas
- Authentication flow (JWT-based)
- Error handling standards
- Versioning strategy
- Service-to-service contracts (Analytics, Periodization)

**When to reference:**

- Integrating with the Training Service
- Building frontend clients
- Designing new endpoints
- Troubleshooting API issues

**Key sections:**

- ✅ Service Boundary Definition
- ✅ Inbound Dependencies (Auth, Media)
- ✅ REST API Reference (full endpoint catalog)
- ✅ Authentication Flow
- ✅ Error Handling Standards
- ✅ Future Service Contracts

---

### [TRAINING_SCIENCE.md](./TRAINING_SCIENCE.md) — Academic Foundations

**What it covers:**

- Evidence-based training principles (Progressive Overload, Specificity)
- Periodization models (Linear, Undulating, Block)
- Calisthenics-specific considerations (skill vs. strength)
- Load monitoring framework (ACWR, session RPE)
- Recovery and adaptation science
- Implementation roadmap for advanced features

**When to reference:**

- Designing training algorithms
- Understanding metric calculations
- Validating feature requirements
- Educating product/design teams

**Key sections:**

- ✅ Core Training Principles
- ✅ Periodization Models
- ✅ Calisthenics-Specific Considerations
- ✅ Load Monitoring Framework (ACWR, RPE)
- ✅ Progressive Overload Strategies
- ✅ Implementation in the Service

---

## 🚀 Getting Started

### For New Engineers

**Recommended reading order:**

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** (30 min)
   - Understand service purpose and boundaries
   - Review domain model diagram
   - Familiarize with technology stack

2. **[ENTITIES.md](./ENTITIES.md)** (45 min)
   - Study core entities (Exercise, Workout, Session)
   - Understand relationships and cascade behaviors
   - Review validation rules

3. **[API_CONTRACTS.md](./API_CONTRACTS.md)** (30 min)
   - Learn authentication flow
   - Review REST endpoints
   - Understand error handling

4. **[TRAINING_SCIENCE.md](./TRAINING_SCIENCE.md)** (Optional, 60 min)
   - Deep dive into periodization theory
   - Understand load monitoring concepts
   - Review future feature implementations

**Total time investment:** ~2-3 hours for comprehensive understanding

---

### For Product/Design Teams

**Focus areas:**

- [ARCHITECTURE.md](./ARCHITECTURE.md) → Evolution Roadmap section
- [TRAINING_SCIENCE.md](./TRAINING_SCIENCE.md) → Core Training Principles
- [API_CONTRACTS.md](./API_CONTRACTS.md) → REST API Reference (for feature scoping)

---

### For API Consumers

**Essential reading:**

- [API_CONTRACTS.md](./API_CONTRACTS.md) (complete)
- [ENTITIES.md](./ENTITIES.md) → Entity schemas (for understanding data structures)

---

## 🗺️ Service Evolution Roadmap

### Phase 1: Foundation ✅ (Current — v1.0)

**Status:** **Complete**

- [x] Exercise catalog with seeding
- [x] Workout template CRUD
- [x] Session logging
- [x] User data isolation
- [x] Swagger API documentation

**Timeline:** Completed October 2025

---

### Phase 2: Metrics & Analytics 🔄 (Q1 2026)

**Status:** **Planned**

- [ ] Session volume metrics computation
- [ ] Weekly/monthly aggregates
- [ ] Basic progress charts
- [ ] Export API for analytics service

**Key Deliverables:**

- `TrainingMetrics` entity
- Analytics endpoints (`/users/:userId/metrics`)
- Volume trend visualization data

**Timeline:** January - March 2026

---

### Phase 3: Periodization 📅 (Q2 2026)

**Status:** **Planned**

- [ ] `TrainingPhase` entity (mesocycle/microcycle)
- [ ] `Goal` entity with target metrics
- [ ] Phase-based workout scheduling
- [ ] Auto-progression rules

**Key Deliverables:**

- Periodization engine
- Goal tracking system
- Phase templates (Hypertrophy, Strength, Skill, Deload)

**Timeline:** April - June 2026

---

### Phase 4: Advanced Features 🚀 (Q3 2026)

**Status:** **Planned**

- [ ] Load monitoring (ACWR)
- [ ] Exercise progression graphs
- [ ] Readiness scoring
- [ ] Coach-athlete multi-tenancy

**Key Deliverables:**

- ACWR calculation engine
- Injury risk alerts
- `groupExternalId` for coaching relationships

**Timeline:** July - September 2026

---

### Phase 5: Intelligence 🤖 (Q4 2026)

**Status:** **Planned**

- [ ] AI workout recommendations
- [ ] Injury risk prediction
- [ ] Adaptive programming (auto-adjust based on performance)
- [ ] Form analysis integration (video AI)

**Key Deliverables:**

- ML feature pipeline
- Recommendation engine integration
- Adaptive auto-regulation system

**Timeline:** October - December 2026

---

## 🔬 Core Concepts at a Glance

### Domain Model

```
┌─────────────────────────────────────────────────────────────┐
│                    TRAINING SERVICE DOMAIN                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Exercise (Catalog) ─┬─► WorkoutExercise ─► Workout        │
│                      │                       (Template)     │
│                      │                                      │
│                      └─► SessionExercise ─► Session         │
│                                              (Log)          │
│                                                             │
│  FUTURE:                                                    │
│  ├─ TrainingMetrics  (Derived load, RPE, volume)           │
│  ├─ Goal             (Performance targets)                  │
│  └─ TrainingPhase    (Periodization structure)             │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Patterns

1. **External User Reference**
   - Services don't manage auth
   - `externalUserId` links to Auth Service

2. **Template-Instance**
   - Workout = Reusable template
   - Session = One-time execution log

3. **Compositional vs. Referential**
   - Workout ↔ WorkoutExercise = Compositional (cascade delete)
   - Exercise ↔ WorkoutExercise = Referential (restrict delete)

4. **Immutable Logs**
   - Sessions are append-only
   - Ensures historical data integrity

---

## 📊 Service Metrics & Success Criteria

### Current State (v1.0)

| **Metric**                | **Target** | **Actual** | **Status** |
| ------------------------- | ---------- | ---------- | ---------- |
| API Uptime                | 99.9%      | TBD        | 🟢         |
| Average Response Time     | < 200ms    | TBD        | 🟢         |
| Database Query Efficiency | < 50ms     | TBD        | 🟢         |
| Test Coverage             | > 80%      | TBD        | 🟡         |

### Future Metrics (Phase 2+)

- Daily Active Users (DAU)
- Sessions Logged per Day
- Workout Templates Created
- Analytics Query Performance
- ACWR Calculation Accuracy

---

## 🛠️ Technical Stack Summary

| **Layer**  | **Technology**  | **Version** | **Purpose**                     |
| ---------- | --------------- | ----------- | ------------------------------- |
| Framework  | NestJS          | 11.x        | Enterprise TypeScript framework |
| ORM        | Prisma          | 6.x         | Type-safe database queries      |
| Database   | PostgreSQL      | 16.x        | Relational data store           |
| Validation | class-validator | Latest      | DTO validation                  |
| API Docs   | Swagger/OpenAPI | Latest      | Auto-generated documentation    |
| Testing    | Jest            | Latest      | Unit/integration/E2E tests      |

**Deployment:**

- Docker containerization
- PostgreSQL (primary database)
- Future: Read replicas for analytics

---

## 📖 Reference Materials

### Academic Sources

1. **Bompa & Haff (2009)** — _Periodization: Theory and Methodology of Training_
2. **Zatsiorsky & Kraemer (2006)** — _Science and Practice of Strength Training_
3. **Gallagher (2013)** — _Overcoming Gravity_ (Calisthenics-specific)

### Industry Standards

- REST API Design (RESTful principles)
- OpenAPI 3.0 Specification
- JWT Authentication (RFC 7519)
- ISO 8601 Date Formatting

---

## 🤝 Contributing to Documentation

### When to Update

**Trigger events:**

- New entity added to schema
- API endpoint added/modified/deprecated
- Architecture decision made
- New feature implemented

### Update Process

1. **Make changes** to relevant .md file(s)
2. **Update version number** at top of document
3. **Add changelog entry** at bottom of document
4. **Create PR** with documentation changes
5. **Request review** from tech lead

### Style Guidelines

- Use **Markdown** for all documentation
- Include **code examples** where applicable
- Add **diagrams** (ASCII art or Mermaid.js)
- Keep **tables** for structured data
- Use **emojis** sparingly for visual hierarchy

---

## 📞 Support & Feedback

### Questions?

- **Slack:** #training-service-dev
- **Email:** backend-team@example.com
- **GitHub:** Open an issue with `[docs]` prefix

### Found an Error?

Please open a GitHub issue with:

- Document name and section
- Specific error or inconsistency
- Suggested correction (optional)

---

## 📜 Document Maintenance

| **Document**        | **Last Updated** | **Next Review** | **Owner**     |
| ------------------- | ---------------- | --------------- | ------------- |
| ARCHITECTURE.md     | Oct 27, 2025     | Jan 27, 2026    | Backend Team  |
| ENTITIES.md         | Oct 27, 2025     | Jan 27, 2026    | Backend Team  |
| API_CONTRACTS.md    | Oct 27, 2025     | Jan 27, 2026    | Backend Team  |
| TRAINING_SCIENCE.md | Oct 27, 2025     | Jan 27, 2026    | Domain Expert |

**Review Cadence:** Quarterly (or upon major feature releases)

---

## 🎓 Glossary

Quick reference for domain-specific terms:

| **Term**                 | **Definition**                                    | **Document**        |
| ------------------------ | ------------------------------------------------- | ------------------- |
| **ACWR**                 | Acute:Chronic Workload Ratio (injury risk metric) | TRAINING_SCIENCE.md |
| **externalUserId**       | Immutable reference to Auth Service user ID       | ARCHITECTURE.md     |
| **Mesocycle**            | 3-6 week training block                           | TRAINING_SCIENCE.md |
| **Progressive Overload** | Gradual increase in training stress               | TRAINING_SCIENCE.md |
| **RPE**                  | Rate of Perceived Exertion                        | TRAINING_SCIENCE.md |
| **Session**              | Completed training log                            | ENTITIES.md         |
| **Workout**              | Reusable training template                        | ENTITIES.md         |

---

**Documentation Version:** 1.0.0  
**Service Version:** 1.0.0  
**Last Updated:** October 27, 2025

---

**Built with 💪 for the Calisthenics Community**
