import { Router } from "express";
import {
  createNewLocation,
  editLocationData,
  getAllLocations,
  getAllUsersLocations,
  deleteLocation,
} from "../controller/LocationsController";
import { authentification } from "../Middleware/Authentification";

const locationsRouter = Router();

locationsRouter.get("/locations/:id", authentification, getAllLocations);
locationsRouter.get("/users/:id/locations", authentification, getAllUsersLocations);
locationsRouter.post("/users/:userId/locations", authentification, createNewLocation);
locationsRouter.put("/users/:id/locations/:locationId", authentification, editLocationData);
locationsRouter.delete("/users/:id/locations/:locationId", authentification, deleteLocation);

export default locationsRouter;
