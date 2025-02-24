import { DataSource } from "./lib/typeorm.js";
import * as entities from "./models/index.ts";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Deno.env.get("DB_HOST") || "localhost",
  port: parseInt(Deno.env.get("DB_PORT") || "5432"),
  username: Deno.env.get("DB_USERNAME") || "postgres",
  password: Deno.env.get("DB_PASSWORD") || "postgres",
  database: Deno.env.get("DB_NAME") || "starknet_indexer",
  synchronize: true,
  logging: false,
  entities: Object.values(entities),
  subscribers: [],
  migrations: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};
