"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var LocationsController_1 = require("../controller/LocationsController");
var Authentification_1 = require("../Middleware/Authentification");
var locationsRouter = (0, express_1.Router)();
locationsRouter.get("/locations/:id", Authentification_1.authentification, LocationsController_1.getAllLocations);
locationsRouter.get("/users/:id/locations", Authentification_1.authentification, LocationsController_1.getAllUsersLocations);
locationsRouter.post("/users/:userId/locations", Authentification_1.authentification, LocationsController_1.createNewLocation);
locationsRouter.put("/users/:id/locations/:locationId", Authentification_1.authentification, LocationsController_1.editLocationData);
locationsRouter.delete("/users/:id/locations/:locationId", Authentification_1.authentification, LocationsController_1.deleteLocation);
exports.default = locationsRouter;
//# sourceMappingURL=locations.routes.js.map