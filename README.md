# 🛡️ Error Guard

**Error Guard** is a minimal, lightweight, and easy to use Express.js error handling library designed to simplify error management in your Node.js applications.

## 🚀 Installation

```bash
npm install error-guard
```

## 💬 Environment Variables
- Make sure you have a variable named `NODE_ENV` in your `.env` file.
- When `process.env.NODE_ENV !== 'production'`, all error objects include a full stack trace to help with debugging.
- In production, the stack field and name are automatically removed to prevent sensitive information from being exposed in API responses.

## 🧩 It provides:

- A custom `ErrorGuard` class for structured error messages
`ErrorGuard(statusCode, code, message, details)` (note: details parameter is optional)
```javascript
// Wrap your async route handler with asyncHandler
const { ErrorGuard } = require("error-guard");

throw new ErrorGuard(404, "NOT_FOUND", "User not found");

throw new ErrorGuard(404, "NOT_FOUND", "email not found", {
  email: email,
  });
```
Output (When NODE_ENV is set to production stack and name will disapear) :
{
  "status": "fail",
  "message": "email not found",
  "details": {
    "field": "email"
  },
  "stack": "ErrorGuard: email not found\n    at /path/to/file.js:35:11",
  "name": "ErrorGuard"
}


- An `asyncHandler` wrapper to catch async route errors automatically
```javascript
const { asyncHandler } = require("error-guard");

app.get("/users/:id", asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) throw new ErrorGuard(404, "NOT_FOUND", "User not found", { userID: id});
  res.json(user);
}));
```
- ErrorHelper Each helper returns an instance of ErrorGuard with a prefilled status code and error type.
- Function / Status / Code / Description
- `BadRequest(message, details)` / 400 / `BAD_REQUEST`/ Invalid request data
- `ValidationError(message, details)` / 400 / `VALIDATION_ERROR` / Schema or input validation failed
- `AuthenticationError(message, details)` / 401 / `AUTHENTICATION_ERROR`  / Invalid or missing credentials
- `AuthorizationError(message, details)`  / 403 / `FORBIDDEN_ACCESS`      / Not allowed to perform this action
- `ResourceNotFound(message, details)`    / 404 / `RESOURCE_NOT_FOUND`    / Resource does not exist
- `ConflictError(message, details)`       / 409 / `RESOURCE_CONFLICT`     / Conflict with an existing resource
- `RateLimitError(message, details)`      / 429 / `RATE_LIMIT_EXCEEDED`   / Too many requests
- `DependencyError(message, details)`     / 503 / `SERVICE_UNAVAILABLE`   / External dependency failed
- `InternalError(message, details)`       / 500 / `INTERNAL_SERVER_ERROR` / Generic server error



```javascript
const { asyncHandler } = require("error-guard");

app.get("/users/:id", asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) throw new ResourceNotFound("User not found", { userID: id});
  res.json(user);
}));
```

- `createErrorHandler` function — centralized error-handling middleware
```javascript
const { createErrorHandler } = require("error-guard");

// Optional custom logger
const logger = (err, req) => {
  console.error(`[${new Date().toISOString()}] ${err.status}: ${err.message} - ${req.method} ${req.url}`);
};

app.use(createErrorHandler({ logger }));
```
