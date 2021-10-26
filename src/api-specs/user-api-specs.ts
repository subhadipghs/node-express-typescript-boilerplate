import { IApiOperationGetArgs, IApiPathArgs } from "swagger-express-ts";

export class UserApiSpecs {
  public static instance: UserApiSpecs | null;

  constructor() {}

  public static getSpecs() {
    if (!UserApiSpecs.instance) {
      UserApiSpecs.instance = new UserApiSpecs();
    }
    return UserApiSpecs.instance;
  }

  public getApiPath(): IApiPathArgs {
    return {
      path: "/users",
      name: "Users",
      security: {
        basicAuth: [],
      },
    };
  }

  public get(): IApiOperationGetArgs {
    return {
      summary: "Get a user by id",
      description: "Get a user by id",
      security: {
        basicAuth: [],
      },
      parameters: {
        path: {
          id: {
            name: "Id of the user",
            description: "Id of the user should",
            allowEmptyValue: false,
          },
        },
      },
      responses: {
        200: {
          description: "Successfully retrived the user",
        },
        404: {
          description: "User not found",
        },
      },
    };
  }
}
