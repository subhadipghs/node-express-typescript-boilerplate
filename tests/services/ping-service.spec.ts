import "reflect-metadata";
import { PingService } from "../../src/services/ping.services";

describe("Tests for ping services", () => {
  const service: PingService = new PingService();

  test("should greet with required fields", () => {
    const greet = service.greet();
    expect(greet).toHaveProperty("ok");
    expect(greet).toHaveProperty("uptime");
    expect(greet).toHaveProperty("message");
    expect(greet.message).toBe("Hola from server");
    expect(greet.ok).toBe(true);
    expect(greet.uptime).toBeGreaterThan(0);
  });
});
