import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User.entity";
import { Buildings } from "./entity/Buildings.entity";
import { DataCenters } from "./entity/DataCenters.entity";
import { Locations } from "./entity/Locations.entity";
require("dotenv").config({ path: ".env.local" });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User, Buildings, DataCenters, Locations],
  migrations: [],
  subscribers: [],
  extra: {
    ssl: { rejectUnauthorized: false },
  },
});
