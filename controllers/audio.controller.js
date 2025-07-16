import { AppError } from "../utils/customErr.js";
import Audio from "../models/audio.model.js";
import path from "path";
import fs from "fs";
import { log } from "console";
const addAudio = async (req, res) => {
    try {
        log(req.file)
        const { title, genre, isPrivate, audioFile } = req.body;
        if (!req.file) {
            throw new AppError(" no audio provided", 400);
        }
        let audio = new Audio({
            title,
            addedBy: req.user.userId,
            genre,
            isPrivate,
            audioFile: req.file.path,
            addedBy: req.user.userId,
        });
        await audio.save();
        res.status(201).json({
            success: true,
            message: "Audio added successfully",
            audio,
        });

    } catch (error) {

        res.status(500).json({ message: "Internal server error", error });
    }
}
const getAllAudios = async (req, res) => {
    let audios = await Audio.find({ isPrivate: false });
    if (!audios.length) throw new AppError("No Audios provided", 404)
    res.status(200).json({
        success: true,
        audios,
    });


}
const getUserAudios = async (req, res) => {
    let { userId } = req.user;
    let audios = await Audio.find({ addedBy: userId });
    if (!audios.length) throw new AppError("No Audios found", 404);
    res.status(200).json({
        success: true,
        audios,
    });
}
const streamAudio = (req, res) => {
    try {

        let { filename } = req.params

        let audioFile = path.resolve(`./uploads/audio/user_${req.user.userId}`, filename + ".mp3");
        log(audioFile)
        if (!fs.existsSync(audioFile)) {
            return res.status(404).json({ success: false, message: "Audio file not found" });
        }
        res.setHeader('Content-Type', 'audio/mpeg');
        const stream = fs.createReadStream(audioFile);
        stream.on("error", () => {
            throw new AppError("Error Streaming Audio", 500)
        })
        stream.pipe(res);

    } catch (error) {
        log(error)
        res.status(500).json({ success: false, message: "internal server err", error })

    }


}





export { addAudio, getAllAudios, getUserAudios, streamAudio };