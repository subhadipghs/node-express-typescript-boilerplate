import dotenv from "dotenv";
dotenv.config();

import { MissingArgument } from "../helpers/errors";

export class Environment {
  private env: Record<string, string>;
  private validate: boolean = true;

  constructor(env: Record<string, string>, validate = true) {
    this.env = env;
    this.validate = validate;
  }

  private getValue(variable: string) {
    return this.env[variable];
  }

  public getPort(): number {
    return +parseInt(this.getValue("PORT"));
  }

  public validateSync(values: string[]) {
    if (this.validate) {
      values.forEach((value) => {
        if (!this.getValue(value)) {
          throw new MissingArgument(`${value} is missing from .env`);
        }
      });
    }
    return this;
  }

  getEnv() {
    return this.getValue("NODE_ENV");
  }

  getPostgresEnv() {
    return {
      port: +parseInt(this.getValue("POSTGRES_PORT")),
      host: this.getValue("POSTGRES_HOST"),
      username: this.getValue("POSTGRES_USERNAME"),
      password: this.getValue("POSTGRES_PASSWORD"),
      database: this.getValue("POSTGRES_DB"),
    };
  }
}

export const AppEnv = new Environment(
  process.env as Record<string, any>
).validateSync([
  "POSTGRES_USERNAME",
  "POSTGRES_PASSWORD",
  "POSGRES_DB",
  "POSTGRES_HOST",
  "POSTGRES_PORT",
  "NODE_ENV",
  "PORT",
]);
