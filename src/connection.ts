import { AppEnv } from "./configs/environment.config";
import { Connection, createConnection } from "typeorm";
import { User } from "./entities/user.entity";

export async function createPgConnection() {
  const { host, port, database, username, password } = AppEnv.getPostgresEnv();
  const connection: Connection = await createConnection({
    type: "postgres",
    host,
    port,
    database,
    username,
    password,
    entities: [User],
    synchronize: true,
  });
  return connection;
}

export async function createTestConnection() {
  const { host, port, database, username, password } = AppEnv.getPostgresEnv();
  const testConnection: Connection = await createConnection({
    name: "test",
    type: "postgres",
    host,
    port,
    database,
    username,
    password,
    entities: [User],
    synchronize: true,
    dropSchema: true,
  });
  return testConnection;
}
