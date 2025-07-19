import { Router } from "express";
import { allowedTo, authenticate } from "../middlewares/authenticate.js";
import { Roles } from "../enums/roles.js";
import { getAllUsersAudios } from "../controllers/adminTools.js";
import { deleteAudio } from "../controllers/audio.controller.js";

export const adminRouter = Router();
adminRouter
    .use(authenticate, allowedTo(Roles.ADMIN))
    .get("/audios", getAllUsersAudios)
    .delete("/audio/:id", deleteAudio)

