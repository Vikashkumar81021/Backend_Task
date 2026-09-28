# TaskFlow Backend

TaskFlow is a lightweight multi-tenant project management backend built with Node.js, Express, TypeScript, PostgreSQL, Prisma, Redis, and BullMQ.

The system supports organizations, members, projects, tasks, task assignments, comments, authentication, role-based authorization, background email notifications, retries, and job tracking.

---

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis
- BullMQ
- Zod
- JWT
- bcrypt
- Swagger / OpenAPI
- Docker & Docker Compose

---

## Architecture

The application follows a clean layered architecture:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
```

Background notification flow:

```text
Task Assignment
      ↓
PostgreSQL Transaction
      ↓
TaskAssignment + OutboxEvent
      ↓
BullMQ
      ↓
Redis
      ↓
Email Worker
      ↓
Mock Email
```

### Docker Services

```text
API
Worker
PostgreSQL
Redis
```

---

# Features

## Authentication

- User registration
- User login
- Access token
- Refresh token
- Refresh token revocation
- Logout
- bcrypt password hashing
- JWT authentication
- 15-minute access token
- 7-day refresh token
- Authentication rate limiting

## Authorization

Supported roles:

- `org_admin`
- `member`

Organization administrators can:

- Manage organization members
- Delete projects

All resource access is scoped to the authenticated user's organization.

Client-provided `organizationId` is never trusted.

---

# Multi-Tenant Security

TaskFlow uses organization-level multi-tenancy.

Every protected resource is validated against the authenticated user's organization.

```text
Authenticated User
       ↓
User Organization
       ↓
Project Organization
       ↓
Task Project
```

Cross-organization resource access returns:

```json
{
  "error": "Forbidden",
  "code": "FORBIDDEN",
  "details": {}
}
```

Sensitive data from another organization is never returned.

---

# Database

PostgreSQL is used as the primary database.

## Main Tables

- users
- organizations
- org_members
- projects
- tasks
- task_assignments
- comments
- refresh_tokens
- outbox_events

## PostgreSQL Enums

### Status

```text
todo
in_progress
review
done
```

### Priority

```text
low
medium
high
urgent
```

## Database Migrations

Prisma migrations are used.

Run:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Seed database:

```bash
npx prisma db seed
```

---

# Environment Variables

Create a `.env` file in the project root.

For local development:

```env
NODE_ENV=development

PORT=5000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow

REDIS_URL=redis://localhost:6379

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=taskflow

JWT_ACCESS_SECRET_KEY=change_this_access_secret
JWT_REFRESH_SECRET_KEY=change_this_refresh_secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_ROUNDS=12
```

When running the API and Worker inside Docker Compose, use Docker service names as hostnames:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/taskflow

REDIS_URL=redis://redis:6379
```

Do not commit `.env` to Git.

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project:

```bash
cd taskflow-backend
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```bash
cp .env.example .env
```

Run Prisma migration:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Seed the database:

```bash
npx prisma db seed
```

---

# Run Locally

Start API:

```bash
npm run dev
```

Start Worker in another terminal:

```bash
npm run worker
```

API:

```text
http://localhost:5000
```

---

# Docker

The project provides Docker Compose with the required services:

```text
API
Worker
PostgreSQL
Redis
```

Build and start all services:

```bash
docker compose up --build
```

Run in background:

```bash
docker compose up --build -d
```

Stop services:

```bash
docker compose down
```

View all logs:

```bash
docker compose logs -f
```

View API logs:

```bash
docker compose logs -f api
```

View Worker logs:

```bash
docker compose logs -f worker
```

Check running containers:

```bash
docker compose ps
```

---

# API Documentation - Swagger / OpenAPI

TaskFlow provides interactive API documentation using Swagger UI.

Swagger documents the available REST APIs, request parameters, request bodies, responses, authentication, and API schemas.

## Swagger UI

After starting the API, open:

```text
http://localhost:5000/api-docs
```

Swagger UI allows you to:

- View all available API endpoints
- View HTTP methods
- View request parameters
- View request bodies
- View response schemas
- Test APIs directly from the browser
- Test authenticated endpoints
- Understand API request/response formats

## OpenAPI Specification

The API documentation follows the OpenAPI specification.

The Swagger documentation is generated from the application's OpenAPI definitions and route annotations.

Typical Swagger setup uses:

```text
src/
├── config/
│   └── swagger.ts
├── controllers/
├── routes/
├── services/
└── server.ts
```

Swagger UI is mounted in the Express application at:

```text
/api-docs
```

Example:

```text
http://localhost:5000/api-docs
```

## Swagger Authentication

Protected endpoints use JWT authentication.

The Swagger UI can be used to authorize requests with a Bearer token when Bearer authentication is configured in the OpenAPI definition.

Example OpenAPI security scheme:

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

Protected endpoints can then use:

```yaml
security:
  - bearerAuth: []
```

For cookie-based authentication, the API uses HTTP-only cookies for access and refresh tokens.

Swagger documentation should describe the authentication requirement for protected endpoints.

---

# Authentication APIs

## Register

```http
POST /api/v1/auth/register
```

## Login

```http
POST /api/v1/auth/login
```

## Refresh Token

```http
POST /api/v1/auth/refresh
```

## Logout

```http
POST /api/v1/auth/logout
```

Authentication endpoints are rate limited to:

```text
10 requests / minute / IP
```

These endpoints are also documented in Swagger UI.

---

# Project APIs

Projects support CRUD operations.

```http
POST   /api/v1/projects
GET    /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
```

Every project is automatically scoped to the authenticated user's organization.

These APIs can be tested through:

```text
http://localhost:5000/api-docs
```

---

# Task APIs

Tasks support CRUD operations.

```http
POST   /api/v1/tasks
GET    /api/v1/tasks
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
```

Tasks belong to projects, and projects belong to organizations.

---

# Task Filters

Tasks can be filtered by:

- status
- priority
- assignee
- due-date range

Example:

```http
GET /api/v1/tasks?status=in_progress&priority=high
```

Zod is used for request validation.

---

# Pagination

Task listing supports cursor-based pagination.

Example:

```http
GET /api/v1/tasks?limit=20
```

Response:

```json
{
  "data": [],
  "next_cursor": null
}
```

For the next page:

```http
GET /api/v1/tasks?limit=20&cursor=<cursor>
```

---

# Task Assignment

Assign a user:

```http
POST /api/v1/tasks/:id/assign
```

Request:

```json
{
  "userId": 5
}
```

The assigned user must belong to the same organization as the task.

Duplicate task assignments are prevented using a database unique constraint:

```text
(taskId, userId)
```

Unassign a user:

```http
DELETE /api/v1/tasks/:id/assign/:userId
```

---

# Background Email Notifications

When a user is assigned to a task, an asynchronous email notification is created.

The system uses:

```text
PostgreSQL
    ↓
Transactional Outbox
    ↓
BullMQ
    ↓
Redis
    ↓
Email Worker
```

---

# Transactional Outbox Strategy

Task assignment and creation of the outbox event happen inside the same PostgreSQL transaction.

```text
Transaction
 ├── TaskAssignment
 └── OutboxEvent
```

Both records are committed together.

After the transaction succeeds, the notification job is added to BullMQ.

If queue enqueueing fails, a compensating transaction removes the assignment and outbox event so that the system does not leave an inconsistent assignment state.

A background outbox publisher also checks unprocessed events and can recover jobs after temporary process failures.

---

# Email Retry

Email jobs are configured with:

```text
Attempts: 3
```

Exponential backoff:

```text
Attempt 1
   ↓
1 second
   ↓
Attempt 2
   ↓
2 seconds
   ↓
Attempt 3
   ↓
4 seconds
```

After retries are exhausted, the job is moved to the dead-letter queue.

---

# Job Status API

Check notification job status:

```http
GET /api/v1/jobs/:id
```

Supported statuses:

```text
pending
active
completed
failed
```

Example response:

```json
{
  "success": true,
  "data": {
    "jobId": "outbox-1",
    "status": "completed",
    "attemptsMade": 1
  }
}
```

The Job Status API is also available in Swagger UI.

---

# Project Dashboard

Project dashboard provides task counts grouped by status.

Example:

```json
{
  "todo": 3,
  "in_progress": 4,
  "review": 2,
  "done": 5
}
```

---

# Error Response

The API uses a consistent error format.

```json
{
  "error": "Task not found",
  "code": "TASK_NOT_FOUND",
  "details": {}
}
```

Examples of error codes:

```text
TASK_NOT_FOUND
PROJECT_NOT_FOUND
USER_NOT_FOUND
USER_NOT_IN_ORGANIZATION
TASK_USER_ALREADY_ASSIGNED
FORBIDDEN
VALIDATION_ERROR
UNAUTHORIZED
```

---

# Security

The application implements:

- JWT authentication
- bcrypt password hashing
- Organization-level RBAC
- Organization-scoped database queries
- Cross-tenant access protection
- Request validation using Zod
- Authentication rate limiting
- Refresh token revocation
- No sensitive credentials committed to Git

Bcrypt cost factor:

```text
12
```

Access token TTL:

```text
15 minutes
```

Refresh token TTL:

```text
7 days
```

---

# Testing

The project includes unit and integration tests.

## Unit Tests

- Authentication logic
- Task assignment validation
- Pagination helper

## Integration Tests

- Login flow
- Task CRUD
- Cross-tenant access
- Validation errors
- Task assignment
- Queue job creation

Tests should run against an isolated test database.

Run tests:

```bash
npm test
```

Coverage:

```bash
npm run test:coverage
```

---

# API Documentation

Interactive Swagger documentation:

```text
http://localhost:5000/api-docs
```

Swagger/OpenAPI provides documentation for:

- Authentication APIs
- Project APIs
- Task APIs
- Task filters
- Pagination
- Task assignment
- Task unassignment
- Dashboard
- Job status
- Request schemas
- Response schemas
- Authentication requirements

The project can also provide a Postman or Bruno collection for API testing.

---

# Seed Data

The database seed provides:

- 2 organizations
- 5 users
- Multiple projects
- 10+ tasks
- Tasks distributed across projects
- Different task statuses
- Different priorities
- Task assignments
- Sample comments

---

# Project Structure

```text
src/
├── config/
│   └── swagger.ts
├── controllers/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── validators/
├── schemas/
├── queues/
├── workers/
├── utils/
├── constants/
├── server.ts
└── worker.ts

prisma/
├── schema.prisma
├── migrations/
└── seed.ts

Dockerfile
docker-compose.yml
.env.example
README.md
package.json
tsconfig.json
```

---

# Development Commands

Install dependencies:

```bash
npm install
```

Run API:

```bash
npm run dev
```

Run Worker:

```bash
npm run worker
```

Build:

```bash
npm run build
```

Start production API:

```bash
npm start
```

Prisma migration:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Seed database:

```bash
npx prisma db seed
```

Run Docker:

```bash
docker compose up --build
```

Open Swagger:

```text
http://localhost:5000/api-docs
```

---

# Production Readiness

The project demonstrates:

- Clean architecture
- PostgreSQL relational database
- Prisma migrations
- Multi-tenant authorization
- RBAC
- JWT authentication
- Refresh token revocation
- Redis + BullMQ
- Background workers
- Retry and backoff
- Dead-letter queue
- Transactional Outbox pattern
- Docker Compose
- Automated tests
- Swagger/OpenAPI documentation
- Environment-based configuration

---

# Assignment Requirements Coverage

| Requirement            | Status |
| ---------------------- | ------ |
| Node.js + Express      | ✅     |
| TypeScript             | ✅     |
| PostgreSQL             | ✅     |
| Prisma                 | ✅     |
| Redis                  | ✅     |
| BullMQ                 | ✅     |
| Docker Compose         | ✅     |
| API                    | ✅     |
| Worker                 | ✅     |
| Authentication         | ✅     |
| JWT Access Token       | ✅     |
| Refresh Token          | ✅     |
| bcrypt ≥ 12            | ✅     |
| Organization RBAC      | ✅     |
| Multi-tenant isolation | ✅     |
| Project CRUD           | ✅     |
| Task CRUD              | ✅     |
| Task filters           | ✅     |
| Cursor pagination      | ✅     |
| Task assignment        | ✅     |
| Task unassignment      | ✅     |
| Background email       | ✅     |
| Retry 3 times          | ✅     |
| Exponential backoff    | ✅     |
| Dead-letter queue      | ✅     |
| Job status API         | ✅     |
| Zod validation         | ✅     |
| Unit tests             | ✅     |
| Integration tests      | ✅     |
| Swagger/OpenAPI        | ✅     |
| Docker API             | ✅     |
| Docker Worker          | ✅     |
| Docker PostgreSQL      | ✅     |
| Docker Redis           | ✅     |

---

# Security Notice

Never commit the real `.env` file.

Use:

```text
.env.example
```

for sharing required environment variable names.

Production secrets must be generated securely and stored outside the Git repository.
