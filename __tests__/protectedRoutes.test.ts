import request from "supertest";
import app from "../server";
import jwt from "jsonwebtoken";
import { TestDataSource } from "../config/data-source.test";

beforeAll(async () => {
  await TestDataSource.initialize(); 
});

afterAll(async () => {
  await TestDataSource.destroy(); 
});

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"), 
  verify: jest.fn(), 
}));

describe("Protected API Tests", () => {
  const validToken = jwt.sign({ id: 1, email: "test@example.com" }, "default_secret_key");

  it("GET /api/protected/resource - доступ без токена (має повернути 401)", async () => {
    const response = await request(app).get("/api/protected/resource");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Токен відсутній або має неправильний формат");
  });

  it("GET /api/protected/resource - успішний доступ з валідним токеном", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1, email: "test@example.com" });

    const response = await request(app)
      .get("/api/protected/resource")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Успішний доступ до захищеного ресурсу");
  });

  it("GET /api/protected/resource - невірний токен (має повернути 403)", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const response = await request(app)
      .get("/api/protected/resource")
      .set("Authorization", "Bearer invalid_token");

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Невірний токен або токен закінчився");
  });
});