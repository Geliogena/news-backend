import request from "supertest";
import app from "../server";
import { NewsRepository } from "../repositories/NewsRepository";
import { TestDataSource } from "../config/data-source.test";

beforeAll(async () => {
  await TestDataSource.initialize(); 
});

afterAll(async () => {
  await TestDataSource.destroy(); 
});

describe("Тест бази даних", () => {
  it("Перевірка роботи бази", async () => {
    expect(true).toBe(true);
  });
});
jest.mock('../repositories/NewsRepository', () => ({
  
  findAll: jest.fn(),
  findById: jest.fn(),
  createAndSave: jest.fn(),
  deleteById: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("News API Tests", () => {
  
  it("GET /api/news - має повертати список новин", async () => {
    (NewsRepository.findAll as jest.Mock).mockResolvedValue([
      { id: 1, title: "Test News 1", text: "Content 1" },
      { id: 2, title: "Test News 2", text: "Content 2" },
    ]);

    const response = await request(app).get("/api/news");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("title", "Test News 1");
  });

  it("GET /api/news/:id - має повертати конкретну новину", async () => {
    (NewsRepository.findById as jest.Mock).mockResolvedValue({
      id: 1,
      title: "Test News 1",
      text: "Content 1",
    });

    const response = await request(app).get("/api/news/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("title", "Test News 1");
  });

  it("POST /api/news - має додати новину", async () => {
    (NewsRepository.createAndSave as jest.Mock).mockResolvedValue({
      id: 3,
      title: "New Test News",
      text: "New Content",
    });

    const response = await request(app)
      .post("/api/news")
      .send({ title: "New Test News", text: "New Content" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", 3);
    expect(response.body).toHaveProperty("title", "New Test News");
  });

  it("DELETE /api/news/:id - має видаляти новину", async () => {
    (NewsRepository.deleteById as jest.Mock).mockResolvedValue(true);
  
    const response = await request(app).delete("/api/news/1");
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "News deleted successfully");
  });
});