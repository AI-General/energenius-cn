"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var BuildingsController_1 = require("../controller/BuildingsController");
var Authentification_1 = require("../Middleware/Authentification");
var buildingsRouter = (0, express_1.Router)();
buildingsRouter.post("/create/buildings/:userId", Authentification_1.authentification, BuildingsController_1.createNewBuilding);
buildingsRouter.get("/user-buildings-data/:userId", Authentification_1.authentification, BuildingsController_1.getAllUserBuildings);
buildingsRouter.put("/edit/building/:userId/:buildingId", Authentification_1.authentification, BuildingsController_1.editBuildingData);
exports.default = buildingsRouter;
//# sourceMappingURL=buildings.routes.js.map