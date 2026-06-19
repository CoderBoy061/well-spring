# AI Session Export — Assistant / Co-pilot

User: "setup and create a node.js application inside the backend folder using typescript, install express, nodemon, sequelize, sequelize-cli, postgres, cors, bcrypt, jsonwebtoken and their types in typescript"

User: "create sequelize migrations for creators, programs, sessions, audit_logs and import_jobs tables"

User: "help me design a multi-tenant architecture using creatorId as tenant identifier"

User: "review the database schema and make sure tenant isolation is enforced at the data layer"

User: "generate JWT authentication middleware where creatorId is extracted from the token"

User: "implement signup and login APIs using bcrypt and JWT"

User: "create CRUD APIs for programs using express, sequelize and typescript"

User: "check the transaction code, if it is properly implemented or not. We need to use transactions because we are dealing with multiple models at once"

User: "implement audit logging for create, update and delete operations"

User: "create session CRUD APIs with creator-level isolation"

User: "implement drag and drop session reordering and update positions correctly"

User: "design a CSV import workflow with row-level validation feedback"

User: "implement idempotent imports using creatorId and clientImportId"

User: "generate a sample CSV file and an invalid CSV file for testing"

User: "column 'passwordResetToken' does not exist. I guess we need to run the migration file to add that column"

User: "Error [ERR_REQUIRE_ESM]: require() of ES Module uuid not supported"

User: "the seeder should create 2 creators, 3 programs each, ~10 sessions per program"

User: "implement file uploads using multer and local storage"

User: "configure structured logging using pino"

User: "check all non-negotiable quality bars are implemented"

User: "generate tenant isolation test cases and import idempotency test cases"

User: "review the backend architecture and identify missing requirements from the assignment"

---

## Frontend

User: "create a Next.js application using TypeScript and App Router"

User: "setup project structure for app, components, services, hooks, contexts and types"

User: "create an axios instance with request interceptors to automatically attach JWT token"

User: "implement login page using react-hook-form and Material UI"

User: "implement signup page and integrate it with backend APIs"

User: "create an authentication context for managing login and logout state"

User: "after logout, if user manually navigates to /login while already authenticated, redirect to /dashboard"

User: "create protected route logic for Next.js App Router"

User: "build dashboard page to display all programs"

User: "create program creation modal and integrate with backend"

User: "create program details page with session management"

User: "implement drag and drop session reordering using @dnd-kit"

User: "create CSV upload page for importing sessions"

User: "create audit logs page with filtering support"

User: "review frontend architecture and suggest simplifications"

User: "check for TypeScript issues, route protection issues and authentication edge cases"

User: "review the entire application and verify all assignment requirements are covered"
