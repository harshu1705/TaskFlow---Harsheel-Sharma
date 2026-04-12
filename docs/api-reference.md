# API Reference

TaskFlow backend exposes the following endpoints operating over JSON payloads.

All non-auth routes expect headers:
`Authorization: Bearer <token>`

## 1. Authentication
*   **POST** `/auth/register`: Create a new User. Returns JWT and user entity.
*   **POST** `/auth/login`: Issue an access token for valid credentials. Returns JWT and user entity.

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
