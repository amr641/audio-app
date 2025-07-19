import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


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
            return res.status(403).json({ message: "You Are Not Allowed" })
        }
        next()
    }
}
<<<<<<< HEAD

export { authenticate, allowedTo }
=======
>>>>>>> 6771c2a (yarab)
