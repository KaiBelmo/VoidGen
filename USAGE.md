# VoidGen Usage Guide

This guide covers how to run VoidGen, structure your data file, use hot reloading, and configure route-level behavior.

## Basic Usage

Start the server with a data file and port:

```bash
voidgen --file path/to/your/data.json --port 3000
```

Watch mode is enabled by default. To disable hot reloading:

```bash
voidgen --file path/to/your/data.json --port 3000 --no-watch
```

## Data File Format

Your JSON data file should follow this structure:

```json
{
  "todos": [
    { "id": 1, "title": "Learn TypeScript", "completed": false },
    { "id": 2, "title": "Build something awesome", "completed": true }
  ],
  "config": {
    "theme": "dark",
    "notifications": true
  }
}
```

This generates the following endpoints:

- `GET /api/todos`
- `GET /api/todos/:id`
- `POST /api/todos`
- `PUT /api/todos/:id`
- `PATCH /api/todos/:id`
- `DELETE /api/todos/:id`
- `GET /api/config`
- `PUT /api/config`
- `PATCH /api/config`

Collections become full CRUD resources. Plain objects become singleton resources.

## Hot Reloading

When watch mode is enabled, VoidGen automatically reloads:

- The main data file passed with `--file`
- The route behavior config file, if present

This lets you update data and API behavior without restarting the server.

## Route-Level Behavior

You can customize specific routes and HTTP methods by placing a config file next to your data file using the same base name:

- `db.json` -> `db.config.json`
- `examples/db.json` -> `examples/db.config.json`

Example:

```json
{
  "/api/posts": {
    "GET": {
      "delay": 100
    },
    "POST": {
      "delay": 300,
      "validation": {
        "requiredFields": ["title", "author"],
        "errorStatus": 400
      }
    }
  },
  "/api/posts/:id": {
    "DELETE": {
      "delay": 150,
      "errorInjection": {
        "enabled": true,
        "statusCode": 503,
        "message": "Service temporarily unavailable",
        "probability": 0.25
      }
    }
  },
  "/api/comments": {
    "GET": {
      "rateLimit": {
        "windowMs": 60000,
        "maxRequests": 10,
        "statusCode": 429,
        "message": "Too Many Requests"
      }
    }
  }
}
```

Supported options:

- `delay`: adds latency in milliseconds before the response
- `validation.requiredFields`: enforces required fields on `POST`, `PUT`, and `PATCH`
- `validation.errorStatus`: custom status code for validation errors
- `errorInjection.enabled`: turns on simulated failures
- `errorInjection.statusCode`: HTTP status code returned for injected errors
- `errorInjection.message`: response message for injected errors
- `errorInjection.probability`: probability from `0` to `1` that an error is injected
- `rateLimit.windowMs`: rate limit window in milliseconds
- `rateLimit.maxRequests`: maximum requests allowed during the window
- `rateLimit.statusCode`: custom status code for rate limit responses
- `rateLimit.message`: response message for rate limit responses

## Tips

- Use arrays for collection endpoints and objects for singleton endpoints.
- Keep IDs on collection items if you want predictable item routes.
- Use watch mode during frontend development so your mock server reflects file changes immediately.
