import { Request, Response } from "express";
import { Controller } from "inversify-express-utils";

export interface PingControllerInterface extends Controller {
  /**
   * A simple controller to greet
   * @httpMethod GET
   */
  greet: (request: Request, response: Response) => Promise<any>;
}
