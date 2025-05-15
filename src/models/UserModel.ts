import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
},{
    versionKey: false
});

const User = model("User", userSchema);
export { User };