# System Architecture

TaskFlow utilizes a segmented monolithic architecture. The repository is configured as a lightweight monorepo separating React frontend capabilities from Express/Node.js backend responsibilities.

## 1. Domain Driven Separation (Backend)
The API leverages the following tiered processing path for incoming HTTP requests:

1. **Routes Layer (`src/routes`)**: Unpacks incoming requests and maps REST paths to Controllers.
2. **Middleware Layer (`src/middlewares`)**: Intercepts requests for authorization extraction (JWT extraction), schema validation (Zod parsing), and global error handlers.
3. **Controller Layer (`src/controllers`)**: Isolates the HTTP context. Calls respective Domain Services.
4. **Service Layer (`src/services`)**: Completely detached from Request/Response context. Business logic, transactional bounds, and cross-domain interaction occur here.
5. **Repository Layer (`src/repositories`)**: Isolates database (PostgreSQL) context. Abstracts raw SQL or query builder execution from business logic.

## 2. Component Design (Frontend)
The frontend utilizes a scaled atomic design:
- **`components/`**: Pure UI layout blocks (Buttons, Inputs). Dumb components holding no API state.
- **`pages/`**: Routable views executing Layout wrappers. 
- **`hooks/`**: Specialized tools to extract data-fetching logic (e.g. Tanstack Query custom hooks).
- **`store/`**: Global state containers (e.g. Zustand) governing things like Active User Session, or active dragged tasks.

## 3. Database Architecture & Persistence Strategy

We use purely native PostgreSQL (13+) driven by custom `.sql` UP/DOWN migrations mapped to an automated `.ts` runner sequence. This entirely eliminates the bloated "ORM Lock-in" (e.g. Prisma sync lag), giving absolute control over schema definitions.

### Strategic Schema Definitions (Interview Callouts)
- **Primary Keys**: We strictly enforce `gen_random_uuid()` (or `uuid_generate_v4()`) instead of Auto-Incrementing Integers (`SERIAL`). This averts IDOR (Insecure Direct Object Reference) vulnerabilities natively without requiring hash-masking utilities on the backend.
- **Data Boundaries via PostgreSQL ENUMs**: We shift validation as deeply into the system as possible. Defining `task_status` and `task_priority` natively at the DB level via custom `TYPE` protects boundaries more rigorously than code-level validations alone.
- **Relational Integrity via Cascade**: Implementing `ON DELETE CASCADE` on Projects structurally guarantees that deleting a Workspace drops all connected Tasks without executing "soft-deletion" logic inside the Javascript memory runtime, radically simplifying the Service layer.
- **Performance Indexing**: We explicitly applied `CREATE INDEX` on heavily read/filtered table columns: `owner_id`, `assignee_id`, `project_id`, `status` and `created_at`. This drops query complexities from `O(N)` Full Table Scans to `O(log N)` B-Tree executions.

## 4. Authentication Pipeline

The authentication domain establishes the gateway to the REST application without utilizing session boundaries or external state caches.

- **Storage**: We intercept raw passwords and pipe them through `bcrypt` (Cost Factor: 12) before raw SQL insertion. The database never witnesses plain text string payloads.
- **Token Delivery**: On verified credentials, the application yields a signed `jsonwebtoken` (JWT) strictly mapped containing purely the contextual identifiers (`userId` and `email`).
- **Middleware Extraction**: Subsequent requests hit `auth.middleware.ts`, which extracts the `Authorization: Bearer <token>` pipeline headers, decrypts the token footprint natively against `process.env.JWT_SECRET`, and maps the deserialized Context into explicitly typed `req.user` blocks for downstream Controllers.
