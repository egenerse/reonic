import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { SimulationResolver } from "./resolvers/SimulationResolver";
import { SimulationService } from "./services/SimulationService";

export interface Context {
  simulationService: SimulationService;
}

async function main() {
  const app = express();
  const port = process.env.PORT || 4000;

  // Initialize Prisma
  const prisma = new PrismaClient();

  // Initialize Services
  const simulationService = new SimulationService(prisma);

  // Build GraphQL schema
  const schema = await buildSchema({
    resolvers: [SimulationResolver],
    validate: false,
  });

  // Create Apollo Server
  const server = new ApolloServer<Context>({
    schema,
    introspection: process.env.NODE_ENV !== "production",
  });

  await server.start();

  // Apply CORS middleware
  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://your-frontend-domain.com"]
          : true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async (): Promise<Context> => ({ simulationService }),
    })
  );

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
    console.log(`📊 Health check at http://localhost:${port}/health`);
    console.log(
      `🔗 Database Admin password:password http://localhost:8080/?pgsql=postgres&username=postgres&db=reonic_simulation&ns=public`
    );
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    await prisma.$disconnect();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
