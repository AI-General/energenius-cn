import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Buildings } from "./Buildings.entity";
import { DataCenters } from "./DataCenters.entity";
import { Locations } from "./Locations.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Buildings, (building) => building.owner, { cascade: true })
  buildings: Buildings[];

  @OneToMany(() => DataCenters, (datacenter) => datacenter.owner, { cascade: true })
  dataCenters: DataCenters[];

  @OneToMany(() => Locations, (location) => location.owner, { cascade: true })
  locations: Locations[];

  @Column({ default: "user" })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
