import { inject } from "inversify";
import { controller, httpGet } from "inversify-express-utils";
import { PingService } from "../services/ping.services";
import { PingControllerInterface } from "interfaces/controllers/ping.controller.interface";
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

@ApiPath({
  path: "/ping",
  name: "Ping",
  security: {
    basicAuth: [],
  },
})
@controller("/ping")
export class PingController implements PingControllerInterface {
  constructor(@inject(PingService.name) private pingService: PingService) {}

  @httpGet("/")
  @ApiOperationGet({
    description: "Greet the user",
    summary: "Greet the user",
    responses: {
      200: {
        description: "success",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
      },
    },
  })
  public async greet(): Promise<any> {
    return this.pingService.greet();
  }
}
