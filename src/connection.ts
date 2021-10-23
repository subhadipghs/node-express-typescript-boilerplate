import { Connection, createConnection } from "typeorm";
import { User } from "./entities/user.entity";

export async function createPgConnection() {
  const connection: Connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "postgres",
    username: "postgres",
    password: "postgres",
    entities: [User],
    synchronize: true,
  });
  return connection;
}
