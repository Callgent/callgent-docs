---
sidebar_position: 1
title: Define the user API
description: Callgent is yet another AI programming tool besides Copilot, UI generator, and bug fixer, etc.
keywords: [user as a service]
---

Assuming you are developing an `employee leave request` API service.

## Define the API

Firstly, let's generate the OpenAPI documentation using [Mistral](https://chat.mistral.ai),

<details>
<summary>Click to view employee-leave-api.yaml</summary>

```yaml {3-5}
openapi: 3.0.0
info:
  title: Employee Leave Management API
  description: An API for managing employee leave requests
  version: 1.0.0
servers:
  - url: http://localhost:8080/api/v1
paths:
  /leave-requests:
    post:
      summary: Submit a new leave request
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LeaveRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LeaveRequest'
    get:
      summary: Get all leave requests
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/LeaveRequest'
  /leave-requests/{leaveRequestId}:
    get:
      summary: Get a specific leave request
      parameters:
        - in: path
          name: leaveRequestId
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LeaveRequest'
    put:
      summary: Update a specific leave request
      parameters:
        - in: path
          name: leaveRequestId
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LeaveRequest'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LeaveRequest'
components:
  schemas:
    LeaveRequest:
      type: object
      properties:
        id:
          type: string
        employeeId:
          type: string
        startDate:
          type: string
          format: date
        endDate:
          type: string
          format: date
        status:
          type: string
          enum: [pending, approved, rejected]
```

</details>

Above is the simplest OpenAPI 3.0 schema for a RESTful API that supports operations for a `LeaveRequest` resource. We are not going to implement the service from code.

Actually we will create a `callgent` to forward all service requests to a human being by email, to execute the logic.

:::tip
The purpose of doing this is to quickly define a service and be able to connect it to other systems via RestAPI. The specific execution can be a person instead of a piece of code, which makes the person a part of the system.
:::
