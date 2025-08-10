# Backend API

A GraphQL API server built with TypeScript, Prisma, and Apollo Server for the Reonic simulation platform.

## Features

- **GraphQL API** with Apollo Server
- **Database ORM** with Prisma
- **PostgreSQL** database
- **TypeScript** for type safety
- **CRUD operations** for simulation data
- **Docker** setup for PostgreSQL

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start PostgreSQL with Docker

Make sure Docker is running, then start the PostgreSQL container:

```bash
# From the root directory
docker-compose up -d postgres
```

This will start:

- PostgreSQL on `localhost:5432`
- Adminer (database admin tool) on `localhost:8080`

### 3. Set up the Database

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to the database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 4. Start the Development Server

```bash
npm run dev
```

The server will be running at:

- GraphQL API: `http://localhost:4000/graphql`
- Health Check: `http://localhost:4000/health`

## Database Management

- **Prisma Studio**: Run `npm run db:studio` to open the database admin interface
- **Adminer**: Go to `http://localhost:8080` (when Docker is running)
  - Server: `postgres`
  - Username: `postgres`
  - Password: `password`
  - Database: `reonic_simulation`

## API Endpoints

### GraphQL Queries

- `simulationResults` - Get all simulation results
- `simulationResult(id)` - Get a specific simulation result
- `simulationOutputs` - Get all simulation outputs
- `simulationOutput(id)` - Get a specific simulation output
- `simulationOutputsByInputId(inputId)` - Get outputs for a specific input

### GraphQL Mutations

- `createSimulation(data)` - Create a new simulation result
- `updateSimulation(id, data)` - Update a simulation result
- `deleteSimulation(id)` - Delete a simulation result
- `deleteSimulationOutput(id)` - Delete a simulation output

## Project Structure

```
src/
├── index.ts              # Main server file
├── resolvers/            # GraphQL resolvers
│   └── SimulationResolver.ts
├── types/                # GraphQL types and DTOs
│   ├── SimulationTypes.ts
│   └── SimulationResults.ts
├── services/             # Business logic
│   └── SimulationService.ts
├── utils/                # Utilities
│   └── prisma.ts
└── seed.ts               # Database seeding
```

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/reonic_simulation?schema=public"
PORT=4000
NODE_ENV=development
GRAPHQL_PLAYGROUND=true
```

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## Next Steps

1. Install the dependencies: `npm install`
2. Start PostgreSQL: `docker-compose up -d postgres`
3. Set up the database: `npm run db:generate && npm run db:push && npm run db:seed`
4. Start the server: `npm run dev`
5. Open GraphQL Playground at `http://localhost:4000/graphql`

The simulation logic from `packages/frontend/src/utils/simulation.ts` can later be moved to the backend service layer.
