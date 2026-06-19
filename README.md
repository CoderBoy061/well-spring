# Wellspring — Full Stack Application

Loom Walkthrough: https://www.loom.com/share/5d8c63f00c7f499595149f8d046ca270

## Overview

Wellspring is a multi-tenant content management platform for wellness creators.

The application allows creators to:

- Create and manage programs
- Create and manage sessions
- Upload session content
- Import sessions using CSV files
- Reorder sessions
- View audit logs
- Access only their own data through tenant isolation

The project consists of:

```txt
backend/   -> Express + TypeScript + PostgreSQL
frontend/  -> Next.js + TypeScript
```

---

# Technology Stack

## Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Multer
- Pino Logging

## Frontend

- Next.js 15
- TypeScript
- Material UI
- Axios
- React Hook Form
- DnD Kit

---

# Repository Structure

```txt
.
├── backend/
├── frontend/
├── ai-history/
├── docs/
└── README.md
```

---

# Features

## Authentication

- Signup
- Login
- JWT Authentication
- Protected Routes

## Multi-Tenant Architecture

- Tenant isolation using creatorId
- Resource ownership validation
- Cross-tenant access prevention

## Program Management

- Create Program
- Update Program
- Delete Program
- View Programs

## Session Management

- Create Session
- Update Session
- Delete Session
- Session Reordering

## CSV Import

- Bulk Session Import
- Row-Level Validation
- Import Idempotency

## Audit Logs

- Program Events
- Session Events
- Import Events
- Reorder Events

## Uploads

- Local File Uploads
- S3-ready Architecture

## Structured Logging

- Request IDs
- Tenant-aware Logging
- Response Timing

---

# Backend Setup

## Navigate

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

```bash
cp .env.example .env
```

Update environment variables.

## Run Migrations

```bash
npm run db:migrate
```

## Run Seeders

```bash
npm run db:seed
```

## Start Backend

```bash
npm run dev
```

Backend URL:

```txt
http://localhost:5000
```

Health Check:

```txt
GET http://localhost:5000/health
```

---

# Frontend Setup

## Navigate

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Start Frontend

```bash
npm run dev
```

Frontend URL:

```txt
http://localhost:3000
```

---

# Test Credentials

Created through seeders.

```txt
See seeders for generated users.
```

Or create a new account using the Signup page.

---

# API Endpoints

## Authentication

```http
POST /api/auth/signup
POST /api/auth/login
```

## Programs

```http
GET    /api/programs
POST   /api/programs
GET    /api/programs/:id
PUT    /api/programs/:id
DELETE /api/programs/:id
```

## Sessions

```http
POST   /api/programs/:programId/sessions
GET    /api/programs/:programId/sessions

PUT    /api/sessions/:id
DELETE /api/sessions/:id

PATCH  /api/programs/:programId/reorder
```

## Uploads

```http
POST /api/uploads
```

## Imports

```http
POST /api/programs/:programId/import
```

## Audit Logs

```http
GET /api/audit-logs
```

---

# AI Usage

AI-assisted development history is available in:

```txt
ai-history/
```

The exported prompts document how AI was used for:

- Architecture planning
- Code generation
- Debugging
- Testing
- Reviews
- Documentation

---

# Additional Documentation

```txt
docs/
├── ARCHITECTURE_REVIEW.md
├── CODE_SUMMARY.md
```

---

# Notes For Reviewers

- Tenant isolation is enforced at the data layer.
- CSV imports are idempotent.
- Audit logs are generated for write operations.
- Structured logging is enabled.
- Local file storage is used for uploads.
- The upload layer can be extended to AWS S3 with minimal changes.
- Creator acts as both the tenant owner and administrative user for this assessment.

Thank you for reviewing the submission.
