import "reflect-metadata";

import { env } from "process";
import { AddressInfo } from "net";
import Http, { Server } from "http";
import express, { Application } from "express";
import { Container } from "inversify";
import { RestApplication } from "./types";
import { InversifyExpressServer } from "inversify-express-utils";
import * as swagger from "swagger-express-ts";
import { asyncModule, container } from "./container";
import bodyParser from "body-parser";

export class App implements RestApplication.App {
  container: Container;
  config: RestApplication.AppConfig;
  app: null | Application;
  server: null | Server;
  constructor(config: RestApplication.AppConfig) {
    this.config = config;
    this.container = container;
    this.app = null;
    this.server = null;
  }

  public getPort(): number {
    return this.config.port;
  }

  public getHost(): string {
    return this.config.host;
  }

  public getProtocol() {
    return env.NODE_ENV !== "production" ? "http" : "https";
  }

  public getUrl(): string {
    if (this.server) {
      const addr = this.server.address() as AddressInfo;
      const url = `${this.getProtocol()}://${addr.address}:${addr.port}`;
      return url;
    }
    return "";
  }

  /**
   * Boot the application with all the necessary modules
   */
  public async boot() {
    // body parser module
    await container.loadAsync(asyncModule);
    let setup = new InversifyExpressServer(this.container);
    setup.setConfig((app) => {
      app.use(
        bodyParser.urlencoded({
          extended: true,
        })
      );
      app.use(bodyParser.json());
    });
    this.app = setup.build();
    this.server = Http.createServer(this.app);
    // swagger modules
    this.app.use("/api-docs/swagger", express.static("swagger"));
    this.app.use(
      "/api-docs/swagger/assets",
      express.static("node_modules/swagger-ui-dist")
    );
    this.app.use(
      swagger.express({
        definition: {
          info: {
            title: "Utility API",
            version: "1.0.0",
          },
        },
      })
    );
  }

  public async start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        if (this.server) {
          this.server.listen(this.getPort(), this.getHost(), resolve);
          this.handleServerEvents(this.server);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleServerEvents(server: Server) {
    this.getServerErrorMap(server).forEach((handler, name) => {
      server.on(name, handler);
    });
    this.getProcessErrorMap(server).forEach((handler, name) => {
      process.on(name, handler);
    });
  }

  private getServerErrorMap(
    server: Server
  ): Map<string, (error: Error) => void> {
    return new Map<string, (error: Error) => void>([
      [
        "error",
        async (e: any) => {
          this.gracefulShutdown(server, e.message);
        },
      ],
    ]);
  }

  private getProcessErrorMap(
    server: Server
  ): Map<string, (error: Error) => void> {
    return new Map<string, (error: Error) => void>([
      [
        "SIGTERM",
        () => {
          this.gracefulShutdown(server, "SIGTERM received");
        },
      ],
      [
        "unhandledRejection",
        (error) => {
          this.gracefulShutdown(
            server,
            `unhandledRejection occured. ${error.message}`
          );
        },
      ],
      [
        "uncaughtException",
        (error) => {
          this.gracefulShutdown(
            server,
            `unhandledException occured. ${error.message}`
          );
        },
      ],
    ]);
  }

  private gracefulShutdown(server: Server, reason: string = "unknown") {
    global.setTimeout(() => {
      console.error(`
          ==================================
            Gracefully closing the server!
            Reason: ${reason}
          ==================================
        `);
      server.close();
    }, this.config.gracefulShutdownPeriod ?? 0);
  }
}
