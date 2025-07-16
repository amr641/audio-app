import { AppError } from "../utils/customErr.js";
import Audio from "../models/audio.model.js";
import path from "path";
import fs from "fs";
const addAudio = async (req, res) => {
    try {
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
            addedBy: req.user._id,
        });
        await audio.save();
        res.status(201).json({
            success: true,
            message: "Audio added successfully",
            audio,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
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
    const filename = req.params.filename;
    const filePath = path.join("uploads", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            error: 'Audio file not found'
        });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const mimeType = mime.getType(path.extname(filename));

    if (range) {
        // Parse range header
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;

        const file = fs.createReadStream(filePath, { start, end });


        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': mimeType,
            'Cache-Control': 'no-cache'
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        // No range requested, send entire file
        const head = {
            'Content-Length': fileSize,
            'Content-Type': mimeType,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache'
        };

        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
}
export { addAudio, getAllAudios, getUserAudios, streamAudio };