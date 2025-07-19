
import { AppError } from "../utils/customErr.js";
import User from "../models/user.model.js";
import { getAccessToken } from "../jwt/jwt.service.js";

const register = async (req, res, next) => {
  try {
    const { username, email, password, roles } = req.body;
    const profilePic = req.file ? req.file.path : undefined;

    const existing = await User.findOne({ email });
    if (existing) throw new AppError("Email already exists", 400);

    const user = await User.create({ username, email, password, roles, profilePic });


    const token = await getAccessToken({ _id: user._id, role: user.roles })
    console.log(token);
    res.status(201).json({ message: "User registered", user: { id: user._id, name: user.name, email: user.email, token } });

  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new AppError("Invalid credentials", 400);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError("Invalid credentials", 400);

    const token = await getAccessToken({ _id: user._id, role: user.roles });

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

const deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw { statusCode: 404, message: "User not found" };

    if (user.profilePic && fs.existsSync(user.profilePic)) {
      fs.unlinkSync(user.profilePic);
    }

    await user.deleteOne();
    res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};


export { register, login,deleteProfile,updateProfile,getProfile  };

