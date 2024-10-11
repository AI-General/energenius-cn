import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import config from "../config/config";
dotenv.config();
declare global {
  namespace Express {
    interface Request {
      currentUser: any;
    }
  }
}
const JWT_SECRET = config.jwtSecret;
export const authentification = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req["currentUser"] = decode;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Authentication error Login Session Expired, Please Login Again" });
  }
};
