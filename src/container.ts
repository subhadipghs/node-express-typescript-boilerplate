import "reflect-metadata";
import { AsyncContainerModule, Container } from "inversify";
import { PingService } from "./services/ping.services";
import { UserService } from "./services/user.services";
import { PingController } from "./controllers/ping.controller";
import { getRepository, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { UserController } from "./controllers/user.controller";
import { createPgConnection } from "./connection";

const asyncModule = new AsyncContainerModule(async (bind) => {
  const connection = await createPgConnection();

  // Bind the repositories here
  bind<Repository<User>>(User.name)
    .toDynamicValue(() => {
      return getRepository(User, connection.name);
    })
    .inRequestScope();

  // Bind the services here
  bind<UserService>(UserService.name).to(UserService).inSingletonScope();
  bind<PingService>(PingService.name).to(PingService).inSingletonScope();

  // Bind the controllers here
  bind<PingController>(PingController.name)
    .to(PingController)
    .inSingletonScope();
  bind<UserController>(UserController.name)
    .to(UserController)
    .inSingletonScope();
});

const container = new Container();

export { container, asyncModule };
