# VoidGen - Mock API Server

VoidGen is a lightweight, configurable mock API server that generates RESTful endpoints from JSON and other structured data formats. It is designed for frontend development, testing, rapid prototyping, and any scenario where you need a reliable API without building a full backend.
## Features

- Instant REST API from JSON files (with additional data formats planned)
- Supports both singleton and collection resources
- In-memory data store with automatic reload on file changes
- Full CRUD operations for collection resources
- Configurable port and data file
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

## Usage

### Basic Usage

```bash
voidgen --file path/to/your/data.json --port 3000
```

### Data File Format

Your JSON data file should follow this structure. While JSON is currently the only supported format, future updates will introduce support for other data and schema formats.

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

This will generate the following endpoints:

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Replace a todo
- `PATCH /api/todos/:id` - Partially update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /api/config` - Get config
- `PUT /api/config` - Replace config
- `PATCH /api/config` - Partially update config

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
- Advanced route-level behavior (latency, error injection, rate limiting)  
- Persistent storage options (file or SQLite)  
- Relationship modeling between resources  
- Web interface for browsing and editing data  

For the full roadmap, see:

[ROADMAP.md](./ROADMAP.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
