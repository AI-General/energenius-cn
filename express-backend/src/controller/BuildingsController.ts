import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Buildings } from "../entity/Buildings.entity";
import { User } from "../entity/User.entity";

const buildingsRepository = AppDataSource.getRepository(Buildings);

export const createNewBuilding = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const existingUser = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const building = new Buildings();
    building.name = req.body.name;
    building.location = req.body.location;
    building.owner = existingUser;
    building.timeZone = req.body.timeZone;
    await buildingsRepository.save(building);

    // get all new users buildings
    const newBuildings = await AppDataSource.getRepository(User).find({
      where: {
        id: userId,
      },
      relations: ["buildings"],
    });
    return res.status(201).json({ message: "Building created successfully", buildings: newBuildings[0].buildings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUserBuildings = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const existingUser = await AppDataSource.getRepository(User).find({
      where: {
        id: userId,
      },
      relations: ["buildings"],
    });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ buildings: existingUser[0].buildings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editBuildingData = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    console.log("body", req.body);
    const existingUser = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const buildingId = req.params.buildingId;
    const existingBuilding = await AppDataSource.getRepository(Buildings).findOneBy({ id: buildingId });
    if (!existingBuilding) {
      return res.status(404).json({ message: "Building not found" });
    }
    existingBuilding.floorMap = req.body?.floorMap ? req.body.floorMap : existingBuilding.floorMap;
    existingBuilding.buildingData = req.body?.buildingData ? req.body.buildingData : existingBuilding.buildingData;
    await buildingsRepository.save(existingBuilding);
    res.status(200).json({ message: "Building updated successfully", building: existingBuilding });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
