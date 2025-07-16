import { Router } from "express";
import upload from "../config/multer.js";
import * as ac from "../controllers/audio.controller.js"
import { authenticate } from "../middlewares/authenticate.js";

export const AudioRouter = new Router();
AudioRouter
    .use(authenticate)
    .post("/", upload.single("audioFile"), ac.addAudio)
    .get("/", ac.getAllAudios)
    .get("/mine", ac.getUserAudios)
    .get("/stream/:filename", ac.streamAudio);