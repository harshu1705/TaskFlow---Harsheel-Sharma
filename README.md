# TaskFlow — Greening India Operations

A full-stack task and project management platform built as part of the Zomato "Greening India" initiative. The idea was to build something that actually feels like a product — not a demo — with proper auth, real-time UI updates, containerized infrastructure, and a design system that makes sense.

---

## What this does

You can register an account, create sustainability projects (think: "EV Fleet rollout", "Zero Waste Packaging"), add tasks inside those projects, track their status, and watch your dashboard update with eco-metrics as work gets done. There's a carbon offset calculator baked into the dashboard that grows dynamically as you complete tasks.

It's a SPA backed by a REST API, with JWT auth, PostgreSQL persistence, and the whole thing boots with a single Docker command.

---

## Tech stack

**Frontend**
- React + Vite + TypeScript
- Tailwind CSS + ShadCN UI
- Zustand (global state + auth persistence)
- TanStack Query (data fetching + cache)
- Framer Motion (animations)
- React CountUp (animated stat widgets)

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL (via `pg` driver, raw SQL — no ORM)
- JWT + Bcrypt for auth
- Zod for request validation
- Layered architecture: Controller → Service → Repository

**Infrastructure**
- Docker + Docker Compose
- PostgreSQL healthcheck (backend waits for DB to be ready before migrating)
- Auto-runs migrations + seed data on first boot

---

## Running locally

You just need Docker Desktop installed. That's it.

```bash
git clone https://github.com/harshu1705/TaskFlow---Harsheel-Sharma.git
cd TaskFlow---Harsheel-Sharma

docker compose up --build
```

Wait about 30–60 seconds for everything to build and the DB to initialize.

- **App**: http://localhost:3000  
- **API**: http://localhost:4000

To stop everything:
```bash
docker compose down
```

To wipe the database and start fresh:
```bash
docker compose down -v
docker compose up --build
```

---

## Demo credentials

The database is pre-seeded with a demo account and sample projects so you don't have to set anything up manually.

```
Email:    test@example.com
Password: password123
```

You'll land on the dashboard with 3 Greening India projects already created (EV fleet, zero-waste packaging, solar kitchens) — each with multiple tasks in different states so the UI actually has something to show.

---

## API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Login, returns JWT |
| GET | `/projects` | ✓ | List projects (paginated) |
| POST | `/projects` | ✓ | Create project |
| PUT | `/projects/:id` | ✓ | Update project |
| DELETE | `/projects/:id` | ✓ | Delete project |
| GET | `/projects/:id/tasks` | ✓ | List tasks for a project |
| POST | `/projects/:id/tasks` | ✓ | Create task |
| PUT | `/projects/:id/tasks/:taskId` | ✓ | Update task |
| DELETE | `/projects/:id/tasks/:taskId` | ✓ | Delete task |

A Postman collection is included at [`docs/TaskFlow.postman_collection.json`](./docs/TaskFlow.postman_collection.json). Import it, set `baseUrl` to `http://localhost:4000` and `jwtToken` to the token from login, and all endpoints are ready to test.

---

## Project structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/          # Env validation (Zod)
│   │   ├── controllers/     # Express route handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # SQL queries
│   │   ├── middlewares/     # Auth guard, error handler
│   │   ├── validators/      # Request schemas
│   │   └── utils/           # DB pool, JWT helpers, migration runner
│   └── migrations/          # SQL migration + seed files
├── frontend/
│   └── src/
│       ├── components/      # UI primitives + layout
│       ├── pages/           # Route-level components
│       ├── store/           # Zustand auth + theme
│       ├── services/        # Axios API client
│       └── hooks/           # Custom hooks
└── docker-compose.yml
```

---

## Architecture decisions

**Why raw SQL over an ORM?**  
Prisma or Drizzle would've worked fine, but I wanted full control over the queries — especially for pagination and filtering. It also means there's no magic layer to debug if something goes wrong.

**Why the Controller → Service → Repository split?**  
It keeps things testable. The service layer holds all business logic and doesn't know anything about HTTP. The repository layer handles SQL and doesn't know anything about business rules. Swapping PostgreSQL for something else, or extracting the service into a microservice later, becomes a bounded change.

**Why Zustand over Redux?**  
Much less boilerplate for the scope of state this app needs. The `persist` middleware handles auth token hydration on refresh automatically, which is what makes the "stay logged in across refreshes" behaviour work.

---

## Things I'd add with more time

- Proper role-based access (project owner vs. member vs. viewer)
- Real drag-and-drop Kanban columns for tasks
- Email notifications when tasks are assigned
- File attachments on tasks
- Activity/audit log per project
- Unit and integration tests for the service layer

---

Built by **Harsheel Sharma**
