
import { validationResult } from "express-validator"
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ erros: errors.array() });
    } else next();
};