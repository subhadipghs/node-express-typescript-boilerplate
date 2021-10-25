import * as typeorm from "typeorm";
import Sinon, { mock, stub } from "sinon";
import { Repository } from "typeorm";

export function setupFakeDb<T>(
  entity: any,
  createFakeRepoFn: () => Record<string, Function>
) {
  const fakeRepo = createFakeRepoFn();
  stub(typeorm, "getRepository")
    .withArgs(entity)
    .returns(fakeRepo as unknown as Repository<T>);

  return {
    getFakeRepo: typeorm.getRepository,
    fakeRepo: mock(createFakeRepoFn),
  };
}
