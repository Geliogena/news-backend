import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

export enum Genre {
  Politic = "Politic",
  Business = "Business",
  Sport = "Sport",
  Other = "Other"
}

@Entity()
export class Newspost {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text" })
  text!: string;

  @Column({ type: "enum", enum: Genre })
  genre!: Genre;

  @Column({ type: "boolean", default: false })
  isPrivate!: boolean;

  @ManyToOne(() => User, (user) => user.newsposts)
  author!: User;
}