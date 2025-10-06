# 🛡️ Error Guard

**Error Guard** is a minimal, lightweight, and easy to use Express.js error handling library designed to simplify error management in your Node.js applications.
It provides:
- A custom `ErrorGuard` class for structured error messages
- An `asyncHandler` wrapper to catch async route errors automatically
- A clean, customizable Express error-handling middleware

## 🚀 Installation

```bash
npm install error-guard
```

## 📌 It provides:

- `ErrorGuard` class — for structured errors
```javascript
// Wrap your async route handler with asyncHandler
const { ErrorGuard } = require("error-guard");

// Throw a 404 error with extra details
throw new ErrorGuard("User not found", 404, { userId: "123" });
```

- `asyncHandler` function — for automatically handling async route errors
```javascript
const { asyncHandler } = require("error-guard");

app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ErrorGuard("User not found", 404);
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
