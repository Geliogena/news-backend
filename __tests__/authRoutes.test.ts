import request from "supertest";
import app from "../server";
import { UserRepository } from "../repositories/UserRepository";
import { TestDataSource } from "../config/data-source.test";

beforeAll(async () => {
  await TestDataSource.initialize(); 
});

afterAll(async () => {
  await TestDataSource.destroy(); 
});

jest.mock("../repositories/UserRepository", () => ({
  UserRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Auth API Tests", () => {
  
  it("POST /api/auth/register - успішна реєстрація", async () => {
    (UserRepository.save as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "hashed_password",
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "Password123" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("email", "test@example.com");
  });

  it("POST /api/auth/login - успішний вхід", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "hashed_password",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "Password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("POST /api/auth/login - невірний пароль", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "WrongPassword" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Невірний логін або пароль");
  });
});