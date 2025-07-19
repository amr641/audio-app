// GET /api/admin/audios
import Audio from "../models/audio.model.js";
import { AppError } from "../utils/customErr.js"
const getAllUsersAudios = async (req, res) => {
    try {

        let audios = await Audio.find();
        if (!audios.length) throw new AppError("No Audios Found", 404);
        res.status(200).json({ success: true, audios })
    } catch (error) {
        throw error
    }
}



export { getAllUsersAudios }