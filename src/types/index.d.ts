import { Application } from "express";
import { Server } from "http";
import { AsyncContainerModule, Container } from "inversify";
import { AddressInfo } from "net";

export declare namespace RestApplication {
  export type HttpAddressInfo = string | AddressInfo | null;

  export interface App {
    config: AppConfig;
    app: Application | null;
    server: Server | null;
    container: Container;

    boot: () => Promise<void>;
    start: () => Promise<void>;

    getPort: () => number;
    getHost: () => string;
    getUrl: () => string;
    getProtocol: () => string;
  }

  export interface AppConfig {
    port: number;
    host: string;
    gracefulShutdownPeriod?: number;
    enableCors?: boolean;
    enableCsrf?: boolean;
    enableXssProtection?: boolean;
  }
}
