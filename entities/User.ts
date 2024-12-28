import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Newspost } from "./Newspost";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @OneToMany(() => Newspost, (newspost) => newspost.author)
  newsposts!: Newspost[];

  @Column({ type: "boolean", default: true })
  sendNotification!: boolean;

  @Column({ type: "varchar", default: "log" }) 
  notificationChannel!: "log" | "alert";
}
