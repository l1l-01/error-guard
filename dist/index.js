"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthenticationError: () => AuthenticationError,
  AuthorizationError: () => AuthorizationError,
  BadRequest: () => BadRequest,
  ConflictError: () => ConflictError,
  DependencyError: () => DependencyError,
  ErrorGuard: () => ErrorGuard,
  InternalError: () => InternalError,
  RateLimitError: () => RateLimitError,
  ResourceNotFound: () => ResourceNotFound,
  ValidationError: () => ValidationError,
  asyncHandler: () => asyncHandler,
  createErrorHandler: () => createErrorHandler
});
module.exports = __toCommonJS(index_exports);
var ErrorGuard = class extends Error {
  constructor(statusCode = 500, code = "ERROR", message, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.details = details;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var createErrorHelper = ({ statusCode, code, defaultMessage }) => (message, details) => new ErrorGuard(statusCode, code, message != null ? message : defaultMessage, details);
var BadRequest = createErrorHelper({
  statusCode: 400,
  code: "BAD_REQUEST",
  defaultMessage: "Bad Request"
});
var ValidationError = createErrorHelper({
  statusCode: 400,
  code: "VALIDATION_ERROR",
  defaultMessage: "Validation failed"
});
var AuthenticationError = createErrorHelper({
  statusCode: 401,
  code: "AUTHENTICATION_ERROR",
  defaultMessage: "Authentication required"
});
var AuthorizationError = createErrorHelper({
  statusCode: 403,
  code: "FORBIDDEN_ACCESS",
  defaultMessage: "Forbidden access"
});
var ResourceNotFound = createErrorHelper({
  statusCode: 404,
  code: "RESOURCE_NOT_FOUND",
  defaultMessage: "Resource not found"
});
var ConflictError = createErrorHelper({
  statusCode: 409,
  code: "RESOURCE_CONFLICT",
  defaultMessage: "Resource conflict"
});
var RateLimitError = createErrorHelper({
  statusCode: 429,
  code: "RATE_LIMIT_EXCEEDED",
  defaultMessage: "Rate limit exceeded"
});
var DependencyError = createErrorHelper({
  statusCode: 503,
  code: "SERVICE_UNAVAILABLE",
  defaultMessage: "Service unavailable"
});
var InternalError = createErrorHelper({
  statusCode: 500,
  code: "INTERNAL_SERVER_ERROR",
  defaultMessage: "Internal server error"
});
var asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
var createErrorHandler = (opts = {}) => {
  const { logger } = opts;
  return (err, req, res, next) => {
    var _a;
    if (logger) {
      try {
        logger(err, req);
      } catch {
      }
    }
    const statusCode = (err == null ? void 0 : err.statusCode) || 500;
    const status = (err == null ? void 0 : err.status) || (String(statusCode).startsWith("4") ? "fail" : "error");
    const message = (_a = err == null ? void 0 : err.message) != null ? _a : "Internal server error";
    const body = {
      status,
      code: (err == null ? void 0 : err.code) || "ERROR",
      message
    };
    if (err == null ? void 0 : err.details) body.details = err.details;
    if (process.env.NODE_ENV !== "production") {
      body.stack = err.stack;
      body.name = err.name;
    }
    res.status(statusCode).json(body);
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticationError,
  AuthorizationError,
  BadRequest,
  ConflictError,
  DependencyError,
  ErrorGuard,
  InternalError,
  RateLimitError,
  ResourceNotFound,
  ValidationError,
  asyncHandler,
  createErrorHandler
});
