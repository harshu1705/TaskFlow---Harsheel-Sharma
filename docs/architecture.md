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

## 3. Database Schema
- **Users**: Central Authentication context.
- **Projects**: Core container model mapping a `1:N` relationship to Tasks.
- **Tasks**: Granular action objects holding `N:1` relationships to Assignees (Users) and `N:1` relationships to Projects.

*Further detailed Database schemas apply post Schema Migrations execution.*
