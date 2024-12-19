import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Newspost } from "../entities/Newspost";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { Genre } from "../entities/Newspost";
const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("База даних підключена для Seeding");

    const userRepository = AppDataSource.getRepository(User);
    const newspostRepository = AppDataSource.getRepository(Newspost);

    
    const adminEmail = "admin@example.com";
    let adminUser = await userRepository.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      adminUser = userRepository.create({
        email: adminEmail,
        password: hashedPassword,
      });
      await userRepository.save(adminUser);
      console.log("Адміністративного користувача додано");
    } else {
      console.log("Адміністративний користувач вже існує");
    }

    
    for (let i = 0; i < 20; i++) {
      const newPost = newspostRepository.create({
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraphs(2),
        genre: faker.helpers.arrayElement(Object.values(Genre)),
        isPrivate: faker.datatype.boolean(),
        author: adminUser, 
      });

      await newspostRepository.save(newPost);
      console.log(`Новина ${i + 1} створена`);
    }

    console.log("Seeding завершено!");
    await AppDataSource.destroy();
  } catch (error) {
    console.error("Помилка при Seeding:", error);
    process.exit(1);
  }
};

seedDatabase();