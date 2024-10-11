import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Locations {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.locations)
  @JoinColumn()
  owner: User;

  @Column({ nullable: true })
  cityName: string;

  @Column()
  timeZone: string;

  @Column("simple-array")
  location: [string, string];

  @Column({ default: "building" })
  type: string;

  @Column({ nullable: true })
  floorMap: string;

  @Column({ nullable: true })
  csvDataFile: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
