import { asyncModule, container } from "./container";
import { App } from "./app";
import { RestApplication } from "./types";
import { AppEnv } from "./configs/environment.config";

export async function main(options: RestApplication.AppConfig) {
  await container.loadAsync(asyncModule);
  const app = new App(container, options);
  await app.boot();
  await app.start();

  console.log(`Server is running at ${app.getUrl()}`);
  console.log(`Try ${app.getUrl()}/ping`);
  return app;
}

if (require.main === module) {
  const options: RestApplication.AppConfig = {
    port: +(AppEnv.getPort() ?? 3000),
    host: "127.0.0.1",
    gracefulShutdownPeriod: 4000,
    openApi: {
      version: "1.0.0",
      title: "sample-api",
      path: "/api/docs",
    },
  };

  main(options).catch((error: Error) => {
    console.error(`Caught error starting the app. Reason: ${error.message}`);
    console.error(error.stack);
  });
}
