import { AddressInfo } from "net";
import Http, { Server } from "http";
import express, { Application } from "express";
import { Container } from "inversify";
import { RestApplication } from "./types";
import { InversifyExpressServer as ExpressApp } from "inversify-express-utils";
import * as swagger from "swagger-express-ts";
import { AppEnv } from "./configs/environment.config";

export class App implements RestApplication.App {
  container: Container;
  config: RestApplication.AppConfig;
  app: Application;
  server: Server;

  constructor(container: Container, config: RestApplication.AppConfig) {
    this.config = config;
    this.container = container;
    this.app = new ExpressApp(container)
      .setConfig((app) => {
        app.use(express.json());
        app.use(
          express.urlencoded({
            extended: true,
          })
        );
      })
      .build();
    this.server = Http.createServer(this.app);
  }

  public getPort(): number {
    return this.config.port;
  }

  public getHost(): string {
    return this.config.host;
  }

  public getProtocol() {
    return AppEnv.getEnv() !== "production" ? "http" : "https";
  }

  public getUrl(): string {
    const addr = this.server.address() as AddressInfo;
    const url = `${this.getProtocol()}://${addr.address}:${addr.port}`;
    return url;
  }

  /**
   * Boot the application with all the necessary modules
   */
  public async boot() {
    this.app.use(this.config.openApi.path, express.static("swagger"));
    this.app.use(
      "/api-docs/swagger/assets",
      express.static("node_modules/swagger-ui-dist")
    );
    this.app.use(
      swagger.express({
        definition: {
          info: {
            title: this.config.openApi.title,
            version: this.config.openApi.version,
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
