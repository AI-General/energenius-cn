import { Router } from "express";
import { createNewBuilding, getAllUserBuildings, editBuildingData } from "../controller/BuildingsController";
import { authentification } from "../Middleware/Authentification";

const buildingsRouter = Router();

buildingsRouter.post("/create/buildings/:userId", authentification, createNewBuilding);
buildingsRouter.get("/user-buildings-data/:userId", authentification, getAllUserBuildings);
buildingsRouter.put("/edit/building/:userId/:buildingId", authentification, editBuildingData);

export default buildingsRouter;
