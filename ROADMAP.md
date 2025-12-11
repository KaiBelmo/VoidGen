# VoidGen Roadmap

This document outlines planned enhancements and long-term goals for VoidGen.

## 1. Schema-Driven API Generation
- Generate REST APIs from **OpenAPI/Swagger** files.
- Generate REST APIs from **TypeScript interfaces** or type definitions.
- Automatic schema parsing and CRUD route scaffolding.

## 2. Automatic Mock Data Generation
- Random/mock data generation based on schema types.
- Built-in generators for names, emails, dates, addresses, etc.
- Pattern-based data generation (regex, enums, numeric ranges).
- Seeded generation for reproducible tests.

## 3. Advanced Mock Server Controls
- Route-level latency simulation, failure injection, rate limiting.
- Relationship modeling (e.g., users → posts).
- Pluggable middleware and custom generators.

## 4. Persistence Options
- Optional persistent mode via file-based or SQLite storage.
- Snapshot/restore support for mock datasets.

## 5. Web Interface (Upcoming)
- UI for browsing resources.
- In-browser CRUD for mock data.
- Configuration editor.
- API activity logs.
- Real-time sync with in-memory store.
