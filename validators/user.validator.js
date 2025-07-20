import { body, cookie, param } from "express-validator";


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => err.msg);
        return res.status(400).json({ errors: extractedErrors });
    }
    next();
};
const signUpValidation = [
    body("username")
        .isString().withMessage("Username must be a string")
        .trim()
        .escape()
        .toLowerCase()
        .custom((value) => {
            let firstLetter = value.charAt(0);
            firstLetter = firstLetter.toUpperCase();
            return firstLetter + value.slice(1);
        }),
    body("email")
        .trim()
        .normalizeEmail()
        .escape()
        .toLowerCase()
        .isEmail().withMessage("Email must be a valid email address"),
    body("password")
        .trim()
        .escape()
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("role")
        .optional()
        .trim()
        .escape()
        .toLowerCase()
        .isString().withMessage("Role must be a string"),
    body("profile")
        .optional()
        .trim()
        .escape()
        .isString().withMessage("Profile must be a string")
];

const loginValidation = [
    body("email")
        .trim()
        .normalizeEmail()
        .escape()
        .toLowerCase()
        .isEmail().withMessage("Email must be a valid email address"),
    body("password")
        .trim()
        .escape()
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];
const updateProfileValidators = [
    body("name")
        .optional()
        .isLength({ min: 2 }).withMessage("Name must be at least 2 characters")
];
export { loginValidation, signUpValidation, updateProfileValidators, validate }
