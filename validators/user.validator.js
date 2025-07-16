import { body, cookie, param } from "express-validator";

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
