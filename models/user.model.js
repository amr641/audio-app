import mongoose from "mongoose";
import { Roles } from "../enums/roles";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: false,
        trim: true,
    },
    profile: {
        type: String,
        default: "default-profile.png",
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        enum: [...Object.values(Roles)],
        default: "user"
    }

});
export default mongoose.model("User", userSchema);