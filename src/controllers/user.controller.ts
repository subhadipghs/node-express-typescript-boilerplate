import { User } from "../entities/user.entity";
import { Request } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  requestParam,
  request,
  Controller,
} from "inversify-express-utils";
import { UserService } from "../services/user.services";
import {
  ApiOperationGet,
  ApiPath,
  IApiOperationGetArgs,
} from "swagger-express-ts";
import { UserApiSpecs } from "../api-specs/user-api-specs";

@ApiPath(UserApiSpecs.getSpecs().getApiPath())
@controller("/users")
export class UserController implements Controller {
  constructor(@inject(UserService.name) private userService: UserService) {}

  @httpPost("/")
  async create(@request() req: Request): Promise<User> {
    return this.userService.create(req.body);
  }

  @httpGet("/")
  @ApiOperationGet(UserApiSpecs.getSpecs().get())
  async get(@requestParam("id") id: number): Promise<User | undefined> {
    return this.userService.get(id);
  }
}
