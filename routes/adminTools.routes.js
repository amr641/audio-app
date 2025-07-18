import { Router } from "express";
import { allowedTo, authenticate } from "../middlewares/authenticate.js";
import { Roles } from "../enums/roles.js";
import { deleteAudioForAdmin, getAllUsersAudios } from "../controllers/adminTools.js";

export const adminRouter = Router();
adminRouter
    .use(authenticate, allowedTo(Roles.ADMIN))
    .get("/audios", getAllUsersAudios)
    .delete("/audio/:id", deleteAudioForAdmin)

