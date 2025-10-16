// ---------------- ErrorGuard Class ----------------
export class ErrorGuard extends Error {
  statusCode: number;
  code: string;
  status: string;
  isOperational: boolean;
  details: any;

  constructor(
    statusCode = 500,
    code = "ERROR",
    message?: string,
    details: any = null,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.details = details;

    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

// ---------------- Error Helpers Factory ----------------
type ErrorHelperOptions = {
  statusCode: number;
  code: string;
  // optional default message
  defaultMessage?: string;
};

const createErrorHelper =
  ({ statusCode, code, defaultMessage }: ErrorHelperOptions) =>
  (message?: string, details?: any) =>
    new ErrorGuard(statusCode, code, message ?? defaultMessage, details);

// ---------------- Predefined Errors with Default Messages ----------------
export const BadRequest = createErrorHelper({
  statusCode: 400,
  code: "BAD_REQUEST",
  defaultMessage: "Bad Request",
});
export const ValidationError = createErrorHelper({
  statusCode: 400,
  code: "VALIDATION_ERROR",
  defaultMessage: "Validation failed",
});
export const AuthenticationError = createErrorHelper({
  statusCode: 401,
  code: "AUTHENTICATION_ERROR",
  defaultMessage: "Authentication required",
});
export const AuthorizationError = createErrorHelper({
  statusCode: 403,
  code: "FORBIDDEN_ACCESS",
  defaultMessage: "Forbidden access",
});
export const ResourceNotFound = createErrorHelper({
  statusCode: 404,
  code: "RESOURCE_NOT_FOUND",
  defaultMessage: "Resource not found",
});
export const ConflictError = createErrorHelper({
  statusCode: 409,
  code: "RESOURCE_CONFLICT",
  defaultMessage: "Resource conflict",
});
export const RateLimitError = createErrorHelper({
  statusCode: 429,
  code: "RATE_LIMIT_EXCEEDED",
  defaultMessage: "Rate limit exceeded",
});
export const DependencyError = createErrorHelper({
  statusCode: 503,
  code: "SERVICE_UNAVAILABLE",
  defaultMessage: "Service unavailable",
});
export const InternalError = createErrorHelper({
  statusCode: 500,
  code: "INTERNAL_SERVER_ERROR",
  defaultMessage: "Internal server error",
});

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
      err?.status || (String(statusCode).startsWith("4") ? "fail" : "error");

    // Use the error message if present, otherwise fallback to defaultMessage in ErrorGuard
    const message = err?.message ?? "Internal server error";

    const body: any = {
      status,
      code: err?.code || "ERROR",
      message,
    };

    if (err?.details) body.details = err.details;

    if (process.env.NODE_ENV !== "production") {
      body.stack = err.stack;
      body.name = err.name;
    }

    res.status(statusCode).json(body);
  };
};
