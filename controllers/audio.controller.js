import { AppError } from "../utils/customErr.js";
import Audio from "../models/audio.model.js";
import path from "path";
import fs from "fs";
import { log } from "console";
const addAudio = async (req, res) => {
    try {
        const { title, genre, isPrivate } = req.body;
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
const streamAudio = async (req, res) => {
    try {

        let { filename } = req.params

        let audioFile = path.resolve(`./uploads/audio/user_${req.user.userId}`, filename + ".mp3");

        if (!fs.existsSync(audioFile)) {
            return res.status(404).json({ success: false, message: "Audio file not found" });
        }
        const audioStat = await fs.promises.stat(audioFile);
        const audioSize = audioStat.size;

        req.headers.range = 'bytes=1024-'
        const range = req.headers.range;

        if (range) {
            // Parse range (e.g., "bytes=0-1023")
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : audioSize - 1;

            const chunkSize = (end - start) + 1;

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${audioSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'audio/mpeg'
            });

            // Create read stream for the range
            const stream = fs.createReadStream(audioFile, { start, end });
            stream.on("error", () => {
                throw new AppError("Error Streaming Audio", 500)
            })
            stream.pipe(res);
        } else {
            // No range requested, send entire file
            res.writeHead(200, {
                'Content-Length': audioSize,
                'Content-Type': 'audio/mpeg',
                'Accept-Ranges': 'bytes'
            });

            fs.createReadStream(audioFile).pipe(res);
        }

    } catch (error) {
        log(error)
        res.status(500).json({ success: false, message: "internal server err", error })

    }
}
const updateAudio = async (req, res) => {
    let { id } = req.params;
    let audio = await Audio.findById(id);
    if (req.file) {
        try {
            await audio.updateOne({ audioFile: req.file.path, ...req.body })

        } catch (error) {
            fs.promises.unlink(req.file.path)
                .then(() => { log("file deleted") })
                .catch(err => {
                    throw new AppError("cannot delete the file", 500)
                })

            throw new AppError("Err while updating", 500)

        }
        let oldFile = path.resolve(`./uploads/audio/user_${req.user.userId}`, audio.audioFile + ".mp3");
        if (!fs.existsSync(oldFile)) {
            return res.status(404).json({ success: false, message: "old Audio file not found" });
        }
        fs.promises.unlink(oldFile)
            .then(() => { log("old file deleted") })
            .catch(err => {
                throw new AppError("cannot delete the old file", 500)
            })
        res.status(201).json({ success: true, message: "Audio Updated Successfuly" })
    } else {
        await audio.updateOne(req.body)
        res.status(201).json({ success: true, message: "Audio Updated Successfuly" })

    }
}
const deleteAudio = async (req, res) => {
    let { id } = req.params.id;
    let audio = await Audio.findById(id);
    try {

        await audio.deleteOne()
    } catch (error) {
        throw new AppError("Err deleteing the audio documnet", 500)
    }

    let oldFile = path.resolve(`./uploads/audio/user_${req.user.userId}`, audio.audioFile + ".mp3");
    if (!fs.existsSync(oldFile)) {
        return res.status(404).json({ success: false, message: " Audio file not found" });
    }
    fs.promises.unlink(oldFile)
        .then(() => { log("old file deleted") })
        .catch(err => {
            throw new AppError("cannot delete the old file", 500)
        })
    res.status(201).json({ success: true, message: "Audio deleted Successfuly" })
}




export { addAudio, getAllAudios, getUserAudios, streamAudio, updateAudio, deleteAudio };