# Training Service Architecture

> **Version:** 1.0.0  
> **Last Updated:** October 27, 2025  
> **Maintainer:** Backend Engineering Team

---

## Executive Summary

The **Training Service** is the **core training logic engine** of the calisthenics full-stack platform. It owns the complete lifecycle of training data—from exercise definitions through workout templates to executed training sessions—and serves as the **single source of truth** for all training-related information.

This service does **not** manage user authentication or profiles; it references external identity through immutable `userExternalId` values provided by the Auth Service. All training entities are scoped to users, enabling future multi-tenant and coach-athlete architectures.

---

## Service Purpose & Responsibilities

### Core Mission

The Training Service answers fundamental questions about athletic training:

1. **What was trained?** (Exercise catalog, movement patterns, skill progressions)
2. **How was it programmed?** (Workout templates with prescribed volume and intensity)
3. **What was actually performed?** (Session logs with actual execution data)
4. **How does this relate to progress?** (Future: Derived metrics, load trends, readiness)

### Primary Responsibilities

| **Responsibility**                 | **Status** | **Description**                                                    |
| ---------------------------------- | ---------- | ------------------------------------------------------------------ |
| Exercise Catalog Management        | ✅ Active  | Maintains canonical bodyweight and weighted calisthenics exercises |
| Workout Template CRUD              | ✅ Active  | User-scoped workout creation, retrieval, update, deletion          |
| Training Session Logging           | ✅ Active  | Records actual training execution with timestamp, duration, volume |
| Exercise Categorization            | ✅ Active  | Taxonomic organization (Push/Pull/Legs/Core/Skill)                 |
| User Data Isolation                | ✅ Active  | Enforces user-level data boundaries via `externalUserId`           |
| Training Metrics Computation       | 🔄 Planned | Derived load, volume, tonnage, intensity per session/week/phase    |
| Goal & Phase Management            | 🔄 Planned | Structured periodization with mesocycle/microcycle tracking        |
| Progressive Overload Tracking      | 🔄 Planned | Time-series analysis of performance trends                         |
| Coach-Athlete Relationship Support | 🔄 Planned | Optional `groupExternalId` for team/coaching hierarchies           |

### Out of Scope

- **User Authentication/Authorization** → Delegated to Auth Service
- **User Profile Management** → Delegated to User Service
- **Content Media Storage** → Delegated to Media/CDN Service (referenced via `imageId`)
- **Social Features** → Delegated to Community Service
- **Nutrition/Biometrics** → Separate microservices

---

## Domain Model Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      TRAINING SERVICE DOMAIN                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────┐         ┌──────────┐         ┌─────────┐       │
│  │ EXERCISE  │◄────────│ WORKOUT  │◄────────│ SESSION │       │
│  │ (Catalog) │         │(Template)│         │  (Log)  │       │
│  └───────────┘         └──────────┘         └─────────┘       │
│       │                     │                     │            │
│       │                     │                     │            │
│       └─────────────────────┴─────────────────────┘            │
│                             │                                  │
│                   ┌─────────▼─────────┐                        │
│                   │  WorkoutExercise  │                        │
│                   │  SessionExercise  │                        │
│                   │  (Join Entities)  │                        │
│                   └───────────────────┘                        │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │            FUTURE ENTITIES (Planned)              │        │
│  ├────────────────────────────────────────────────────┤        │
│  │ • TrainingMetrics    (Derived load, volume, RPE)  │        │
│  │ • Goal               (Performance targets)         │        │
│  │ • TrainingPhase      (Periodization structure)     │        │
│  │ • ProgressionRule    (Auto-progression logic)      │        │
│  └────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Entity Relationships & Boundaries

### **1. Exercise** (Base Unit of Training)

**Purpose:** Defines the canonical library of bodyweight and weighted calisthenics movements.

**Characteristics:**

- **Immutable** once referenced by workouts/sessions (maintains historical integrity)
- **Platform-scoped** (not user-owned; shared catalog)
- **Categorized** by movement pattern (Push/Pull/Legs/Core/Skill)
- **Media-enriched** via `imageId` (delegated to Media Service)

**Key Relationships:**

- `1:N` → `WorkoutExercise` (appears in many workout templates)
- `1:N` → `SessionExercise` (logged in many training sessions)

**Future Extensions:**

- Exercise progressions/regressions graph
- Biomechanical tags (isometric, concentric, eccentric phases)
- Equipment requirements (rings, parallettes, weighted vest, etc.)

---

### **2. Workout** (Training Template)

**Purpose:** User-defined reusable training session blueprint with prescribed volume and rest periods.

**Characteristics:**

- **User-scoped** via `externalUserId`
- **Prescriptive** (defines target sets/reps, not actual performance)
- **Template-based** (can be instantiated multiple times as sessions)

**Key Relationships:**

- `N:1` → `User` (via `externalUserId`, external reference)
- `1:N` → `WorkoutExercise` (compositional; cascade delete)
- `1:N` → `Session` (template instantiation; optional reference)

**Scientific Rationale:**

- Enables **training consistency** (repeat proven protocols)
- Supports **auto-regulation** (session can deviate from template based on readiness)
- Foundation for **periodized programming** (phased workout rotation)

**Future Extensions:**

- `TrainingPhase` association (mesocycle assignment)
- Auto-progression rules (when to increase load/reps)
- Target RPE/intensity zones

---

### **3. Session** (Training Execution Log)

**Purpose:** Immutable record of a completed training session with actual performance data.

**Characteristics:**

- **User-scoped** via `externalUserId`
- **Time-stamped** (precise chronological tracking)
- **Descriptive** (captures actual execution vs. planned)
- **Optionally linked** to workout template (supports free-form training)

**Key Relationships:**

- `N:1` → `User` (via `externalUserId`, external reference)
- `N:1` → `Workout` (optional template reference)
- `1:N` → `SessionExercise` (compositional; cascade delete)

**Scientific Rationale:**

- Foundation for **training load monitoring** (volume, intensity trends)
- Enables **adaptive periodization** (adjust future training based on performance)
- Supports **fatigue management** (detect overreaching patterns)

**Future Extensions:**

- Derived metrics: total tonnage, session RPE, volume load
- Readiness scores (compare planned vs. actual performance)
- Recovery markers (duration, perceived exertion)

---

### **4. WorkoutExercise / SessionExercise** (Join Entities)

**Purpose:** Compositional relationship managers with exercise-specific metadata.

| **Entity**        | **Context**  | **Key Attributes**                        |
| ----------------- | ------------ | ----------------------------------------- |
| `WorkoutExercise` | Prescription | `sets`, `reps`, `rest` (seconds), `notes` |
| `SessionExercise` | Execution    | `sets`, `actualReps`, `notes`             |

**Design Rationale:**

- Allows **per-exercise configuration** within a workout/session
- Maintains **referential integrity** (cascade operations)
- Enables **partial completion tracking** (log incomplete sessions)

**Future Extensions:**

- `load` (external weight in kg/lbs)
- `tempo` (e.g., "3-0-1-0" for eccentric-pause-concentric-pause)
- `rpe` (Rate of Perceived Exertion per exercise)
- `videoId` (form check recordings)

---

## Data Isolation & Multi-Tenancy

### User Scoping Strategy

All user-owned entities enforce strict data isolation:

```typescript
// Example: Workout retrieval enforces user boundary
async findByUser(externalUserId: string): Promise<Workout[]> {
  return this.prisma.workout.findMany({
    where: { externalUserId }, // ← Mandatory filter
    include: { exercises: { include: { exercise: true } } },
  });
}
```

**Security Guarantees:**

1. No cross-user data leakage
2. Controllers **must** validate `externalUserId` from JWT claims
3. Database queries **always** filter by `externalUserId`

### Future Multi-Tenancy: Coach-Athlete Model

**Planned Extension:** `groupExternalId` field

```prisma
model Workout {
  externalUserId  String   // Athlete who owns the workout
  groupExternalId String?  // Optional coaching organization/team
  // ... rest of schema
}
```

**Use Cases:**

- Coaches create workout templates for athletes
- Team-wide programming distribution
- Group analytics and leaderboards
- Privacy-controlled data sharing

---

## Inter-Service Communication

### Dependencies (Inbound)

| **Service**       | **Relationship**             | **Data Flow**                         |
| ----------------- | ---------------------------- | ------------------------------------- |
| **Auth Service**  | Identity Provider (Required) | Supplies `userExternalId` via JWT     |
| **Media Service** | Content Delivery (Optional)  | Provides `imageId` for exercise media |

**Authentication Flow:**

```
1. User requests training data
2. API Gateway validates JWT (Auth Service)
3. JWT payload contains { userId: "uuid", ... }
4. Training Service receives `externalUserId` = "uuid"
5. Database queries filter by `externalUserId`
```

### Dependents (Outbound)

| **Service**               | **Consumes**                              | **Purpose**                         |
| ------------------------- | ----------------------------------------- | ----------------------------------- |
| **Analytics Service**     | Session logs, workout metadata            | Progress dashboards, trend analysis |
| **Periodization Service** | Workout templates, training phases        | Structured program generation       |
| **Recommendation Engine** | Performance history, exercise preferences | AI-driven workout suggestions       |

**API Contract Pattern:**

```
GET /api/training/users/{userId}/sessions?from=2025-01-01&to=2025-01-31
→ Returns chronological session history for external analytics
```

---

## Scientific Foundations

### Periodization Principles

The service architecture reflects **evidence-based periodization theory**:

| **Principle**            | **Implementation**                                        |
| ------------------------ | --------------------------------------------------------- |
| **Progressive Overload** | Session logs enable time-series volume/intensity tracking |
| **Specificity**          | Exercise categorization aligns with training goals        |
| **Variation**            | Workout templates support phase-based rotation            |
| **Recovery**             | Session duration/notes capture readiness markers          |

### Calisthenics-Specific Considerations

**Bodyweight Training Characteristics:**

- **Skill acquisition** (handstand, muscle-up) requires separate tracking from strength work
- **Leverage-based progression** (e.g., tuck → advanced tuck → straddle → full)
- **Relative strength** metrics (body weight ratio matters)

**Future Metric Examples:**

```typescript
// Derived metrics for calisthenics
interface SessionMetrics {
  totalReps: number; // Sum of all reps
  totalTimeUnderTension: number; // For isometric holds
  skillWorkVolume: number; // Skill-specific accumulation
  strengthVolume: number; // Push/Pull/Legs aggregate
  estimatedIntensity: number; // Based on exercise difficulty rating
}
```

### Load Monitoring Framework (Future)

**Acute:Chronic Workload Ratio (ACWR):**

- 7-day rolling average (acute load)
- 28-day rolling average (chronic load)
- Target ACWR: 0.8–1.3 (optimal adaptation zone)

**Implementation Roadmap:**

1. **Phase 1** (Current): Log raw session data
2. **Phase 2**: Compute session volume metrics
3. **Phase 3**: Aggregate weekly/monthly loads
4. **Phase 4**: Calculate ACWR and injury risk indicators

---

## API Design Philosophy

### RESTful Resource Modeling

| **Resource** | **Endpoint Pattern**            | **Ownership**     |
| ------------ | ------------------------------- | ----------------- |
| Exercises    | `GET /exercises`                | Platform (public) |
| Workouts     | `POST /users/{userId}/workouts` | User (private)    |
| Sessions     | `POST /users/{userId}/sessions` | User (private)    |

**Design Decisions:**

- **Hierarchical routes** reflect ownership (`/users/{userId}/...`)
- **Idempotent operations** where applicable (PUT for updates)
- **Bulk endpoints** for analytics queries (`/sessions?from=X&to=Y`)

### Versioning Strategy

**Approach:** URI versioning (`/api/v1/training/...`)

**Rationale:**

- Clear API evolution path
- Supports backward compatibility during migrations
- Enables gradual feature rollout

---

## Technology Stack Rationale

| **Component**  | **Choice**      | **Justification**                                   |
| -------------- | --------------- | --------------------------------------------------- |
| **Framework**  | NestJS          | Enterprise TypeScript, modularity, DI, testability  |
| **ORM**        | Prisma          | Type-safe queries, migrations, relational integrity |
| **Database**   | PostgreSQL      | ACID compliance, JSON support, time-series queries  |
| **Validation** | class-validator | Declarative DTOs, OpenAPI integration               |
| **API Docs**   | Swagger/OpenAPI | Auto-generated, contract-first design               |

**Database Choice: PostgreSQL**

- **Relational integrity** (foreign keys enforce entity relationships)
- **JSON fields** for flexible metadata (future `SessionMetrics`)
- **Time-series extensions** (pg_partman for session archival)
- **Analytics-ready** (pgvector for future ML feature embeddings)

---

## Evolution Roadmap

### Phase 1: Foundation (Current)

- [x] Exercise catalog with seeding
- [x] Workout template CRUD
- [x] Session logging
- [x] User data isolation

### Phase 2: Metrics & Analytics (Q1 2026)

- [ ] Session volume metrics computation
- [ ] Weekly/monthly aggregates
- [ ] Basic progress charts
- [ ] Export API for analytics service

### Phase 3: Periodization (Q2 2026)

- [ ] `TrainingPhase` entity (mesocycle/microcycle)
- [ ] `Goal` entity with target metrics
- [ ] Phase-based workout scheduling
- [ ] Auto-progression rules

### Phase 4: Advanced Features (Q3 2026)

- [ ] Load monitoring (ACWR)
- [ ] Exercise progression graphs
- [ ] Readiness scoring
- [ ] Coach-athlete multi-tenancy

### Phase 5: Intelligence (Q4 2026)

- [ ] AI workout recommendations
- [ ] Injury risk prediction
- [ ] Adaptive programming (auto-adjust based on performance)
- [ ] Form analysis integration (video AI)

---

## Compliance & Data Governance

### Data Retention

- **Active training data**: Indefinite retention (user's training history)
- **Deleted users**: Cascade delete via `externalUserId` tombstone pattern
- **Archived sessions**: Move to cold storage after 2 years (analytics preservation)

### Privacy Considerations

- **No PII stored** (only `externalUserId` reference)
- **User-initiated deletion** triggers cascade operations
- **GDPR compliance** via external identity service

### Audit Requirements

- **Session immutability** (logs never modified, only appended)
- **Workout versioning** (future: track template changes over time)
- **API access logs** (rate limiting, abuse detection)

---

## Testing Strategy

### Test Pyramid

| **Layer**      | **Coverage**  | **Focus**                                 |
| -------------- | ------------- | ----------------------------------------- |
| Unit Tests     | 80%+          | Service logic, validation, business rules |
| Integration    | Core flows    | Database queries, Prisma interactions     |
| E2E Tests      | Happy paths   | Full request→response cycles              |
| Contract Tests | Inter-service | API schema validation for dependents      |

### Key Test Scenarios

1. **User isolation**: User A cannot access User B's workouts/sessions
2. **Cascade operations**: Deleting workout removes associated exercises
3. **Referential integrity**: Cannot log session with non-existent exercise
4. **Edge cases**: Empty workouts, zero-duration sessions, past-dated logs

---

## Deployment Architecture

### Microservice Boundaries

```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway (Kong)                   │
│            (Auth, Rate Limiting, Routing)               │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │   Auth   │   │ Training │   │  Media   │
   │ Service  │   │ Service  │   │ Service  │
   └──────────┘   └────┬─────┘   └──────────┘
                       │
                       ▼
               ┌───────────────┐
               │  PostgreSQL   │
               │   (Primary)   │
               └───────────────┘
```

### Scalability Considerations

- **Stateless service design** (horizontal scaling)
- **Read replicas** for analytics queries (separate from transactional writes)
- **Database partitioning** by `externalUserId` (future sharding strategy)

---

## Glossary

| **Term**                 | **Definition**                                          |
| ------------------------ | ------------------------------------------------------- |
| **Exercise**             | A discrete movement or skill (e.g., push-up, pull-up)   |
| **Workout**              | A prescriptive template defining planned training       |
| **Session**              | A completed training log with actual performance data   |
| **externalUserId**       | Immutable reference to user identity from Auth Service  |
| **Progressive Overload** | Gradual increase in training stress to drive adaptation |
| **Periodization**        | Systematic variation of training variables over time    |
| **ACWR**                 | Acute:Chronic Workload Ratio (injury risk metric)       |
| **Mesocycle**            | 3-6 week training block with specific goal              |
| **Microcycle**           | 1-week training unit (typically 3-7 sessions)           |

---

## References & Further Reading

### Sports Science

1. Bompa, T. & Haff, G. (2009). _Periodization: Theory and Methodology of Training_
2. Stone, M. et al. (2007). "Training Principles: Evaluation of Modes and Methods of Resistance Training"
3. Hubal, M. et al. (2005). "Variability in muscle size and strength gain after unilateral resistance training"

### Calisthenics-Specific

1. Kavadlo, D. (2013). _Pushing the Limits! Total Body Strength with No Equipment_
2. Gallagher, P. (2013). _Overcoming Gravity: A Systematic Approach to Gymnastics and Bodyweight Strength_
3. Eshetu, E. et al. (2021). "The Science of Calisthenics: A Systematic Review"

### Software Architecture

1. Newman, S. (2021). _Building Microservices_ (2nd Edition)
2. Evans, E. (2003). _Domain-Driven Design_
3. Richardson, C. (2018). _Microservices Patterns_

---

## Document Maintenance

| **Version** | **Date**     | **Author**       | **Changes**                     |
| ----------- | ------------ | ---------------- | ------------------------------- |
| 1.0.0       | Oct 27, 2025 | Engineering Team | Initial architecture definition |

**Review Cadence:** Quarterly (or upon major feature releases)  
**Stakeholders:** Backend Team, Product, Data Science

---

**Questions or Feedback?**  
Contact: [backend-team@example.com](mailto:backend-team@example.com)
