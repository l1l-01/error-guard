# 🛡️ Error Guard

**Error Guard** is a lightweight, TypeScript-friendly library for standardized error handling in Node.js/Express applications.

# Changelog
## v1.0.8 2025-10-16
- Fixed: Error code now properly shows in responses.
- Improved: Library fully supports TypeScript, ECMAScript Modules (ESM), and CommonJS (CJS).
- Refactored: Error helper creation to reduce repetition and improve code quality.
- Updated: TypeScript typings for better developer experience.

## Installation
```bash
npm install error-guard
```

## Environment Variables
- Make sure you have a variable named `NODE_ENV` in your `.env` file.
- When `process.env.NODE_ENV !== 'production'`, all error objects include a full stack trace to help with debugging.
- In production, the stack field and name are automatically removed to prevent sensitive information from being exposed in API responses.

## It provides:
- Custom error classes with HTTP status codes and error codes
- Predefined error helpers (BadRequest, ValidationError, etc.)
- Async route handler wrapper
- Express error-handling middleware

## Usage
- Basic Example
```Typescript
import express from "express";
import {
  BadRequest,
  asyncHandler,
  createErrorHandler,
} from "error-guard";

const app = express();
app.use(express.json());

app.get(
  "/test",
  asyncHandler(async (req, res) => {
    // Throw a standardized error
    throw BadRequest("Invalid request data");
  })
);
// Global error handler
app.use(createErrorHandler());

app.listen(3000, () => console.log("Server running on port 3000"));
```
- Output (JSON):
```Typescript
{
  "status": "fail",
  "code": "BAD_REQUEST",
  "message": "Invalid request data",
  "stack": "Error: ...",
  "name": "ErrorGuard"
}
```

## Using Predefined Errors
- `BadRequest(message, details)` : Invalid request data
- `ValidationError(message, details)` : Schema or input validation failed
- `AuthenticationError(message, details)` : Invalid or missing credentials
- `AuthorizationError(message, details)` : Not allowed to perform this action
- `ResourceNotFound(message, details)` : Resource does not exist
- `ConflictError(message, details)` : Conflict with an existing resource
- `RateLimitError(message, details)` : Too many requests
- `DependencyError(message, details)` : External dependency failed
- `InternalError(message, details)` : Generic server error
```Typescript
BadRequest(message?: string, details?: any)
ValidationError(message?: string, details?: any)
AuthenticationError(message?: string, details?: any).
```

### You can also provide optional details for more information:
```Typescript
throw ValidationError("Invalid email format", { field: "email" });
```

## Async Handlers
- Wrap async route handlers to automatically catch errors:
```Typescript
app.get(
  "/async-test",
  asyncHandler(async (req, res) => {
    const data = await fetchData();
    if (!data) throw ResourceNotFound("Data not found");
    res.json(data);
  })
);
```

## Custom Error Handling Middleware
- You can provide a logger to capture all errors:
```Typescript
app.use(createErrorHandler({
  logger: (err, req) => {
    console.error(`[${req.method}] ${req.url} -`, err);
  }
}));
```

## API Reference
```Typescript
new ErrorGuard(statusCode?: number, code?: string, message?: string, details?: any)
```
- `statusCode` — HTTP status code (default: 500)
- `code` — Error code string (default: "ERROR")
- `message` — Error message
- `details` — Optional extra information


# License
MIT License © l1l-01
