import { provide } from "inversify-binding-decorators";
import { PingServiceInterface } from "interfaces/services/ping.services.interface";
import { injectable } from "inversify";

@injectable()
export class PingService implements PingServiceInterface {
  public static TARGET_NAME: string = "PingService";

  // greet the server
  public greet() {
    return {
      ok: true,
      message: "Hola from server",
    };
  }
}
