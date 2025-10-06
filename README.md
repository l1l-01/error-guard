# 🛡️ Error Guard

**Error Guard** is a simple and lightweight Express.js library that helps you handle errors gracefully.
It provides:
- A custom `ErrorGuard` class for structured error messages
- An `asyncHandler` wrapper to catch async route errors automatically
- A clean, customizable Express error-handling middleware

## 🚀 Installation

```bash
npm install error-guard
```

## 📌 Example of use

```javascript
// Wrap your async route handler with asyncHandler
const register = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    // Throw AppError instead of manual res.status
    throw new AppError("Email already exists", 400, { email });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    email,
    password: hashedPassword,
    role,
  });
  await newUser.save();

  // Success response
  res.status(201).json({ message: `User registered with email ${email}` });
});
```

```javascript
const express = require("express");
const { AppError, asyncHandler, createErrorHandler } = require("error-guard");

const app = express();
app.use(express.json());

const logger = (err, req) => {
  console.log(`[${new Date().toISOString()}] ${err.status}: ${err.message} - ${req.method} ${req.url}`);
};

app.get("/fail", (req, res) => {
  throw new AppError("Something went wrong!", 500);
});

app.use(createErrorHandler({ logger }));

app.listen(3000, () => console.log("Server running on port 3000"));
```
