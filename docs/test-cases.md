# TaskFlow Complete API Test Cases

This document serves as the absolute source of truth for the Zomato-level Backend Domain API Endpoints. Import these payloads or execute them sequentially in Postman to verify Business Rules, Relational Integrity, and Bonus Metric constraints.

---

## 1. Authentication Domain

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/auth/register`
- **Test Objective**: Validate row-level hashing and JWT issuance.
```json
{
  "name": "Jane Zomato",
  "email": "jane@taskflow.local",
  "password": "productionGrade123!"
}
```
**Expected**: `201 Created`. (Extract `token` for subsequent requests).

### 1.2 Login User
- **Method**: `POST`
- **Path**: `/auth/login`
- **Test Objective**: Validate stateless BCrypt decrypt and JWT session allocation.
```json
{
  "email": "jane@taskflow.local",
  "password": "productionGrade123!"
}
```
**Expected**: `200 OK`.

---

## 2. Projects Core Domain (Secured via JWT)

### 2.1 Create Project
- **Method**: `POST`
- **Path**: `/projects`
- **Test Objective**: Verify project builds tracking JWT native owner mapping.
```json
{
  "name": "Frontend Overhaul",
  "description": "Porting React components to Vite"
}
```
**Expected**: `201 Created`.

### 2.2 Get User Projects (With Pagination)
- **Method**: `GET`
- **Path**: `/projects?page=1&limit=5`
- **Test Objective**: Ensure User isolated context and that the paginator meta-block counts correctly.
**Expected**: `200 OK`.
```json
{
  "success": true,
  "data": [ { "name": "Frontend Overhaul", ... } ],
  "pagination": { "page": 1, "limit": 5, "total": 1, "pages": 1 }
}
```

### 2.3 Update Project
- **Method**: `PUT`
- **Path**: `/projects/:id`
- **Test Objective**: Restrict update purely to Project Owner.
```json
{
  "name": "Frontend Overhaul (Priority)"
}
```
**Expected**: `200 OK`.

---

## 3. Tasks Core Domain (Secured + Filtered)

### 3.1 Create Task
- **Method**: `POST`
- **Path**: `/projects/:projectId/tasks`
- **Test Objective**: Verify task links cleanly to the Project parent, verifying hierarchy.
```json
{
  "title": "Configure GitHub Actions",
  "description": "Standardize CI/CD testing",
  "status": "todo",
  "priority": "high"
}
```
**Expected**: `201 Created`.

### 3.2 Update Task Status
- **Method**: `PUT`
- **Path**: `/tasks/:taskId`
- **Test Objective**: Validate status shifts for implicit Frontend Kanban Drag-and-Drop capability.
```json
{
  "status": "in_progress"
}
```
**Expected**: `200 OK`.

---

## 4. Advanced USP Optimizations (Senior Logic)

### 4.1 Execute Dynamic Search & Filter Tasks
- **Method**: `GET`
- **Path**: `/projects/:projectId/tasks?search=GitHub&status=todo&priority=high&sortBy=created_at&order=desc&page=1&limit=10`
- **Test Objective**: Stress-test PostgreSQL composite filtering, validating `search=GitHub` dynamically parses title/description via `ILIKE`.
**Expected**: `200 OK` (Only matching queried arrays).

### 4.2 Execute Analytical Stats Execution
- **Method**: `GET`
- **Path**: `/projects/:projectId/stats`
- **Test Objective**: Bypass raw node array filtering natively generating dashboard-ready datasets directly from raw DB performance engines.
**Expected**: `200 OK`.
```json
{
  "success": true,
  "data": {
    "totalTasks": 1,
    "todo": 0,
    "inProgress": 1,
    "done": 0,
    "highPriority": 1,
    "overdue": 0
  }
}
```

---

*Note: All endpoints attempting mutation by unauthorized user payloads will definitively return `403 Forbidden` mapping securely down the repository chain via isolated `JOIN` strategies.*
