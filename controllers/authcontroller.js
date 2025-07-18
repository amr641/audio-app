
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


export { register, login };

