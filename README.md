# VoidGen - Mock API Server

VoidGen is a lightweight, configurable mock API server that generates RESTful endpoints from JSON and other structured data formats. It is designed for frontend development, testing, rapid prototyping, and any scenario where you need a reliable API without building a full backend.

## Features

- Instant REST API from JSON files (with additional data formats planned)
- Supports both singleton and collection resources
- In-memory data store with automatic reload on file changes
- Full CRUD operations for collection resources
- Configurable port and data file
- Watch mode enabled by default for hot reloading data and behavior config
- Route-level behavior controls for delay, validation, error injection, and rate limiting
- Tested with Jest

## Installation

```bash
# Using npm
npm install -g voidgen

# Or using yarn
yarn global add voidgen

# Or using pnpm
pnpm add -g voidgen
```

## Quick Start

```bash
voidgen --file path/to/your/data.json --port 3000
```

Example data file:

```json
{
  "todos": [
    { "id": 1, "title": "Learn TypeScript", "completed": false },
    { "id": 2, "title": "Build something awesome", "completed": true }
  ],
  "config": {
    "theme": "dark",
    "notifications": true
  }
}
```

Collections become CRUD endpoints and objects become singleton endpoints.

For full usage details, see:

- [USAGE.md](./USAGE.md)

## Development

### Prerequisites

- Node.js 16+
- pnpm (recommended) or npm/yarn

### Setup

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

### Available Scripts

- `pnpm dev` - Start development server with hot-reload
- `pnpm build` - Build the project
- `pnpm start` - Start the production server
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate test coverage report
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Testing

Run the test suite:

```bash
pnpm test
```

## Roadmap

VoidGen is actively evolving. Planned enhancements include:

- REST API generation from **OpenAPI** specifications  
- REST API generation from **TypeScript interfaces**  
- Automatic random/mock data generation  
- Persistent storage options (file or SQLite)  
- Relationship modeling between resources  
- Web interface for browsing and editing data  

For the full roadmap, see:

[ROADMAP.md](./ROADMAP.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
