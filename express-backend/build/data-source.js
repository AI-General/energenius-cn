"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var User_entity_1 = require("./entity/User.entity");
var Buildings_entity_1 = require("./entity/Buildings.entity");
var DataCenters_entity_1 = require("./entity/DataCenters.entity");
var Locations_entity_1 = require("./entity/Locations.entity");
require("dotenv").config({ path: ".env.local" });
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User_entity_1.User, Buildings_entity_1.Buildings, DataCenters_entity_1.DataCenters, Locations_entity_1.Locations],
    migrations: [],
    subscribers: [],
    extra: {
        ssl: { rejectUnauthorized: false },
    },
});
//# sourceMappingURL=data-source.js.map