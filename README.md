# 99Tech-assessment

## Requirement
Develop a backend server with ExpressJS. You are required to build a set of CRUD interface that allow a user to interact with the service. You are required to use TypeScript for this task.

1. Interface functionalities:
    - Create a resource.
    - List resources with basic filters.
    - Get details of a resource.
    - Update resource details.
    - Delete a resource.
2. You should connect your backend service with a simple database for data persistence.
3. Provide `README.md` for the configuration and the way to run application.

## Validation
- Validate request parameter
  + Validate page and pageSize to set a default value for get list API
  + Validate valid uuid
- Validate request body: Check type and required fields

## Setup project
- Prerequisites
    + Node >=18
    + Docker

- Steps
    + Stay in the root folder, open terminal and run command `docker-compose up -d` to startup the postgres database
    + Create `.env` file and copy content in `.env-sample.txt` to `.env` file
    + Start the server by running the following command `npm install && npm run build && npm start`, the server will be listen on port 3000 by default
    + The API will be expose under `http://{host}:{port}/v1/products`. For local environment, the url should be `http://localhost:3000/v1/products`

## API Specs
- API Get All
  - HTTP Method: GET
  - Endpoint: /v1/products
  - Query parameter:
    + name: string (optional)
    + page: integer (optional)
    + pageSize: integer (optional)
  - Response:
    - Success: { success: true, data: {...} }
    - Failed: { success: false, message: "", errorCode: "" }
- API Get Details
  - HTTP Method: GET
  - Endpoint: /v1/products/{id}
  - Path parameter:
    + id: string (required)
  - Response:
    - Success: { success: true, data: {...} }
    - Failed: { success: false, message: "", errorCode: "" }
- API Create
  - HTTP Method: POST
  - Endpoint: /v1/products
  - Body: json object
    + name: string (required)
    + code: string (required)
    + color: string (required)
    + brandName: string (required)
  - Response:
    - Success: { success: true, data: {...} }
    - Failed: { success: false, message: "", errorCode: "" }
- API Update
  - HTTP Method: PATCH
  - Endpoint: /v1/products/{id}
  - Path parameter:
    + id: string (required)
  - Body: json object
    + name: string (optional)
    + color: string (optional)
    + brandName: string (optional)
  - Response:
    - Success: { success: true, data: {...} }
    - Failed: { success: false, message: "", errorCode: "" }
- API Delete
  - HTTP Method: DELETE
  - Endpoint: /v1/products/{id}
  - Path parameter:
    + id: string (required)
  - Response:
    - Success: { success: true }
    - Failed: { success: false, message: "", errorCode: "" }
    
