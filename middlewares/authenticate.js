import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Audio from "../models/audio.model.js";
import { AppError } from "../utils/customErr.js";
import { removeUnHandledFiles } from "../utils/removeOldFile.js";

const authenticate = async (req, res, next) => {
    const { token } = req.headers;
    jwt.verify(token, process.env.ACCESSTOKEN_KEY, async (err, decoded) => {
        if (err) return res.status(401).json({ message: "inavlid token" });
        let user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ message: "User Not Found" })
        req.user = decoded;
        next();
    });
};
const allowedTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError("You Are Not Allowed", 403)
        }
        next()
    }
}

const restrictUserActions = async (req, res, next) => {
    try {
        let userId = req.user.userId;
        let { id } = req.params;

        if (!id) throw new AppError("id is required", 400);
        let audio = await Audio.findById(id);
        if (!audio) throw new AppError("Audio Not Found", 404);

        if (userId !== audio.addedBy.toString()) throw new AppError("You Are Not Allowed", 403);
        next()
    } catch (error) {
        if (req.file) {
            await removeUnHandledFiles(req)
        }
        throw error

    }



}

export { authenticate, allowedTo, restrictUserActions }

