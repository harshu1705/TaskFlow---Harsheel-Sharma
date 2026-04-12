# TaskFlow

> **Mid-level Engineer · Full Stack / Backend / Frontend**

TaskFlow is a production-grade, minimalist task and project management ecosystem. It provides robust capabilities for multi-user project handling, kanban-style task tracking, and role-based assignments, built around a Zomato "Greening India" thematic UI.

---

## 1. Overview
The platform allows users to register, manage projects securely, and organize categorized tasks. The frontend is responsive and optimized for both mobile and desktop utility. The backend exposes a RESTful JSON API secured by JWT-based authentication. 

**Tech Stack**:
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Frontend**: React, Vite, TypeScript, TailwindCSS, ShadCN UI
- **Infrastructure**: Docker Compose

---

## 2. Architecture Decisions
TaskFlow implements a strict layered architecture pattern on the backend:
- `Controller (HTTP Layer)` → `Service (Business Logic)` → `Repository (Data Access)`

**Why this structure?**
- **Separation of Concerns**: Decouples business logic from HTTP transport and Data access layers. Testing becomes trivial as Services can be mocked independently of Express requests or SQL queries. 
- **Predictability & Scale**: Allows the application to smoothly pivot from a monolithic structure to microservices in the future if required.
- **Why REST over GraphQL?**: Given the explicit, relational, and scope-constrained nature of the data models (Users, Projects, Tasks), REST provides robust caching, straight-forward status mapping, and reduced overhead for the frontend.

For the frontend domain, the architecture utilizes modular directories (`components/`, `hooks/`, `services/`, `store/`) to avoid prop-drilling, managing global state securely while keeping page bundles lightweight. 

For detailed systems layout, consult `docs/architecture.md`.

---

## 3. Running Locally

We utilize Docker for a "zero manual steps" local integration.

```bash
git clone https://github.com/your-name/taskflow
cd taskflow

# 1. Prepare Environment Variables
cp .env.example .env

# 2. Boot the cluster (Postgres, Backend, Frontend)
docker compose up --build
```
> App available locally at [http://localhost:3000](http://localhost:3000)

---

## 4. Running Migrations
*(To be detailed in Phase 2)*

Migrations run automatically via scripts attached to the Docker Node.js container lifecycle upon initialization.

---

## 5. Test Credentials
*(To be provided post DB-seed in Phase 2)*
```text
Email:    test@example.com
Password: password123
```

---

## 6. API Reference
- We provide comprehensive API guidelines. Please see the complete collection here: [docs/api-reference.md](./docs/api-reference.md).

---

## 7. What I'd Do With More Time
*(To be updated at project conclusion)*
