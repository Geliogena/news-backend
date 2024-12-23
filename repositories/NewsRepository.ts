import { Newspost } from "../entities/Newspost";

export const NewsRepository = {
  findAll: jest.fn(() => {
    return Promise.resolve([
      { id: 1, title: "Test News 1", text: "Content of Test News 1" },
      { id: 2, title: "Test News 2", text: "Content of Test News 2" },
    ]);
  }),

  findById: jest.fn((id: number) => {
    if (id === 1) {
      return Promise.resolve({ id: 1, title: "Test News 1", text: "Content of Test News 1" });
    }
    return Promise.resolve(null);
  }),

  createAndSave: jest.fn((newsData: Partial<Newspost>) => {
    return Promise.resolve({
      id: 3,
      ...newsData,
    });
  }),

  deleteById: jest.fn((id: number) => {
    if (id === 1) {
      return Promise.resolve({ affected: 1 });
    }
    return Promise.resolve({ affected: 0 });
  }),
};
