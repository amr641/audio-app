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

/*// ✅ models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profilePic: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

// ✅ controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const profilePic = req.file ? req.file.path : undefined;

    const existing = await User.findOne({ email });
    if (existing) throw { statusCode: 400, message: "Email already exists" };

    const user = await User.create({ name, email, password, role, profilePic });
    res.status(201).json({ message: "User registered", user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw { statusCode: 400, message: "Invalid credentials" };

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw { statusCode: 400, message: "Invalid credentials" };

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };

// ✅ routes/authRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { validate, registerValidators, loginValidators } = require("../middlewares/validators");
const { register, login } = require("../controllers/authController");

router.post("/register", upload.single("profilePic"), registerValidators, validate, register);
router.post("/login", loginValidators, validate, login);

module.exports = router;
*/ 