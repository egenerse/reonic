# Reonic Challenge

A monorepo with GraphQL backend and React frontend for simulation management.
Frontend deployed to : https://reonic-frontend.vercel.app/

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database and start everything
npm run setup

# Start development servers
npm run dev
```

That's it! The application will be running at:

- **Frontend**: http://localhost:5173
- **Backend GraphQL**: http://localhost:4000/graphql
- **Database Admin**: http://localhost:8080/?pgsql=postgres&username=postgres&db=reonic_simulation&ns=public

## � Available Commands

```bash
npm run setup    # Start Docker, setup database, seed data
npm run dev      # Start both backend and frontend
npm run stop     # Stop Docker services
```

## 🛠️ What happens during setup?

1. Starts PostgreSQL database with Docker
2. Waits for database to be ready
3. Generates Prisma client and creates database schema
4. Seeds the database with initial data

## 📝 Requirements

- Node.js (v22.16.0)
- Docker
- npm

## � Database Access

- **Server**: postgres
- **Port**: 5432
- **Database**: reonic_simulation
- **Username**: postgres
- **Password**: password
