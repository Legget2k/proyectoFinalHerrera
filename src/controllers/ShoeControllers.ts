import { Request, Response } from "express";
import { Shoes } from "../models/ShoesModel";
import { IShoes } from "../interfaces/IShoes";

class ShoeController{
        
    static async getAllShoes (req: Request, res: Response): Promise<any>{
        try{
            const shoes = await Shoes.find();
            return res.status(200).json({
                succes: true,
                data: shoes
            });
        }catch (error){
            const err = error as Error;
            return res.status(500).json({
                succes: false,
                message: err.message
            });
        }
    }

    static async getShoe (req: Request, res: Response): Promise<any>{
        const id = req.params.id;
        try{
            const foundShoe = await Shoes.findById(id);
            if(!foundShoe) return res.status(404).json({ 
                succes: false,
                message: "Shoe not found" 
            });
            return res.status(200).json({
                succes: true,
                data: foundShoe
            });
        }catch (error){
            const err = error as Error;
            return res.status(500).json({
                succes: false,
                message: err.message
            });
        }
    }

    static async createNewShoe (req: Request, res: Response): Promise<any>{
        try{
            const body = req.body as IShoes;
            const { model, brand, price, size, color } = body;
            if(!model || !brand || !price || !size || !color) return res.status(400).json({ 
                succes: false,
                message: "Bad Request" 
            }); 

            const newShoe = new Shoes({ model, brand, price, size, color });
            newShoe.save();
            return res.status(201).json({
                succes: true,
                data: newShoe
            });
        }catch (error){
            const err = error as Error;
            return res.status(500).json({
                succes: false,
                message: err.message
            });
        }
    }

    static async updateShoe  (req: Request, res: Response): Promise<any>{
        const id = req.params.id;
        const body = req.body as IShoes;
        try{
            const updatedShoe = await Shoes.findByIdAndUpdate(id, body, { new: true });
            if(!updatedShoe) return res.status(404).json({ 
                succes: false,
                message: "Shoe not found" 
            });
            return res.status(200).json({
                succes: true,
                data: updatedShoe
            });
        }catch (error){
            const err = error as Error;
            return res.status(500).json({
                succes: false,
                message: err.message
            });
        }
    }

    static async deleteShoe  (req: Request, res: Response): Promise<any>{
        const id = req.params.id;
        try{
            const deleteShoe = await Shoes.findByIdAndDelete(id);
            if(!deleteShoe) return res.status(404).json({ 
                succes: false,
                message: "Shoe not found" 
            });
            return res.status(200).json({
                succes: true,
                message: "Shoe deleted"
            });
        }catch (error){
            const err = error as Error;
            return res.status(500).json({
                succes: false,
                message: err.message
            });
        }
    }
}

export default ShoeController;