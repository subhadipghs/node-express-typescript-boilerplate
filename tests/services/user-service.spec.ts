import "reflect-metadata";
import { Connection } from "typeorm";
import { User } from "../../src/entities/user.entity";
import { UserService } from "../../src/services/user.services";
import { createTestConnection } from "../../src/connection";
import { setupFakeDb } from "../../src/helpers/setup-fake-database";

function createFakeRepo() {
  return {
    find(id: number) {
      const fakes = [
        { id: 1, name: "test", age: 12 },
        { id: 2, name: "test2", age: 32 },
        { id: 3, name: "test3", age: 52 },
      ];
      for (let i = 0; i < fakes.length; i++) {
        if (fakes[i].id === id) {
          return fakes[i];
        }
      }
    },
    findOne(id: number | string | any) {
      const user = new User(1, "test", 12);
      return user;
    },
    create({ name, age }: { name: string; age: number }) {
      return {
        id: Math.floor(Math.random() * 40),
        name,
        age,
      };
    },
  };
}

describe("Tests for user services", () => {
  const fakeDb = setupFakeDb<User>(User, createFakeRepo);

  let userService: UserService;
  let connection: Connection;

  beforeAll(async () => {
    connection = await createTestConnection();
    userService = new UserService(
      fakeDb.getFakeRepo<User>(User, connection.name)
    );
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.getRepository<User>(User).delete({});
  });

  test("should create user correctly", async () => {
    const user = await userService.create({
      name: "test",
      age: 12,
    });
    expect(user).toBeDefined();
    expect(user.age).toBe(12);
    expect(user.name).toBe("test");
    expect(user.id).toBeGreaterThan(0);
  });

  test("should get user correctly", async () => {
    const user = await userService.create({
      name: "test",
      age: 12,
    });
    const gUser = await userService.get(user.id);
    expect(gUser).toBeDefined();
    expect(gUser!.id).toBe(user.id);
    expect(gUser!.age).toBe(user.age);
    expect(gUser!.name).toBe(user.name);
  });

  test("should return empty array when user doesn't exists", async () => {
    const user = await userService.get(1);
    expect(user).toBeUndefined();
  });
});
