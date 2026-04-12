# API Reference

TaskFlow backend exposes the following endpoints operating over JSON payloads.

All non-auth routes expect headers:
`Authorization: Bearer <token>`

## 1. Authentication

### Register a User
- **Method**: `POST`
- **Path**: `/auth/register`
- **Description**: Exposes account creation. Executes Zod parsing enforcing minimal email shapes and standard password complexities (min 8 chars).
- **Request Body**:
```json
{
  "name": "Jane Zomato",
  "email": "jane@example.com",
  "password": "productionGrade123!"
}
```
- **Response** `201 Created`:
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "e2ba261...",
    "name": "Jane Zomato",
    "email": "jane@example.com"
  }
}
```
- **Response** `400 Bad Request` (Email already exists / Validation Failure). Returns strictly mapped field-based JSON structures.

### Authenticate Session
- **Method**: `POST`
- **Path**: `/auth/login`
- **Description**: Authenticates active credentials wrapping encrypted SQL hash verifications.
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "productionGrade123!"
}
```
- **Response** `200 OK`: Yields equivalent signed Identity `token` structure as POST register.
- **Response** `401 Unauthorized`: Triggers natively upon Invalid Credentials logic.


## 2. Projects
*   **GET** `/projects`: List projects tied to the authenticated caller properties.
*   **POST** `/projects`: Generate a new project. Caller defaults to project owner.
*   **GET** `/projects/:id`: Obtain a single project's detail including attached task relationships.
*   **PATCH** `/projects/:id`: Update specific fields dynamically (Name/Description). Owner restricted.
*   **DELETE** `/projects/:id`: Execute cascading removal of a project and tasks. Owner restricted.

## 3. Tasks
*   **GET** `/projects/:id/tasks`: List scope tasks. Accepts Query Params: `?status=todo` or `?assignee=uuid`.
*   **POST** `/projects/:id/tasks`: Attach a task to a project.
*   **PATCH** `/tasks/:id`: Dynamically update task status (i.e., for Drag and Drop).
*   **DELETE** `/tasks/:id`: Eliminate a task. 

*(Detailed Request/Response JSON structures will align precisely with the established test collection Postman definitions)*
