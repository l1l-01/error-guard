// ---------------- ErrorGuard Class ----------------
const isDev = process.env.NODE_ENV !== "production";

// Predefine constants for reuse (no alloc per call)
const BAD_REQUEST = "BAD_REQUEST";
const BAD_REQUEST_MSG = "Bad Request";
const VALIDATION_ERROR = "VALIDATION_ERROR";
const VALIDATION_ERROR_MSG = "Validation failed";
const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
const AUTHENTICATION_ERROR_MSG = "Authentication required";
const FORBIDDEN_ACCESS = "FORBIDDEN_ACCESS";
const FORBIDDEN_ACCESS_MSG = "Forbidden access";
const RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND";
const RESOURCE_NOT_FOUND_MSG = "Resource not found";
const RESOURCE_CONFLICT = "RESOURCE_CONFLICT";
const RESOURCE_CONFLICT_MSG = "Resource conflict";
const RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED";
const RATE_LIMIT_EXCEEDED_MSG = "Rate limit exceeded";
const SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE";
const SERVICE_UNAVAILABLE_MSG = "Service unavailable";
const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
const INTERNAL_SERVER_ERROR_MSG = "Internal server error";

export class ErrorGuard extends Error {
  statusCode: number;
  code: string;
  status: string;
  isOperational: boolean = true;
  details: any;

  constructor(
    statusCode = 500,
    code = "ERROR",
    message?: string,
    details: any = null,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.details = details;
    if (isDev) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

// ---------------- Predefined Errors (Inline) ----------------
export const BadRequest = (message?: string, details?: any) =>
  new ErrorGuard(400, BAD_REQUEST, message ?? BAD_REQUEST_MSG, details);

export const ValidationError = (message?: string, details?: any) =>
  new ErrorGuard(
    400,
    VALIDATION_ERROR,
    message ?? VALIDATION_ERROR_MSG,
    details,
  );

export const AuthenticationError = (message?: string, details?: any) =>
  new ErrorGuard(
    401,
    AUTHENTICATION_ERROR,
    message ?? AUTHENTICATION_ERROR_MSG,
    details,
  );

export const AuthorizationError = (message?: string, details?: any) =>
  new ErrorGuard(
    403,
    FORBIDDEN_ACCESS,
    message ?? FORBIDDEN_ACCESS_MSG,
    details,
  );

export const ResourceNotFound = (message?: string, details?: any) =>
  new ErrorGuard(
    404,
    RESOURCE_NOT_FOUND,
    message ?? RESOURCE_NOT_FOUND_MSG,
    details,
  );

export const ConflictError = (message?: string, details?: any) =>
  new ErrorGuard(
    409,
    RESOURCE_CONFLICT,
    message ?? RESOURCE_CONFLICT_MSG,
    details,
  );

export const RateLimitError = (message?: string, details?: any) =>
  new ErrorGuard(
    429,
    RATE_LIMIT_EXCEEDED,
    message ?? RATE_LIMIT_EXCEEDED_MSG,
    details,
  );

export const DependencyError = (message?: string, details?: any) =>
  new ErrorGuard(
    503,
    SERVICE_UNAVAILABLE,
    message ?? SERVICE_UNAVAILABLE_MSG,
    details,
  );

export const InternalError = (message?: string, details?: any) =>
  new ErrorGuard(
    500,
    INTERNAL_SERVER_ERROR,
    message ?? INTERNAL_SERVER_ERROR_MSG,
    details,
  );

// ---------------- Async Handler for Express ----------------
export const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ---------------- Express Error Middleware ----------------
export const createErrorHandler = (opts: any = {}) => {
  const { logger } = opts;

  return (err: any, req: any, res: any, next: any) => {
    if (logger) {
      try {
        logger(err, req);
      } catch {
        // ignore logger errors
      }
    }

    const statusCode = err?.statusCode || 500;
    const status =
      err?.status ?? (statusCode >= 400 && statusCode < 500 ? "fail" : "error");

    // Use the error message if present, otherwise fallback to defaultMessage in ErrorGuard
    const message = err?.message ?? INTERNAL_SERVER_ERROR_MSG;

    const body: any = {
      status,
      code: err?.code || "ERROR",
      message,
    };

    if (err?.details) body.details = err.details;

    if (isDev) {
      body.stack = err.stack;
    }

    res.status(statusCode).json(body);
  };
};
