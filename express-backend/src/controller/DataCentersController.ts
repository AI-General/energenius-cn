import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DataCenters } from "../entity/DataCenters.entity";
import { User } from "../entity/User.entity";

export const createNewDataCenter = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const existingUser = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const dataCenter = new DataCenters();
    dataCenter.name = req.body.name;
    dataCenter.location = req.body.location;
    dataCenter.owner = existingUser;
    await AppDataSource.getRepository(DataCenters).save(dataCenter);
    return res.status(201).json({ message: "DataCenter created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
