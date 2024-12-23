import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

export const UserRepository = AppDataSource.getRepository(User).extend({
  async findByEmail(email: string) {
    return await this.findOne({ where: { email } });
  },

  async findById(id: number) {
    return await this.findOne({ where: { id } });
  },

  async createAndSave(userData: Partial<User>) {
    const user = this.create(userData);
    return await this.save(user);
  },
});