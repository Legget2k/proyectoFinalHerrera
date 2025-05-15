import { Router } from "express";
import AuthController from "../controllers/AuthController";

//http://localhost:1234/api/auth
const authRouter = Router();

authRouter.post("/login",    AuthController.login);
authRouter.post("/register", AuthController.register);


export { authRouter };