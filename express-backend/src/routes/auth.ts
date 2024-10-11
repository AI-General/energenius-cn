import { Router } from "express";
import { SignUp, SignIn } from "../controller/AuthController";

const authRouter = Router();

authRouter.post("/auth/signup", SignUp);
authRouter.post("/auth/signin", SignIn);

export default authRouter;
