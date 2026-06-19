# Code Summary

This document provides a concise, module-by-module overview of the Wellspring backend to help reviewers and future contributors quickly understand the codebase.

## src/config

### database.ts

Initializes Sequelize using the PostgreSQL connection string provided through environment variables.

Responsibilities:

- Database connection management
- Sequelize configuration
- SSL configuration for hosted databases

### logger.ts

Configures structured logging using Pino.

Responsibilities:

- Request logging
- Structured JSON logs
- Environment-specific logging configuration

---

## src/models

The application is built around five primary domain models.

### Creator

Represents an authenticated creator (tenant).

Key fields:

- id
- name
- email
- password

### Program

Represents a wellness program owned by a creator.

Key fields:

- id
- creatorId
- title
- description

### Session

Represents a session belonging to a program.

Key fields:

- id
- creatorId
- programId
- title
- duration
- instructorName
- mediaUrl
- position
- tags

### AuditLog

Stores audit events for administrative actions.

Key fields:

- creatorId
- actorId
- action
- entityType
- entityId

### ImportJob

Used to support import idempotency.

Key fields:

- creatorId
- clientImportId

---

## src/services

The service layer contains all business logic and tenant isolation rules.

### auth.service.ts

Handles:

- Signup
- Login
- Password hashing
- JWT generation
- Credential validation

### program.service.ts

Handles:

- Create Program
- Get Programs
- Get Program By Id
- Update Program
- Delete Program

Important:

All program queries include `creatorId` to enforce tenant isolation.

### session.service.ts

Handles:

- Create Session
- List Sessions
- Update Session
- Delete Session
- Session Reordering

Responsibilities:

- Position management
- Program ownership validation
- Audit logging

### import.service.ts

Handles:

- CSV parsing
- Row-level validation
- Session creation
- Import idempotency

Responsibilities:

- Prevent duplicate imports using `clientImportId`
- Return validation feedback for invalid rows

### audit.service.ts

Handles:

- Audit log retrieval
- Filtering audit records

---

## src/controllers

Controllers are intentionally thin.

Responsibilities:

- Parse requests
- Validate request data
- Call service methods
- Return HTTP responses

Controllers never trust client-supplied tenant identifiers.

The authenticated creator is always derived from the JWT token.

---

## src/middlewares

### auth.middleware.ts

Responsibilities:

- Validate JWT tokens
- Extract creatorId
- Protect authenticated routes

### logger.middleware.ts

Responsibilities:

- Request timing
- Request tracing
- Structured logging

### request-id.middleware.ts

Responsibilities:

- Generate request IDs
- Support request correlation across logs

### upload.middleware.ts

Responsibilities:

- File upload handling using Multer
- Local file storage configuration

---

## src/utils

### jwt.ts

JWT creation and verification helpers.

### password.ts

Password hashing and comparison helpers using bcrypt.

### audit.ts

Utility for creating audit log entries from services.

---

## Database Migrations

All schema changes are managed through Sequelize migrations.

Tables:

- creators
- programs
- sessions
- audit_logs
- import_jobs

This ensures schema changes are version controlled and reproducible.

---

## Seeders

Seeders provide sample development data.

Current seed strategy:

- 2 Creators
- 3 Programs per Creator
- Approximately 10 Sessions per Program

This allows reviewers to quickly test functionality after setup.

---

## Transactions

Transactions are used for operations involving multiple related database writes where consistency is important.

Examples:

- CSV imports
- Multi-step write operations
- Future audit + entity write combinations

The goal is to prevent partial updates and maintain data integrity during failures.

---

## Structured Logging

Request logs include:

- requestId
- creatorId
- HTTP method
- URL
- statusCode
- responseTime

This improves debugging and observability in a multi-tenant environment.

---

## Key Design Decisions

### Tenant Isolation

Tenant isolation is enforced at the data layer.

Example:

```ts
Program.findOne({
  where: {
    id: programId,
    creatorId,
  },
});
```

This prevents cross-tenant access even when resource IDs are known.

### Idempotent Imports

Imports are protected using:

```txt
creatorId + clientImportId
```

This prevents duplicate imports caused by retries or network issues.

### Auditability

Administrative write operations generate audit records to support traceability and future compliance requirements.

---

## Future Improvements

With additional development time, the following improvements would be prioritized:

- Redis caching
- Background job processing using BullMQ
- AWS S3 uploads and presigned URLs
- Rate limiting
- Role-based access control
- CI/CD pipelines
- Expanded integration testing
- Improved monitoring and observability
- Frontend design and UX improvements

The current implementation prioritizes correctness, tenant isolation, maintainability, and simplicity while providing a strong foundation for future scalability.
