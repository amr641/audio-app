

import { Router } from "express";
const router = Router();
import  upload  from "../config/multer.js";
import { signUpValidation, loginValidation ,updateProfileValidators ,validate} from "../validators/user.validator.js";
import { register, login,getProfile, updateProfile, deleteProfile  } from "../controllers/authcontroller.js";
import {validateRequest} from "../middlewares/validateRequest.js"
import { authenticate } from "../middlewares/authenticate.js";

router.post("/register", upload.single("profilePic"), signUpValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, upload.single("profilePic"), updateProfileValidators, validate, updateProfile);
router.delete("/profile", authenticate, deleteProfile);

export default router;

