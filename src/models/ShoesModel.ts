import { Schema, model } from "mongoose";
import { colors } from "../utils/colors"; 
import { sizes } from "../utils/sizes";

const shoesSchema = new Schema({
    model:   { type: String, required: true, unique: true },
    brand:  { type: String, required: true },
    price:  { type: Number, required: true },
    size:   { type: Number, enum: sizes, required: true },
    color:  { type: String, enum: colors, required: true },
},{
    versionKey: false
});

const Shoes = model("Shoes", shoesSchema);
export { Shoes };