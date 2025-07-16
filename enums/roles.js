export const Roles = {
    ADMIN: 'admin',
    USER: 'user'
};
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
const fs = require("fs");

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

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw { statusCode: 404, message: "User not found" };
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) throw { statusCode: 404, message: "User not found" };

    if (name) user.name = name;

    if (req.file) {
      if (user.profilePic && fs.existsSync(user.profilePic)) {
        fs.unlinkSync(user.profilePic);
      }
      user.profilePic = req.file.path;
    }

    await user.save();
    res.status(200).json({ message: "Profile updated", user: { id: user._id, name: user.name, email: user.email, profilePic: user.profilePic } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, updateProfile };

// ✅ routes/authRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { validate, registerValidators, loginValidators, updateProfileValidators } = require("../middlewares/validators");
const { register, login, getProfile, updateProfile } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/auth");

router.post("/register", upload.single("profilePic"), registerValidators, validate, register);
router.post("/login", loginValidators, validate, login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single("profilePic"), updateProfileValidators, validate, updateProfile);

module.exports = router;

// ✅ middlewares/validators.js
const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 400;
    error.errors = errors.array();
    return next(error);
  }
  next();
};

const passwordComplexity = body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters")
  .matches(/[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/)
  .withMessage("Password must contain a number or special character");

const registerValidators = [
  body("name").notEmpty().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Email must be valid"),
  passwordComplexity,
  body("role").optional().isIn(["user", "admin"]).withMessage("Role must be user or admin"),
];

const loginValidators = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileValidators = [
  body("name").optional().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
];

module.exports = {
  validate,
  registerValidators,
  loginValidators,
  updateProfileValidators,
};
 */