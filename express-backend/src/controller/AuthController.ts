import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User.entity";
import config from "../config/config";
import * as bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);
const JWT_SECRET = config.jwtSecret;

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userRepository.findOneBy({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    await userRepository.save(user);

    res.status(201).json({
      message: "Signed Up successfully!",
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const SignIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (email === "adminuser21@gmail.com" || email === "energeniusadmin@gmailcom") {
      user.role = "admin";
    } else {
      user.role = "user";
    }
    await userRepository.save(user);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "30d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { email: user.email, id: user.id, createdAt: user.createdAt, updatedAt: user.updatedAt, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
