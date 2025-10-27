# API Contracts & Inter-Service Communication

> **Defining the boundaries of the Training Service**

**Version:** 1.0.0  
**Last Updated:** October 27, 2025

---

## Table of Contents

1. [Service Boundary Definition](#service-boundary-definition)
2. [Inbound Dependencies](#inbound-dependencies)
3. [Outbound APIs](#outbound-apis)
4. [REST API Reference](#rest-api-reference)
5. [Authentication Flow](#authentication-flow)
6. [Error Handling](#error-handling)
7. [Versioning Strategy](#versioning-strategy)
8. [Future Service Contracts](#future-service-contracts)

---

## Service Boundary Definition

### What This Service Owns

The Training Service is the **authoritative source** for:

```
✅ OWNS (Read + Write Authority)
├── Exercise catalog (CRUD operations)
├── Workout templates (user-scoped CRUD)
├── Training sessions (user-scoped creation + read)
├── Exercise-workout relationships
└── Exercise-session relationships

❌ DOES NOT OWN (External Dependencies)
├── User authentication/authorization → Auth Service
├── User profiles (name, email, avatar) → User Service
├── Exercise images/videos (storage) → Media Service
├── Social interactions (likes, comments) → Community Service
└── Nutrition/biometrics data → Separate services
```

---

### Service Architecture Context

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                             │
│              (Authentication, Routing, Rate Limiting)           │
└────────────┬────────────────────────────────────────────────────┘
             │
    ┌────────┼────────┬────────────┬───────────────┐
    │        │        │            │               │
    ▼        ▼        ▼            ▼               ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   ┌──────────┐
│  Auth  │ │ USER   │ │ TRAIN  │ │ MEDIA  │   │ COMMUN   │
│ Service│ │ Service│ │ SERVICE│ │ Service│   │ Service  │
└────────┘ └────────┘ └───┬────┘ └────────┘   └──────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ PostgreSQL  │
                   │  (Primary)  │
                   └─────────────┘
```

**Communication Patterns:**

- **Synchronous:** HTTP REST APIs (primary)
- **Asynchronous:** Message queues (future: Kafka/RabbitMQ for analytics events)

---

## Inbound Dependencies

### 1. Authentication Service (Required)

**Dependency Type:** Critical (service cannot function without it)

**Data Flow:**

```
User Request
    ↓
API Gateway validates JWT (Auth Service)
    ↓
Extract { userId: "uuid", email: "...", role: "..." }
    ↓
Pass userId as externalUserId to Training Service
    ↓
Training Service filters all queries by externalUserId
```

**Contract Requirements:**

| **Aspect**     | **Requirement**                                                     |
| -------------- | ------------------------------------------------------------------- |
| **JWT Format** | Standard JWT with `userId` claim                                    |
| **Header**     | `Authorization: Bearer <token>`                                     |
| **Claims**     | `{ userId: string, email: string, role: string, exp: number }`      |
| **Validation** | Performed at API Gateway (Training Service trusts validated tokens) |

**Example JWT Payload:**

```json
{
  "userId": "user_abc123",
  "email": "athlete@example.com",
  "role": "user",
  "iat": 1698420000,
  "exp": 1698423600
}
```

**Error Scenarios:**

- **401 Unauthorized:** Missing or invalid JWT → Handled by API Gateway
- **403 Forbidden:** Valid JWT but insufficient permissions → Training Service checks `role`

---

### 2. Media Service (Optional)

**Dependency Type:** Optional (service degrades gracefully without it)

**Data Flow:**

```
Exercise has imageId = "img_abc123"
    ↓
Frontend fetches image from Media Service
    ↓
GET https://media-service.example.com/images/img_abc123
    ↓
Returns image URL or CDN redirect
```

**Contract Requirements:**

| **Aspect**          | **Requirement**                                                    |
| ------------------- | ------------------------------------------------------------------ |
| **Image ID Format** | String (UUID or custom identifier)                                 |
| **Fallback**        | Training Service also stores `mediaUrl` (direct link fallback)     |
| **Responsibility**  | Media Service handles storage, CDN, compression, format conversion |

**API Endpoint (Media Service):**

```http
GET /api/v1/media/images/:imageId
→ Returns: { url: "https://cdn.example.com/img_abc123.jpg" }
```

**Failure Handling:**

- If Media Service is down, Training Service returns `mediaUrl` as fallback
- Frontend displays placeholder image if both are unavailable

---

## Outbound APIs

### Service API Surface

The Training Service exposes REST APIs for external consumption:

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRAINING SERVICE APIS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PUBLIC (No Auth Required)                                      │
│  ├── GET /api/v1/exercises        (Exercise catalog)            │
│  └── GET /api/v1/exercises/:id    (Exercise details)            │
│                                                                 │
│  USER-SCOPED (Auth Required)                                    │
│  ├── POST   /api/v1/users/:userId/workouts                      │
│  ├── GET    /api/v1/users/:userId/workouts                      │
│  ├── GET    /api/v1/users/:userId/workouts/:id                  │
│  ├── PUT    /api/v1/users/:userId/workouts/:id                  │
│  ├── DELETE /api/v1/users/:userId/workouts/:id                  │
│  ├── POST   /api/v1/users/:userId/sessions                      │
│  ├── GET    /api/v1/users/:userId/sessions                      │
│  ├── GET    /api/v1/users/:userId/sessions/:id                  │
│  └── GET    /api/v1/users/:userId/sessions?from=X&to=Y          │
│                                                                 │
│  ANALYTICS (Future - Service-to-Service)                        │
│  ├── GET /api/v1/analytics/users/:userId/metrics                │
│  └── GET /api/v1/analytics/users/:userId/volume-trends          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## REST API Reference

### Exercise Endpoints

#### **GET /api/v1/exercises**

Retrieve all exercises in the catalog.

**Authentication:** None (public)

**Request:**

```http
GET /api/v1/exercises HTTP/1.1
Host: training-service.example.com
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Push Up",
    "category": "Push",
    "description": "A basic push exercise.",
    "mediaUrl": "https://example.com/pushup.jpg",
    "imageId": "img_123abc"
  },
  {
    "id": 2,
    "name": "Pull Up",
    "category": "Pull",
    "description": "A basic pull exercise.",
    "mediaUrl": null,
    "imageId": "img_456def"
  }
]
```

**Use Cases:**

- Mobile app populates exercise picker
- Frontend displays exercise library
- Third-party integrations (e.g., workout builders)

---

#### **GET /api/v1/exercises/:id**

Retrieve a specific exercise by ID.

**Authentication:** None (public)

**Request:**

```http
GET /api/v1/exercises/1 HTTP/1.1
Host: training-service.example.com
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "Push Up",
  "category": "Push",
  "description": "A basic push exercise.",
  "mediaUrl": "https://example.com/pushup.jpg",
  "imageId": "img_123abc"
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Exercise not found",
  "error": "Not Found"
}
```

---

### Workout Endpoints

#### **POST /api/v1/users/:userId/workouts**

Create a new workout template for a user.

**Authentication:** Required (JWT)

**Authorization:** `userId` in URL must match JWT `userId` claim

**Request:**

```http
POST /api/v1/users/user_abc123/workouts HTTP/1.1
Host: training-service.example.com
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Upper Body Push Focus",
  "notes": "Emphasize scapular engagement",
  "exercises": [
    {
      "exerciseId": 1,
      "sets": 5,
      "reps": 10,
      "rest": 120,
      "notes": "Slow eccentric phase"
    },
    {
      "exerciseId": 3,
      "sets": 3,
      "reps": 20,
      "rest": 60
    }
  ]
}
```

**Response (201 Created):**

```json
{
  "id": 42,
  "externalUserId": "user_abc123",
  "name": "Upper Body Push Focus",
  "notes": "Emphasize scapular engagement",
  "exercises": [
    {
      "id": 100,
      "exerciseId": 1,
      "sets": 5,
      "reps": 10,
      "rest": 120,
      "notes": "Slow eccentric phase",
      "exercise": {
        "id": 1,
        "name": "Push Up"
      }
    },
    {
      "id": 101,
      "exerciseId": 3,
      "sets": 3,
      "reps": 20,
      "rest": 60,
      "notes": null,
      "exercise": {
        "id": 3,
        "name": "Plank"
      }
    }
  ]
}
```

**Validation Errors (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "exercises must be an array with at least 1 item"
  ],
  "error": "Bad Request"
}
```

---

#### **GET /api/v1/users/:userId/workouts**

Retrieve all workouts for a user.

**Authentication:** Required (JWT)

**Request:**

```http
GET /api/v1/users/user_abc123/workouts HTTP/1.1
Host: training-service.example.com
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**

```json
[
  {
    "id": 42,
    "externalUserId": "user_abc123",
    "name": "Upper Body Push Focus",
    "notes": "Emphasize scapular engagement",
    "exercises": [
      {
        "id": 100,
        "exerciseId": 1,
        "sets": 5,
        "reps": 10,
        "rest": 120,
        "exercise": { "id": 1, "name": "Push Up" }
      }
    ]
  }
]
```

---

#### **GET /api/v1/users/:userId/workouts/:id**

Retrieve a specific workout for a user.

**Authentication:** Required (JWT)

**Request:**

```http
GET /api/v1/users/user_abc123/workouts/42 HTTP/1.1
Host: training-service.example.com
Authorization: Bearer <jwt-token>
```

**Response (200 OK):** Same as POST response

**Error Responses:**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Workout not found",
  "error": "Not Found"
}
```

---

#### **DELETE /api/v1/users/:userId/workouts/:id**

Delete a user's workout.

**Authentication:** Required (JWT)

**Request:**

```http
DELETE /api/v1/users/user_abc123/workouts/42 HTTP/1.1
Host: training-service.example.com
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**

```json
{
  "success": true
}
```

**Side Effects:**

- Deletes all `WorkoutExercise` records (cascade)
- Sets `Session.workoutId` to `null` for referencing sessions (orphans sessions)

---

### Session Endpoints

#### **POST /api/v1/users/:userId/sessions**

Log a completed training session.

**Authentication:** Required (JWT)

**Request:**

```http
POST /api/v1/users/user_abc123/sessions HTTP/1.1
Host: training-service.example.com
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "workoutId": 42,
  "date": "2025-10-27T08:30:00Z",
  "duration": 3600,
  "notes": "Great session! Felt strong.",
  "exercises": [
    {
      "exerciseId": 1,
      "sets": 5,
      "actualReps": 12,
      "notes": "Exceeded target reps"
    },
    {
      "exerciseId": 3,
      "sets": 3,
      "actualReps": 25,
      "notes": "Last set was tough"
    }
  ]
}
```

**Response (201 Created):**

```json
{
  "id": 101,
  "externalUserId": "user_abc123",
  "workoutId": 42,
  "date": "2025-10-27T08:30:00Z",
  "duration": 3600,
  "notes": "Great session! Felt strong.",
  "exercises": [
    {
      "id": 200,
      "exerciseId": 1,
      "sets": 5,
      "actualReps": 12,
      "notes": "Exceeded target reps",
      "exercise": { "id": 1, "name": "Push Up" }
    },
    {
      "id": 201,
      "exerciseId": 3,
      "sets": 3,
      "actualReps": 25,
      "notes": "Last set was tough",
      "exercise": { "id": 3, "name": "Plank" }
    }
  ]
}
```

**Validation Errors:**

```json
{
  "statusCode": 400,
  "message": [
    "date must be a valid ISO 8601 date string",
    "duration must be at least 60 seconds"
  ],
  "error": "Bad Request"
}
```

---

#### **GET /api/v1/users/:userId/sessions**

Retrieve all sessions for a user (paginated, date-sorted).

**Authentication:** Required (JWT)

**Query Parameters:**

| **Parameter** | **Type** | **Required** | **Description**                     |
| ------------- | -------- | ------------ | ----------------------------------- |
| `from`        | ISO Date | No           | Start date (inclusive)              |
| `to`          | ISO Date | No           | End date (inclusive)                |
| `limit`       | Integer  | No           | Max results (default: 50, max: 100) |
| `offset`      | Integer  | No           | Pagination offset (default: 0)      |

**Request:**

```http
GET /api/v1/users/user_abc123/sessions?from=2025-10-01&to=2025-10-31&limit=10 HTTP/1.1
Host: training-service.example.com
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": 101,
      "externalUserId": "user_abc123",
      "workoutId": 42,
      "date": "2025-10-27T08:30:00Z",
      "duration": 3600,
      "notes": "Great session!",
      "exercises": [...]
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

#### **GET /api/v1/users/:userId/sessions/:id**

Retrieve a specific session.

**Authentication:** Required (JWT)

**Request:**

```http
GET /api/v1/users/user_abc123/sessions/101 HTTP/1.1
Host: training-service.example.com
Authorization: Bearer <jwt-token>
```

**Response (200 OK):** Same as POST response

---

## Authentication Flow

### End-to-End Request Flow

```
┌─────────────┐
│   Client    │
│  (Mobile/   │
│   Web App)  │
└──────┬──────┘
       │
       │ 1. POST /login (Auth Service)
       ├──────────────────────────────────────►
       │                                        │
       │ 2. Return JWT                          │
       ◄────────────────────────────────────────┤
       │                                        │
       │ 3. GET /workouts                       │
       │    Authorization: Bearer <JWT>         │
       ├──────────────────────────────────────► │
       │                                    ┌───▼────┐
       │                                    │  API   │
       │                                    │Gateway │
       │                                    └───┬────┘
       │                                        │
       │                                        │ 4. Validate JWT
       │                                        │    (Auth Service)
       │                                        │
       │                                    ┌───▼────────┐
       │                                    │  Training  │
       │                                    │  Service   │
       │                                    └───┬────────┘
       │                                        │
       │                                        │ 5. Query DB
       │                                        │    WHERE userId = X
       │                                        │
       │ 6. Return workouts                     │
       ◄────────────────────────────────────────┤
       │                                        │
└──────┴────────────────────────────────────────┘
```

### Implementation in Training Service

**NestJS Guard (JWT Validation):**

```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Populated by API Gateway

    if (!user || !user.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
```

**Controller Usage:**

```typescript
@Controller('users/:userId/workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutController {
  @Get()
  async findAll(@Param('userId') userId: string, @Request() req) {
    // Verify URL userId matches JWT userId
    if (req.user.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.workoutService.findByUser(userId);
  }
}
```

---

## Error Handling

### Standard Error Format

All error responses follow this structure:

```json
{
  "statusCode": 400,
  "message": "Detailed error message or array of validation errors",
  "error": "Bad Request",
  "timestamp": "2025-10-27T10:30:00Z",
  "path": "/api/v1/users/user_abc123/workouts"
}
```

### HTTP Status Codes

| **Code** | **Meaning**           | **Use Case**                                                     |
| -------- | --------------------- | ---------------------------------------------------------------- |
| `200`    | OK                    | Successful GET, PUT, DELETE                                      |
| `201`    | Created               | Successful POST (resource created)                               |
| `400`    | Bad Request           | Validation errors, malformed JSON                                |
| `401`    | Unauthorized          | Missing or invalid JWT                                           |
| `403`    | Forbidden             | Valid JWT but insufficient permissions                           |
| `404`    | Not Found             | Resource does not exist                                          |
| `409`    | Conflict              | Duplicate resource (e.g., exercise name exists)                  |
| `422`    | Unprocessable Entity  | Business logic violation (e.g., past-dated session beyond limit) |
| `500`    | Internal Server Error | Unexpected server error                                          |
| `503`    | Service Unavailable   | Downstream service (DB, Auth) is down                            |

### Common Error Scenarios

**1. User Tries to Access Another User's Data**

```json
{
  "statusCode": 403,
  "message": "Access denied: You can only access your own resources",
  "error": "Forbidden"
}
```

**2. Invalid Exercise ID in Workout Creation**

```json
{
  "statusCode": 404,
  "message": "Exercise with id 999 not found",
  "error": "Not Found"
}
```

**3. Validation Errors (Multiple)**

```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "exercises must be an array with at least 1 item",
    "sets must be between 1 and 20"
  ],
  "error": "Bad Request"
}
```

---

## Versioning Strategy

### URI Versioning (Current Approach)

**Pattern:** `/api/v{major}/resource`

**Example:**

```
v1 (Current): /api/v1/exercises
v2 (Future):  /api/v2/exercises (breaking changes)
```

**Rules:**

1. **Major version increment** = Breaking changes
   - Field removal
   - Field type change
   - Endpoint removal
   - Authentication scheme change

2. **Backward-compatible changes** = Same version
   - New optional fields
   - New endpoints
   - New query parameters (with defaults)

**Deprecation Process:**

1. **Announce deprecation** (6 months notice)
2. **Deploy v2** (v1 still supported)
3. **Sunset v1** (redirect to v2, return 410 Gone)

**Example Deprecation Header:**

```http
GET /api/v1/exercises HTTP/1.1

HTTP/1.1 200 OK
Deprecation: true
Sunset: Sun, 01 Jan 2026 00:00:00 GMT
Link: </api/v2/exercises>; rel="alternate"
```

---

## Future Service Contracts

### Analytics Service (Planned Q1 2026)

**Direction:** Training Service → Analytics Service (data export)

**API Endpoint (Training Service):**

```http
GET /api/v1/analytics/users/:userId/metrics?from=2025-01-01&to=2025-12-31
→ Returns aggregated training metrics (volume, frequency, intensity)
```

**Response:**

```json
{
  "userId": "user_abc123",
  "period": {
    "start": "2025-01-01",
    "end": "2025-12-31"
  },
  "metrics": {
    "totalSessions": 156,
    "totalVolume": 45000,
    "avgSessionDuration": 3600,
    "categoryBreakdown": {
      "Push": 15000,
      "Pull": 18000,
      "Legs": 8000,
      "Core": 4000
    }
  }
}
```

**Use Cases:**

- Progress dashboards
- Year-in-review reports
- Machine learning training data

---

### Periodization Service (Planned Q2 2026)

**Direction:** Bidirectional (Training ↔ Periodization)

**Periodization Service queries Training Service:**

```http
GET /api/v1/users/:userId/sessions?from=X&to=Y
→ Retrieves historical performance data
```

**Training Service creates TrainingPhase via Periodization:**

```http
POST /api/v1/users/:userId/phases (Periodization Service)
{
  "name": "Strength Block 1",
  "phaseType": "Strength",
  "startDate": "2026-01-01",
  "endDate": "2026-01-31",
  "workoutIds": [42, 43, 44]
}
→ Training Service references phaseId in Workout table
```

---

### Recommendation Engine (Planned Q4 2026)

**Direction:** Training Service → Recommendation Engine (ML features)

**API Endpoint (Training Service):**

```http
GET /api/v1/ml/users/:userId/features
→ Returns feature vector for ML model
```

**Response:**

```json
{
  "userId": "user_abc123",
  "features": {
    "avgWeeklyVolume": 5000,
    "exercisePreferences": ["Pull Up", "Dip", "Handstand"],
    "sessionFrequency": 4.2,
    "performanceTrend": "increasing"
  }
}
```

**Use Cases:**

- Workout recommendations
- Injury risk prediction
- Adaptive programming

---

## Service-to-Service Authentication

### Internal API Keys (Future)

For service-to-service communication:

```http
GET /api/v1/analytics/users/:userId/metrics HTTP/1.1
Host: training-service.example.com
X-Service-Key: analytics-service-key-abc123
X-Service-Name: analytics-service
```

**Validation:**

```typescript
@Injectable()
export class ServiceAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const serviceKey = request.headers['x-service-key'];

    if (!this.isValidServiceKey(serviceKey)) {
      throw new UnauthorizedException('Invalid service key');
    }

    return true;
  }
}
```

---

## API Documentation

### Swagger/OpenAPI

**Endpoint:** `GET /api/docs`

**Access:** Available in development and staging (disabled in production)

**Features:**

- Interactive API explorer
- Request/response schemas
- Authentication testing
- Code generation (client SDKs)

**Example Configuration:**

```typescript
// swagger.ts
const config = new DocumentBuilder()
  .setTitle('Training Service API')
  .setDescription('Calisthenics training data management')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
```

---

## Rate Limiting & Quotas

### API Gateway Configuration

| **Tier**     | **Requests/Minute** | **Daily Quota** | **Use Case**                 |
| ------------ | ------------------- | --------------- | ---------------------------- |
| **Free**     | 60                  | 5,000           | Individual users             |
| **Premium**  | 300                 | 50,000          | Power users, coaches         |
| **Internal** | Unlimited           | Unlimited       | Service-to-service (trusted) |

### Rate Limit Headers

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1698420060
```

**429 Too Many Requests:**

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Try again in 30 seconds.",
  "error": "Too Many Requests",
  "retryAfter": 30
}
```

---

## Contract Testing

### Consumer-Driven Contracts (Pact)

**Scenario:** Analytics Service depends on Training Service API

**Consumer (Analytics Service) defines contract:**

```javascript
// analytics-service/tests/pacts/training-service.pact.js
await provider
  .given('user user_abc123 has sessions')
  .uponReceiving('a request for session metrics')
  .withRequest({
    method: 'GET',
    path: '/api/v1/analytics/users/user_abc123/metrics',
    headers: { 'X-Service-Key': 'analytics-key' },
  })
  .willRespondWith({
    status: 200,
    body: {
      totalSessions: 156,
      totalVolume: 45000,
    },
  });
```

**Provider (Training Service) validates contract:**

```bash
npx pact-provider-verifier \
  --provider training-service \
  --pact-urls ./pacts/analytics-service.json
```

---

## Monitoring & Observability

### Health Check Endpoint

```http
GET /health HTTP/1.1

HTTP/1.1 200 OK
{
  "status": "ok",
  "timestamp": "2025-10-27T10:30:00Z",
  "uptime": 123456,
  "database": {
    "status": "connected",
    "latency": 5
  },
  "dependencies": {
    "authService": "ok",
    "mediaService": "degraded"
  }
}
```

### Metrics (Prometheus Format)

```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",endpoint="/exercises",status="200"} 12345

# HELP db_query_duration_seconds Database query duration
# TYPE db_query_duration_seconds histogram
db_query_duration_seconds_bucket{le="0.1"} 9500
db_query_duration_seconds_bucket{le="0.5"} 9850
```

---

## Summary

| **Aspect**         | **Contract**                               |
| ------------------ | ------------------------------------------ |
| **Authentication** | JWT via `Authorization: Bearer` header     |
| **User Isolation** | All endpoints filter by `externalUserId`   |
| **Versioning**     | URI-based (`/api/v1/...`)                  |
| **Error Format**   | JSON with `statusCode`, `message`, `error` |
| **Rate Limiting**  | 60 req/min (free), 300 req/min (premium)   |
| **Documentation**  | Swagger at `/api/docs`                     |
| **Health Check**   | `GET /health`                              |

---

**Document Version:** 1.0.0  
**Last Updated:** October 27, 2025  
**Maintained By:** Backend Engineering Team
