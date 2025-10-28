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
var isDev = process.env.NODE_ENV !== "production";
var BAD_REQUEST = "BAD_REQUEST";
var BAD_REQUEST_MSG = "Bad Request";
var VALIDATION_ERROR = "VALIDATION_ERROR";
var VALIDATION_ERROR_MSG = "Validation failed";
var AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
var AUTHENTICATION_ERROR_MSG = "Authentication required";
var FORBIDDEN_ACCESS = "FORBIDDEN_ACCESS";
var FORBIDDEN_ACCESS_MSG = "Forbidden access";
var RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND";
var RESOURCE_NOT_FOUND_MSG = "Resource not found";
var RESOURCE_CONFLICT = "RESOURCE_CONFLICT";
var RESOURCE_CONFLICT_MSG = "Resource conflict";
var RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED";
var RATE_LIMIT_EXCEEDED_MSG = "Rate limit exceeded";
var SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE";
var SERVICE_UNAVAILABLE_MSG = "Service unavailable";
var INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
var INTERNAL_SERVER_ERROR_MSG = "Internal server error";
var ErrorGuard = class extends Error {
  constructor(statusCode = 500, code = "ERROR", message, details = null) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
    this.code = code;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.details = details;
    if (isDev) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var BadRequest = (message, details) => new ErrorGuard(400, BAD_REQUEST, message != null ? message : BAD_REQUEST_MSG, details);
var ValidationError = (message, details) => new ErrorGuard(
  400,
  VALIDATION_ERROR,
  message != null ? message : VALIDATION_ERROR_MSG,
  details
);
var AuthenticationError = (message, details) => new ErrorGuard(
  401,
  AUTHENTICATION_ERROR,
  message != null ? message : AUTHENTICATION_ERROR_MSG,
  details
);
var AuthorizationError = (message, details) => new ErrorGuard(
  403,
  FORBIDDEN_ACCESS,
  message != null ? message : FORBIDDEN_ACCESS_MSG,
  details
);
var ResourceNotFound = (message, details) => new ErrorGuard(
  404,
  RESOURCE_NOT_FOUND,
  message != null ? message : RESOURCE_NOT_FOUND_MSG,
  details
);
var ConflictError = (message, details) => new ErrorGuard(
  409,
  RESOURCE_CONFLICT,
  message != null ? message : RESOURCE_CONFLICT_MSG,
  details
);
var RateLimitError = (message, details) => new ErrorGuard(
  429,
  RATE_LIMIT_EXCEEDED,
  message != null ? message : RATE_LIMIT_EXCEEDED_MSG,
  details
);
var DependencyError = (message, details) => new ErrorGuard(
  503,
  SERVICE_UNAVAILABLE,
  message != null ? message : SERVICE_UNAVAILABLE_MSG,
  details
);
var InternalError = (message, details) => new ErrorGuard(
  500,
  INTERNAL_SERVER_ERROR,
  message != null ? message : INTERNAL_SERVER_ERROR_MSG,
  details
);
var asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
var createErrorHandler = (opts = {}) => {
  const { logger } = opts;
  return (err, req, res, next) => {
    var _a, _b;
    if (logger) {
      try {
        logger(err, req);
      } catch {
      }
    }
    const statusCode = (err == null ? void 0 : err.statusCode) || 500;
    const status = (_a = err == null ? void 0 : err.status) != null ? _a : statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    const message = (_b = err == null ? void 0 : err.message) != null ? _b : INTERNAL_SERVER_ERROR_MSG;
    const body = {
      status,
      code: (err == null ? void 0 : err.code) || "ERROR",
      message
    };
    if (err == null ? void 0 : err.details) body.details = err.details;
    if (isDev) {
      body.stack = err.stack;
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
