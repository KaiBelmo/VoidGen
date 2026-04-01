# VoidGen Roadmap

This document reflects the current status of planned enhancements for VoidGen based on the codebase today.

## Done

### Advanced Mock Server Controls
- Route-level latency simulation, failure injection, and rate limiting.

## WIP

No roadmap items are currently far enough along in the codebase to be marked as work in progress.

## Upcoming

### Schema-Driven API Generation
- Generate REST APIs from **OpenAPI/Swagger** files.
- Generate REST APIs from **TypeScript interfaces** or type definitions.
- Automatic schema parsing and CRUD route scaffolding.

### Automatic Mock Data Generation
- Random/mock data generation based on schema types.
- Built-in generators for names, emails, dates, addresses, etc.
- Pattern-based data generation (regex, enums, numeric ranges).
- Seeded generation for reproducible tests.

### Advanced Mock Server Controls
- Relationship modeling between resources.
- Pluggable middleware and custom generators.

### Persistence Options
- Optional persistent mode via file-based or SQLite storage.
- Snapshot/restore support for mock datasets.

### Web Interface
- UI for browsing resources.
- In-browser CRUD for mock data.
- Configuration editor.
- API activity logs.
- Real-time sync with in-memory store.
