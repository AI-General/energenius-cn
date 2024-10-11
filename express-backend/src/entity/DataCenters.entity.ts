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
export class DataCenters {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.dataCenters)
  @JoinColumn()
  owner: User;

  @Column("simple-array")
  location: [string, string];

  @Column()
  floorMap: string;

  @Column()
  dataCenterData: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
