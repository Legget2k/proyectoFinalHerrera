import { Router } from "express";
import ShoeController from "../controllers/ShoeControllers";

const ShoesRouter = Router();

//http://localhost:1234/api/Shoes || http://localhost:3000/api/Shoes

ShoesRouter.get("/",        ShoeController.getAllShoes);
ShoesRouter.get("/:id",     ShoeController.getShoe);
ShoesRouter.post("/",       ShoeController.createNewShoe);
ShoesRouter.patch("/:id",   ShoeController.updateShoe);
ShoesRouter.delete("/:id",  ShoeController.deleteShoe);

export { ShoesRouter };