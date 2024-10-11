import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Locations } from "../entity/Locations.entity";
import { User } from "../entity/User.entity";

const locationsRepository = AppDataSource.getRepository(Locations);
const usersRepository = AppDataSource.getRepository(User);

export const getAllUsersLocations = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        locations: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ locations: user.locations });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const locations = await locationsRepository
      .createQueryBuilder("locations")
      .select([
        "locations.id",
        "locations.name",
        "locations.cityName",
        "locations.timeZone",
        "locations.location",
        "locations.type",
      ])
      // .where("locations.ownerId != :userId", { userId })
      .getMany();
    return res.status(200).json({ locations });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("error:", error);
  }
};

export const createNewLocation = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const existingUser = await usersRepository.findOneBy({ id: userId });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const building = new Locations();
    building.name = req.body.name;
    building.location = req.body.location;
    building.owner = existingUser;
    building.timeZone = req.body.timeZone;
    building.type = req.body.type;
    building.cityName = req.body.cityName;
    await locationsRepository.save(building);

    // get all new users buildings
    const newBuildings = await usersRepository.find({
      where: {
        id: userId,
      },
      relations: ["locations"],
    });
    return res
      .status(201)
      .json({ message: "Building created successfully - locations", buildings: newBuildings[0].locations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editLocationData = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const existingUser = await usersRepository.findOneBy({ id: userId });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const buildingId = req.params.locationId;
    const existingBuilding = await locationsRepository.findOneBy({ id: buildingId });
    if (!existingBuilding) {
      return res.status(404).json({ message: "Building not found" });
    }
    existingBuilding.floorMap = req.body?.floorMap ? req.body.floorMap : existingBuilding.floorMap;
    existingBuilding.csvDataFile = req.body?.buildingData ? req.body.buildingData : existingBuilding.csvDataFile;
    await locationsRepository.save(existingBuilding);
    res.status(200).json({ message: "Building updated successfully", building: existingBuilding });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const locationId = req.params.locationId;

  const existingLocation = await locationsRepository.findOneBy({ id: locationId });

  if (!existingLocation) {
    return res.status(404).json({ message: "Location not found" });
  }

  await locationsRepository.remove(existingLocation);

  const locations = await locationsRepository
    .createQueryBuilder("locations")
    .select([
      "locations.id",
      "locations.name",
      "locations.cityName",
      "locations.timeZone",
      "locations.location",
      "locations.type",
    ])
    .getMany();

  const user = await usersRepository.findOne({
    where: {
      id: userId,
    },
    relations: {
      locations: true,
    },
  });

  return res
    .status(200)
    .json({ message: "Location deleted successfully", allLocations: locations, userLocations: user.locations });
};
