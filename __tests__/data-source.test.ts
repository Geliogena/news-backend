import { TestDataSource } from "../config/data-source.test";

describe("Database Connection", () => {
  it("should initialize the database", async () => {
    await expect(TestDataSource.initialize()).resolves.not.toThrow();
    await TestDataSource.destroy();
  });
});