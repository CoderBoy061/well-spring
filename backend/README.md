# Wellspring — Backend

Loom walkthrough: https://www.loom.com/share/5d8c63f00c7f499595149f8d046ca270

## Overview

Wellspring is a multi-tenant content management backend for wellness creators.

The application allows creators to manage programs and sessions, upload content, import sessions via CSV, view audit logs, and securely access only their own data through tenant isolation.

Built using:

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Multer
- Pino Logging

---

## Features

### Authentication

- Creator signup
- Creator login
- JWT-based authentication
- Protected routes

### Multi-Tenant Architecture

- Tenant isolation enforced using `creatorId`
- Every query is scoped to the authenticated creator
- Cross-tenant data access is prevented at the service/data layer

### Programs

- Create Program
- List Programs
- Update Program
- Delete Program

### Sessions

- Create Session
- List Sessions
- Update Session
- Delete Session
- Session Reordering

### CSV Import

- Bulk Session Import
- Row-Level Validation
- Import Idempotency using `clientImportId`

### File Uploads

- Local file uploads using Multer
- Storage abstraction can be extended to S3 in future

### Audit Logging

- Program Actions
- Session Actions
- Import Actions
- Reorder Actions

### Structured Logging

- Request ID tracking
- Tenant-aware logs
- Response timing logs

---

## Quick Start

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Update the environment variables.

### Run Migrations

```bash
npm run db:migrate
```

### Run Seeders

```bash
npm run db:seed
```

### Start Development Server

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

---

## Seed Data

The seeders generate:

- 2 Creators
- 3 Programs per Creator
- ~10 Sessions per Program

---

## API Endpoints

### Authentication

```http
POST /api/auth/signup
POST /api/auth/login
```

### Programs

```http
GET    /api/programs
POST   /api/programs
GET    /api/programs/:id
PUT    /api/programs/:id
DELETE /api/programs/:id
```

### Sessions

```http
POST   /api/programs/:programId/sessions
GET    /api/programs/:programId/sessions

PUT    /api/sessions/:id
DELETE /api/sessions/:id

PATCH  /api/programs/:programId/reorder
```

### Uploads

```http
POST /api/uploads
```

### Imports

```http
POST /api/programs/:programId/import
```

### Audit Logs

```http
GET /api/audit-logs
```

### Health

```http
GET /health
```

---

## Project Structure

```txt
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
└── tests/
```

---

## AI History

AI-assisted development history is available under:

```txt
ai-history/
```

The exported prompts and conversations document how AI was used during planning, implementation, debugging, testing, and review.

---

## Notes For Reviewers

- Tenant isolation is enforced at the data layer.
- CSV imports are idempotent.
- Audit logs are generated for write operations.
- Structured request logging is enabled.
- Local storage is used for uploads; the storage layer can be extended to AWS S3 in the future.
