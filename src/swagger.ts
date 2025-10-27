import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Calisthenics Training Service')
    .setDescription(
      `
## Overview
REST API for managing calisthenics training data including exercises, workout templates, and training sessions.

## Architecture
- **Bounded Context**: Training domain (exercises, workouts, sessions)
- **Authentication**: JWT Bearer tokens issued by external Auth Service
- **Authorization**: User-scoped resources (users can only access their own data)

## Resource Ownership
- **Exercises**: Public catalog (no authentication required)
- **Workouts**: User-owned templates (requires authentication)
- **Sessions**: User-owned training logs (requires authentication)

## Error Responses
All endpoints may return the following error responses:
- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Attempting to access another user's resources
- **404 Not Found**: Resource does not exist
- **500 Internal Server Error**: Unexpected server errors

## Validation Rules
- **Session duration**: Minimum 60 seconds (1 minute)
- **Session date**: Cannot be more than 24 hours in the future
- **Workout exercises**: Must have at least 1 exercise
- **Sets/Reps ranges**: Sets (1-20), Reps (1-100), Rest (0-600s)
    `.trim(),
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Enter JWT token from Auth Service. Token must contain userId claim.',
      },
      'JWT-auth',
    )
    .addTag('exercises', 'Public exercise catalog (no authentication required)')
    .addTag(
      'workouts',
      'User workout templates (requires authentication, user-scoped)',
    )
    .addTag(
      'sessions',
      'Training session logs (requires authentication, user-scoped)',
    )
    .addTag('health', 'Service health and status monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  } as const;

  SwaggerModule.setup('docs', app, document, swaggerOptions);
}
