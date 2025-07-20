import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { Roles } from "../enums/roles.js";

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
    type: String,
    enum: [...Object.values(Roles)],
    default: "user"
  }

});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);

