import { DataSource } from "typeorm";

export const TestDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "Mazutka1972", 
  database: process.env.TEST_DB_NAME || "test_database",
  synchronize: true,
  dropSchema: true,
  logging: true,
  entities: [__dirname + '/../entities/*.ts'], 
});

describe("Data source tests", () => {
  it("should initialize TestDataSource", async () => {
    await expect(TestDataSource.initialize()).resolves.not.toThrow();
    await TestDataSource.destroy();
  });
});