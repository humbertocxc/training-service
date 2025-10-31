# Event Bus Documentation

## Overview

The `training-service` publishes domain events to RabbitMQ to enable asynchronous communication with other services in the system. Events are published using a **topic exchange** pattern, allowing flexible routing based on event types.

---

## Configuration

### Environment Variables

| Variable                 | Description                       | Default Value           | Required |
| ------------------------ | --------------------------------- | ----------------------- | -------- |
| `RABBITMQ_URL`           | RabbitMQ connection URL           | `amqp://localhost:5672` | Yes      |
| `RABBITMQ_EXCHANGE`      | Exchange name for training events | `training.events`       | Yes      |
| `RABBITMQ_EXCHANGE_TYPE` | Exchange type                     | `topic`                 | No       |

### Example Configuration

```bash
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
RABBITMQ_EXCHANGE=training.events
RABBITMQ_EXCHANGE_TYPE=topic
```

---

## Exchange Information

### Exchange Details

- **Name**: `training.events` (configurable via `RABBITMQ_EXCHANGE`)
- **Type**: `topic`
- **Durable**: `true`
- **Auto-delete**: `false`

### Routing Key Format

Events use a hierarchical routing key format:

```
training.<domain>.<action>
```

**Pattern Examples:**

- `training.session.completed` - Session completion event
- `training.session.started` - Session start event
- `training.workout.created` - Workout creation event
- `training.workout.updated` - Workout update event
- `training.goal.achieved` - Goal achievement event
- `training.phase.transitioned` - Training phase transition event

### Binding Patterns

Consumers can subscribe using wildcard patterns:

- `training.session.*` - All session events
- `training.workout.*` - All workout events
- `training.#` - All training service events
- `training.*.completed` - All completion events across domains

---

## Event Structure

### Base Event Schema

All events follow a consistent JSON structure:

```json
{
  "eventType": "string",
  "timestamp": "ISO 8601 string",
  "userExternalId": "string",
  "...domain-specific fields"
}
```

### Field Definitions

| Field            | Type   | Description                                      | Required |
| ---------------- | ------ | ------------------------------------------------ | -------- |
| `eventType`      | string | Routing key (e.g., `training.session.completed`) | ✓        |
| `timestamp`      | string | ISO 8601 timestamp of event creation             | ✓        |
| `userExternalId` | string | External user identifier from JWT (sub claim)    | ✓        |
| Domain fields    | varies | Event-specific payload data                      | ✓        |

---

## Event Flow

### Outgoing Events → External Services

The training-service publishes events to enable other services to react to training activities:

#### To Periodization Service

The `training.session.completed` event is the primary integration point with the periodization service. This allows the periodization service to:

- **Adjust Training Load**: Modify volume and intensity based on session frequency and RPE trends
- **Progress/Regress Phases**: Automatically transition between training phases (e.g., from hypertrophy to strength)
- **Calculate Recovery Needs**: Determine rest requirements based on session duration and perceived effort
- **Track Progression**: Monitor improvements in specific exercises or movement patterns
- **Identify Plateaus**: Detect when progress has stalled and suggest deload weeks or program changes

**Integration Pattern:**

```
training-service → RabbitMQ (training.session.completed)
                     ↓
           periodization-service (consumer)
                     ↓
         Update user training program
```

**Consumer Binding:**

```typescript
// Periodization service should bind to:
await channel.bindQueue(queue, 'training.events', 'training.session.completed');
```

#### To Analytics Service

Session completed events enable the analytics service to:

- Calculate weekly/monthly training volume
- Track workout consistency and adherence
- Generate performance reports and visualizations
- Identify injury risk factors based on load patterns

#### To Notification Service

Events can trigger user notifications for:

- Congratulations on personal records
- Reminders for rest days or recovery
- Milestone achievements (e.g., 100 sessions completed)

---

## Published Events

### Session Events

#### `training.session.completed`

Published when a training session is logged and completed. This event is sent to external services (e.g., periodization-service) to track training progress and adjust programming.

**Payload Structure:**

```typescript
interface SessionCompletedEventDto {
  eventType: 'training.session.completed';
  timestamp: string; // ISO 8601 timestamp
  userExternalId: string; // JWT sub claim
  session: {
    sessionId: string;
    workoutId?: string;
    date: string; // ISO 8601 session date
    duration: number; // seconds
    perceivedEffort?: number; // Average RPE (1-10)
    notes?: string;
  };
}
```

**Example 1: Planche Progression Session**

```json
{
  "eventType": "training.session.completed",
  "timestamp": "2025-10-29T14:30:00.000Z",
  "userExternalId": "auth0|user_planche123",
  "session": {
    "sessionId": "42",
    "workoutId": "15",
    "date": "2025-10-29T14:00:00.000Z",
    "duration": 3600,
    "perceivedEffort": 8.5,
    "notes": "Solid planche training - achieved 10s tuck planche hold PR"
  }
}
```

**Example 2: OAC (One Arm Chin-up) Testing Session**

```json
{
  "eventType": "training.session.completed",
  "timestamp": "2025-10-29T10:15:00.000Z",
  "userExternalId": "auth0|user_oac456",
  "session": {
    "sessionId": "87",
    "date": "2025-10-29T09:30:00.000Z",
    "duration": 1800,
    "perceivedEffort": 9.5,
    "notes": "OAC max testing - new PR with 5s hold at top, minimal band assistance"
  }
}
```

**Example 3: Full Body Strength Session**

```json
{
  "eventType": "training.session.completed",
  "timestamp": "2025-10-29T18:45:00.000Z",
  "userExternalId": "auth0|user_strength789",
  "session": {
    "sessionId": "123",
    "workoutId": "28",
    "date": "2025-10-29T17:00:00.000Z",
    "duration": 4500,
    "perceivedEffort": 7.8,
    "notes": "Push day - weighted dips felt heavy but completed all sets"
  }
}
```

**Field Descriptions:**

| Field                     | Type   | Description                                      | Required |
| ------------------------- | ------ | ------------------------------------------------ | -------- |
| `eventType`               | string | Always `'training.session.completed'`            | ✓        |
| `timestamp`               | string | ISO 8601 timestamp when event was published      | ✓        |
| `userExternalId`          | string | User identifier from JWT (sub claim)             | ✓        |
| `session.sessionId`       | string | Unique session identifier                        | ✓        |
| `session.workoutId`       | string | Associated workout template ID                   |          |
| `session.date`            | string | ISO 8601 timestamp of when session was performed | ✓        |
| `session.duration`        | number | Session duration in seconds                      | ✓        |
| `session.perceivedEffort` | number | Average RPE across all exercises (1-10 scale)    |          |
| `session.notes`           | string | Optional user notes about the session            |          |

**Use Cases for Consuming Services:**

- **Periodization Service**: Adjust training volume and intensity based on session frequency and RPE trends
- **Analytics Service**: Track training consistency, volume progression, and fatigue indicators
- **Notification Service**: Send congratulations on PRs or remind users of rest days
- **Recovery Service**: Calculate recovery needs based on session duration and perceived effort

---

#### `training.session.started`

Published when a training session begins.

**Example Payload:**

```json
{
  "eventType": "training.session.started",
  "timestamp": "2025-10-29T13:00:00.000Z",
  "userExternalId": "auth0|user123",
  "sessionId": 42,
  "workoutId": 15,
  "startedAt": "2025-10-29T13:00:00.000Z",
  "plannedExercises": [
    {
      "exerciseId": 1,
      "plannedSets": 3,
      "plannedReps": 10
    }
  ]
}
```

---

### Workout Events

#### `training.workout.created`

Published when a new workout is created.

**Example Payload:**

```json
{
  "eventType": "training.workout.created",
  "timestamp": "2025-10-29T10:00:00.000Z",
  "userExternalId": "auth0|user123",
  "workoutId": 15,
  "name": "Upper Body Strength",
  "description": "Focus on push movements",
  "exercises": [
    {
      "exerciseId": 1,
      "order": 1,
      "sets": 3,
      "reps": 10
    }
  ]
}
```

---

#### `training.workout.updated`

Published when a workout is modified.

**Example Payload:**

```json
{
  "eventType": "training.workout.updated",
  "timestamp": "2025-10-29T11:00:00.000Z",
  "userExternalId": "auth0|user123",
  "workoutId": 15,
  "changes": {
    "name": "Upper Body Power",
    "exercises": [
      {
        "exerciseId": 1,
        "order": 1,
        "sets": 5,
        "reps": 5
      }
    ]
  }
}
```

---

### Goal Events

#### `training.goal.created`

Published when a user sets a new training goal.

**Example Payload:**

```json
{
  "eventType": "training.goal.created",
  "timestamp": "2025-10-29T09:00:00.000Z",
  "userExternalId": "auth0|user123",
  "goalId": 7,
  "type": "STRENGTH",
  "targetValue": 100,
  "currentValue": 80,
  "targetDate": "2025-12-31T23:59:59.000Z",
  "description": "Increase bench press to 100kg"
}
```

---

#### `training.goal.achieved`

Published when a goal is successfully achieved.

**Example Payload:**

```json
{
  "eventType": "training.goal.achieved",
  "timestamp": "2025-10-29T15:00:00.000Z",
  "userExternalId": "auth0|user123",
  "goalId": 7,
  "achievedAt": "2025-10-29T15:00:00.000Z",
  "finalValue": 102,
  "targetValue": 100
}
```

---

### Training Phase Events

#### `training.phase.transitioned`

Published when a user moves to a new training phase.

**Example Payload:**

```json
{
  "eventType": "training.phase.transitioned",
  "timestamp": "2025-10-29T08:00:00.000Z",
  "userExternalId": "auth0|user123",
  "phaseId": 3,
  "phaseName": "Hypertrophy Phase",
  "previousPhaseId": 2,
  "startDate": "2025-10-29T00:00:00.000Z",
  "plannedEndDate": "2025-11-26T23:59:59.000Z",
  "focus": "Muscle growth with moderate weights and higher volume"
}
```

---

## Usage Examples

### Publishing an Event

```typescript
import { EventPublisherService } from './event-bus/event-publisher.service';

@Injectable()
export class SessionService {
  constructor(private readonly eventPublisher: EventPublisherService) {}

  async completeSession(sessionId: number, userExternalId: string) {
    // ... session completion logic ...

    // Publish event
    await this.eventPublisher.publish('training.session.completed', {
      userExternalId,
      sessionId,
      workoutId: session.workoutId,
      completedAt: new Date().toISOString(),
      duration: 3600,
      exercises: session.exercises,
      notes: session.notes,
    });
  }
}
```

### Consuming Events (External Service)

```typescript
// Example consumer in another service
import * as amqp from 'amqplib';

async function consumeSessionEvents() {
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();

  const exchange = 'training.events';
  const queue = 'analytics-service.sessions';

  await channel.assertExchange(exchange, 'topic', { durable: true });
  await channel.assertQueue(queue, { durable: true });

  // Bind to all session events
  await channel.bindQueue(queue, exchange, 'training.session.*');

  channel.consume(queue, (msg) => {
    if (msg) {
      const event = JSON.parse(msg.content.toString());
      console.log('Received event:', event.eventType);

      // Process event...

      channel.ack(msg);
    }
  });
}
```

---

## Best Practices

### Event Publishing

1. **Always include `userExternalId`**: Ensures traceability and proper event attribution
2. **Use ISO 8601 timestamps**: Consistent time representation across services
3. **Keep payloads focused**: Only include relevant domain data for the event
4. **Handle failures gracefully**: EventPublisher will throw on failure - implement retry logic if needed

### Event Consumption

1. **Use appropriate binding patterns**: Subscribe only to events you need
2. **Implement idempotency**: Events may be delivered more than once
3. **Handle schema evolution**: Be prepared for new fields in events
4. **Use dead letter queues**: Capture failed message processing
5. **Monitor queue depths**: Prevent consumer lag

### Routing Keys

1. **Follow the hierarchy**: `training.<domain>.<action>`
2. **Use present tense for states**: `started`, `completed`, `created`
3. **Use past tense for completed actions**: `achieved`, `transitioned`
4. **Keep keys concise**: Avoid deeply nested hierarchies

---

## Monitoring

### Logs

The EventPublisher service logs all published events:

```
[Event Published] training.session.completed
```

### Metrics to Monitor

- Event publish rate
- Failed publish attempts
- Exchange/queue depths
- Consumer lag
- Message processing time

---

## Troubleshooting

### Events Not Being Published

1. **Check RabbitMQ connection**:
   - Verify `RABBITMQ_URL` is correct
   - Ensure RabbitMQ is running and accessible

2. **Check exchange configuration**:
   - Verify exchange exists and is of type `topic`
   - Check exchange name matches `RABBITMQ_EXCHANGE`

3. **Review application logs**:
   - Look for connection errors
   - Check for publish failures

### Events Not Being Received

1. **Verify queue bindings**:
   - Ensure routing key pattern matches published events
   - Check queue is bound to correct exchange

2. **Check consumer configuration**:
   - Verify consumer is connected and running
   - Check for consumer errors in logs

3. **Inspect messages**:
   - Use RabbitMQ management UI to view messages
   - Verify message format matches expected schema

---

## Related Documentation

- [Architecture Documentation](./ARCHITECTURE.md)
- [API Contracts](./API_CONTRACTS.md)
- [Training Science](./TRAINING_SCIENCE.md)
