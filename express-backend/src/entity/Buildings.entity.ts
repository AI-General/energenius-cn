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
export class Buildings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.buildings)
  @JoinColumn()
  owner: User;

  @Column({ nullable: true })
  cityName: string;

  @Column()
  timeZone: string;

  @Column("simple-array")
  location: [string, string];

  @Column({ nullable: true })
  floorMap: string;

  @Column({ nullable: true })
  buildingData: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
