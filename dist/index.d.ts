declare class ErrorGuard extends Error {
    statusCode: number;
    code: string;
    status: string;
    isOperational: boolean;
    details: any;
    constructor(statusCode?: number, code?: string, message?: string, details?: any);
}
declare const BadRequest: (message?: string, details?: any) => ErrorGuard;
declare const ValidationError: (message?: string, details?: any) => ErrorGuard;
declare const AuthenticationError: (message?: string, details?: any) => ErrorGuard;
declare const AuthorizationError: (message?: string, details?: any) => ErrorGuard;
declare const ResourceNotFound: (message?: string, details?: any) => ErrorGuard;
declare const ConflictError: (message?: string, details?: any) => ErrorGuard;
declare const RateLimitError: (message?: string, details?: any) => ErrorGuard;
declare const DependencyError: (message?: string, details?: any) => ErrorGuard;
declare const InternalError: (message?: string, details?: any) => ErrorGuard;
declare const asyncHandler: (fn: any) => (req: any, res: any, next: any) => Promise<any>;
declare const createErrorHandler: (opts?: any) => (err: any, req: any, res: any, next: any) => void;

export { AuthenticationError, AuthorizationError, BadRequest, ConflictError, DependencyError, ErrorGuard, InternalError, RateLimitError, ResourceNotFound, ValidationError, asyncHandler, createErrorHandler };
