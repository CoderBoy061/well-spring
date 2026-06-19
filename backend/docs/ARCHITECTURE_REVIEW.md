# Architecture Review — Wellspring Backend

This document explains the architecture decisions, trade-offs, and future improvements made while building the Wellspring backend. The goal was to prioritize correctness, tenant isolation, idempotency, and maintainability while staying within the time constraints of the assessment.

---

## 1. What I Built and What I Skipped

I built a multi-tenant backend for wellness creators with:

- JWT-based authentication
- Creator-level tenant isolation
- CRUD APIs for Programs
- CRUD APIs for Sessions
- Session drag-and-drop reordering
- CSV session import with row-level validation
- Import idempotency using a client-supplied `clientImportId`
- Audit logging for write operations
- Structured request logging
- Local file upload support
- Health monitoring endpoint

For this implementation, the **Creator acts as both the tenant owner and administrative user**. A separate role-based permission system was intentionally omitted to keep the solution aligned with the assessment scope.

### Deprioritized Items

The following items were intentionally left out or simplified due to time constraints:

- Full role-based access control (RBAC)
- Background job processing for imports
- Redis caching
- Rate limiting and tenant quotas
- CI/CD pipeline configuration
- Advanced upload streaming and resumable uploads
- Advanced frontend styling and design system

---

## 2. Tenant Isolation Strategy

Tenant isolation is enforced at the service/data-access layer using `creatorId`.

Every authenticated request extracts the tenant identifier from the JWT token and all resource queries are scoped by both:

- Resource ID
- Creator ID

Example:

```ts
Program.findOne({
  where: {
    id: programId,
    creatorId,
  },
});
```

This prevents cross-tenant access even if a user attempts to manually access another creator's resource identifier.

### Scaling Considerations

For larger deployments I would consider:

- Additional indexes on tenant-heavy tables
- Table partitioning
- Read replicas
- Separate schemas for enterprise tenants with stronger isolation requirements

The current shared-schema approach keeps the implementation simple and performs well for small-to-medium tenant counts.

---

## 3. Bulk Import Design and Idempotency

CSV imports support bulk session creation.

The import process:

1. Parse uploaded CSV.
2. Validate each row.
3. Return row-level validation errors.
4. Skip invalid rows.
5. Create valid sessions.
6. Store an ImportJob record using (`creatorId`, `clientImportId`).

To prevent duplicate imports:

```txt
creatorId + clientImportId
```

must be unique.

If the same import request is submitted again with the same `clientImportId`, the import is ignored and duplicate session creation is prevented.

### Future Improvements

With more time I would:

- Process imports asynchronously
- Add import progress tracking
- Store validation failures in a dedicated table
- Add import status polling endpoints

---

## 4. File Upload Architecture

The assessment mentions S3 uploads. Due to the absence of an AWS account during development, I implemented uploads using local storage and Multer.

Files are stored locally and referenced through generated URLs.

The upload layer was intentionally designed so it can later be replaced by an AWS S3 implementation with minimal business-logic changes.

Migrating to S3 would primarily require:

- AWS Access Key
- AWS Secret Key
- S3 Bucket Configuration

The upload endpoints and application flow would remain largely unchanged.

### Production Improvements

For production environments I would:

- Replace local storage with S3
- Generate pre-signed upload URLs
- Validate uploaded object metadata
- Use multipart uploads for large files

---

## 5. Audit Logging Strategy

Audit logs are generated for administrative write operations including:

- Program Creation
- Program Updates
- Program Deletion
- Session Creation
- Session Updates
- Session Deletion
- Session Reordering
- CSV Imports

Each audit entry captures:

- Actor ID
- Creator ID
- Action
- Entity Type
- Entity ID
- Timestamp

This provides a simple audit trail and supports future compliance requirements.

---

## 6. Structured Logging

Structured logging is implemented using request-scoped logs.

Each request captures:

- Request ID
- Creator ID
- HTTP Method
- URL
- Status Code
- Response Time

This improves observability and simplifies debugging in multi-tenant environments.

---

## 7. Areas for Improvement

The parts I would improve first are:

### Import Processing

The current import process runs inside the request lifecycle and is suitable for small files. For larger imports I would move processing to background workers.

### Testing

Current testing focuses on critical functionality such as:

- Tenant isolation
- Authentication
- Import idempotency

Additional integration and load testing would improve confidence.

### Error Recovery

Transient database and infrastructure failures would benefit from:

- Retry policies
- Circuit breakers
- Dead-letter queues for failed jobs

---

## 8. What I Would Add With Two More Days

If given additional time, I would prioritize:

### Backend

- Redis caching for frequently accessed data
- BullMQ-based background workers
- Rate limiting
- Role-based access control
- S3 pre-signed upload support
- CI/CD pipelines

### Frontend

- Improved visual design system
- Responsive mobile layouts
- Better loading and error states
- Accessibility improvements
- Dark mode support

---

## Conclusion

The implementation prioritizes:

- Tenant isolation
- Import idempotency
- Auditability
- Maintainability
- Simplicity

While some production-level enhancements were intentionally deferred, the current architecture provides a solid foundation that can be extended with caching, background processing, and cloud storage as the platform grows.
