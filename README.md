<div align="center">
  <img src="./frontend/public/vite.svg" alt="TaskFlow Logo" width="80" height="80">
  <h1 align="center">TaskFlow 🌿</h1>
  <p align="center">
    <strong>A Production-Grade, "Greening India" Thematic Task Management Platform</strong>
  </p>
  <p align="center">
    <a href="#tech-stack">Tech Stack</a> • 
    <a href="#features--usps">Features</a> • 
    <a href="#quick-start-docker">Quick Start</a> • 
    <a href="#architecture">Architecture</a> • 
    <a href="#api--testing">API & Testing</a>
  </p>
</div>

---

## 📖 Overview

**TaskFlow** is a complete, full-stack application built to facilitate enterprise-level sustainability initiatives. Designed conceptually for the logistics industry (e.g., Zomato's "Greening India" operations), it bridges the gap between high-level project goals and actionable developer tasks. 

It features an aesthetically stunning UI, a secure RESTful backend, and enterprise-grade architectural decisions designed to scale smoothly.

![TaskFlow UI Demo](./docs/demo.gif)
*(A quick walkthrough of our animated dashboards, Kanban states, and fluid UX).*

---

## ⚡ Tech Stack

This project was built leveraging modern, high-performance web standards:

### Frontend
- **React.js & Vite** for lightning-fast HMR and optimized builds.
- **TypeScript** for strict end-to-end type safety.
- **Tailwind CSS & ShadCN UI** for a highly bespoke, accessible, and responsive design system.
- **Zustand & TanStack Query** for persistent global state and asynchronous cache handling.
- **Framer Motion & React-CountUp** for delightful micro-interactions.

### Backend
- **Node.js & Express.js** for a robust, non-blocking asynchronous REST API.
- **PostgreSQL** as the highly relational, atomic source of truth.
- **TypeScript** ensuring exact domain-model alignment with the frontend.
- **JWT & Bcrypt** for secure, stateless authentication flows.
- **Docker & Docker Compose** for guaranteed zero-configuration deployment.

---

## ✨ Features & USPs

During the development lifecycle, we prioritized features that simulate a real-world, premium product rather than just a minimum viable prototype:

1. **Dynamic Sustainability Metrics**: Task completion mathematically calculates real-world environmental offsets (e.g., *Tasks Done × 3.5 = kg CO₂ offset*).
2. **Beautiful Light/Dark Modes**: Fully integrated Tailwind `dark:` variants ensure seamless transitions out-of-the-box, protecting user accessibility.
3. **Optimistic UI Updates**: Leveraging Tanstack Mutations, deletions and creations happen instantly on the UI without waiting for network round-trips.
4. **Keyboard Centric UX**: Advanced accessibility shortcuts (e.g., Press `N` to deploy a New Project).
5. **Graceful Error Handling**: 100% of network failures, duplicate emails, and validation errors are safely trapped and displayed as beautiful toast notifications.

---

## 🚀 Quick Start (Docker)

Reviewing this repository is completely frictionless. We utilize a containerized environment to guarantee it works identically on every device.

### 1. Requirements
- Docker Desktop installed and running.

### 2. Booting the Servers
Clone the repository and launch the orchestrated containers:

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow

# Boot Database, Backend, and Frontend simultaneously
docker compose up --build -d
```

### 3. Access
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)

> **💡 Reviewer Time-Saver:**
> You do not need to register a new account to test the platform. At the `/login` screen, use the embedded quick demo credentials:
> **Email**: `test@example.com` | **Password**: `password123`

---

## 🏛️ Architecture & Scaling Design

TaskFlow implements a strict layered architecture pattern on the Node backend:
`Controller (HTTP Layer)` → `Service (Business Logic)` → `Repository (Data Access)`

**Why this structure over a monolith router?**
- **Separation of Concerns**: Decouples business logic from HTTP transport, making the framework completely agnostic.
- **Testability**: Services can be tested completely isolated from Express `req/res` contexts and Postgres querying bottlenecks.
- **Scalability**: Allows smooth pivots toward microservices should the platform expand to millions of concurrent operations.

---

## 🧪 API & Testing

### Interactive Postman Collection
To thoroughly validate the REST API endpoints without navigating the GUI, a fully configured Postman environment is bundled in the source code.
👉 **[Download API Collection](./docs/TaskFlow.postman_collection.json)** *(Import directly into Postman)*

### Live Endpoints Overview
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Creates a new user | ❌ |
| `POST` | `/auth/login` | Authenticates and returns JWT | ❌ |
| `GET` | `/projects` | Fetches paginated user projects | ✅ |
| `POST` | `/projects` | Creates a new project | ✅ |
| `DELETE` | `/projects/:id`| Hard deletes a project | ✅ |

---

<div align="center">
  <i>Crafted with passion for clean code and excellent user experiences.</i>
</div>
