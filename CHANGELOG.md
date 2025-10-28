## Changelog
### v2.0.1 2025-10-28
#### Changed
- Optimized internal implementation of the ErrorGuard class for better performance and reduced overhead.
- Predefined error helpers are now inlined instead of using closure factories, lowering function allocation costs.
- Stack trace capturing (Error.captureStackTrace) is now only enabled in non-production environments.
- Removed redundant constructor name assignment for cleaner and faster error creation.
- Simplified status computation logic to minimize conditional overhead.
#### Performance
- Average latency reduced by 10% compared to the previous release.
- Lower memory allocation per error instance, resulting in improved throughput consistency.
### Notes
- No breaking changes; all existing APIs remain fully compatible.
- This version is part of a long-term effort to make ErrorGuard both lightweight and production-efficient.

### v2.0.0 2025-10-16
- Fixed: Error code now properly shows in responses.
- Improved: Library fully supports TypeScript, ECMAScript Modules (ESM), and CommonJS (CJS).
- Refactored: Error helper creation to reduce repetition and improve code quality.
- Updated: TypeScript typings for better developer experience.
