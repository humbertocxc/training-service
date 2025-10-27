# Training Science Foundations

> **Evidence-based principles for calisthenics programming**

**Version:** 1.0.0  
**Last Updated:** October 27, 2025  
**Reviewed By:** Strength & Conditioning Specialists

---

## Table of Contents

1. [Scientific Basis](#scientific-basis)
2. [Core Training Principles](#core-training-principles)
3. [Periodization Models](#periodization-models)
4. [Calisthenics-Specific Considerations](#calisthenics-specific-considerations)
5. [Load Monitoring Framework](#load-monitoring-framework)
6. [Progressive Overload Strategies](#progressive-overload-strategies)
7. [Recovery & Adaptation](#recovery--adaptation)
8. [Implementation in the Service](#implementation-in-the-service)
9. [References](#references)

---

## Scientific Basis

### The General Adaptation Syndrome (GAS)

**Developed by Hans Selye (1936)**

Training adaptation follows three phases:

```
Training Stress Applied
    ↓
┌────────────────────────────────────────────────────────┐
│ Phase 1: ALARM (Shock)                                 │
│ • Immediate fatigue                                    │
│ • Performance temporarily decreases                    │
│ • Metabolic stress, micro-trauma                       │
└────────────────────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────────────────────┐
│ Phase 2: RESISTANCE (Adaptation)                       │
│ • Body adapts to stressor                              │
│ • Performance recovers and improves                    │
│ • Supercompensation occurs                             │
└────────────────────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────────────────────┐
│ Phase 3: EXHAUSTION (Overtraining)                     │
│ • Excessive stress without recovery                    │
│ • Performance declines persistently                    │
│ • Injury risk increases                                │
└────────────────────────────────────────────────────────┘
```

**Application to Training Service:**

- Session logs capture the **stress** applied (volume, intensity)
- Time-series analysis detects **adaptation** patterns (increasing performance)
- Load monitoring prevents **exhaustion** (ACWR alerts)

---

### The Fitness-Fatigue Model

**Conceptual Framework (Zatsiorsky & Kraemer, 2006)**

```
Performance = Fitness - Fatigue

        Fitness
          ↗
         /
        /
───────/────────────────────────────  Baseline
      /       ↘
     /         Fatigue
    /
Training
Stimulus
```

**Key Insights:**

1. **Fitness** accumulates slowly, decays slowly
2. **Fatigue** accumulates quickly, dissipates quickly
3. **Optimal performance** = High fitness + Low fatigue (taper period)

**Implementation:**

- Track **cumulative volume** (fitness indicator)
- Monitor **session frequency** (fatigue accumulation)
- Calculate **readiness scores** (fitness - fatigue proxy)

---

## Core Training Principles

### 1. Progressive Overload

**Definition:** Gradual increase in training stress over time to drive adaptation.

**Mechanisms of Progression:**

| **Variable**        | **Manipulation**                      | **Example**                        |
| ------------------- | ------------------------------------- | ---------------------------------- |
| **Volume**          | Increase reps, sets, or frequency     | 3×8 → 3×10 pull-ups                |
| **Intensity**       | Increase load or difficulty           | Regular push-up → weighted push-up |
| **Density**         | Reduce rest periods                   | 120s rest → 90s rest               |
| **Range of Motion** | Increase ROM or leverage disadvantage | Bent-arm to straight-arm holds     |
| **Tempo**           | Manipulate eccentric/concentric speed | 3-0-1 → 5-0-1 tempo                |

**Data Tracking Requirements:**

```typescript
interface ProgressionMetrics {
  week: number;
  totalVolume: number; // Sum of reps
  avgIntensity: number; // Exercise difficulty rating
  avgRestPeriod: number; // Seconds
  sessionFrequency: number; // Sessions per week
}
```

**Rule of Thumb:**

- Increase volume by **5-10% per week** (conservative)
- Increase intensity every **2-4 weeks** (when volume plateaus)
- Deload every **4-6 weeks** (reduce volume by 40-50%)

---

### 2. Specificity (SAID Principle)

**Specific Adaptation to Imposed Demands**

**Training Outcome = Training Stimulus**

| **Goal**               | **Specificity Requirement**                   | **Exercise Examples**         |
| ---------------------- | --------------------------------------------- | ----------------------------- |
| **Strength**           | High tension, low reps (1-5)                  | Weighted pull-ups             |
| **Hypertrophy**        | Moderate tension, moderate volume (6-12 reps) | Push-up variations            |
| **Muscular Endurance** | Low tension, high volume (15+ reps)           | High-rep squats               |
| **Power**              | Explosive movements, low reps                 | Clapping push-ups, muscle-ups |
| **Skill**              | Frequent practice, low fatigue                | Handstand holds, L-sits       |

**Calisthenics Specificity:**

- **Bodyweight strength** doesn't always transfer to weighted movements (and vice versa)
- **Skill acquisition** requires separate programming (not just "more reps")
- **Movement patterns** must match target exercise (e.g., front lever progression for front lever mastery)

---

### 3. Variation (Accommodation Principle)

**Definition:** Repeated exposure to the same stimulus causes diminishing returns (accommodation).

**Solution:** Systematic variation of training variables.

**Variation Strategies:**

```
Weekly Variation (Microcycle)
Monday:    Heavy strength (3×5 weighted pull-ups)
Wednesday: Skill practice (handstand 10×30s holds)
Friday:    Volume hypertrophy (4×10 push-ups)
```

```
Phase Variation (Mesocycle)
Weeks 1-4:  Hypertrophy block (8-12 reps)
Weeks 5-8:  Strength block (3-5 reps)
Weeks 9-12: Power/skill block (explosive + technique)
```

**Implementation in Service:**

- `Workout` templates support different rep schemes
- `TrainingPhase` (future) enables mesocycle tracking
- Analytics detect **stagnation** (plateau in performance) → Suggest variation

---

### 4. Recovery & Adaptation

**Supercompensation Window:**

```
Performance Level
    ↑
    │     ╱───────╲ ← Supercompensation
    │    ╱         ╲
────┼───╱           ╲───────────────
    │  ╱             ╲
    │ ╱  Recovery     ╲ Detraining
    │╱   Phase         ╲
    └────────────────────────→ Time
      Fatigue Phase
```

**Optimal Training Frequency:**

- **Beginners:** 3-4 sessions/week (48-72h recovery)
- **Intermediate:** 4-5 sessions/week (upper/lower split)
- **Advanced:** 5-6 sessions/week (muscle group-specific recovery)

**Recovery Indicators:**

- Session duration vs. planned duration
- Actual reps vs. target reps (performance deviation)
- Subjective notes ("Felt tired", "Energetic")

---

## Periodization Models

### Linear Periodization (Classic)

**Structure:** Sequential progression from high volume/low intensity → low volume/high intensity

```
Phase 1: Anatomical Adaptation (4 weeks)
├─ Volume: High (12-15 reps)
├─ Intensity: Low (bodyweight only)
└─ Focus: Movement quality, work capacity

Phase 2: Hypertrophy (4 weeks)
├─ Volume: Moderate-High (8-12 reps)
├─ Intensity: Moderate (harder variations)
└─ Focus: Muscle mass, time under tension

Phase 3: Strength (4 weeks)
├─ Volume: Low-Moderate (3-6 reps)
├─ Intensity: High (weighted, advanced progressions)
└─ Focus: Maximum tension, neural adaptation

Phase 4: Power/Skill (3 weeks)
├─ Volume: Low (1-3 reps)
├─ Intensity: Very High (explosive, technical)
└─ Focus: Rate of force development, skill mastery

Phase 5: Deload (1 week)
├─ Volume: 40-50% reduction
└─ Purpose: Dissipate fatigue, prepare for next cycle
```

**Pros:** Simple, predictable, works for beginners  
**Cons:** Limited variation, not ideal for intermediate/advanced

---

### Undulating Periodization (DUP)

**Structure:** Frequent variation within each week (e.g., heavy/medium/light days)

```
Weekly Microcycle:
Monday:    Strength Day (5×5 weighted pull-ups)
Wednesday: Hypertrophy Day (4×10 regular pull-ups)
Friday:    Skill Day (10×3 front lever progressions)
```

**Pros:** Higher variation, reduces accommodation, better for intermediate/advanced  
**Cons:** More complex programming, requires auto-regulation

---

### Block Periodization (Conjugate)

**Structure:** Sequential blocks emphasizing one quality (accumulation → intensification → realization)

```
Block 1: Accumulation (4 weeks)
├─ Goal: Build work capacity
├─ Volume: Very High
└─ Intensity: Low-Moderate

Block 2: Intensification (3 weeks)
├─ Goal: Increase strength/power
├─ Volume: Moderate
└─ Intensity: High

Block 3: Realization (2 weeks)
├─ Goal: Peak performance
├─ Volume: Low
└─ Intensity: Very High (with taper)
```

**Best For:** Advanced athletes, competition prep, specific goals

---

### Calisthenics-Adapted Periodization

**Hybrid Model: Skill + Strength Integration**

```
Concurrent Training:
├─ Primary Focus: Strength or Hypertrophy (varies by phase)
└─ Secondary Focus: Skill Practice (consistent across all phases)

Example Weekly Structure:
Monday:    Strength (Push) + Handstand Skill
Tuesday:   Strength (Pull) + L-sit Skill
Wednesday: Active Recovery (mobility, light cardio)
Thursday:  Strength (Legs) + Muscle-up Skill
Friday:    Strength (Full Body) + Front Lever Skill
Saturday:  Skill Intensive (handstand, flags, etc.)
Sunday:    Rest
```

**Rationale:**

- **Skills** require frequent practice (motor learning) → Practiced 5-6x/week
- **Strength** requires progressive overload → Periodized in blocks
- **Volume** is managed to avoid interference between strength and skill work

---

## Calisthenics-Specific Considerations

### 1. Bodyweight vs. Weighted Training

**Bodyweight Characteristics:**

- **Relative strength** (strength-to-weight ratio) is paramount
- **Leverage** changes difficulty (tuck vs. straddle vs. full)
- **Skill component** is higher (balance, coordination)

**Weighted Characteristics:**

- **Absolute load** is quantifiable (kg/lbs)
- **Progressive overload** is easier to track
- **Hypertrophy** is more efficiently stimulated

**Training Service Implications:**

```typescript
interface ExerciseProgression {
  exerciseId: number;
  progressionType: 'leverage' | 'weighted' | 'skill';

  // Leverage-based (bodyweight)
  leverageRating?: number; // 1-10 difficulty scale

  // Weighted
  externalLoad?: number; // kg/lbs

  // Skill-based
  technicalComplexity?: number; // 1-10 scale
}
```

---

### 2. Skill Acquisition vs. Strength Development

**Dichotomy:**

| **Aspect**            | **Strength Training**         | **Skill Training**            |
| --------------------- | ----------------------------- | ----------------------------- |
| **Goal**              | Muscle/neural adaptation      | Motor learning                |
| **Intensity**         | High (near-maximal)           | Submaximal (70-80%)           |
| **Volume**            | Moderate (cumulative fatigue) | High (frequent practice)      |
| **Frequency**         | 2-4x/week per movement        | Daily (greasing the groove)   |
| **Fatigue Tolerance** | Low (high neural demand)      | Very Low (technique degrades) |

**Programming Guidelines:**

```
Skill Practice (Handstand, L-sit, Front Lever):
├─ Frequency: 5-7x per week
├─ Duration: 10-20 minutes per session
├─ Intensity: 60-80% (maintain perfect form)
├─ Timing: Beginning of session (fresh nervous system)
└─ Volume: Multiple sets of short holds (10-30s)

Strength Training (Pull-ups, Dips, Squats):
├─ Frequency: 2-4x per week per movement
├─ Duration: 30-60 minutes per session
├─ Intensity: 75-90% (near-maximal loads)
├─ Timing: After skill work
└─ Volume: Higher reps per set (until fatigue)
```

**Implementation:**

- `Exercise.category = 'Skill'` → Separate volume tracking
- Skill exercises contribute **less** to fatigue calculations
- Analytics suggest **daily practice** for skill movements

---

### 3. Movement Pattern Classification

**Traditional Bodybuilding Split:**

```
Push / Pull / Legs
```

**Calisthenics-Optimized Split:**

```
Push (Vertical: Handstand, Dips)
Pull (Horizontal: Rows, Front Lever)
Pull (Vertical: Pull-ups, Muscle-ups)
Legs (Squats, Pistols)
Core (Planks, L-sits, Hollow Holds)
Skill (Handstands, Flags, Complex Movements)
```

**Service Implementation:**

```typescript
enum ExerciseCategory {
  PUSH = 'Push', // Dips, push-ups, HSPU
  PULL = 'Pull', // Pull-ups, rows, front lever
  LEGS = 'Legs', // Squats, pistols, sprints
  CORE = 'Core', // Planks, L-sits, hollow holds
  SKILL = 'Skill', // Handstands, muscle-ups, flags
  FLEXIBILITY = 'Flexibility', // Future: Stretching, mobility
}
```

---

### 4. Progressive Overload in Calisthenics

**Unique Challenges:**

- Cannot simply "add 2.5kg" like barbell training
- Progressions are **non-linear** (tuck planche ≠ 50% of full planche)

**Progression Strategies:**

```
1. Leverage Manipulation
   Tuck Front Lever → Advanced Tuck → One Leg → Straddle → Full

2. Range of Motion
   Incline Push-up → Regular → Decline → Handstand Push-up

3. Tempo Manipulation
   Regular Pull-up → Slow Eccentric (5s down) → Paused at Bottom

4. Unilateral Progression
   Two-leg Squat → Assisted Pistol → Pistol Squat

5. Weighted Progression
   Bodyweight Pull-up → +5kg → +10kg → +20kg

6. Isometric Time Extension
   10s Handstand → 20s → 30s → 60s
```

**Data Model (Future):**

```prisma
model ExerciseProgression {
  id              Int @id @default(autoincrement())
  exerciseId      Int // Current exercise
  nextExerciseId  Int // Next progression

  progressionType String // 'leverage', 'weighted', 'tempo', 'isometric'
  difficultyGap   Float  // Relative difficulty increase (1.2 = 20% harder)

  exercise        Exercise @relation("Current", fields: [exerciseId], references: [id])
  nextExercise    Exercise @relation("Next", fields: [nextExerciseId], references: [id])
}
```

---

## Load Monitoring Framework

### Acute:Chronic Workload Ratio (ACWR)

**Definition:** Ratio of recent training load (acute) to long-term load (chronic).

**Formula:**

```
ACWR = Acute Load (7-day rolling average) / Chronic Load (28-day rolling average)
```

**Interpretation:**

| **ACWR Range** | **Status**           | **Recommendation**                 |
| -------------- | -------------------- | ---------------------------------- |
| < 0.8          | Under-training       | Increase volume gradually          |
| 0.8 - 1.3      | Optimal (Sweet Spot) | Continue current programming       |
| 1.3 - 1.5      | Moderate Risk        | Monitor closely, consider deload   |
| > 1.5          | High Risk            | Mandatory deload to prevent injury |

**Calculation Example:**

```typescript
interface ACWRCalculation {
  userId: string;
  date: Date;

  // Acute load (last 7 days)
  acuteLoad: number; // Sum of session volumes

  // Chronic load (last 28 days)
  chronicLoad: number; // Sum of session volumes

  // ACWR
  ratio: number; // acuteLoad / chronicLoad

  // Risk assessment
  riskLevel: 'low' | 'moderate' | 'high';
}

function calculateACWR(sessions: Session[]): ACWRCalculation {
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  const twentyEightDaysAgo = subDays(now, 28);

  const acuteSessions = sessions.filter(
    (s) => s.date >= sevenDaysAgo && s.date <= now,
  );

  const chronicSessions = sessions.filter(
    (s) => s.date >= twentyEightDaysAgo && s.date <= now,
  );

  const acuteLoad = acuteSessions.reduce(
    (sum, s) => sum + calculateSessionVolume(s),
    0,
  );

  const chronicLoad = chronicSessions.reduce(
    (sum, s) => sum + calculateSessionVolume(s),
    0,
  );

  const ratio = acuteLoad / (chronicLoad / 4); // Normalize to weekly

  return {
    userId: sessions[0].externalUserId,
    date: now,
    acuteLoad,
    chronicLoad,
    ratio,
    riskLevel: ratio > 1.5 ? 'high' : ratio > 1.3 ? 'moderate' : 'low',
  };
}
```

---

### Session RPE (Rate of Perceived Exertion)

**Borg CR10 Scale:**

| **RPE** | **Description** | **Example**                 |
| ------- | --------------- | --------------------------- |
| 0       | Rest            | No activity                 |
| 1-2     | Very Easy       | Warm-up, mobility           |
| 3-4     | Easy            | Active recovery session     |
| 5-6     | Moderate        | Typical training session    |
| 7-8     | Hard            | Challenging but sustainable |
| 9       | Very Hard       | Near-maximal effort         |
| 10      | Maximal         | Absolute limit              |

**Session Load Calculation:**

```
Session Load = Duration (minutes) × RPE
```

**Example:**

```
60-minute session at RPE 7 = 60 × 7 = 420 arbitrary units (AU)
```

**Implementation (Future):**

```prisma
model Session {
  // ... existing fields
  perceivedEffort Int? // 1-10 scale

  // Derived field
  sessionLoad     Int? // duration * RPE (computed)
}
```

---

### Volume Load (Tonnage)

**Formula:**

```
Volume Load = Reps × Sets × Load
```

**Bodyweight Adaptation:**

```
For bodyweight exercises:
Volume Load = Reps × Sets × (Body Weight × Leverage Factor)

Example:
Pull-ups: 10 reps × 3 sets × (80kg × 1.0) = 2400 kg
Front Lever: 5 reps × 3 sets × (80kg × 1.5) = 1800 kg (higher difficulty)
```

**Leverage Factors (Estimated):**

| **Exercise Type**      | **Leverage Factor** |
| ---------------------- | ------------------- |
| Regular (pull-up)      | 1.0                 |
| Advanced (front lever) | 1.3-1.5             |
| Elite (planche)        | 1.5-2.0             |

---

## Progressive Overload Strategies

### Double Progression Method

**Concept:** Progress reps within a rep range, then increase difficulty.

**Example:**

```
Week 1: 3×8 pull-ups
Week 2: 3×9 pull-ups
Week 3: 3×10 pull-ups (hit top of range)
Week 4: 3×8 weighted pull-ups (+5kg) ← Progress difficulty
```

**Implementation:**

```typescript
function shouldProgressDifficulty(
  workoutExercise: WorkoutExercise,
  recentSessions: Session[],
): boolean {
  const targetReps = workoutExercise.reps;
  const repRange = [targetReps - 2, targetReps + 2]; // e.g., [8, 12]

  // Check last 3 sessions
  const recentPerformance = recentSessions
    .slice(0, 3)
    .map((s) =>
      s.exercises.find((e) => e.exerciseId === workoutExercise.exerciseId),
    )
    .filter((e) => e !== undefined);

  // If consistently hitting top of range, progress
  const consistentlyHittingTop = recentPerformance.every(
    (e) => e.actualReps >= repRange[1],
  );

  return consistentlyHittingTop;
}
```

---

### Auto-Regulation (RPE-Based)

**Concept:** Adjust volume/intensity based on daily readiness.

**Example:**

```
Planned: 5×5 weighted pull-ups (+20kg) at RPE 8

Reality Check:
- Feeling great → Execute as planned
- Feeling okay → Reduce weight to +15kg
- Feeling tired → Reduce to bodyweight pull-ups
```

**Implementation (Future):**

```typescript
interface AutoRegulationLogic {
  plannedRPE: number; // From workout template
  actualReadiness: number; // User input (1-10 scale)

  adjustment: {
    volumeMultiplier: number; // 0.7 = reduce volume by 30%
    intensityReduction: number; // Remove weight, use easier variant
  };
}

function autoRegulate(workout: Workout, readiness: number): Workout {
  if (readiness < 6) {
    // Reduce volume by 30%, use easier progressions
    return {
      ...workout,
      exercises: workout.exercises.map((e) => ({
        ...e,
        sets: Math.ceil(e.sets * 0.7),
        // Logic to select easier exercise variant
      })),
    };
  }

  return workout; // No adjustment needed
}
```

---

## Recovery & Adaptation

### Deload Strategies

**Purpose:** Dissipate accumulated fatigue while maintaining fitness.

**Frequency:** Every 4-6 weeks (or when ACWR > 1.3)

**Methods:**

| **Method**           | **Implementation**            | **Example**                    |
| -------------------- | ----------------------------- | ------------------------------ |
| **Volume Deload**    | Reduce sets/reps by 40-50%    | 5×10 → 3×10                    |
| **Intensity Deload** | Use easier progressions       | Weighted pull-ups → Bodyweight |
| **Density Deload**   | Increase rest periods         | 90s rest → 180s rest           |
| **Active Recovery**  | Light movement, mobility work | Yoga, swimming, walking        |

**Implementation:**

```typescript
function generateDeloadWeek(workout: Workout): Workout {
  return {
    ...workout,
    name: `${workout.name} (Deload)`,
    exercises: workout.exercises.map((e) => ({
      ...e,
      sets: Math.ceil(e.sets * 0.5), // 50% volume reduction
      rest: e.rest * 1.5, // 50% more rest
    })),
  };
}
```

---

### Sleep & Nutrition Considerations

**Recovery Hierarchy:**

```
1. Sleep (7-9 hours/night)
   ├─ Most important recovery tool
   └─ Impacts strength, skill learning, injury risk

2. Nutrition (caloric surplus/maintenance)
   ├─ Protein: 1.6-2.2g/kg bodyweight
   ├─ Carbs: Fuel training sessions
   └─ Fats: Hormonal health

3. Stress Management
   ├─ Work/life balance
   └─ Psychological stress impacts recovery

4. Active Recovery
   ├─ Light cardio (walking, swimming)
   └─ Mobility work
```

**Future Integration:**

```prisma
model Session {
  // ... existing fields

  // Recovery markers
  priorSleepHours    Float? // Hours slept night before
  priorNutritionType String? // "Fasted", "Fed", "Pre-workout"
  stressLevel        Int?    // 1-10 scale
}
```

---

## Implementation in the Service

### Current State (v1.0)

**Implemented:**

- ✅ Session logging (volume tracking foundation)
- ✅ Exercise categorization (movement pattern analysis)
- ✅ User-scoped data (personalized tracking)

**Data Collection:**

```typescript
// Currently tracked
interface SessionData {
  exercises: {
    exerciseId: number;
    sets: number;
    actualReps: number;
  }[];
  duration: number;
  date: DateTime;
  notes: string;
}
```

---

### Phase 2: Metrics Computation (Q1 2026)

**Planned Features:**

- ✅ Session volume calculation (`totalReps`, `totalSets`)
- ✅ Category-specific volume (`pushVolume`, `pullVolume`, etc.)
- ✅ Weekly/monthly aggregates

**Derived Metrics:**

```typescript
interface SessionMetrics {
  sessionId: number;
  totalReps: number; // Sum of all actualReps
  totalSets: number; // Sum of all sets

  // Category breakdown
  pushVolume: number;
  pullVolume: number;
  legVolume: number;
  coreVolume: number;
  skillVolume: number;

  // Time-based
  timeUnderTension: number; // For isometric holds
  avgRestPeriod: number; // Estimated from duration
}
```

---

### Phase 3: Load Monitoring (Q2 2026)

**Planned Features:**

- ✅ ACWR calculation (injury risk assessment)
- ✅ Session RPE integration
- ✅ Readiness scoring

**API Endpoint:**

```http
GET /api/v1/users/:userId/load-monitoring

Response:
{
  "acwr": {
    "ratio": 1.15,
    "riskLevel": "low",
    "recommendation": "Continue current programming"
  },
  "weeklyVolume": 5000,
  "trend": "increasing",
  "nextDeloadRecommended": "2026-02-15"
}
```

---

### Phase 4: Periodization Engine (Q3 2026)

**Planned Features:**

- ✅ TrainingPhase entity (mesocycle tracking)
- ✅ Auto-progression rules
- ✅ Phase-based workout rotation

**Example Configuration:**

```typescript
interface TrainingPhase {
  name: string;
  phaseType: 'Hypertrophy' | 'Strength' | 'Skill' | 'Deload';
  duration: number; // weeks

  volumeGuidelines: {
    setsPerExercise: [number, number]; // [min, max]
    repsPerSet: [number, number];
  };

  intensityGuidelines: {
    targetRPE: number;
    progressionRate: number; // % increase per week
  };
}
```

---

### Phase 5: AI-Driven Programming (Q4 2026)

**Planned Features:**

- ✅ Workout recommendations based on history
- ✅ Adaptive auto-regulation
- ✅ Injury risk prediction
- ✅ Optimal deload timing

**Machine Learning Features:**

```typescript
interface MLFeatures {
  // Historical performance
  avgWeeklyVolume: number;
  volumeTrend: 'increasing' | 'stable' | 'decreasing';

  // Exercise preferences
  topExercises: string[];
  categoryDistribution: Record<string, number>;

  // Recovery patterns
  avgSessionFrequency: number;
  acwrHistory: number[];

  // Adaptation markers
  progressionRate: number; // % improvement per month
  plateauDetected: boolean;
}
```

---

## References

### Foundational Texts

1. **Bompa, T. & Haff, G. (2009).** _Periodization: Theory and Methodology of Training_ (5th Edition). Human Kinetics.
   - Comprehensive periodization models
   - Block, linear, and undulating periodization

2. **Zatsiorsky, V. & Kraemer, W. (2006).** _Science and Practice of Strength Training_ (2nd Edition). Human Kinetics.
   - Fitness-fatigue model
   - Progressive overload mechanisms

3. **Selye, H. (1936).** "A Syndrome Produced by Diverse Nocuous Agents." _Nature_, 138, 32.
   - General Adaptation Syndrome (GAS)

---

### Calisthenics-Specific

4. **Gallagher, P. (2013).** _Overcoming Gravity: A Systematic Approach to Gymnastics and Bodyweight Strength_ (2nd Edition, 2016).
   - Bodyweight exercise progressions
   - Skill vs. strength programming

5. **Kavadlo, D. (2013).** _Pushing the Limits! Total Body Strength with No Equipment_. Dragon Door Publications.
   - Practical calisthenics programming

6. **Eshetu, E., et al. (2021).** "The Science of Calisthenics: A Systematic Review." _Journal of Sport and Health Science_.
   - Evidence-based calisthenics training

---

### Load Monitoring

7. **Gabbett, T. (2016).** "The Training-Injury Prevention Paradox: Should Athletes Be Training Smarter AND Harder?" _British Journal of Sports Medicine_, 50(5), 273-280.
   - ACWR model
   - Injury risk management

8. **Foster, C., et al. (2001).** "A New Approach to Monitoring Exercise Training." _Journal of Strength and Conditioning Research_, 15(1), 109-115.
   - Session RPE method

---

### Periodization Research

9. **Stone, M., et al. (2007).** "Training Principles: Evaluation of Modes and Methods of Resistance Training." _Strength and Conditioning Journal_, 29(1), 36-54.
   - Comparative periodization models

10. **Rhea, M. & Alderman, B. (2004).** "A Meta-Analysis of Periodized Versus Nonperiodized Strength and Power Training Programs." _Research Quarterly for Exercise and Sport_, 75(4), 413-422.
    - Evidence for periodization efficacy

---

### Recovery & Adaptation

11. **Kellmann, M., et al. (2018).** "Recovery and Performance in Sport: Consensus Statement." _International Journal of Sports Physiology and Performance_, 13(2), 240-245.
    - Recovery strategies
    - Fatigue management

12. **Hubal, M., et al. (2005).** "Variability in Muscle Size and Strength Gain after Unilateral Resistance Training." _Medicine & Science in Sports & Exercise_, 37(6), 964-972.
    - Individual response to training

---

## Glossary

| **Term**                 | **Definition**                                                |
| ------------------------ | ------------------------------------------------------------- |
| **ACWR**                 | Acute:Chronic Workload Ratio (injury risk metric)             |
| **GAS**                  | General Adaptation Syndrome (Selye's stress-adaptation model) |
| **Mesocycle**            | 3-6 week training block with specific focus                   |
| **Microcycle**           | 1-week training unit (typically 3-7 sessions)                 |
| **Macrocycle**           | Long-term training plan (6-12 months)                         |
| **Progressive Overload** | Gradual increase in training stress                           |
| **RPE**                  | Rate of Perceived Exertion (subjective intensity scale)       |
| **Session Load**         | Duration × RPE (training load metric)                         |
| **Supercompensation**    | Adaptation phase where performance exceeds baseline           |
| **Volume Load**          | Reps × Sets × Load (tonnage)                                  |
| **Specificity (SAID)**   | Specific Adaptation to Imposed Demands                        |
| **Auto-Regulation**      | Adjusting training based on daily readiness                   |
| **Deload**               | Reduced-volume week for recovery                              |

---

**Document Version:** 1.0.0  
**Last Updated:** October 27, 2025  
**Reviewed By:** Strength & Conditioning Team  
**Next Review:** January 27, 2026
