---
sidebar_position: 1
title: Design the Service
description: Callgent is yet another AI programming tool besides Copilot, UI generator, and bug fixer, etc.
keywords: [user as a service]
---

Let's create a recruiting callgent service, to receive and process job applications.

:::tip
There are 2 benefits for using Callgent to create this service:

1. We can build this service without any programming or coding, since requests are processed by real humans.
2. The service can be integrated into any existing systems via API, pages, etc.

:::

## Design Service API

Firstly, you may send the below prompt to some AI tools like [Mistral](https://chat.mistral.ai) to generate an OpenAPI document:

```markdown
Generate an OpenAPI documentation in json format for `Recruiting Service`,
including the following functions:
 - `List/View job positions`
 - `Apply for a position`
```

Then the `recruiting-service-api.yaml` is generated:
<details>
<summary>Click to view <i>recruiting-service-api.yaml</i></summary>

```json {15-17,50-52,76-78}
{
  "openapi": "3.0.0",
  "info": {
    "title": "Recruiting Service API",
    "description": "API for managing job positions and applications.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://api.recruitingservice.com/v1",
      "description": "Production server"
    }
  ],
  "paths": {
    "/positions": {
      "get": {
        "summary": "List all job positions",
        "description": "Retrieve a list of all available job positions.",
        "operationId": "listPositions",
        "responses": {
          "200": {
            "description": "A list of job positions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/JobPosition"
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
    "/positions/{positionId}": {
      "get": {
        "summary": "View a specific job position",
        "description": "Retrieve details of a specific job position by its ID.",
        "operationId": "viewPosition",
        "parameters": [
          {
            "name": "positionId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "The ID of the job position to retrieve"
          }
        ],
        "responses": {
          "200": {
            "description": "Details of the job position",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/JobPosition"
                }
              }
            }
          },
          "404": {
            "description": "Job position not found"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
    "/positions/{positionId}/apply": {
      "post": {
        "summary": "Apply for a position",
        "description": "Submit an application for a specific job position.",
        "operationId": "applyForPosition",
        "parameters": [
          {
            "name": "positionId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "The ID of the job position to apply for"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Application"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Application submitted successfully"
          },
          "400": {
            "description": "Invalid input"
          },
          "404": {
            "description": "Job position not found"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "JobPosition": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the job position"
          },
          "title": {
            "type": "string",
            "description": "Title of the job position"
          },
          "description": {
            "type": "string",
            "description": "Description of the job position"
          },
          "location": {
            "type": "string",
            "description": "Location of the job position"
          },
          "requirements": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "List of requirements for the job position"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the job position was created"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the job position was last updated"
          }
        }
      },
      "Application": {
        "type": "object",
        "properties": {
          "applicantName": {
            "type": "string",
            "description": "Name of the applicant"
          },
          "email": {
            "type": "string",
            "format": "email",
            "description": "Email address of the applicant"
          },
          "resume": {
            "type": "string",
            "format": "binary",
            "description": "Resume of the applicant"
          },
          "coverLetter": {
            "type": "string",
            "description": "Cover letter of the applicant"
          },
          "appliedAt": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the application was submitted"
          }
        }
      }
    }
  }
}
```

</details>

There are 3 APIs are designed in `recruiting-service-api.yaml`.

Next we'll import this API definition into a new callgent,
