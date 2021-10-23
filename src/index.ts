import { env } from "process";
import { App } from "./app";
import { RestApplication } from "./types";

export async function main(options: RestApplication.AppConfig) {
  const app = new App(options);
  await app.boot();
  await app.start();

  console.log(`Server is running at ${app.getUrl()}`);
  console.log(`Try ${app.getUrl()}/ping`);
  return app;
}

if (require.main === module) {
  const options: RestApplication.AppConfig = {
    port: +(env.PORT ?? 3000),
    host: "127.0.0.1",
    gracefulShutdownPeriod: 4000,
  };

  main(options).catch((error: Error) => {
    console.error(`Caught error starting the app. Reason: ${error.message}`);
    console.error(error.stack);
  });
}
