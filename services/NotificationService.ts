import { Server } from "socket.io";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

interface NotificationData {
    title: string;
    content: string;
    link: string;
}

export class NotificationService {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    async notifyUsers(notificationData: NotificationData): Promise<void> {
        try {
            const userRepository = AppDataSource.getRepository(User);

            
            const users = await userRepository.find({ where: { sendNotification: true } });

            users.forEach((user) => {
                if (user.notificationChannel === "log") {
                    
                    this.io.emit("notification-log", {
                        title: notificationData.title,
                        content: notificationData.content,
                        link: notificationData.link,
                    });
                } else if (user.notificationChannel === "alert") {
                    
                    this.io.emit("notification-alert", {
                        title: notificationData.title,
                        content: notificationData.content,
                        link: notificationData.link,
                    });
                }
            });
        } catch (error) {
            console.error("Помилка відправки повідомлення:", error);
        }
    }
}