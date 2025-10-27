# Domain Entity Reference

> **Comprehensive guide to Training Service data models**

**Version:** 1.0.0  
**Last Updated:** October 27, 2025

---

## Table of Contents

1. [Entity Relationship Diagram](#entity-relationship-diagram)
2. [Core Entities](#core-entities)
   - [Exercise](#exercise)
   - [Workout](#workout)
   - [Session](#session)
3. [Compositional Entities](#compositional-entities)
   - [WorkoutExercise](#workoutexercise)
   - [SessionExercise](#sessionexercise)
4. [Future Entities](#future-entities)
5. [Design Patterns](#design-patterns)
6. [Evolution Guidelines](#evolution-guidelines)

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CURRENT SCHEMA                          │
└─────────────────────────────────────────────────────────────────┘

                    ┌───────────────┐
                    │   Exercise    │ (Platform-scoped)
                    │───────────────│
                    │ id            │
                    │ name (unique) │
                    │ category      │
                    │ description   │
                    │ mediaUrl      │
                    │ imageId       │
                    └───────┬───────┘
                            │
                ┏━━━━━━━━━━━┻━━━━━━━━━━━┓
                ┃                        ┃
        ┌───────▼──────────┐     ┌──────▼─────────┐
        │ WorkoutExercise  │     │SessionExercise │
        │──────────────────│     │────────────────│
        │ id               │     │ id             │
        │ workoutId (FK)   │     │ sessionId (FK) │
        │ exerciseId (FK)  │     │ exerciseId (FK)│
        │ sets             │     │ sets           │
        │ reps             │     │ actualReps     │
        │ rest             │     │ notes          │
        │ notes            │     └────────────────┘
        └───────┬──────────┘              ▲
                │                         │
        ┌───────▼──────────┐     ┌────────┴───────┐
        │     Workout      │     │    Session     │
        │──────────────────│     │────────────────│
        │ id               │     │ id             │
        │ externalUserId   │     │ externalUserId │
        │ name             │     │ workoutId (FK) │ (optional)
        │ notes            │     │ date           │
        └──────────────────┘     │ duration       │
              (User-scoped)      │ notes          │
                                 └────────────────┘
                                   (User-scoped)

┌─────────────────────────────────────────────────────────────────┐
│                       FUTURE EXTENSIONS                         │
└─────────────────────────────────────────────────────────────────┘

        ┌──────────────────┐
        │  TrainingMetrics │ (Derived data)
        │──────────────────│
        │ sessionId (FK)   │
        │ totalVolume      │
        │ totalTonnage     │
        │ avgIntensity     │
        │ sessionRPE       │
        └──────────────────┘

        ┌──────────────────┐
        │       Goal       │ (Performance targets)
        │──────────────────│
        │ externalUserId   │
        │ targetExercise   │
        │ targetMetric     │
        │ deadline         │
        └──────────────────┘

        ┌──────────────────┐
        │  TrainingPhase   │ (Periodization)
        │──────────────────│
        │ externalUserId   │
        │ goalId (FK)      │
        │ phaseType        │ (Hypertrophy, Strength, Skill)
        │ startDate        │
        │ endDate          │
        └──────────────────┘
```

---

## Core Entities

---

### Exercise

**Purpose:** Canonical library of bodyweight and weighted calisthenics movements.

#### Database Schema

```prisma
model Exercise {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  category    String
  description String
  mediaUrl    String?
  imageId     String?

  WorkoutExercise WorkoutExercise[]
  SessionExercise SessionExercise[]
}
```

#### Field Specifications

| **Field**     | **Type**  | **Constraints**     | **Description**                              |
| ------------- | --------- | ------------------- | -------------------------------------------- |
| `id`          | `Int`     | Primary Key         | Auto-incremented unique identifier           |
| `name`        | `String`  | Unique, Required    | Exercise name (e.g., "Pull Up", "Handstand") |
| `category`    | `String`  | Required, Enum-like | Movement pattern (Push/Pull/Legs/Core/Skill) |
| `description` | `String`  | Required            | Detailed exercise instructions               |
| `mediaUrl`    | `String?` | Optional, URL       | Fallback direct image URL                    |
| `imageId`     | `String?` | Optional            | Reference to Media Service asset             |

#### Category Taxonomy

```typescript
export enum ExerciseCategory {
  PUSH = 'Push', // Push-ups, dips, handstand push-ups
  PULL = 'Pull', // Pull-ups, rows, front lever
  CORE = 'Core', // Planks, L-sits, hollow holds
  LEGS = 'Legs', // Squats, pistol squats, sprints
  SKILL = 'Skill', // Handstands, muscle-ups, flags
}
```

**Design Rationale:**

- **Push/Pull/Legs** → Classic strength training split
- **Core** → Dedicated trunk stability work
- **Skill** → Complex movements requiring motor learning (not just strength)

#### Business Rules

1. **Immutability After Reference**
   - Once an exercise is used in a workout or session, its `name` and `category` should not change
   - Reason: Maintains historical data integrity
   - Exception: `description`, `mediaUrl`, `imageId` can be updated (enrichment)

2. **Platform-Level Ownership**
   - Exercises are **not** user-scoped (shared catalog)
   - Future: Admin role for exercise management
   - User-generated exercises → Separate `CustomExercise` entity (future)

3. **Media Delegation**
   - `imageId` is **preferred** (scalable via CDN)
   - `mediaUrl` is **fallback** (direct links, external assets)
   - Service does not store image bytes

#### Relationships

```
Exercise (1) ──── (N) WorkoutExercise
         (1) ──── (N) SessionExercise
```

**Cascade Behavior:**

- **Delete Exercise:** `RESTRICT` (cannot delete if referenced by workouts/sessions)
- **Update Exercise:** Fields `description`, `mediaUrl`, `imageId` are safe to update

#### Future Extensions

```prisma
model Exercise {
  // ... existing fields

  difficulty      Int?            // 1-10 scale
  equipmentNeeds  String[]        // ["rings", "parallettes", "vest"]
  biomechanics    Json?           // { phases: ["concentric", "isometric"], muscle_groups: [...] }
  progressionOf   Int?            // FK to parent exercise (e.g., Tuck Planche → Full Planche)
  regressionOf    Int?            // FK to easier variant

  // Relationships
  progressions    Exercise[]  @relation("ExerciseProgression")
  regressions     Exercise[]  @relation("ExerciseRegression")
}
```

#### Example Data

```json
{
  "id": 1,
  "name": "Pull Up",
  "category": "Pull",
  "description": "Hang from a bar with palms facing away. Pull your chest to the bar, then lower with control.",
  "mediaUrl": "https://cdn.example.com/pullup.jpg",
  "imageId": "img_abc123"
}
```

---

### Workout

**Purpose:** User-defined reusable training session template with prescribed volume and rest periods.

#### Database Schema

```prisma
model Workout {
  id             Int      @id @default(autoincrement())
  externalUserId String
  name           String
  notes          String?

  exercises      WorkoutExercise[]
  sessions       Session[]
}
```

#### Field Specifications

| **Field**        | **Type**  | **Constraints**   | **Description**                             |
| ---------------- | --------- | ----------------- | ------------------------------------------- |
| `id`             | `Int`     | Primary Key       | Auto-incremented unique identifier          |
| `externalUserId` | `String`  | Required, Indexed | Immutable reference to Auth Service user ID |
| `name`           | `String`  | Required          | User-friendly workout name                  |
| `notes`          | `String?` | Optional          | Additional context (e.g., "Pre-exhaustion") |

#### Business Rules

1. **User Isolation**

   ```typescript
   // All queries MUST filter by externalUserId
   const workouts = await prisma.workout.findMany({
     where: { externalUserId: userId }, // ← Mandatory
   });
   ```

2. **Soft Ownership**
   - User can delete their own workouts
   - Deleting workout **cascades** to `WorkoutExercise` (compositional)
   - Deleting workout **does NOT** delete referencing sessions (sessions become "unlinked")

3. **Template Instantiation**
   - Workout is a **blueprint** (prescriptive)
   - Session is an **instantiation** (descriptive)
   - User can log session **without** a workout (free-form training)

4. **Validation Rules**
   - Must have at least 1 exercise (`WorkoutExercise`)
   - Exercise IDs must exist in `Exercise` table
   - Total exercises per workout: 1–20 (practical limit)

#### Relationships

```
Workout (N) ──── (1) User (external, via externalUserId)
        (1) ──── (N) WorkoutExercise (compositional)
        (1) ──── (N) Session (optional reference)
```

**Cascade Behavior:**

- **Delete Workout:** Cascade to `WorkoutExercise`, nullify `Session.workoutId`
- **Update Workout:** Safe to modify `name`, `notes`

#### Use Cases

1. **Template Library**
   - User creates "Upper Body Push Day"
   - Saves as template for weekly repetition

2. **Progressive Overload Tracking**
   - User updates workout with higher reps/sets
   - Version history (future) tracks changes

3. **Program Sharing** (Future)
   - Coach creates workout template
   - Assigns to athlete via `groupExternalId`

#### Future Extensions

```prisma
model Workout {
  // ... existing fields

  groupExternalId  String?        // Coach/team identifier
  isPublic         Boolean        // Shareable template
  targetRPE        Int?           // 1-10 scale
  estimatedDuration Int?          // Minutes
  phaseId          Int?           // FK to TrainingPhase
  tags             String[]       // ["strength", "skill", "beginner"]
  version          Int            // Track template evolution
}
```

#### Example Data

```json
{
  "id": 42,
  "externalUserId": "user_abc123",
  "name": "Upper Body Pull Focus",
  "notes": "Emphasize scapular engagement",
  "exercises": [
    {
      "exerciseId": 2,
      "sets": 5,
      "reps": 5,
      "rest": 180,
      "notes": "Weighted if possible"
    }
  ]
}
```

---

### Session

**Purpose:** Immutable record of a completed training session with actual performance data.

#### Database Schema

```prisma
model Session {
  id             Int      @id @default(autoincrement())
  externalUserId String
  workoutId      Int?
  date           DateTime
  duration       Int
  notes          String?

  workout        Workout? @relation(fields: [workoutId], references: [id])
  exercises      SessionExercise[]
}
```

#### Field Specifications

| **Field**        | **Type**   | **Constraints**    | **Description**                           |
| ---------------- | ---------- | ------------------ | ----------------------------------------- |
| `id`             | `Int`      | Primary Key        | Auto-incremented unique identifier        |
| `externalUserId` | `String`   | Required, Indexed  | Owner of the session                      |
| `workoutId`      | `Int?`     | Optional, FK       | Reference to workout template (if used)   |
| `date`           | `DateTime` | Required           | Timestamp of session (ISO 8601)           |
| `duration`       | `Int`      | Required, Positive | Total session time (seconds)              |
| `notes`          | `String?`  | Optional           | Subjective feedback (e.g., "Felt strong") |

#### Business Rules

1. **Immutability**
   - Sessions should **never** be modified after creation
   - Reason: Training logs are historical records
   - Exception: Allow note edits within 24 hours (grace period)

2. **Temporal Integrity**
   - `date` can be in the past (logging retroactive training)
   - `date` cannot be in the future (>24 hours from now)
   - `duration` must be ≥ 60 seconds (minimum session length)

3. **Template Decoupling**
   - `workoutId` is **optional** (supports free-form training)
   - If `workoutId` is deleted, session persists (orphaned but valid)

4. **User Isolation**
   - Same as Workout: All queries filter by `externalUserId`

#### Relationships

```
Session (N) ──── (1) User (external, via externalUserId)
        (N) ──── (1) Workout (optional)
        (1) ──── (N) SessionExercise (compositional)
```

**Cascade Behavior:**

- **Delete Session:** Cascade to `SessionExercise`
- **Delete User:** Cascade to all user's sessions (tombstone pattern)

#### Use Cases

1. **Performance Tracking**
   - Log actual reps/sets performed
   - Compare to workout template (planned vs. actual)

2. **Volume Calculation**
   - Sum all `SessionExercise.actualReps * sets`
   - Aggregate weekly/monthly totals

3. **Readiness Assessment**
   - Short duration + low reps → Possible fatigue
   - Compare notes: "Felt tired" → Auto-regulation signal

#### Future Extensions

```prisma
model Session {
  // ... existing fields

  location         String?        // "Gym", "Park", "Home"
  weather          String?        // "Hot", "Cold" (outdoor training)
  priorSleep       Int?           // Hours slept (readiness factor)
  priorNutrition   String?        // "Fasted", "Pre-workout meal"
  perceivedEffort  Int?           // 1-10 RPE for entire session

  // Derived metrics (computed, not user-input)
  totalVolume      Int?           // Sum of all reps
  totalTonnage     Float?         // Sum of (reps * load) for weighted exercises
  avgIntensity     Float?         // Derived from exercise difficulty ratings
}
```

#### Example Data

```json
{
  "id": 101,
  "externalUserId": "user_abc123",
  "workoutId": 42,
  "date": "2025-10-27T08:30:00Z",
  "duration": 3600,
  "notes": "Great session! Nailed all sets.",
  "exercises": [
    {
      "exerciseId": 2,
      "sets": 5,
      "actualReps": 6,
      "notes": "Last set was tough"
    }
  ]
}
```

---

## Compositional Entities

---

### WorkoutExercise

**Purpose:** Join table between `Workout` and `Exercise` with prescriptive training parameters.

#### Database Schema

```prisma
model WorkoutExercise {
  id         Int      @id @default(autoincrement())
  workoutId  Int
  exerciseId Int
  sets       Int
  reps       Int
  rest       Int
  notes      String?

  workout    Workout  @relation(fields: [workoutId], references: [id], onDelete: Cascade)
  exercise   Exercise @relation(fields: [exerciseId], references: [id], onDelete: Restrict)
}
```

#### Field Specifications

| **Field**    | **Type**  | **Constraints** | **Description**                    |
| ------------ | --------- | --------------- | ---------------------------------- |
| `id`         | `Int`     | Primary Key     | Auto-incremented unique identifier |
| `workoutId`  | `Int`     | FK (Cascade)    | Parent workout                     |
| `exerciseId` | `Int`     | FK (Restrict)   | Referenced exercise                |
| `sets`       | `Int`     | Required, ≥ 1   | Number of sets to perform          |
| `reps`       | `Int`     | Required, ≥ 1   | Target reps per set                |
| `rest`       | `Int`     | Required, ≥ 0   | Rest between sets (seconds)        |
| `notes`      | `String?` | Optional        | Exercise-specific cues             |

#### Business Rules

1. **Compositional Ownership**
   - Deleting `Workout` deletes all `WorkoutExercise` (cascade)
   - Cannot exist without parent workout

2. **Exercise Referential Integrity**
   - Cannot delete `Exercise` if referenced by `WorkoutExercise` (restrict)
   - Ensures historical data validity

3. **Validation**
   - `sets` ∈ [1, 20] (practical training range)
   - `reps` ∈ [1, 100] (supports high-rep endurance work)
   - `rest` ∈ [0, 600] (0 = superset, 600 = 10 minutes max)

#### Future Extensions

```prisma
model WorkoutExercise {
  // ... existing fields

  tempo           String?        // "3-1-2-0" (eccentric-pause-concentric-pause)
  targetRPE       Int?           // 1-10 scale
  loadType        String?        // "Bodyweight", "Weighted", "Assisted"
  externalLoad    Float?         // kg/lbs for weighted exercises
  isSuperset      Boolean        // Part of superset (rest = 0)
  orderIndex      Int            // Exercise order in workout (1, 2, 3...)
}
```

#### Example Data

```json
{
  "id": 1,
  "workoutId": 42,
  "exerciseId": 2,
  "sets": 5,
  "reps": 5,
  "rest": 180,
  "notes": "Focus on full range of motion"
}
```

---

### SessionExercise

**Purpose:** Join table between `Session` and `Exercise` with actual execution data.

#### Database Schema

```prisma
model SessionExercise {
  id         Int      @id @default(autoincrement())
  sessionId  Int
  exerciseId Int
  actualReps Int
  sets       Int
  notes      String?

  session    Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  exercise   Exercise @relation(fields: [exerciseId], references: [id], onDelete: Restrict)
}
```

#### Field Specifications

| **Field**    | **Type**  | **Constraints** | **Description**                    |
| ------------ | --------- | --------------- | ---------------------------------- |
| `id`         | `Int`     | Primary Key     | Auto-incremented unique identifier |
| `sessionId`  | `Int`     | FK (Cascade)    | Parent session                     |
| `exerciseId` | `Int`     | FK (Restrict)   | Referenced exercise                |
| `actualReps` | `Int`     | Required, ≥ 0   | Actual reps performed per set      |
| `sets`       | `Int`     | Required, ≥ 1   | Number of sets completed           |
| `notes`      | `String?` | Optional        | Subjective feedback per exercise   |

#### Business Rules

1. **Compositional Ownership**
   - Deleting `Session` deletes all `SessionExercise` (cascade)

2. **Actual vs. Planned**
   - `actualReps` may differ from `WorkoutExercise.reps`
   - Supports auto-regulation (adjust based on readiness)

3. **Partial Completion**
   - `actualReps = 0` is valid (attempted but failed)
   - Example: Failed handstand attempt (logged as 0 reps)

#### Comparison with WorkoutExercise

| **Attribute** | **WorkoutExercise** (Planned) | **SessionExercise** (Actual) |
| ------------- | ----------------------------- | ---------------------------- |
| Reps field    | `reps` (target)               | `actualReps` (performed)     |
| Rest field    | `rest` (prescribed)           | ❌ Not tracked               |
| Tempo field   | ✅ Future                     | ❌ Not tracked               |
| RPE field     | ✅ Future (target)            | ✅ Future (actual)           |

**Design Rationale:**

- **WorkoutExercise** = Prescriptive (what you _should_ do)
- **SessionExercise** = Descriptive (what you _actually did_)

#### Future Extensions

```prisma
model SessionExercise {
  // ... existing fields

  actualRPE       Int?           // Perceived exertion per exercise
  externalLoad    Float?         // Actual weight used (kg/lbs)
  restTaken       Int?           // Actual rest (seconds)
  formRating      Int?           // 1-5 self-assessment
  videoId         String?        // Reference to form check video
  failurePoint    String?        // "Concentric", "Lockout" (for failed reps)
}
```

#### Example Data

```json
{
  "id": 1,
  "sessionId": 101,
  "exerciseId": 2,
  "sets": 5,
  "actualReps": 6,
  "notes": "Last set hit failure at rep 5"
}
```

---

## Future Entities

---

### TrainingMetrics (Planned Q1 2026)

**Purpose:** Derived metrics computed from session data for analytics and progress tracking.

#### Proposed Schema

```prisma
model TrainingMetrics {
  id              Int      @id @default(autoincrement())
  sessionId       Int      @unique

  // Volume metrics
  totalReps       Int      // Sum of all actualReps
  totalSets       Int      // Sum of all sets
  totalVolume     Int      // totalReps (for bodyweight)
  totalTonnage    Float?   // Sum of (reps * load) for weighted

  // Intensity metrics
  avgIntensity    Float?   // Based on exercise difficulty ratings
  sessionRPE      Int?     // Overall perceived exertion

  // Categorized volume
  pushVolume      Int      // Reps in Push exercises
  pullVolume      Int      // Reps in Pull exercises
  legVolume       Int      // Reps in Legs exercises
  coreVolume      Int      // Reps in Core exercises
  skillVolume     Int      // Reps/time in Skill exercises

  // Time-based metrics
  timeUnderTension Int?    // For isometric holds (seconds)

  session         Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([sessionId])
}
```

**Computation Strategy:**

- **Batch processing:** Nightly cron job computes metrics for recent sessions
- **Real-time:** Compute on session creation (blocking) or async (background job)

---

### Goal (Planned Q2 2026)

**Purpose:** User-defined performance targets with deadline and progress tracking.

#### Proposed Schema

```prisma
model Goal {
  id              Int      @id @default(autoincrement())
  externalUserId  String

  name            String   // "Achieve 10 Pull-Ups"
  targetExerciseId Int?    // Optional FK to Exercise
  targetMetric    String   // "reps", "time", "max_load"
  targetValue     Float    // 10.0 (reps)
  currentValue    Float?   // Updated automatically

  startDate       DateTime
  deadline        DateTime
  status          String   // "In Progress", "Achieved", "Abandoned"

  exercise        Exercise? @relation(fields: [targetExerciseId], references: [id])
  phases          TrainingPhase[]

  @@index([externalUserId])
}
```

---

### TrainingPhase (Planned Q2 2026)

**Purpose:** Structured periodization blocks (mesocycles) with specific training focus.

#### Proposed Schema

```prisma
model TrainingPhase {
  id              Int      @id @default(autoincrement())
  externalUserId  String
  goalId          Int?

  name            String   // "Hypertrophy Block 1"
  phaseType       String   // "Hypertrophy", "Strength", "Skill", "Deload"
  startDate       DateTime
  endDate         DateTime

  goal            Goal?    @relation(fields: [goalId], references: [id])
  workouts        Workout[] // Workouts assigned to this phase

  @@index([externalUserId])
}
```

**Phase Types:**

- **Hypertrophy:** High volume (8-12 reps), moderate intensity
- **Strength:** Low volume (1-5 reps), high intensity
- **Skill:** Technique focus, lower fatigue
- **Deload:** Reduced volume for recovery

---

## Design Patterns

### 1. External User Reference Pattern

**Problem:** Training Service does not manage user authentication.

**Solution:** Immutable `externalUserId` field referencing Auth Service.

```typescript
interface UserScoped {
  externalUserId: string; // From JWT claims
}

// All queries enforce boundary
async findByUser(externalUserId: string) {
  return this.prisma.workout.findMany({
    where: { externalUserId }
  });
}
```

**Benefits:**

- Loose coupling between services
- Auth Service can evolve independently
- Supports future migration to different auth providers

---

### 2. Compositional vs. Referential Relationships

| **Pattern**       | **Entities**                | **Delete Behavior**            |
| ----------------- | --------------------------- | ------------------------------ |
| **Compositional** | Workout ↔ WorkoutExercise  | Cascade (part-of relationship) |
| **Compositional** | Session ↔ SessionExercise  | Cascade                        |
| **Referential**   | Exercise ↔ WorkoutExercise | Restrict (shared resource)     |
| **Referential**   | Workout ↔ Session          | Nullify (optional reference)   |

**Rule of Thumb:**

- If child cannot exist without parent → **Compositional** (cascade)
- If child references shared resource → **Referential** (restrict/nullify)

---

### 3. Template-Instance Pattern

**Pattern:** Workout (template) → Session (instance)

```
Workout = "Upper Body Push Day" (reusable blueprint)
   ↓ instantiate
Session = "October 27, 2025 at 8:30 AM" (one-time execution)
```

**Key Properties:**

- Template can be instantiated multiple times
- Instance can deviate from template (auto-regulation)
- Instance can exist without template (free-form training)

---

### 4. Immutable Log Pattern

**Pattern:** Sessions are append-only historical records.

```typescript
// ✅ Allowed: Create session
await prisma.session.create({ data: {...} });

// ❌ Forbidden: Update session
await prisma.session.update({ where: { id }, data: {...} });

// ✅ Exception: Update notes within 24h grace period
if (Date.now() - session.date < 24 * 3600 * 1000) {
  await prisma.session.update({
    where: { id },
    data: { notes: updatedNotes }
  });
}
```

**Rationale:**

- Training logs are legal records (doping controls, sports science research)
- Prevents accidental data corruption
- Enables reliable time-series analysis

---

## Evolution Guidelines

### Adding New Fields

**Safe Additions (Non-Breaking):**

- New optional fields (`String?`, `Int?`)
- New relationships with optional FK (`workoutId Int?`)

**Example:**

```prisma
model Session {
  // ... existing fields
  location String? // ✅ Optional, backward compatible
}
```

**Breaking Changes (Require Migration):**

- Making existing optional field required
- Changing field type (e.g., `String` → `Int`)
- Removing fields

---

### Introducing New Entities

**Steps:**

1. **Define schema** in `prisma/schema.prisma`
2. **Generate migration** (`npx prisma migrate dev --name add_training_metrics`)
3. **Create NestJS module** (`nest g module training-metrics`)
4. **Create service & controller**
5. **Add validation DTOs**
6. **Write tests** (unit + integration)
7. **Update API documentation** (Swagger)

**Example:**

```bash
# Add new entity to schema
npx prisma migrate dev --name add_training_metrics

# Generate NestJS scaffolding
nest g module training-metrics
nest g service training-metrics
nest g controller training-metrics

# Run tests
npm run test
```

---

### Deprecation Strategy

**Scenario:** Rename field `mediaUrl` → `legacyMediaUrl`

**Process:**

1. **Phase 1:** Add new field `imageId` (keep `mediaUrl`)
2. **Phase 2:** Migrate data (`UPDATE Exercise SET imageId = ...`)
3. **Phase 3:** Mark `mediaUrl` as deprecated in API docs
4. **Phase 4:** After 6 months, remove `mediaUrl`

**Prisma Migration:**

```prisma
// Phase 1
model Exercise {
  mediaUrl  String?  // @deprecated Use imageId instead
  imageId   String?  // ← New preferred field
}

// Phase 4 (6 months later)
model Exercise {
  imageId   String?  // mediaUrl removed
}
```

---

## Validation Rules Summary

| **Entity**      | **Rule**                                    | **Enforcement**     |
| --------------- | ------------------------------------------- | ------------------- |
| Exercise        | `name` must be unique                       | Database constraint |
| Workout         | Must have ≥ 1 exercise                      | Application logic   |
| WorkoutExercise | `sets` ∈ [1, 20], `reps` ∈ [1, 100]         | DTO validation      |
| Session         | `duration` ≥ 60 seconds                     | DTO validation      |
| Session         | `date` cannot be > 24h in future            | Application logic   |
| SessionExercise | `actualReps` ≥ 0 (supports failed attempts) | DTO validation      |

---

## Indexes & Performance

**Critical Indexes:**

```prisma
model Workout {
  externalUserId String
  @@index([externalUserId]) // ← User isolation queries
}

model Session {
  externalUserId String
  date           DateTime
  @@index([externalUserId, date]) // ← Time-series queries
}
```

**Query Patterns:**

```sql
-- Fast: Uses index
SELECT * FROM "Workout" WHERE "externalUserId" = 'user_123';

-- Fast: Uses composite index
SELECT * FROM "Session"
WHERE "externalUserId" = 'user_123'
  AND "date" BETWEEN '2025-01-01' AND '2025-12-31';
```

---

## References

- [Prisma Schema Documentation](https://www.prisma.io/docs/orm/prisma-schema)
- [NestJS Database Integration](https://docs.nestjs.com/techniques/database)
- [Domain-Driven Design Patterns](https://martinfowler.com/tags/domain%20driven%20design.html)

---

**Document Version:** 1.0.0  
**Last Updated:** October 27, 2025
